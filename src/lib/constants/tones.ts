import { ComponentType } from 'react';
import { ToneOfVoice } from '@/types';
import {
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export interface ToneOption {
  value: ToneOfVoice;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise, data-driven, professional',
    icon: CpuChipIcon,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200 hover:border-blue-400',
  },
  {
    value: 'casual',
    label: 'Casual', 
    description: 'Friendly, conversational, relatable',
    icon: ChatBubbleLeftRightIcon,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200 hover:border-purple-400',
  },
  {
    value: 'motivational',
    label: 'Motivational',
    description: 'Inspiring, empowering, action-oriented',
    icon: RocketLaunchIcon,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200 hover:border-green-400',
  },
];

export const TONE_GUIDELINES: Record<ToneOfVoice, string[]> = {
  technical: [
    'Use precise technical language',
    'Include specific data points and statistics',
    'Maintain professional credibility',
    'Focus on accuracy and clarity',
    'Use industry-standard terminology',
  ],
  casual: [
    'Use conversational, friendly language',
    'Include relatable examples',
    'Keep the tone light and engaging',
    'Write as if talking to a friend',
    'Use everyday language and expressions',
  ],
  motivational: [
    'Use inspiring and empowering language',
    'Focus on positive outcomes and possibilities',
    'Include clear calls-to-action',
    'Create emotional connections',
    'Emphasize growth and achievement',
  ],
};