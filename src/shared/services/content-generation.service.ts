import { GeneratedContent, ToneOfVoice } from '@/types';
import { getLangChainMicroblogService } from './langchain.factory';
import { getGitHubModelsService } from './github-models.services';
import { MockContentService } from './mock-content.service';

export interface ContentGenerationStrategy {
  generateContent(topic: string, tone: ToneOfVoice, keywords?: string): Promise<GeneratedContent>;
}

class LangChainStrategy implements ContentGenerationStrategy {
  async generateContent(topic: string, tone: ToneOfVoice, keywords?: string): Promise<GeneratedContent> {
    const service = getLangChainMicroblogService();
    return service.generateMicroblogContent(topic, tone, keywords);
  }
}

class GitHubModelsStrategy implements ContentGenerationStrategy {
  async generateContent(topic: string, tone: ToneOfVoice, keywords?: string): Promise<GeneratedContent> {
    const service = getGitHubModelsService();
    return service.generateMicroblogContent(topic, tone, keywords);
  }
}

class MockStrategy implements ContentGenerationStrategy {
  async generateContent(topic: string, tone: ToneOfVoice, keywords?: string): Promise<GeneratedContent> {
    return MockContentService.generateMockContent(topic, tone, keywords);
  }
}

export class ContentGenerationService {
  private static instance: ContentGenerationService;
  private strategy: ContentGenerationStrategy;
  private useLangChain: boolean = true;

  private constructor() {
    this.strategy = this.useLangChain 
      ? new LangChainStrategy() 
      : new GitHubModelsStrategy();
  }

  static getInstance(): ContentGenerationService {
    if (!ContentGenerationService.instance) {
      ContentGenerationService.instance = new ContentGenerationService();
    }
    return ContentGenerationService.instance;
  }

  async generateContent(topic: string, tone: ToneOfVoice, keywords?: string): Promise<GeneratedContent> {
    try {
      return await this.strategy.generateContent(topic, tone, keywords);
    } catch (error) {
      console.warn('Primary strategy failed:', error);
      
      // Check if it's a rate limit error
      const isRateLimit = error instanceof Error && 
        (error.message.includes('Rate limit') || error.message.includes('429'));
      
      if (this.useLangChain) {
        console.warn('LangChain failed, trying GitHub Models...');
        try {
          this.strategy = new GitHubModelsStrategy();
          return await this.strategy.generateContent(topic, tone, keywords);
        } catch (githubError) {
          console.warn('GitHub Models also failed:', githubError);
          
          // If both services fail due to rate limiting, use mock
          if (isRateLimit || (githubError instanceof Error && githubError.message.includes('Rate limit'))) {
            console.warn('Rate limits exceeded, using mock content for development...');
            this.strategy = new MockStrategy();
            return await this.strategy.generateContent(topic, tone, keywords);
          }
          throw githubError;
        }
      }
      
      // If not using LangChain and GitHub Models fails, use mock for rate limits
      if (isRateLimit) {
        console.warn('Rate limit exceeded, using mock content for development...');
        this.strategy = new MockStrategy();
        return await this.strategy.generateContent(topic, tone, keywords);
      }
      
      throw error;
    }
  }

  setStrategy(useLangChain: boolean): void {
    this.useLangChain = useLangChain;
    this.strategy = useLangChain 
      ? new LangChainStrategy() 
      : new GitHubModelsStrategy();
  }

  isUsingLangChain(): boolean {
    return this.useLangChain;
  }
}

export const getContentGenerationService = () => ContentGenerationService.getInstance();