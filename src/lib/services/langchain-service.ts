import { GeneratedContent } from "@/types";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const generatedContentSchema = z.object({
  mainContent: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(280, "Content must not exceed 280 characters"),
  hashtags: z.array(z.string())
    .min(1, "At least one hashtag required")
    .max(5, "Maximum 5 hashtags allowed"),
  insights: z.array(z.string())
    .min(1, "At least one insight required")
    .max(5, "Maximum 5 insights allowed")
});

interface ToneGuidelines {
  [key: string]: string[]
}

class LangChainMicroblogService {
  private chatModel: ChatOpenAI;
  private readonly toneGuidelines: ToneGuidelines;
  private outputParser: StructuredOutputParser<typeof generatedContentSchema>

  constructor() {
    this.validateEnvironmentVariables();

    this.chatModel = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 500,
      openAIApiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
      configuration: {
        baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT || "https://models.inference.ai.azure.com",
      }
    });

    this.toneGuidelines = this.getToneGuidelines();

    this.outputParser = StructuredOutputParser.fromZodSchema(generatedContentSchema);
  }

  /**
   * Validate environment variables required for the service.
   * Ensures that all the necessary credentials are present
   */
  validateEnvironmentVariables(): void {
    const requiredVars = ['NEXT_PUBLIC_GITHUB_MODELS_TOKEN'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables...: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Definition of guidelines for each tone of voice
   * Each tone has specific characteristics that guide the generation of content.
   */
  getToneGuidelines(): ToneGuidelines {
    return {
      technical: [
        'Use precise technical language and industry terminology',
        'Include specific data points, metrics, and statistics when relevant',
        'Maintain professional credibility and authoritative tone',
        'Focus on accuracy, clarity, and factual information',
        'Reference best practices and proven methodologies',
      ],
      casual: [
        'Use conversational, friendly, and approachable language',
        'Include relatable examples and everyday analogies',
        'Keep the tone light, engaging, and personable',
        'Write as if speaking to a friend or colleague',
        'Use informal expressions while maintaining clarity',
      ],
      motivational: [
        'Use inspiring, empowering, and action-oriented language',
        'Focus on positive outcomes, growth, and possibilities',
        'Include clear calls-to-action and next steps',
        'Create emotional connections and resonance',
        'Emphasize achievement, progress, and transformation'
      ]
    }
  }

  private createPromptTemplate(tone: string): ChatPromptTemplate {
    const guidelines = this.toneGuidelines[tone] || this.toneGuidelines.casual;

    const systemPromptTemplate = `You are a professional content creator specializing in creating engaging microblog posts.

      Your expertise includes:
        - Creating viral-worthy content under 280 characters
        - Understanding social media engagement patterns
        - Crafting content that drives discussion and shares
        - Adapting tone while maintaining authenticity
        - Selecting impactful and trending hashtags

      TONE REQUIREMENTS for {tone} style:
        {guidelines}

      RESPONSE GUIDELINES:
        1. Content must be concise and impactful
        2. Optimize for social media sharing
        3. Ensure relevance to target audience
        4. Create engaging and shareable content
        5. Include strategic hashtags for discoverability

      IMPORTANT: Your response must be in valid JSON format as specified below.

      {format_instructions}`;

    // Human prompt as dynamic template
    const humanPromptTemplate = `Create a microblog post about "{topic}"{keywords_section}.

        Generate content that:
          - Captures attention within the first few words
          - Provides value or insight to the reader
          - Encourages engagement (likes, shares, comments)
          - Uses the {tone} tone consistently throughout
          - Includes relevant and trending hashtags
          - Provides actionable insights for the audience`;

    // Composition of the complete template
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
      HumanMessagePromptTemplate.fromTemplate(humanPromptTemplate)
    ]);
  }

  /**
   * Main content generation method using LangChain
   * Completely replaces previous implementation with OpenAI SDK
   */
  async generateMicroblogContent(
    topic: string,
    tone: string,
    keywords?: string
  ): Promise<GeneratedContent> {
    try {
      const guidelines = this.toneGuidelines[tone] || this.toneGuidelines.casual;
      const keywordsSection = keywords
        ? `, incorporating these keywords: ${keywords}`
        : '';

      const promptTemplate = this.createPromptTemplate(tone);

      // Create a chain (operation sequence)
      const chain = RunnableSequence.from([
        promptTemplate,
        this.chatModel,
        this.outputParser
      ]);

      // Execute chain with variables
      const result = await chain.invoke({
        tone: tone,
        guidelines: guidelines.map(g => `• ${g}`).join('\n'),
        format_instructions: this.outputParser.getFormatInstructions(),
        topic: topic,
        keywords_section: keywordsSection
      });

      this.validateGeneratedContent(result);

      console.log('✅ LangChain content generated successfully:', {
        topic,
        tone,
        contentLength: result.mainContent.length,
        hashtagsCount: result.hashtags.length,
        insightsCount: result.insights.length
      });

      return result;
    } catch (error) {
      console.error('❌ LangChain generation error...: ', error);

      if (error instanceof Error) {
        throw new Error(`LangChain generation failed...: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Additional validation specific to our application
   * Complements Zod schema validation
   */
  validateGeneratedContent(content: GeneratedContent): void {
    const { mainContent, hashtags, insights } = content;

    if (mainContent.length > 280) {
      throw new Error(`Content exceeds 280 characters...:  ${mainContent.length}`);
    }

    if (mainContent.length < 10) {
      throw new Error(`Content too short...: ${mainContent.length} characters`);
    }

    hashtags.forEach((tag, index) => {
      if (!tag.startsWith('#') && !tag.match(/^[a-zA-Z0-9_]+$/)) {
        throw new Error(`Invalid hashtag format at position...: ${index}: ${tag}`);
      }
    });

    if (insights.some(insight => insight.length < 5)) {
      throw new Error('All insights must be at least 5 characters long');
    }

    console.log('✅ Content validation passed..: ', {
      contentLength: mainContent.length,
      hashtagsCount: hashtags.length,
      insightsCount: insights.length
    });
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delaysMs: number = 1000): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`🔄 LangChain attempt ${attempt}/${maxAttempts} failed:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempt,
          nextRetryIn: attempt < maxAttempts ? `${delaysMs * attempt}ms` : 'No more retries'
        });

        if (error instanceof Error) {
          // Erros que não devem ser retried
          if (error.message.includes('Invalid API key') ||
            error.message.includes('environment variables') ||
            error.message.includes('exceeds') ||
            error.message.includes('validation')) {
            console.error('🚫 Non-retryable error detected, failing fast:', error.message);
            throw error;
          }
        }

        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delaysMs * attempt));
        }
      }
    }

    throw new Error(`LangChain operation failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
  }

}