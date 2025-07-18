import { OpenAI } from "openai";
import "dotenv/config";
import { GeneratedContent } from "@/types";

interface ToneGuidelines {
  [key: string]: string[];
}

class GitHubModelsService {
  private client: OpenAI;
  private readonly toneGuidelines: ToneGuidelines;
  private readonly modelName: string = "gpt-4o";

  constructor() {
    this.validateEnvironmentVariables();

    this.client = new OpenAI({
      baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT || "https://models.inference.ai.azure.com",
      apiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN
    });

    this.toneGuidelines = this.getToneGuidelines();  
  }


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

  private validateEnvironmentVariables() {
    const requiredVars = ['NEXT_PUBLIC_GITHUB_MODELS_TOKEN'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

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
}

let serviceInstance: GitHubModelsService | null = null;

export function getGitHubModelsService(): GitHubModelsService {
  if(!serviceInstance) {
    serviceInstance = new GitHubModelsService();
  }

  return serviceInstance;
}
