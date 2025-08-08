import { useState, useCallback } from 'react';
import { UI_CONFIG } from '@/lib/constants/app';

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string, itemId: string) => Promise<void>;
  getCopyStatus: (itemId: string) => boolean;
  clearCopyStatus: (itemId: string) => void;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = useCallback(async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setCopiedItems(prev => new Set(prev).add(itemId));
      
      // Auto-clear after timeout
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, UI_CONFIG.AUTO_HIDE_NOTIFICATION_MS / 2); // Half the notification time
      
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const getCopyStatus = useCallback((itemId: string): boolean => {
    return copiedItems.has(itemId);
  }, [copiedItems]);

  const clearCopyStatus = useCallback((itemId: string) => {
    setCopiedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  return {
    copyToClipboard,
    getCopyStatus,
    clearCopyStatus
  };
};