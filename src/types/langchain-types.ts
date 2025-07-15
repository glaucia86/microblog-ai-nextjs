import { OperationContext } from "@/retry/types";
import { GeneratedContent } from "./index";

export interface ContentGenerationContext extends OperationContext {
  topic: string;
  tone: string;
  keywords?: string;
  targetLength?: number;
  audience?: string;
}

export interface LangChainTestResult {
  success: boolean;
  latency: number;
  model: string;
  timestamp: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  errorDetails?: string;
}

export interface LangChainServiceConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  enableLogging: boolean;
  enableRetry: boolean;
  customRetryConfig?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    enableJitter?: boolean;
  };
}

export interface PerformanceMetrics {
  averageLatency: number;
  successRate: number;
  totalRequests: number;
  failedRequests: number;
  retryRate: number;
  lastResetTime: string;
}

export interface EnrichedGeneratedContent extends GeneratedContent {
  metadata: {
    generationTime: number;
    tokensUsed?: number;
    attemptCount: number;
    model: string;
    tone: string;
    timestamp: string;
  };
}