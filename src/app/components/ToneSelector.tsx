'use client';

import React from 'react';
import { ToneOfVoice } from '@/types';
import {
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

interface ToneOption {
  value: ToneOfVoice;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

interface ToneSelectorProps {
  value: ToneOfVoice;
  onChange: (tone: ToneOfVoice) => void;
  disabled?: boolean;
}

const toneOptions: ToneOption[] = [
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise, data-driven, professional',
    icon: <CpuChipIcon className="w-5 h-5" />,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200 hover:border-blue-400',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly, conversational, relatable',
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200 hover:border-purple-400',
  },
  {
    value: 'motivational',
    label: 'Motivational',
    description: 'Inspiring, empowering, action-oriented',
    icon: <RocketLaunchIcon className="w-5 h-5" />,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200 hover:border-green-400',
  },
];

export default function ToneSelector({
  value,
  onChange,
  disabled = false,
}: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Tone of Voice
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toneOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? `${option.borderClass} ${option.bgClass} ring-2 ring-offset-2 ${option.colorClass.replace('text-', 'ring-')}`
                    : `border-gray-200 hover:${option.borderClass} hover:shadow-md`
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`
                    flex-shrink-0 mt-0.5
                    ${isSelected ? option.colorClass : 'text-gray-400'}
                  `}
                >
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`
                      font-medium
                      ${isSelected ? option.colorClass : 'text-gray-900 dark:text-white'}
                    `}
                  >
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
        })}
      </div>
    </div>
  );
}