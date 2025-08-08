'use client';

import React from 'react';
import { PRO_TIPS } from '@/lib/data/features';

export const ProTips: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        Pro Tips
      </h3>
      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
        {PRO_TIPS.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};