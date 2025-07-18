import { NextResponse } from 'next/server';
import { AppError, ErrorCode } from '@/lib/errors/app-errors';

export interface ErrorResponse {
  success: false;
  error: string;
  code?: ErrorCode;
  timestamp: string;
}

export const handleApiError = (error: unknown): NextResponse<ErrorResponse> => {
  console.error('API Error:', error);

  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let code: ErrorCode = ErrorCode.UNKNOWN_ERROR;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  } else if (error instanceof Error) {
    if (error.message.includes('environment variables')) {
      statusCode = 500;
      message = 'Server configuration error';
      code = ErrorCode.API_ERROR;
    } else if (error.message.includes('Rate limit')) {
      statusCode = 429;
      message = 'Rate limit exceeded';
      code = ErrorCode.RATE_LIMIT_ERROR;
    } else if (error.message.includes('Invalid')) {
      statusCode = 400;
      message = error.message;
      code = ErrorCode.VALIDATION_ERROR;
    } else {
      message = 'Failed to generate content';
      code = ErrorCode.CONTENT_GENERATION_ERROR;
    }
  }

  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
};