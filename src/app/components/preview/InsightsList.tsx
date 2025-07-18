'use client';

import React from 'react';

interface InsightsListProps {
  insights: string[];
}

export const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  return (
    <ul className="space-y-2">
      {insights.map((insight, index) => (
        <li key={index} className="flex items-start">
          <span className="text-blue-500 mr-2">•</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {insight}
          </span>
        </li>
      ))}
    </ul>
  );
};