
# Integration with Artificial Intelligence and GitHub Models

We’ve reached the core of our application: the integration with Artificial Intelligence and GitHub Models. In this section, we’ll implement the integration with **GitHub Models**, a service that gives us access to cutting-edge AI models for free. We will develop a robust service that not only communicates with the AI but also handles errors, implements retry logic, and validates responses professionally.

## Learning Objectives

By the end of this session, you will be able to:

* Integrate AI APIs into Next.js applications
* Implement retry and error-handling patterns
* Create effective prompts for different contexts
* Validate and sanitize AI responses
* Apply design patterns like Singleton to optimize performance

## Step 1: Understanding GitHub Models and Initial Setup

**[GitHub Models](https://github.com/marketplace/models-github)** is a platform that provides access to advanced AI models through an OpenAI-compatible API. This means we can use models like GPT-4o in a scalable and reliable way, leveraging GitHub’s infrastructure to host our artificial intelligence.

The big advantage of GitHub Models is that it allows us to experiment with different AI models without having to manage our own infrastructure. Additionally, compatibility with the OpenAI API means our code will be easily portable if we decide to switch to other providers in the future. And of course, it’s free to use in open-source projects, which aligns perfectly with our development philosophy.

### Structuring the Base Service

We’ll create the file `src/lib/services/github-models.service.ts`, which will be the core of our AI integration.

<details><summary><b>src/lib/services/github-models.service.ts</b></summary>
<br/>

```typescript
// src/lib/services/github-models.service.ts
import { OpenAI } from "openai";
import "dotenv/config";
import { GeneratedContent } from "@/types";

// Interface to define tone of voice guidelines
interface ToneGuidelines {
  [key: string]: string[];
}

class GitHubModelsService {
  private client: OpenAI;
  private readonly toneGuidelines: ToneGuidelines;
  private readonly modelName: string = "gpt-4o";

  constructor() {
    // Validate environment variables at instantiation time
    this.validateEnvironmentVariables();

    // Configure the OpenAI client for GitHub Models
    this.client = new OpenAI({
      baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT || "https://models.inference.ai.azure.com",
      apiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN
    });

    // Initialize tone of voice guidelines
    this.toneGuidelines = this.getToneGuidelines();  
  }

```

</details>
<br/>

### Analyzing the Base Structure

We start with strategic imports: the OpenAI SDK for API communication, dotenv to automatically load environment variables, and our previously defined custom type `GeneratedContent`.

The `ToneGuidelines` interface uses an index signature that allows any string as a key, with each tone holding multiple guidelines stored in an array of strings. This structure gives us flexibility to add new tones in the future without breaking the existing code.

The `GitHubModelsService` class encapsulates all logic for interacting with GitHub Models. In the constructor, we validate essential environment variables to ensure our application doesn’t fail silently in production. The OpenAI client is configured with the GitHub Models base URL and authentication token, both defined via environment variables.

The client configuration is where the magic happens. We redirect the base URL to GitHub Models instead of the official OpenAI API, include a default fallback URL in case the environment variable is not defined, and configure authentication with the GitHub Models-specific token.

## Step 2: Implementing Robust Environment Validation

### Creating a Proactive Validation System

We’ll implement a method that validates the environment variables required for the service to function. This helps prevent silent failures in production.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private validateEnvironmentVariables() {
  const requiredVars = ['GITHUB_MODELS_TOKEN'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}
```

</details>
<br/>

### Why Is This Validation Critical?

This validation follows the **Fail Fast Principle**, detecting configuration issues immediately rather than waiting for obscure runtime errors. This greatly simplifies debugging across different development and production environments. Furthermore, validating environment variables is a recommended best practice in modern applications—especially when working with external services that require authentication. By ensuring all necessary variables are present before initializing the service, we avoid unexpected failures and improve the reliability of the application.

The error messages are intentionally clear and specific, listing exactly which variables are missing. This greatly speeds up issue resolution during deployment and enhances the development experience for the entire team.

In terms of production robustness, this validation prevents attempts to make unauthenticated API calls, avoids leaking sensitive error information, and ensures the configuration is correct before the service is even initialized.

### Setting Up the Tone Guidelines System

Now, let’s implement the method that returns tone of voice guidelines. This method will be used to customize AI responses based on the application’s context.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private getToneGuidelines(): ToneGuidelines {
  return {
    technical: [
      'Use precise technical language',
      'Include specific data points and statistics',
      'Maintain professional credibility',
      'Focus on accuracy and clarity',
      'Use industry-standard terminology',
    ],
    casual: [
      'Use conversational, friendly language',
      'Include relatable examples',
      'Keep the tone light and engaging',
      'Write as if talking to a friend',
      'Use everyday language and expressions',
    ],
    motivational: [
      'Use inspiring and empowering language',
      'Focus on positive outcomes and possibilities',
      'Include clear calls-to-action',
      'Create emotional connections',
      'Emphasize growth and achievement',
    ],
  };
}
```

</details>
<br/>

### Understanding the Design of Effective Guidelines

The **technical** tone is built around precision and professional credibility. We guide the AI to use accurate technical language, include specific data points and statistics, maintain professional tone, focus on clarity, and use industry-standard terminology.

For the **casual** tone, we create a conversational and friendly atmosphere. The guidelines include using a relaxed, friendly language style, relatable examples, light and engaging tone, writing as if speaking to a friend, and using common everyday expressions.

The **motivational** tone is designed to inspire and emotionally connect. The instructions guide the AI to use empowering language, focus on positive outcomes and possibilities, include clear calls to action, build emotional connections, and emphasize growth and achievement.

## Step 3: Building the Content Generation Engine

### Implementing the Main Content Generation Method

We’ll implement the `generateMicroblogContent` method, which will be responsible for generating content based on a prompt and a specific tone of voice. This method will use the OpenAI client to make API calls to GitHub Models.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
async generateMicroblogContent(
  topic: string,
  tone: string,
  keywords?: string
): Promise<GeneratedContent> {
  return this.executeWithRetry(async () => {
    const systemMessage = this.createSystemPrompt();
    const userMessage = this.createUserPrompt(topic, tone, keywords);

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_completion_tokens: 500,
      response_format: { type: 'json_object'},
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsedContent = JSON.parse(content) as GeneratedContent;
    this.validateGeneratedContent(parsedContent);

    return parsedContent;
  });
}
```

</details>
<br/>

### Understanding the API Parameters

The model configuration is carefully optimized for our application. We use GPT-4o, which is specifically fine-tuned for creative and accurate tasks. A **temperature** of 0.7 provides a perfect balance between creativity and consistency—values closer to 0.0 are more deterministic, while those near 1.0 are highly creative and unpredictable. The 0.7 value is considered a sweet spot for generating focused yet creative content.

The **max\_completion\_tokens** set to 500 helps limit cost and ensures that responses are concise and to the point. The **response\_format** set to `json_object` forces the model to return structured, parseable output, eliminating the need for additional post-processing.

The messaging system is organized with a clear separation of concerns. The **System Message** defines the AI’s persona and behavioral rules, setting the context for how it should operate. The **User Message** contains the specific task instruction. This structure gives us fine-grained control over the model’s behavior.

### Creating Effective Prompts – The System Prompt

Let’s implement the `createSystemPrompt` method, which defines the AI’s tone and behavior. This prompt will be used in every interaction with the model.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private createSystemPrompt(): string {
  return `You are a professional content creator specializing in creating engaging microblog posts.
  Your expertise includes:
  - Creating viral-worthy content under 280 characters
  - Understanding social media engagement patterns
  - Crafting content that drives discussion and shares
  - Adapting tone while maintaining authenticity
  - Selecting impactful and trending hashtags

  Always ensure your responses are:
  1. Concise and impactful
  2. Optimized for social sharing
  3. Properly formatted as JSON
  4. Relevant to the target audience
  5. Engaging and shareable`;
}
```

</details>
<br/>

### Strategies Behind the System Prompt

The System Prompt is carefully crafted to establish a clear **role definition**. By identifying the AI as a "professional content creator," we set an immediate level of expertise, while "specializing in microblog posts" provides a precise focus that guides every response.

The **skillset list** acts like a résumé for the AI. Each item reinforces a key capability needed for our application, establishing a professional quality standard reflected in the outputs.

The **behavioral rules** are presented as a numbered list because structured instructions are easier for AI to follow. The use of “Always ensure” creates an expectation of consistent quality across all outputs.

### Building the Dynamic User Prompt

Let’s implement the `createUserPrompt` method, which creates a dynamic prompt based on the topic, tone of voice, and optional keywords. This method is essential for customizing AI responses.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private createUserPrompt(topic: string, tone: string, keywords?: string): string {
  let prompt = `Create a microblog post about "${topic}`;

  if (keywords) {
    prompt += `, incorporating the following keywords: ${keywords}`;
  }

  const guidelines = this.toneGuidelines[tone] || this.toneGuidelines.casual;
  prompt += `\n\nTone requirements (${tone}):\n${guidelines.map(g => `- ${g}`).join('\n')}`;

  prompt += `\n\nFormat your response as JSON: {
    "mainContent": "your microblog post (max 280 characters)",
    "hashtags": ["relevant", "hashtags", "array"],
    "insights": ["key insights about the topic as array"]
  }`;

  return prompt;
}
```

</details>
<br/>

### Anatomy of the User Prompt Structure

The **main instruction** is intentionally clear and direct, using quotation marks to preserve the full context of the user-provided topic. This initial simplicity ensures the model knows exactly what to do.

The **conditional keyword inclusion** appends keywords only if the user provides them. The use of a comma naturally connects it to the main instruction, keeping the prompt fluid and easy to read.

The **dynamic tone guidelines** are where our architecture truly shines. The system retrieves the specific tone’s guidelines, but smartly falls back to “casual” if an invalid tone is given. Bullet points make the instructions very clear for the model to process.

The **format specification** is crucial for our application. We provide an explicit JSON schema that prevents parsing errors, include inline comments to guide the model on expectations, and mirror the structure to match our TypeScript interface exactly.

## Step 4: Creating a Multi-Layered Validation System

### Implementing Strict Content Validation

We’ll implement the `validateGeneratedContent` method, which validates the structure and content generated by the AI. This method will ensure that the responses are in the correct format and meet quality standards.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private validateGeneratedContent(content: GeneratedContent): void {
  const { mainContent, hashtags, insights } = content;

  if (!mainContent || typeof mainContent !== 'string') {
    throw new Error('Invalid mainContent');
  }

  if (mainContent.length > 280) {
    throw new Error('Content exceeds 280 characters');
  }

  if (!Array.isArray(hashtags) || hashtags.length === 0) {
    throw new Error('Invalid or empty hashtags');
  }

  if (!Array.isArray(insights) || insights.length === 0) {
    throw new Error('Invalid or empty insights');
  }
}
```

</details>
<br/>

### Understanding the Validation Layers

The first layer performs **type and existence validation**. We not only check if the content exists but also confirm it’s of the correct type. The `||` operator is especially useful here as it captures all falsy values such as null, undefined, or an empty string.

The second layer applies **business rule validation**. The 280-character limit is not arbitrary—it’s specific to microblogs and ensures compatibility with major social media platforms. This validation is done on the backend to guarantee that even if the frontend is compromised, the rules are still enforced.

The third layer executes **array structure validation**. We use `Array.isArray()` which is safer and more reliable than `instanceof Array`, especially in environments with multiple execution contexts. Additionally, we check that the arrays have at least one item, ensuring that our AI always returns useful content.

### Developing the Retry System with Backoff

Let’s implement the `executeWithRetry` method, which executes a function using retry logic with exponential backoff. This will ensure that our application is resilient to temporary API failures.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
private async executeWithRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
```

</details>
<br/>

### Analyzing the Advanced Retry Pattern

This system uses **Generic Type Safety** through `<T>`, allowing retry logic to work with any operation while maintaining complete type safety throughout the execution chain. The function signature `() => Promise<T>` clearly defines how operations should be structured.

We implement **Exponential Backoff**, where the first attempt delays 1000ms, the second 2000ms, and the third 3000ms. This progression significantly reduces the load on APIs experiencing temporary issues, allowing them time to recover.

The **Error Aggregation** system preserves the last error for detailed debugging. We use a type assertion `as Error` to maintain consistency and only throw the final error if all attempts fail—providing full context of what went wrong.

**Smart Logging** uses the `warn` level to indicate a non-critical issue (we still have retries left). We include the attempt number to aid debugging and only log on failure, keeping logs clean when everything works as expected.

## Step 5: Implementing the Singleton Pattern for Performance

### Creating the Singleton System

We’ll implement the Singleton pattern to ensure that our instance of `GitHubModelsService` is reused across the entire application, optimizing resource usage and avoiding multiple unnecessary connections.

<details><summary><b>src/lib/services/github-models.service.ts (continued)</b></summary>
<br/>

```typescript
let serviceInstance: GitHubModelsService | null = null;

export function getGitHubModelsService(): GitHubModelsService {
  if (!serviceInstance) {
    serviceInstance = new GitHubModelsService();
  }

  return serviceInstance;
}
```

</details>
<br/>

### Architectural Advantages of Singleton

The Singleton pattern provides **connection reuse**, allowing the HTTP client to reuse connection pools, which significantly reduces the overhead of instance creation and improves performance in applications with many simultaneous requests.

It enables **centralized state management** with a single source of configuration across the app. The tone guidelines are loaded only once in memory, maintaining consistency throughout the app without duplicating resources.

**Resource control** avoids creating unnecessary instances that would consume additional memory. It reduces overall memory usage and makes debugging and monitoring easier since there's only one instance to track.

**Lazy Initialization** ensures that the instance is created only when truly needed. It triggers environment validation on-demand and makes app startup faster since it doesn’t initialize services that might never be used.

### How to Use It in Practice

To use the Singleton service in your application, simply import the `getGitHubModelsService` function and call the `generateMicroblogContent` method as needed. Example:

```typescript
// Inside an API route or component
import { getGitHubModelsService } from '@/lib/services/github-models.service';

// Usage example
const service = getGitHubModelsService();
const content = await service.generateMicroblogContent(
  "Machine Learning trends",
  "technical",
  "AI, neural networks, deep learning"
);
```

## Step 6: Securely Configuring Environment Variables

### Local Development Setup

Create a `.env` file at the root of your project with your GitHub Models credentials:

```bash
# GitHub Models Configuration
NEXT_PUBLIC_GITHUB_MODELS_TOKEN=your_github_models_token_here
NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT=https://models.inference.ai.azure.com
```

### Production Setup on Vercel

For production deployment, configure your environment variables via the Vercel dashboard. Go to your Vercel Dashboard, navigate to your project, then to Settings > Environment Variables. Add `NEXT_PUBLIC_GITHUB_MODELS_TOKEN` with your GitHub Models token and `NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT` with the endpoint URL.

### Implementing Security Best Practices

It’s very important to **never commit secrets to your repository**. Our `.gitignore` file is already configured to exclude `.env*.local` and `.env`, ensuring that credentials are never exposed by accident.

Our runtime validation via the `validateEnvironmentVariables()` method ensures correct configuration and triggers fast failure in case of misconfiguration, preventing silent issues in production. For different environments, we recommend using separate tokens for development and production to enable better access control and environment-specific usage tracking.

## Step 7: Testing and Validating the Service

### Creating a Basic Manual Test

To validate our service, let’s create a simple manual test. Create a file called `src/app/api/test-ai/route.ts` to expose a test route. This file is intended for development purposes only and should not be included in the final production repository.

<details><summary><b>src/app/api/test-ai/route.ts</b></summary>
<br/>

```typescript
// src/app/api/test-ai/route.ts
import { getGitHubModelsService } from '@/lib/services/github-models.services';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Starting GitHub Models Service test...');

    const service = getGitHubModelsService();

    const result = await service.generateMicroblogContent(
      "The future of web development",
      "technical",
      "React, TypeScript, AI"
    );

    console.log('✅ Test successful:', result);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Test executed successfully!'
    });

  } catch (error) {
    console.error('❌ Test failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Test failed'
    }, { status: 500 });
  }
}
```

</details>
<br/>

Now open your terminal and run:

```bash
npm run dev
```

Visit the test route at `http://localhost:3000/api/test-ai` and check if the service is working correctly. You should see a JSON response with content generated by the AI.

If you see the success message and the generated content—congratulations! You’ve successfully integrated GitHub Models into your Next.js application.

```json
{
  "success": true,
  "data": {
    "mainContent": "🚀 The future of web development is here! React + TypeScript + AI integration is revolutionizing how we build applications. Smart auto-completion, predictive UIs, and intelligent debugging are becoming standard. #WebDev #AI #React #TypeScript",
    "hashtags": ["WebDev", "AI", "React", "TypeScript", "FutureOfTech", "JavaScript"],
    "insights": [
      "AI-powered development tools are reducing coding time by 40%",
      "TypeScript adoption has increased 300% in the past 2 years",
      "React remains the most popular frontend framework in 2024",
      "Integration of AI in development workflows is becoming essential"
    ]
  },
  "message": "Test executed successfully!"
}
```

In your console logs, you should see something like:

```
🧪 Starting GitHub Models Service test...
✅ Test successful: {
  mainContent: "🚀 The future of web development is here!...",
  hashtags: ["WebDev", "AI", "React", "TypeScript", "FutureOfTech", "JavaScript"],
  insights: [...]
}
```

And in the browser, you’ll see the formatted JSON response with the content generated by the AI.

![GitHub Models API Test](../../resources/images/test-ghmodels-api.png)

If you encounter any errors, check the console logs to understand what went wrong. The error message should be clear and informative, helping you quickly identify and fix the issue.

## Practical Exercises for Consolidation

### Expanding with a New Tone of Voice

Implement a new **"professional"** tone by adding it to the existing guidelines. This tone should use formal business language, focus on industry trends and insights, maintain an authoritative voice, include relevant metrics when possible, and address pain points and solutions.

Test the new tone by creating a new API route or modifying the existing one to include this tone of voice.

### Implementing Simple Caching

Implement a basic metrics logging system that tracks the total number of requests, successful requests, failed requests, and average response time. This will help monitor the application in production.

Create an additional API route at `/api/test-ai/metrics` that returns these statistics.

### Advanced Custom Validation

Implement stricter validation for hashtags by checking their format, allowed characters, and maximum length. This will ensure that all generated hashtags are valid for social media platforms.

Test the validation by creating scenarios that force the AI to generate invalid hashtags and observe how the system responds.

## Session Recap and Next Steps

### What Have We Achieved?

In this session, we implemented a robust AI service fully integrated with GitHub Models. We created a tone-based prompt system that enables full flexibility for content generation. We also implemented rigorous input and output validation to ensure content quality and consistency.

We developed resilience patterns using retry logic with exponential backoff, comprehensive error handling to prevent silent failures, and proactive environment variable validation that detects configuration issues early.

Our architecture is scalable thanks to the Singleton pattern, which optimizes performance, along with a clear separation of responsibilities that simplifies maintenance, and a fully type-safe interface in TypeScript that helps prevent runtime errors.

We applied security best practices by securely managing secrets, enforcing configuration validation, and implementing defensive error handling to prevent information leaks.

Most importantly, we built a practical and professional testing system using API routes. It simulates exactly how the service will be used in production, provides immediate feedback through detailed logs, and facilitates debugging and iterative development.

## Preparing for the Next Session

In Session 6, we’ll build the full user interface for the generation form, develop a dedicated page using our test API as the base, implement loading states and advanced visual feedback, and finalize the frontend-backend integration to ensure a smooth and professional user experience.

We’ll use the test API route we created as the foundation for our production API, expanding it with additional validation, rate limiting, and other essential features for a robust production environment.

> **Pro Tip:** Always test your prompts with different types of input to ensure robustness. The quality of the prompt directly determines the quality of the AI’s response, so invest time experimenting and refining your instructions. The test system we implemented makes this experimentation fast and efficient, enabling rapid iteration during development.

**[⬅️ Back: Base Structure with Typing and Reusable Components](./04-initial-structure-components-ctabutton.md) | [Next: Session 06 ➡️](./06-session.md)**

