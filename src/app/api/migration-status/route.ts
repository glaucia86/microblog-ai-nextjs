import { NextResponse } from 'next/server';
import { LangChainService } from '../../../lib/services/langchain.factory';
import { ServiceMigrator } from '../../../lib/services/migration/service.migrator';

export async function GET() {
  try {
    const factoryInfo = LangChainService.info();
    
    return NextResponse.json({
      migration: {
        status: 'completed',
        usingLangChain: ServiceMigrator.isUsingLangChain(),
        timestamp: new Date().toISOString()
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
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      migration: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'enable-langchain':
        ServiceMigrator.enableLangChain();
        break;
      case 'disable-langchain':
        ServiceMigrator.disableLangChain();
        break;
      case 'reset-factory':
        LangChainService.reset();
        break;
      case 'reset-metrics':
        const service = LangChainService.development();
        service.resetMetrics();
        break;
      default:
        throw new Error('Invalid action');
    }
    
    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}