import { GeneratedContent } from '@/types';
import { MICROBLOG_LIMITS } from '@/lib/constants/app';
import { ValidationError } from '@/lib/errors/app-errors';

export class ContentValidator {
  validateAndParse(content: any): GeneratedContent {
    if (!content || typeof content !== 'object') {
      throw new ValidationError('Invalid content structure');
    }

    this.validateMainContent(content.mainContent);
    this.validateHashtags(content.hashtags);
    this.validateInsights(content.insights);

    return {
      mainContent: content.mainContent,
      hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
      insights: Array.isArray(content.insights) ? content.insights : [],
    };
  }

  private validateMainContent(mainContent: any): void {
    if (!mainContent || typeof mainContent !== 'string') {
      throw new ValidationError('Invalid main content');
    }

    if (mainContent.length > MICROBLOG_LIMITS.MAX_CONTENT_LENGTH) {
      throw new ValidationError(`Content exceeds ${MICROBLOG_LIMITS.MAX_CONTENT_LENGTH} characters`);
    }

    if (mainContent.trim().length === 0) {
      throw new ValidationError('Main content cannot be empty');
    }
  }

  private validateHashtags(hashtags: any): void {
    if (!Array.isArray(hashtags)) {
      throw new ValidationError('Hashtags must be an array');
    }

    if (hashtags.length === 0) {
      throw new ValidationError('At least one hashtag is required');
    }

    if (hashtags.length > 10) {
      throw new ValidationError('Too many hashtags provided');
    }

    hashtags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        throw new ValidationError(`Invalid hashtag at position ${index}`);
      }
    });
  }

  private validateInsights(insights: any): void {
    if (!Array.isArray(insights)) {
      throw new ValidationError('Insights must be an array');
    }

    if (insights.length === 0) {
      throw new ValidationError('At least one insight is required');
    }

    insights.forEach((insight, index) => {
      if (typeof insight !== 'string' || insight.trim().length === 0) {
        throw new ValidationError(`Invalid insight at position ${index}`);
      }
    });
  }
}