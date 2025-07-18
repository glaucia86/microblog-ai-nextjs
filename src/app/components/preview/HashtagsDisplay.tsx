'use client';

import React from 'react';

interface HashtagsDisplayProps {
  hashtags: string[];
}

export const HashtagsDisplay: React.FC<HashtagsDisplayProps> = ({ hashtags }) => {
  const formatHashtag = (tag: string) => tag.startsWith('#') ? tag : `#${tag}`;

  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          {formatHashtag(tag)}
        </span>
      ))}
    </div>
  );
};