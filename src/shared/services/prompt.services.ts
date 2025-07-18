import { TONE_GUIDELINES } from '@/lib/constants/tones';
import { ToneOfVoice } from '@/types';

export class PromptService {
  static createSystemPrompt(): string {
    return `You are a professional content creator specializing in creating engaging microblog posts.
    Your expertise includes:
    - Creating viral-worthy content under 280 characters
    - Understanding social media engagement patterns
    - Crafting content that drives discussion and shares
    - Adapting tone while maintaining authenticity
    - Selecting impactful and trending hashtags

    Always ensure your responses are:
    1. Concise and impactful
    2. Optimized for social sharing
    3. Properly formatted as JSON
    4. Relevant to the target audience
    5. Engaging and shareable`;
  }

  static createUserPrompt(topic: string, tone: ToneOfVoice, keywords?: string): string {
    let prompt = `Create a microblog post about "${topic}"`;

    if (keywords) {
      prompt += `, incorporating the following keywords: ${keywords}`;
    }

    const guidelines = TONE_GUIDELINES[tone] || TONE_GUIDELINES.casual;
    prompt += `\n\nTone requirements (${tone}):\n${guidelines.map(g => `- ${g}`).join('\n')}`;

    prompt += `\n\nFormat your response as JSON: {
      "mainContent": "your microblog post (max 280 characters)",
      "hashtags": ["relevant", "hashtags", "array"],
      "insights": ["key insights about the topic as array"]
    }`;

    return prompt;
  }
}