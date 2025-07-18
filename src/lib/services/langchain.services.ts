import { GeneratedContent, ToneOfVoice } from '@/types';
import { LangChainServiceConfig } from '@/types/langchain-types';
import { PromptService } from './prompt.services'
import { RetryManager } from '@/lib/utils/retry/retry-manager';
import { ContentGenerationError } from '@/lib/errors/app-errors';
import { LangChainClient } from './langchain.client';
import { ContentValidator } from './content.validator';

export class LangChainService {
  private client: LangChainClient;
  private validator: ContentValidator;
  private retryManager: RetryManager;

  constructor(private config: LangChainServiceConfig) {
    this.client = new LangChainClient(config);
    this.validator = new ContentValidator();
    this.retryManager = new RetryManager({
      maxAttempts: config.customRetryConfig?.maxAttempts || 3,
      enableLogging: config.enableLogging,
    });
  }

  async generateMicroblogContent(
    topic: string,
    tone: ToneOfVoice,
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
    tone: ToneOfVoice,
    keywords?: string
  ): Promise<GeneratedContent> {
    try {
      const systemPrompt = PromptService.createSystemPrompt();
      const userPrompt = PromptService.createUserPrompt(topic, tone, keywords);

      const result = await this.client.generateContent(systemPrompt, userPrompt);
      const content = this.validator.validateAndParse(result);

      return content;
    } catch (error) {
      throw new ContentGenerationError(
        error instanceof Error ? error.message : 'Failed to generate content with LangChain'
      );
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateMicroblogContent('test', 'casual');
      return true;
    } catch {
      return false;
    }
  }
}