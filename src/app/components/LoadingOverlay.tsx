'use client';

import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Generating content...',
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const overlayClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 rounded-lg';

  return (
    <div className={`${overlayClasses} flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 animate-slide-up">
        {/* Animated Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin" />
          </div>
          {/* Pulsing center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Loading message */}
        <div className="text-center">
          <p className="text-gray-900 dark:text-white font-medium">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please wait...
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress" />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}