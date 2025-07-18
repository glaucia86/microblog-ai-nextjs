import { LangChainServiceConfig } from "@/types/langchain-types";
import { LangChainMicroblogService } from "./langchain-service";

class LangChainServiceFactory {
  private static instance: LangChainMicroblogService | null = null;
  private static currentConfig: LangChainServiceConfig | null = null;

  static getInstance(config?: Partial<LangChainServiceConfig>): LangChainMicroblogService {
    if (this.shouldRecreateInstance(config)) {
      this.destroyInstance();
    }

    if (!this.instance) {
      this.instance = new LangChainMicroblogService(config);
      this.currentConfig = this.instance.getServiceConfig();

      console.log('LangChain Service instance created...: ', {
        model: this.currentConfig?.modelName,
        temperature: this.currentConfig?.temperature,
        retryEnabled: this.currentConfig?.enableRetry,
        timestamp: new Date().toISOString()
      });
    }

    return this.instance;
  }

  private static shouldRecreateInstance(newConfig?: Partial<LangChainServiceConfig>): boolean {
    if (!this.instance || !this.currentConfig) {
      return false;
    }

    if (!newConfig) {
      return false;
    }

    const criticalChanges = [
      'modelName',
      'temperature',
      'maxTokens'
    ] as const;

    return criticalChanges.some(key => {
      if (key in newConfig) {
        return newConfig[key] !== this.currentConfig![key];
      }

      return false;
    });
  }

  static destroyInstance(): void {
    if (this.instance) {
      console.log('Destroying LangChain Service instance');
      this.instance = null;
      this.currentConfig = null;
    }
  }

  static getInstanceInfo(): {
    hasInstance: boolean;
    config: LangChainServiceConfig | null;
    metrics: any;
  } {
    return {
      hasInstance: !!this.instance,
      config: this.currentConfig,
      metrics: this.instance?.getPerformanceMetrics() || null
    };
  }

  static createTestInstance(config?: Partial<LangChainServiceConfig>): LangChainMicroblogService {
    console.log('Creating temporary test instance');
    return new LangChainMicroblogService({
      enableLogging: false,
      ...config
    });
  }

  static recreateInstance(config: Partial<LangChainServiceConfig>): LangChainMicroblogService {
    this.destroyInstance();
    return this.getInstance(config);
  }

  static readonly presets = {
    development: {
      enableLogging: true,
      enableRetry: true,
      customRetryConfig: {
        maxAttempts: 2,
        baseDelayMs: 500
      }
    },
    production: {
      enableLogging: false,
      enableRetry: true,
      customRetryConfig: {
        maxAttempts: 3,
        baseDelayMs: 1000
      }
    },
    testing: {
      enableLogging: false,
      enableRetry: false,
      temperature: 0.1
    }
  } as const;

  static createWithPreset(
    environment: keyof typeof LangChainServiceFactory.presets,
    overrides?: Partial<LangChainServiceConfig>
  ): LangChainMicroblogService {
    const presetConfig = this.presets[environment];
    const finalConfig = { ...presetConfig, ...overrides };

    console.log(`Creating LangChain instance with ${environment} preset:`, finalConfig)

    return this.getInstance(finalConfig);
  }
}

export function getLangChainMicroblogService(config?: Partial<LangChainServiceConfig>): LangChainMicroblogService {
  return LangChainServiceFactory.getInstance(config);
}

export const LangChainService = {
  development: () => LangChainServiceFactory.createWithPreset('development'),
  production: () => LangChainServiceFactory.createWithPreset('production'),
  testing: () => LangChainServiceFactory.createWithPreset('testing'),
  custom: (config: Partial<LangChainServiceConfig>) => LangChainServiceFactory.getInstance(config),
  info: () => LangChainServiceFactory.getInstanceInfo(),
  reset: () => LangChainServiceFactory.destroyInstance(),
  createTestInstance: (config?: Partial<LangChainServiceConfig>) => LangChainServiceFactory.createTestInstance(config)
}

export { LangChainServiceFactory };



