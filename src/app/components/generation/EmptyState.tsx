'use client';

import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
      <div className="text-gray-400 dark:text-gray-500">
        <DocumentTextIcon className="mx-auto h-24 w-24 mb-4" />
        <p className="text-lg font-medium">No content generated yet</p>
        <p className="mt-2 text-sm">
          Fill in the form and click generate to see your content here
        </p>
      </div>
    </div>
  );
};