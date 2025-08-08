import { FormState } from "@/types";
import { MICROBLOG_LIMITS } from "../../lib/constants/app";
import { TONE_OPTIONS } from "../../lib/constants/tones";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<FormState>;
}

export const validateTopic = (topic: string): string | null => {
  if (!topic?.trim()) {
    return 'Topic is required';
  }

  if (topic.length < MICROBLOG_LIMITS.MIN_TOPIC_LENGTH) {
    return `Topic must be at least ${MICROBLOG_LIMITS.MIN_TOPIC_LENGTH} characters`;
  }

  if (topic.length > MICROBLOG_LIMITS.MAX_TOPIC_LENGTH) {
    return `Topic must be less than ${MICROBLOG_LIMITS.MAX_TOPIC_LENGTH} characters`;
  }

  return null;
};

export const validateKeywords = (keywords: string): string | null => {
  if (!keywords?.trim()) return null;

  const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

  if (keywordArray.length > MICROBLOG_LIMITS.MAX_KEYWORDS) {
    return `Maximum ${MICROBLOG_LIMITS.MAX_KEYWORDS} keywords allowed`;
  }

  return null;
};

export const validateTone = (tone: string): boolean => {
  return TONE_OPTIONS.some(option => option.value === tone);
};

export const validateFormData = (formData: FormState): ValidationResult => {
  const errors: Partial<FormState> = {};

  const topicError = validateTopic(formData.topic);

  if (topicError) errors.topic = topicError;

  const keywordsError = validateKeywords(formData.keywords);
  if (keywordsError) errors.keywords = keywordsError;

  if (!validateTone(formData.toneOfVoice as string)) {
    errors.toneOfVoice = 'Invalid tone selected'
  }

  return {
     isValid: Object.keys(errors).length === 0,
     errors
  };
};