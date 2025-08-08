import { ErrorCode } from '@/lib/errors/app-errors';

// Core types
export type ToneOfVoice = 'technical' | 'casual' | 'motivational';

export interface GeneratedContent {
  mainContent: string;
  hashtags: string[];
  insights: string[];
}

// Form types
export interface FormState {
  topic: string;
  toneOfVoice: ToneOfVoice | string;
  keywords: string;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: ErrorCode;
  timestamp?: string;
}

export interface GenerateApiRequest {
  topic: string;
  tone: string;
  keywords?: string;
}

export interface GenerateApiResponse extends ApiResponse<GeneratedContent> {
  content?: GeneratedContent;
}

// UI types
export interface NotificationState {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}