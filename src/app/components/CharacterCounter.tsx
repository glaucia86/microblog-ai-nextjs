'use client';

import React, { useMemo } from 'react';

interface CharacterCounterProps {
  value: string;
  maxLength?: number;
  warningThreshold?: number;
}

export default function CharacterCounter({
  value,
  maxLength = 280,
  warningThreshold = 0.9,
}: CharacterCounterProps) {
  const characterCount = useMemo(() => value.length, [value]);
  const percentage = useMemo(() => characterCount / maxLength, [characterCount, maxLength]);
  const isWarning = useMemo(() => percentage >= warningThreshold, [percentage, warningThreshold]);
  const isError = useMemo(() => characterCount > maxLength, [characterCount, maxLength]);

  const getColorClasses = (): string => {
    if (isError) return 'text-red-600 font-semibold';
    if (isWarning) return 'text-yellow-600 font-medium';
    return 'text-gray-500';
  };

  const getProgressBarColor = (): string => {
    if (isError) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
          style={{
            width: `${Math.min(percentage * 100, 100)}%`,
            transform: isError ? 'scaleY(1.5)' : 'scaleY(1)',
          }}
        />
      </div>
      
      {/* Counter Text */}
      <div className="flex justify-between items-center">
        <span className={`text-sm transition-colors duration-200 ${getColorClasses()}`}>
          {characterCount} / {maxLength} characters
        </span>
        {isError && (
          <span className="text-xs text-red-600 animate-pulse">
            Exceeds limit by {characterCount - maxLength}
          </span>
        )}
      </div>
    </div>
  );
}