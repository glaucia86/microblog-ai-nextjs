'use client';

import React, { useRef, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface EnhancedTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rows?: number;
}

export default function EnhancedTextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  maxLength,
  required = false,
  disabled = false,
  autoFocus = false,
  rows = 4,
}: EnhancedTextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const hasError = Boolean(error);
  const characterCount = value.length;
  const showCounter = maxLength && characterCount > maxLength * 0.8;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showCounter && (
          <span
            className={`text-xs ${
              characterCount >= maxLength ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id={label}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm resize-none
            transition-all duration-200
            ${
              hasError
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${
              disabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            dark:border-gray-600 dark:text-white
          `}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${label}-error` : helperText ? `${label}-description` : undefined
          }
        />
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`text-sm ${
            hasError ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
          }`}
          id={hasError ? `${label}-error` : `${label}-description`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}