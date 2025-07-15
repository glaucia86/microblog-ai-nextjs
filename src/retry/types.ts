/**
 * 🏷️ Types for the retry system
 * Centralizes all retry-related type definitions
 */

// Enum to classify error types
export enum ErrorType {
  RETRYABLE = 'retryable',
  NON_RETRYABLE = 'non_retryable',
  RATE_LIMIT = 'rate_limit',
  VALIDATION = 'validation',
  NETWORK = 'network',
  API_KEY = 'api_key',
  PARSING = 'parsing',
  TIMEOUT = 'timeout'
}

// Interface for retry metrics
export interface RetryMetrics {
  attempt: number;
  maxAttempts: number;
  totalElapsed: number;
  lastError: string;
  errorType: ErrorType;
  nextRetryIn?: number;
  operationName: string;
  context?: Record<string, any>;
}

// Retry Configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
  jitter: boolean;
  enableLogging: boolean;
}

export interface OperationContext {
  operationName: string;
  topic?: string;
  tone?: string;
  keywords?: string;
  metadata?: Record<string, any>
}

export interface ConnectionTestResult {
  success: boolean;
  latency: number;
  model: string;
  timestamp: string;
  errorDetails?: string;
}

export interface RetryableOperation<T> {
  execute: () => Promise<T>;
  context: OperationContext;
  customConfig?: Partial<RetryConfig>;
}

