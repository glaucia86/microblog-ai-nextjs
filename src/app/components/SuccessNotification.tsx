'use client';

import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function SuccessNotification({
  show,
  message,
  onClose,
  autoHideDuration = 5000,
}: SuccessNotificationProps) {
  useEffect(() => {
    if (show && autoHideDuration > 0) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHideDuration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4 pr-12 max-w-md">
        <div className="flex items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}