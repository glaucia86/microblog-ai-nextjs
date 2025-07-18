import { RetryManager } from "@/retry/retry-manager";
import { ErrorType } from "@/retry/types";
import { GeneratedContent } from "@/types";
import { ContentGenerationContext, LangChainServiceConfig, LangChainTestResult, PerformanceMetrics } from "@/types/langchain-types";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { 
  ChatPromptTemplate, 
  HumanMessagePromptTemplate, 
  SystemMessagePromptTemplate 
} from "@langchain/core/prompts";
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
  private outputParser: StructuredOutputParser<typeof generatedContentSchema>;
  private retryManager: RetryManager;
  private config: LangChainServiceConfig;
  private performanceMetrics: PerformanceMetrics;

  constructor(config?: Partial<LangChainServiceConfig>) {
    this.validateEnvironmentVariables();

    this.config = {
      modelName: "gpt-4o",
      temperature: 0.7,
      maxTokens: 500,
      enableLogging: true,
      enableRetry: true,
      ...config
    }

    this.chatModel = new ChatOpenAI({
      model: this.config.modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      openAIApiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
      configuration: {
        baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT || "https://models.inference.ai.azure.com",
      }
    });

    this.toneGuidelines = this.getToneGuidelines();
    this.outputParser = StructuredOutputParser.fromZodSchema(generatedContentSchema);

    this.retryManager = new RetryManager({
      enableLogging: this.config.enableLogging,
      ...this.config.customRetryConfig
    });

    this.performanceMetrics = this.initializeMetrics();
  }

  /**
   * Return service configuration
   */
  getServiceConfig(): LangChainServiceConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateServiceConfig(newConfig: Partial<Pick<LangChainServiceConfig, 'enableLogging' | 'enableRetry'>>): void {
    this.config.enableLogging = newConfig.enableLogging ?? this.config.enableLogging;
    this.config.enableRetry = newConfig.enableRetry ?? this.config.enableRetry;

    if (this.config.enableLogging) {
      console.log('Service configuration updated..: ', {
        enableLoggin: this.config.enableLogging,
        enableRetry: this.config.enableRetry
      });
    }
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

    this.validateInput(topic, tone, keywords);

    const context: ContentGenerationContext = {
      operationName: 'LangChain content generation',
      topic,
      tone,
      keywords,
      metadata: {
        model:this.config.modelName,
        temperature: this.config.temperature 
      }
    };

    const startTime = Date.now();

    try {
      const result = this.config.enableRetry
        ? await this.retryManager.executeWithRetry(
          () => this.executeGeneration(topic, tone, keywords),
          context
          )
        : await this.executeGeneration(topic, tone, keywords);
      
      this.updateSuccessMetrics(Date.now() - startTime);

      return result;
    } catch (error) {
      this.updateFailureMetrics();
      throw error;
    }
  }


  private async executeGeneration(
    topic: string, 
    tone: string, 
    keywords?: string): Promise<GeneratedContent> {
    
    const guidelines = this.toneGuidelines[tone] || this.toneGuidelines.casual;
    const keywordsSection = keywords
      ? `, , incorporating these keywords: ${keywords}` 
      : '';
    
    const promptTemplate = this.createPromptTemplate(tone);

    const chain = RunnableSequence.from([
      promptTemplate,
      this.chatModel,
      this.outputParser
    ]);

    const result = await chain.invoke({
      topic: topic,
      keywords_section: keywordsSection,
      format_instructions: this.outputParser.getFormatInstructions()
    });

    this.validateGeneratedContent(result);

    if (this.config.enableLogging) {
      console.log('✅ LangChain content generated successfully:', {
        topic,
        tone,
        contentLength: result.mainContent.length,
        hashtagsCount: result.hashtags.length,
        insightsCount: result.insights.length
      });
    }

    return result;
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

      TONE REQUIREMENTS for ${tone} style:
        ${guidelines.map(g => `• ${g}`).join('\n')}

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
          - Uses the ${tone} tone consistently throughout
          - Includes relevant and trending hashtags
          - Provides actionable insights for the audience`;

    // Composition of the complete template
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
      HumanMessagePromptTemplate.fromTemplate(humanPromptTemplate)
    ]);
  }

  async testConnection(): Promise<LangChainTestResult> {
    const context = {
      operationName: 'LangChain connection test',
      metadata: { testType: 'connectivity' }
    };

    return this.retryManager.executeWithRetry(async () => {
      const startTime = Date.now();
      
      const testPrompt = ChatPromptTemplate.fromTemplate("Say 'test' in JSON format: {\"response\": \"test\"}");
      const testParser = StructuredOutputParser.fromZodSchema(
        z.object({ response: z.string() })
      );
      
      const testChain = RunnableSequence.from([
        testPrompt,
        this.chatModel,
        testParser
      ]);
      
      await testChain.invoke({});
      
      return {
        success: true,
        latency: Date.now() - startTime,
        model: this.chatModel.modelName,
        timestamp: new Date().toISOString()
      };
    }, context);
  }


  /**
   * Validate environment variables required for the service.
   * Ensures that all the necessary credentials are present
   */
  private validateEnvironmentVariables(): void {
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
  private getToneGuidelines(): ToneGuidelines {
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

  private validateInput(topic: string, tone: string, keywords?: string): void {
    if (!topic || topic.trim().length === 0) {
      throw new Error('Topic is required and cannot be empty');
    }
    
    if (topic.length < 5) {
      throw new Error('Topic must be at least 5 characters long');
    }
    
    if (topic.length > 500) {
      throw new Error('Topic cannot exceed 500 characters');
    }
    
    const validTones = Object.keys(this.toneGuidelines);
    if (!validTones.includes(tone)) {
      throw new Error(`Invalid tone "${tone}". Valid tones: ${validTones.join(', ')}`);
    }
    
    if (keywords && keywords.length > 200) {
      throw new Error('Keywords cannot exceed 200 characters');
    }
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      averageLatency: 0,
      successRate: 0,
      totalRequests: 0,
      failedRequests: 0,
      retryRate: 0,
      lastResetTime: new Date().toISOString()
    };
  }

  private updateSuccessMetrics(latency: number): void {
    this.performanceMetrics.totalRequests++;
    this.performanceMetrics.averageLatency = 
      (this.performanceMetrics.averageLatency + latency) / 2;
    this.performanceMetrics.successRate = 
      ((this.performanceMetrics.totalRequests - this.performanceMetrics.failedRequests) / 
       this.performanceMetrics.totalRequests) * 100;
  }

  private updateFailureMetrics(): void {
    this.performanceMetrics.totalRequests++;
    this.performanceMetrics.failedRequests++;
    this.performanceMetrics.successRate = 
      ((this.performanceMetrics.totalRequests - this.performanceMetrics.failedRequests) / 
       this.performanceMetrics.totalRequests) * 100;
  }

  configureRetry(config: Parameters<RetryManager['updateConfig']>[0]): void {
    this.retryManager.updateConfig(config);
  }

  getRetryConfig() {
    return this.retryManager.getConfig();
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  resetMetrics(): void {
    this.performanceMetrics = this.initializeMetrics();
  }

  async simulateError(errorType: ErrorType): Promise<void> {
    const errorMessages = {
      [ErrorType.RETRYABLE]: 'Simulated retryable error',
      [ErrorType.NON_RETRYABLE]: 'Simulated non-retryable error', 
      [ErrorType.RATE_LIMIT]: 'Rate limit exceeded - too many requests',
      [ErrorType.VALIDATION]: 'Validation error - invalid schema',
      [ErrorType.NETWORK]: 'Network timeout - connection failed',
      [ErrorType.API_KEY]: 'Invalid API key - unauthorized',
      [ErrorType.PARSING]: 'JSON parsing error - malformed response',
      [ErrorType.TIMEOUT]: 'Request timeout - operation took too long'
    };
    
    throw new Error(errorMessages[errorType]);
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
}

export { LangChainMicroblogService }