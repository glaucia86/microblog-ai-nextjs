import { NextRequest, NextResponse } from 'next/server';
import { getGitHubModelsService } from '../../../lib/services/github-models.services'
import type { GenerateApiRequest, GenerateApiResponse } from '@/types';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Input validation
function validateRequest(body: any): GenerateApiRequest | null {
  const { topic, tone, keywords } = body;
  
  if (!topic || typeof topic !== 'string') {
    return null;
  }
  
  if (!tone || typeof tone !== 'string') {
    return null;
  }
  
  if (keywords !== undefined && typeof keywords !== 'string') {
    return null;
  }
  
  return { topic: topic.trim(), tone: tone.toLowerCase(), keywords: keywords?.trim() };
}

// Rate limiting implementation
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }
  
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  clientData.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Extract client identifier (IP or session)
    const clientId = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'anonymous';
    
    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateRequest(body);
    
    if (!validatedData) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Additional validation
    if (validatedData.topic.length < 10 || validatedData.topic.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Topic must be between 10 and 200 characters' },
        { status: 400 }
      );
    }
    
    const validTones = ['technical', 'casual', 'motivational'];
    if (!validTones.includes(validatedData.tone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tone of voice' },
        { status: 400 }
      );
    }
    
    // Generate content using the service
    const service = getGitHubModelsService();
    const generatedContent = await service.generateMicroblogContent(
      validatedData.topic,
      validatedData.tone,
      validatedData.keywords
    );
    
    // Return successful response
    const response: GenerateApiResponse = {
      success: true,
      content: generatedContent,
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Generation API error:', error);
    
    // Determine error type and status code
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      if (error.message.includes('environment variables')) {
        statusCode = 500;
        errorMessage = 'Server configuration error';
      } else if (error.message.includes('Rate limit exceeded')) {
        statusCode = 429;
        errorMessage = 'API rate limit exceeded';
      } else if (error.message.includes('Invalid')) {
        statusCode = 400;
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to generate content';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy',
      service: 'generate-api',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}