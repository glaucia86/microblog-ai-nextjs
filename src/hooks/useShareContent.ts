import { useCallback } from 'react';

interface UseShareContentReturn {
  shareContent: (content: string, title?: string) => Promise<void>;
  canShare: boolean;
}

export const useShareContent = (): UseShareContentReturn => {
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareContent = useCallback(async (content: string, title = 'Check out my microblog post!') => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: content,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        await fallbackToCopyClipboard(content);
      }
    } else {
      await fallbackToCopyClipboard(content);
    }
  }, [canShare]);

  const fallbackToCopyClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return {
    shareContent,
    canShare
  };
};