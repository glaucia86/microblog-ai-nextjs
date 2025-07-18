'use client';

import React from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyButtonProps {
  onCopy: () => void;
  isCopied: boolean;
  title?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  isCopied,
  title = "Copy to clipboard",
  className = "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
}) => {
  return (
    <button
      onClick={onCopy}
      className={className}
      title={title}
    >
      {isCopied ? (
        <CheckIcon className="w-5 h-5 text-green-500" />
      ) : (
        <ClipboardDocumentIcon className="w-5 h-5" />
      )}
    </button>
  );
};