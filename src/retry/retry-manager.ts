import { ErrorClassifier } from "./error-classifier";
import {
  ErrorType,
  OperationContext,
  RetryableOperation,
  RetryConfig,
  RetryMetrics
} from './types';

export class RetryManager {
  private config: RetryConfig;

  constructor(config?: Partial<RetryConfig>) {
    this.config = {
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
      exponentialBase: 2,
      jitter: true,
      enableLogging: true,
      ...config
    };   
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: OperationContext,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const effectiveConfig = { ...this.config, ...customConfig };
    const startTime = Date.now();
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= effectiveConfig.maxAttempts; attempt++) {
      try {
        const result = await operation();

        if (attempt > 1 && effectiveConfig.enableLogging) {
          this.logSuccess(context, attempt, effectiveConfig.maxAttempts, Date.now() - startTime);   
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        const errorInfo = ErrorClassifier.getErrorInfo(lastError);

        if (!errorInfo.isRetryable) {
          if (effectiveConfig.enableLogging) {
            this.logNonRetryableError(context, lastError, errorInfo, attempt);        
          }

          throw this.createEnhancedError(lastError, context, errorInfo);
        }

        const metrics = this.createRetryMetrics(
          attempt,
          effectiveConfig.maxAttempts,
          Date.now() - startTime,
          lastError,
          errorInfo.type,
          context
        );

        if (attempt < effectiveConfig.maxAttempts) {
          const delay = this.calculateDelay(attempt, errorInfo.type, effectiveConfig);
          metrics.nextRetryIn = delay;

          if (effectiveConfig.enableLogging) {
            this.logRetryAttempt(metrics);
          }

          await this.sleep(delay);
        } else {
          if (effectiveConfig.enableLogging) {
            this.logFinalFailure(metrics);
          }
        }
      }
    }

    throw this.createFinalError(context, effectiveConfig.maxAttempts, Date.now() - startTime, lastError!);
  }


  private calculateDelay(attempt: number, errorType: ErrorType, config: RetryConfig): number {
    const { baseDelayMs, maxDelayMs, exponentialBase, jitter } = config;

    const multiplier = ErrorClassifier.getDelayMultiplier(errorType);

    let delay = baseDelayMs * Math.pow(exponentialBase, attempt - 1) * multiplier;

    if (jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.min(delay, maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createRetryMetrics(
    attempt: number,
    maxAttempts: number,
    totalElapsed: number,
    error: Error,
    errorType: ErrorType,
    context: OperationContext
  ): RetryMetrics {
    return {
      attempt,
      maxAttempts,
      totalElapsed,
      lastError: error.message,
      errorType,
      operationName: context.operationName,
      context: {
        topic: context.topic,
        tone: context.tone,
        keywords: context.keywords,
        ...context.metadata
      }
    };
  }

  private createEnhancedError(originalError: Error, context: OperationContext, errorInfo: any): Error {
    const enhancedMessage = [
      `${context.operationName} failed: ${originalError.message}`,
      `Error Type: ${errorInfo.type}`,
      `Suggestion: ${errorInfo.suggestion}`,
      `Context: ${JSON.stringify(context)}`
    ].join(' | ');
    
    const enhancedError = new Error(enhancedMessage);
    enhancedError.stack = originalError.stack;
    enhancedError.name = `${errorInfo.type.toUpperCase()}_ERROR`;
    
    return enhancedError;
  }

  private createFinalError(
    context: OperationContext,
    maxAttempts: number,
    totalTime: number,
    lastError: Error
  ): Error {
    const finalMessage = [
      `${context.operationName} failed after ${maxAttempts} attempts`,
      `Total time: ${totalTime}ms`,
      `Last error: ${lastError.message}`,
      `Context: ${JSON.stringify(context)}`
    ].join(' | ');
    
    const finalError = new Error(finalMessage);
    finalError.name = 'RETRY_EXHAUSTED_ERROR';
    finalError.stack = lastError.stack;
    
    return finalError;
  }

  private logSuccess(context: OperationContext, attempt: number, maxAttempts: number, totalTime: number): void {
    console.log(`✅ ${context.operationName} succeeded on attempt ${attempt}/${maxAttempts}`, {
      totalElapsed: totalTime,
      attempt,
      context: context.topic ? { topic: context.topic, tone: context.tone } : undefined
    });
  }

  private logNonRetryableError(context: OperationContext, error: Error, errorInfo: any, attempt: number): void {
    console.error(`🚫 ${context.operationName} failed with non-retryable error:`, {
      error: error.message,
      errorType: errorInfo.type,
      suggestion: errorInfo.suggestion,
      attempt,
      context: context.topic ? { topic: context.topic, tone: context.tone } : undefined
    });
  }

  private logRetryAttempt(metrics: RetryMetrics): void {
    console.warn(`🔄 ${metrics.operationName} attempt ${metrics.attempt}/${metrics.maxAttempts} failed, retrying in ${metrics.nextRetryIn}ms:`, {
      error: metrics.lastError,
      errorType: metrics.errorType,
      totalElapsed: metrics.totalElapsed,
      nextRetryIn: metrics.nextRetryIn,
      context: metrics.context
    });
  }

  private logFinalFailure(metrics: RetryMetrics): void {
    console.error(`💀 ${metrics.operationName} failed after ${metrics.maxAttempts} attempts:`, {
      error: metrics.lastError,
      errorType: metrics.errorType,
      totalElapsed: metrics.totalElapsed,
      context: metrics.context
    });
  }

  updateConfig(newConfig: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Retry configuration updated:', this.config);
  }

  getConfig(): RetryConfig {
    return { ...this.config };
  }

  async executeWithCustomConfig<T>(
    operation: RetryableOperation<T>
  ): Promise<T> {
    return this.executeWithRetry(
      operation.execute,
      operation.context,
      operation.customConfig
    );
  }
}