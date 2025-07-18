import { useState, useCallback } from 'react';
import { GeneratedContent, GenerateApiRequest } from '@/types';

interface UseContentGenerationReturn {
  generatedContent: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  generateContent: (request: GenerateApiRequest) => Promise<void>;
  clearContent: () => void;
  clearError: () => void;
}

export const useContentGeneration = (): UseContentGenerationReturn => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (request: GenerateApiRequest) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      if (data.success && data.content) {
        setGeneratedContent(data.content);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to generate content. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearContent = useCallback(() => {
    setGeneratedContent(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generatedContent,
    isLoading,
    error,
    generateContent,
    clearContent,
    clearError
  };
};