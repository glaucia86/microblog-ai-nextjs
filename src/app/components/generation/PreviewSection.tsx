'use client';

import React from 'react';
import { GeneratedContent } from '@/types';
import PreviewCard from '../PreviewCard';
import { ProTips } from './ProTips';
import { EmptyState } from './EmptyState';

interface PreviewSectionProps {
  generatedContent: GeneratedContent | null;
  onShare?: (content: string) => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  generatedContent,
  onShare
}) => {
  return (
    <div className="space-y-6">
      {generatedContent ? (
        <PreviewCard content={generatedContent} onShare={onShare} />
      ) : (
        <EmptyState />
      )}
      
      <ProTips />
    </div>
  );
};