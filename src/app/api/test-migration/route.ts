import { NextResponse } from 'next/server';
import { LangChainService } from '../../../lib/services/langchain.factory';
import { ServiceMigrator } from '../../../lib/services/migration/service.migrator';

export async function GET() {
  try {
    console.log('Running comprehensive migration tests...');

    const results = {
      factoryTests: {},
      serviceTests: {},
      migrationTests: {},
      performanceTests: {}
    };

    console.log('Testing Factory Pattern...');
    
    const devService = LangChainService.development();
    const devConfig = devService.getServiceConfig();
    
    const prodService = LangChainService.production();
    const prodConfig = prodService.getServiceConfig();
    
    results.factoryTests = {
      developmentConfig: {
        enableLogging: devConfig.enableLogging,
        enableRetry: devConfig.enableRetry
      },

      productionConfig: {
        enableLogging: prodConfig.enableLogging,
        enableRetry: prodConfig.enableRetry
      },

      singletonTest: devService === LangChainService.development(), // Deve ser true
      factoryInfo: LangChainService.info()
    };

    console.log('Testing Services...');
    
    const testTopic = "Factory pattern in software engineering";
    const testTone = "technical";
    const testKeywords = "singleton, dependency injection, design patterns";

    const langchainResult = await devService.generateMicroblogContent(
      testTopic,
      testTone,
      testKeywords
    );

    const connectivityResult = await devService.testConnection();

    results.serviceTests = {
      generation: {
        success: !!langchainResult.mainContent,
        contentLength: langchainResult.mainContent.length,
        hashtagsCount: langchainResult.hashtags.length,
        insightsCount: langchainResult.insights.length
      },
      connectivity: connectivityResult,
      metrics: devService.getPerformanceMetrics()
    };

    console.log('Testing Migration System...');
    
    const comparisonResult = await ServiceMigrator.compareServices(
      testTopic,
      testTone,
      testKeywords
    );

    results.migrationTests = {
      isUsingLangChain: ServiceMigrator.isUsingLangChain(),
      comparison: {
        langchain: {
          success: comparisonResult.langchain.success,
          duration: comparisonResult.langchain.duration
        },
        github: {
          success: comparisonResult.github.success,
          duration: comparisonResult.github.duration
        }
      }
    };

    console.log('Testing Performance...');
    
    const performanceTests = [];
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      await devService.generateMicroblogContent(
        `Performance test ${i + 1}`,
        "casual"
      );
      
      performanceTests.push(Date.now() - startTime);
    }

    results.performanceTests = {
      averageLatency: performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length,
      testRuns: performanceTests,
      finalMetrics: devService.getPerformanceMetrics()
    };

    return NextResponse.json({
      success: true,
      message: 'Migration tests completed successfully!',
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Migration tests failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Migration tests failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}