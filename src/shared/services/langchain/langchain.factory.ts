import { LangChainServiceConfig } from '@/types/langchain-types';
import { DEFAULT_LANGCHAIN_CONFIG, LANGCHAIN_PRESETS } from '@/lib/config/langchain';
import { LangChainMicroblogService } from '../langchain.services'; 

class LangChainFactory {
  private static instance: LangChainMicroblogService | null = null;
  private static currentConfig: LangChainServiceConfig | null = null;

  static getInstance(config?: Partial<LangChainServiceConfig>): LangChainMicroblogService { 
    const finalConfig = { ...DEFAULT_LANGCHAIN_CONFIG, ...config };

    if (!this.instance || this.configChanged(finalConfig)) {
      this.instance = new LangChainMicroblogService(finalConfig);
      this.currentConfig = finalConfig;
    }

    return this.instance;
  }

  static createWithPreset(
    preset: keyof typeof LANGCHAIN_PRESETS,
    overrides?: Partial<LangChainServiceConfig>
  ): LangChainMicroblogService {
    const presetConfig = LANGCHAIN_PRESETS[preset];
    return this.getInstance({ ...presetConfig, ...overrides });
  }

  static reset(): void {
    this.instance = null;
    this.currentConfig = null;
  }

  private static configChanged(newConfig: LangChainServiceConfig): boolean {
    if (!this.currentConfig) return true;
    
    return JSON.stringify(this.currentConfig) !== JSON.stringify(newConfig);
  }
}

export const getLangChainMicroblogService = (config?: Partial<LangChainServiceConfig>) => 
  LangChainFactory.getInstance(config);