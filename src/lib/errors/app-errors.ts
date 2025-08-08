export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  CONTENT_GENERATION_ERROR = 'CONTENT_GENERATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, ErrorCode.RATE_LIMIT_ERROR, 429);
  }
}

export class ContentGenerationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.CONTENT_GENERATION_ERROR, 500);
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.NETWORK_ERROR, 503);
  }
}