'use client';

import React from 'react';
import { ToneOfVoice } from '@/types';
import { TONE_OPTIONS } from '@/lib/constants/tones';
import { ToneOption } from './ToneOption';

interface ToneSelectorProps {
  value: ToneOfVoice;
  onChange: (tone: ToneOfVoice) => void;
  disabled?: boolean;
}

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
        {TONE_OPTIONS.map((option) => (
          <ToneOption
            key={option.value}
            option={option}
            isSelected={value === option.value}
            isDisabled={disabled}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}