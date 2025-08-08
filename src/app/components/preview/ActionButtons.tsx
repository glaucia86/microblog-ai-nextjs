'use client';

import React from 'react';
import { ClipboardDocumentIcon, CheckIcon, ShareIcon } from '@heroicons/react/24/outline';

interface ActionButtonsProps {
  onCopyAll: () => void;
  onShare?: () => void;
  isCopiedAll: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopyAll,
  onShare,
  isCopiedAll
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
      <button
        onClick={onCopyAll}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {isCopiedAll ? (
          <>
            <CheckIcon className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
            Copy All
          </>
        )}
      </button>
      
      {onShare && (
        <button
          onClick={onShare}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Share
        </button>
      )}
    </div>
  );
};
