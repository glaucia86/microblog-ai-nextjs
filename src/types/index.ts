export type ToneOfVoice = 'technical' | 'casual' | 'motivational';

export interface GeneratedContent {
  mainContent: string;
  hashtags: string[];
  insights: string[];
}

export interface FormState {
  topic: string;
  toneOfVoice: ToneOfVoice | string; 
  keywords: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateApiRequest {
  topic: string;
  tone: string;
  keywords?: string;
}

export interface GenerateApiResponse {
  success: boolean;
  content?: GeneratedContent;
  error?: string;
}