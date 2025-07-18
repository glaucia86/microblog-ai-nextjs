import { NextRequest, NextResponse } from 'next/server';
import { getContentGenerationService } from '@/shared/services/content-generation.service';
import { validateApiRequest } from '../../../shared/utils/api-validation';
import { checkRateLimit } from '../../../shared/utils/rate-limiting';
import { handleApiError } from '../../../shared/utils/error-handler';
import type { GenerateApiRequest, GenerateApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const clientId = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'anonymous';
    
    if (!checkRateLimit(clientId)) {
      return NextResponse.json<GenerateApiResponse>(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const validatedData = validateApiRequest(body);
    
    const contentService = getContentGenerationService();
    const generatedContent = await contentService.generateContent(
      validatedData.topic,
      validatedData.tone as any,
      validatedData.keywords
    );

    return NextResponse.json<GenerateApiResponse>(
      {
        success: true,
        content: generatedContent,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method to generate content' },
    { status: 405 }
  );
}