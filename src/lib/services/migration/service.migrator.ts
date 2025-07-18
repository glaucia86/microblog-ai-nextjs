import { GeneratedContent } from "@/types";
import { getLangChainMicroblogService } from "../langchain.factory";

export class ServiceMigrator {
  private static useLangChain: boolean = true;

  static async generateMicroblogContent(topic: string, tone: string, keywords?: string): Promise<GeneratedContent> {
    if (this.useLangChain) {
      return this.generateMicroblogContent(topic, tone, keywords);
    } else {
      return this.generateWithGitHubModels(topic, tone, keywords);
    }
  }

  private static async generateWithLangChain(topic: string, tone: string, keywords?: string): Promise<GeneratedContent> {
    try {
      const service = getLangChainMicroblogService({
        enableLogging: process.env.NODE_ENV === 'development'
      });

      return await service.generateMicroblogContent(topic, tone, keywords);
    } catch (error) {
      console.log('LangChain generation failed...: ', error);

      if (this.shouldFallbackToOldService(error)) {
        console.warn('Falling back to GitHub Models Service');
        return this.generateWithGitHubModels(topic, tone, keywords);
      }

      throw error;
    }
  }

  private static async generateWithGitHubModels(topic: string, tone: string, keywords?: string): Promise<GeneratedContent> {
    const { getGitHubModelsService } = await import('../github-models.services');
    const service = getGitHubModelsService();

    return await service.generateMicroblogContent(topic, tone, keywords);
  }

  private static shouldFallbackToOldService(error: any): boolean {
    if (!error || typeof error.message !== 'string') return false;

    const fallbackTriggers = [
      'Missing required environment variables',
      'LangChain',
      'Invalid API key',
      'configuration'
    ];

    return fallbackTriggers.some(trigger =>
      error.message.toLowerCase().includes(trigger.toLowerCase())
    );
  }

  static enableLangChain(): void {
    this.useLangChain = true;
    console.log('LangChain service enabled');
  }

  static disableLangChain(): void {
    this.useLangChain = false;
    console.log('Fallback to GitHub Models service enabled')
  }

  static isUsingLangChain(): boolean {
    return this.useLangChain;
  }

  static async compareServices(
    topic: string,
    tone: string,
    keywords?: string
  ): Promise<{
    langchain: { result: GeneratedContent; duration: number; success: boolean };
    github: { result: GeneratedContent; duration: number; success: boolean };
  }> {
    const results = {
      langchain: { result: null as any, duration: 0, success: false },
      github: { result: null as any, duration: 0, success: false }
    };

    try {
      const startTime = Date.now();
      results.langchain.result = await this.generateWithLangChain(topic, tone, keywords);
      results.langchain.duration = Date.now() - startTime;
      results.langchain.success = true;
    } catch (error) {
      console.error('LangChain test failed:', error);
    }

    try {
      const startTime = Date.now();
      results.github.result = await this.generateWithGitHubModels(topic, tone, keywords);
      results.github.duration = Date.now() - startTime;
      results.github.success = true;
    } catch (error) {
      console.error('GitHub Models test failed:', error);
    }

    return results;
  }
}

export function getUnifiedMicroblogService() {
  return {
    generateMicroblogContent: ServiceMigrator.generateMicroblogContent.bind(ServiceMigrator),

    testConnection: async () => {
      const service = getLangChainMicroblogService();
      return service.testConnection();
    },

    getMetrics: () => {
      const service = getLangChainMicroblogService();
      return service.getPerformanceMetrics();
    },

    resetMetrics: () => {
      const service = getLangChainMicroblogService();
      service.resetMetrics();
    }
  };
}