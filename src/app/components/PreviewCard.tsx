'use client';

import React, { useState } from 'react';
import { GeneratedContent } from '@/types';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

interface PreviewCardProps {
  content: GeneratedContent;
  onShare?: (content: string) => void;
}

export default function PreviewCard({ content, onShare }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedItem(itemId);
      setTimeout(() => {
        setCopied(false);
        setCopiedItem(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatHashtags = (hashtags: string[]): string => {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  const fullContent = `${content.mainContent}\n\n${formatHashtags(content.hashtags)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">Generated Content</h3>
      </div>

      {/* Main Content Section */}
      <div className="p-6 space-y-6">
        {/* Microblog Content */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Microblog Post
            </h4>
            <button
              onClick={() => handleCopy(content.mainContent, 'main')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy to clipboard"
            >
              {copied && copiedItem === 'main' ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
            {content.mainContent}
          </p>
        </div>

        {/* Hashtags Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Optimized Hashtags
            </h4>
            <button
              onClick={() => handleCopy(formatHashtags(content.hashtags), 'hashtags')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy hashtags"
            >
              {copied && copiedItem === 'hashtags' ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Strategic Insights
          </h4>
          <ul className="space-y-2">
            {content.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => handleCopy(fullContent, 'full')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {copied && copiedItem === 'full' ? (
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
            onClick={() => onShare(fullContent)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}