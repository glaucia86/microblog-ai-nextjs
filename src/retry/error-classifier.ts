
/**
 * Intelligent error classifier Responsible for analyzing errors and determining retry strategies
*/

import { ErrorType } from "./types";

export class ErrorClassifier {
  static classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLocaleLowerCase() || '';

    if (this.isAuthenticationError(message)) {
      return ErrorType.API_KEY;
    }

    if (this.isValidationError(message)) {
      return ErrorType.VALIDATION;
    }

    if (this.isRateLimitError(message)) {
      return ErrorType.RATE_LIMIT;
    }

    if (this.isTimeoutError(message)) {
      return ErrorType.TIMEOUT;
    }

    if (this.isParsingError(message)) {
      return ErrorType.PARSING;
    }

    return ErrorType.RETRYABLE;
  }

  static isNonRetryable(errorType: ErrorType): boolean {
    return [
      ErrorType.NON_RETRYABLE,
      ErrorType.API_KEY,
      ErrorType.VALIDATION
    ].includes(errorType);
  }

  static getDelayMultiplier(errorType: ErrorType): number {
    switch (errorType) {
      case ErrorType.RATE_LIMIT:
        return 3;
      case ErrorType.NETWORK:
        return 1.5;
      case ErrorType.TIMEOUT:
        return 2;
      case ErrorType.PARSING:
        return 0.5;
      default:
        return 1;
    }
  }

  private static isAuthenticationError(message: string): boolean {
    const authPatterns = [
      'invalid api key',
      'unauthorized',
      'forbidden',
      'authentication failed',
      'access denied',
      'invalid token',
      'expired token'
    ];

    return authPatterns.some(pattern => message.includes(pattern));
  }

  private static isValidationError(message: string): boolean {
    const validationPatterns = [
      'validation',
      'exceeds',
      'invalid format',
      'schema',
      'required field',
      'malformed',
      'invalid input',
      'constraint violation'
    ];

    return validationPatterns.some(pattern => message.includes(pattern));
  }

  private static isRateLimitError(message: string): boolean {
    const rateLimitPatterns = [
      'rate limit',
      'too many requests',
      'quota exceeded',
      'throttled',
      'rate exceeded',
      'requests per',
      'limit reached'
    ];

    return rateLimitPatterns.some(pattern => message.includes(pattern));
  }

  private static isNetworkError(message: string, stack: string): boolean {
    const networkPatterns = [
      'network',
      'connection',
      'fetch',
      'econnreset',
      'enotfound',
      'econnrefused',
      'socket',
      'dns'
    ];

    return networkPatterns.some(pattern => message.includes(pattern) || stack.includes(pattern));
  }

  private static isTimeoutError(message: string): boolean {
    const timeoutPatterns = [
      'timeout',
      'timed out',
      'request timeout',
      'response timeout',
      'deadline exceeded'
    ];

    return timeoutPatterns.some(pattern => message.includes(pattern));
  }

  private static isParsingError(message: string): boolean {
    const parsingPatterns = [
      'json',
      'parse',
      'syntax error',
      'unexpected token',
      'malformed response',
      'invalid json'
    ];

    return parsingPatterns.some(pattern => message.includes(pattern));
  }

  static getErrorInfo(error: Error): {
    type: ErrorType;
    isRetryable: boolean;
    delayMultiplier: number;
    suggestion: string;
  } {
    const type = this.classifyError(error);
    const isRetryable = !this.isNonRetryable(type);
    const delayMultiplier = this.getDelayMultiplier(type);

    const suggestions = {
      [ErrorType.API_KEY]: 'Check your API key configuration',
      [ErrorType.VALIDATION]: 'Verify input data format and constraints',
      [ErrorType.RATE_LIMIT]: 'Reduce request frequency or upgrade plan',
      [ErrorType.NETWORK]: 'Check network connectivity',
      [ErrorType.TIMEOUT]: 'Consider increasing timeout settings',
      [ErrorType.PARSING]: 'Verify response format expectations',
      [ErrorType.RETRYABLE]: 'Temporary error, retry should resolve it',
      [ErrorType.NON_RETRYABLE]: 'Manual intervention required'
    };

    return {
      type,
      isRetryable,
      delayMultiplier,
      suggestion: suggestions[type]
    };
  }
}