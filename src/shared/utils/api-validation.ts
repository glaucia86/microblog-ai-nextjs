import { MICROBLOG_LIMITS } from '@/lib/constants/app';
import { TONE_OPTIONS } from '@/lib/constants/tones';
import { ValidationError } from '@/lib/errors/app-errors';
import { GenerateApiRequest } from '@/types';

export const validateApiRequest = (body: any): GenerateApiRequest => {
  const { topic, tone, keywords } = body;

  // Validate topic
  if (!topic || typeof topic !== 'string') {
    throw new ValidationError('Topic is required and must be a string');
  }

  const trimmedTopic = topic.trim();
  if (trimmedTopic.length < MICROBLOG_LIMITS.MIN_TOPIC_LENGTH) {
    throw new ValidationError(`Topic must be at least ${MICROBLOG_LIMITS.MIN_TOPIC_LENGTH} characters`);
  }

  if (trimmedTopic.length > MICROBLOG_LIMITS.MAX_TOPIC_LENGTH) {
    throw new ValidationError(`Topic must be less than ${MICROBLOG_LIMITS.MAX_TOPIC_LENGTH} characters`);
  }

  // Validate tone
  if (!tone || typeof tone !== 'string') {
    throw new ValidationError('Tone is required and must be a string');
  }

  const validTones = TONE_OPTIONS.map(option => option.value);
  if (!validTones.includes(tone as any)) {
    throw new ValidationError(`Invalid tone. Must be one of: ${validTones.join(', ')}`);
  }

  // Validate keywords (optional)
  if (keywords !== undefined) {
    if (typeof keywords !== 'string') {
      throw new ValidationError('Keywords must be a string');
    }

    const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (keywordArray.length > MICROBLOG_LIMITS.MAX_KEYWORDS) {
      throw new ValidationError(`Maximum ${MICROBLOG_LIMITS.MAX_KEYWORDS} keywords allowed`);
    }
  }

  return {
    topic: trimmedTopic,
    tone: tone.toLowerCase(),
    keywords: keywords?.trim() || undefined,
  };
};