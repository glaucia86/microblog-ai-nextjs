'use client';

import React from 'react';
import { GeneratedContent } from '@/types';
import { formatHashtags, createFullContent } from '../../shared/utils/formatting';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { ContentSection } from './preview/ContentSection';
import { HashtagsDisplay } from './preview/HashtagsDisplay';
import { InsightsList } from './preview/InsightsList';
import { ActionButtons } from './preview/ActionButtons';

interface PreviewCardProps {
  content: GeneratedContent;
  onShare?: (content: string) => void;
}

export default function PreviewCard({ content, onShare }: PreviewCardProps) {
  const { copyToClipboard, getCopyStatus } = useCopyToClipboard();
  
  const fullContent = createFullContent(content.mainContent, content.hashtags);
  const formattedHashtags = formatHashtags(content.hashtags);

  const handleCopyMain = () => copyToClipboard(content.mainContent, 'main');
  const handleCopyHashtags = () => copyToClipboard(formattedHashtags, 'hashtags');
  const handleCopyAll = () => copyToClipboard(fullContent, 'full');
  const handleShare = () => onShare?.(fullContent);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">Generated Content</h3>
      </div>

      {/* Main Content Section */}
      <div className="p-6 space-y-6">
        {/* Microblog Content */}
        <ContentSection
          title="Microblog Post"
          content={content.mainContent}
          onCopy={handleCopyMain}
          isCopied={getCopyStatus('main')}
        />

        {/* Hashtags Section */}
        <ContentSection
          title="Optimized Hashtags"
          content=""
          onCopy={handleCopyHashtags}
          isCopied={getCopyStatus('hashtags')}
        >
          <HashtagsDisplay hashtags={content.hashtags} />
        </ContentSection>

        {/* Insights Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Strategic Insights
          </h4>
          <InsightsList insights={content.insights} />
        </div>
      </div>

      {/* Actions Footer */}
      <ActionButtons
        onCopyAll={handleCopyAll}
        onShare={onShare ? handleShare : undefined}
        isCopiedAll={getCopyStatus('full')}
      />
    </div>
  );
}