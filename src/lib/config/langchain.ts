import { LangChainServiceConfig } from '@/types/langchain-types';

export const DEFAULT_LANGCHAIN_CONFIG: LangChainServiceConfig = {
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

export const LANGCHAIN_PRESETS = {
  development: {
    ...DEFAULT_LANGCHAIN_CONFIG,
    enableLogging: true,
    temperature: 0.8,
  },
  production: {
    ...DEFAULT_LANGCHAIN_CONFIG,
    enableLogging: false,
    temperature: 0.7,
  },
  testing: {
    ...DEFAULT_LANGCHAIN_CONFIG,
    enableLogging: false,
    temperature: 0.5,
    maxTokens: 200,
  }
} as const;