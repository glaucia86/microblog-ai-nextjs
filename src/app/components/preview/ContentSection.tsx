'use client';

import React from 'react';
import { CopyButton } from './CopyButton';

interface ContentSectionProps {
  title: string;
  content: string;
  onCopy: () => void;
  isCopied: boolean;
  children?: React.ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  content,
  onCopy,
  isCopied,
  children
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h4>
        <CopyButton onCopy={onCopy} isCopied={isCopied} />
      </div>
      
      {children || (
        <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      )}
    </div>
  );
};