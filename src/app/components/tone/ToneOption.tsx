'use client';

import React from 'react';
import { ToneOption as ToneOptionType } from '../../../lib/constants/tones';

interface ToneOptionProps {
  option: ToneOptionType;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const ToneOption: React.FC<ToneOptionProps> = ({
  option,
  isSelected,
  isDisabled,
  onClick
}) => {
  const IconComponent = option.icon;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${
          isSelected
            ? `${option.borderClass} ${option.bgClass} ring-2 ring-offset-2 ${option.colorClass.replace('text-', 'ring-')}`
            : `border-gray-200 hover:${option.borderClass} hover:shadow-md`
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 mt-0.5 ${isSelected ? option.colorClass : 'text-gray-400'}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <h3 className={`font-medium ${isSelected ? option.colorClass : 'text-gray-900 dark:text-white'}`}>
            {option.label}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {option.description}
          </p>
        </div>
      </div>
      
      {isSelected && (
        <div
          className={`
            absolute top-2 right-2 w-2 h-2 rounded-full
            ${option.bgClass.replace('bg-', 'bg-').replace('-50', '-500')}
          `}
        />
      )}
    </button>
  );
};