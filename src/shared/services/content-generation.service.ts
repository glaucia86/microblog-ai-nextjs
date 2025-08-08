import { GeneratedContent, ToneOfVoice } from '@/types';
import { getLangChainMicroblogService } from './langchain.factory';
import { getGitHubModelsService } from './github-models.services';

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
      if (this.useLangChain) {
        console.warn('LangChain failed, falling back to GitHub Models:', error);
        this.strategy = new GitHubModelsStrategy();
        return this.strategy.generateContent(topic, tone, keywords);
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