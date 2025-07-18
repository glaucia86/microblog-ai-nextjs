'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  backUrl?: string;
  backLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  backUrl = '/',
  backLabel = 'Back to Home'
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            href={backUrl}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            {backLabel}
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};