import { NextResponse } from 'next/server';
import { LangChainService } from '../../../lib/services/langchain.factory';
import { getContentGenerationService } from '../../../lib/services/content-generation.service';

export async function GET() {
  try {
    console.log('Starting Content Generation Service test...');
    
    const contentService = getContentGenerationService();
    
    // Test current strategy
    const currentStrategy = contentService.isUsingLangChain() ? 'LangChain' : 'GitHub Models';
    console.log(`Current strategy: ${currentStrategy}`);
    
    // Test content generation
    const testResult = await contentService.generateContent(
      "Testing the new content generation service",
      "casual",
      "test, api, integration"
    );
    
    console.log('Content generation test successful:', testResult);
    
    // Test strategy switching
    const originalStrategy = contentService.isUsingLangChain();
    
    // Switch to opposite strategy and test
    contentService.setStrategy(!originalStrategy);
    const newStrategy = contentService.isUsingLangChain() ? 'LangChain' : 'GitHub Models';
    console.log(`Switched to: ${newStrategy}`);
    
    const switchTestResult = await contentService.generateContent(
      "Testing strategy switching",
      "technical",
      "strategy, test, switching"
    );
    
    console.log('Strategy switch test successful:', switchTestResult);
    
    // Switch back to original
    contentService.setStrategy(originalStrategy);
    const restoredStrategy = contentService.isUsingLangChain() ? 'LangChain' : 'GitHub Models';
    console.log(`↩Restored to: ${restoredStrategy}`);
    
    return NextResponse.json({
      success: true,
      message: 'Migration test completed successfully!',
      tests: {
        originalStrategy: originalStrategy ? 'LangChain' : 'GitHub Models',
        switchedStrategy: newStrategy,
        restoredStrategy: restoredStrategy,
        originalResult: testResult,
        switchResult: switchTestResult
      },
      factory: LangChainService.info(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Migration test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Migration test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}