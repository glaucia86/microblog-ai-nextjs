import { RetryManager } from "../../lib/utils/retry/retry-manager";
import { GeneratedContent } from "@/types";
import { LangChainServiceConfig, LangChainTestResult, PerformanceMetrics } from "@/types/langchain-types";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptService } from './prompt.services';
import { MICROBLOG_LIMITS } from '@/lib/constants/app';
import { ValidationError } from '@/lib/errors/app-errors';

const OutputSchema = z.object({
  mainContent: z.string().max(280),
  hashtags: z.array(z.string()).min(1).max(10),
  insights: z.array(z.string()).min(1).max(5),
});

// ✅ Exportar como named export
export class LangChainMicroblogService {
  private model!: ChatOpenAI;
  private parser!: StructuredOutputParser<typeof OutputSchema>;
  private chain!: RunnableSequence;
  private retryManager!: RetryManager;
  private performanceMetrics!: PerformanceMetrics;

  constructor(config?: Partial<LangChainServiceConfig>) {
    // Usar configuração padrão se não fornecida
    const defaultConfig: LangChainServiceConfig = {
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 500,
      enableLogging: process.env.NODE_ENV === 'development',
      enableRetry: true,
      customRetryConfig: {
        maxAttempts: 3,
        baseDelayMs: 1000,
        enableJitter: true,
      }
    };

    this.config = { ...defaultConfig, ...config };
    
    this.validateEnvironmentVariables();
    this.initializeModel();
    this.initializeParser();
    this.buildChain();
    this.retryManager = new RetryManager({
      maxAttempts: this.config.customRetryConfig?.maxAttempts || 3,
      enableLogging: this.config.enableLogging,
    });
    this.performanceMetrics = this.initializeMetrics();
  }

  async generateMicroblogContent(
    topic: string,
    tone: string,
    keywords?: string
  ): Promise<GeneratedContent> {
    return this.retryManager.executeWithRetry(
      () => this.executeGeneration(topic, tone, keywords),
      {
        operationName: 'LangChain Content Generation',
        topic,
        tone,
        keywords,
      }
    );
  }

  private async executeGeneration(
    topic: string,
    tone: string,
    keywords?: string
  ): Promise<GeneratedContent> {
    try {
      const systemPrompt = PromptService.createSystemPrompt();
      const userPrompt = PromptService.createUserPrompt(topic, tone as any, keywords);

      const result = await this.chain.invoke({
        system_prompt: systemPrompt,
        user_prompt: userPrompt,
        format_instructions: this.parser.getFormatInstructions(),
      });

      const content = this.validateAndParseContent(result);
      return content;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate content with LangChain'
      );
    }
  }

  private validateAndParseContent(content: any): GeneratedContent {
    if (!content || typeof content !== 'object') {
      throw new ValidationError('Invalid content structure');
    }

    this.validateMainContent(content.mainContent);
    this.validateHashtags(content.hashtags);
    this.validateInsights(content.insights);

    return {
      mainContent: content.mainContent,
      hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
      insights: Array.isArray(content.insights) ? content.insights : [],
    };
  }

  private validateMainContent(mainContent: any): void {
    if (!mainContent || typeof mainContent !== 'string') {
      throw new ValidationError('Invalid main content');
    }

    if (mainContent.length > MICROBLOG_LIMITS.MAX_CONTENT_LENGTH) {
      throw new ValidationError(`Content exceeds ${MICROBLOG_LIMITS.MAX_CONTENT_LENGTH} characters`);
    }

    if (mainContent.trim().length === 0) {
      throw new ValidationError('Main content cannot be empty');
    }
  }

  private validateHashtags(hashtags: any): void {
    if (!Array.isArray(hashtags)) {
      throw new ValidationError('Hashtags must be an array');
    }

    if (hashtags.length === 0) {
      throw new ValidationError('At least one hashtag is required');
    }

    hashtags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        throw new ValidationError(`Invalid hashtag at position ${index}`);
      }
    });
  }

  private validateInsights(insights: any): void {
    if (!Array.isArray(insights)) {
      throw new ValidationError('Insights must be an array');
    }

    if (insights.length === 0) {
      throw new ValidationError('At least one insight is required');
    }

    insights.forEach((insight, index) => {
      if (typeof insight !== 'string' || insight.trim().length === 0) {
        throw new ValidationError(`Invalid insight at position ${index}`);
      }
    });
  }

  private validateEnvironmentVariables(): void {
    if (!process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN) {
      throw new Error('Missing GITHUB_MODELS_TOKEN environment variable');
    }
  }

  private initializeModel(): void {
    this.model = new ChatOpenAI({
      modelName: this.config.modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      openAIApiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
      configuration: {
        baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT,
      },
    });
  }

  private initializeParser(): void {
    this.parser = StructuredOutputParser.fromZodSchema(OutputSchema);
  }

  private buildChain(): void {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate('{system_prompt}\n\n{format_instructions}'),
      HumanMessagePromptTemplate.fromTemplate('{user_prompt}'),
    ]);

    this.chain = RunnableSequence.from([
      promptTemplate,
      this.model,
      this.parser,
    ]);
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      averageLatency: 0,
      successRate: 0,
      totalRequests: 0,
      failedRequests: 0,
      retryRate: 0,
      lastResetTime: new Date().toISOString(),
    };
  }

  async testConnection(): Promise<LangChainTestResult> {
    try {
      const startTime = Date.now();
      await this.generateMicroblogContent('test', 'casual');
      const latency = Date.now() - startTime;

      return {
        success: true,
        latency,
        model: this.config.modelName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        latency: 0,
        model: this.config.modelName,
        timestamp: new Date().toISOString(),
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getServiceConfig(): LangChainServiceConfig {
    return { ...this.config };
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  // Adicionar propriedade config que estava faltando
  private config: LangChainServiceConfig;
}

// ✅ Também manter como default export para compatibilidade
export default LangChainMicroblogService;