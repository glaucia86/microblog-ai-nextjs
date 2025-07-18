import { NextResponse } from 'next/server';
import { LangChainService } from '../../../shared/services/langchain.factory';
import { getContentGenerationService } from '../../../shared/services/content-generation.service';

export async function GET() {
  try {
    const factoryInfo = LangChainService.info();
    const contentService = getContentGenerationService();
    
    return NextResponse.json({
      migration: {
        status: 'completed',
        usingLangChain: contentService.isUsingLangChain(),
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      },
      factory: factoryInfo,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasGitHubToken: !!process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
        endpoint: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT
      },
      health: factoryInfo.hasInstance ? {
        metrics: factoryInfo.metrics,
        config: factoryInfo.config
      } : null,
      services: {
        langchain: factoryInfo.hasInstance,
        contentGeneration: true,
        strategy: contentService.isUsingLangChain() ? 'LangChain' : 'GitHub Models'
      }
    });
  } catch (error) {
    return NextResponse.json({
      migration: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    const contentService = getContentGenerationService();
    
    switch (action) {
      case 'enable-langchain':
        contentService.setStrategy(true);
        break;
        
      case 'disable-langchain':
        contentService.setStrategy(false);
        break;
        
      case 'reset-factory':
        LangChainService.reset();
        break;
        
      case 'test-connection':
        const testService = LangChainService.createTestInstance();
        const testResult = await testService.testConnection();
        return NextResponse.json({
          success: testResult.success,
          test: testResult,
          message: testResult.success ? 'Connection test passed' : 'Connection test failed'
        });
        
      case 'get-metrics':
        const service = LangChainService.development();
        const metrics = service.getPerformanceMetrics();
        return NextResponse.json({
          success: true,
          metrics,
          message: 'Metrics retrieved successfully'
        });
        
      default:
        throw new Error(`Invalid action: ${action}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}