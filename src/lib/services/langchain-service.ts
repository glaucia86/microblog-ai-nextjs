import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const generatedContentSchema = z.object({
  mainContent: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(280, "Content must not exceed 280 characters"),
  hashtags: z.array(z.string())
    .min(1, "At least one hashtag required")
    .max(5, "Maximum 5 hashtags allowed"),
  insights: z.array(z.string())
    .min(1, "At least one insight required")
    .max(5, "Maximum 5 insights allowed")
});

interface ToneGuidelines {
  [key: string]: string[]
}

class LangChainMicroblogService {
  private chatModel: ChatOpenAI;
  private readonly toneGuidelines: ToneGuidelines;
  private outputParser: StructuredOutputParser<typeof generatedContentSchema>

  constructor() {
    this.validateEnvironmentVariables();
    
    this.chatModel = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 500,
      openAIApiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
      configuration: {
        baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT || "https://models.inference.ai.azure.com",
      }
    });

    this.toneGuidelines = this.getToneGuidelines();

    this.outputParser = StructuredOutputParser.fromZodSchema(generatedContentSchema);
  }

  /**
   * Validate environment variables required for the service.
   * Ensures that all the necessary credentials are present
   */
  validateEnvironmentVariables(): void {
    const requiredVars = ['NEXT_PUBLIC_GITHUB_MODELS_TOKEN'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables...: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Definition of guidelines for each tone of voice
   * Each tone has specific characteristics that guide the generation of content.
   */
  getToneGuidelines(): ToneGuidelines {
    return {
      technical: [
        'Use precise technical language and industry terminology',
        'Include specific data points, metrics, and statistics when relevant',
        'Maintain professional credibility and authoritative tone',
        'Focus on accuracy, clarity, and factual information',
        'Reference best practices and proven methodologies',
      ],
      casual: [
        'Use conversational, friendly, and approachable language',
        'Include relatable examples and everyday analogies',
        'Keep the tone light, engaging, and personable',
        'Write as if speaking to a friend or colleague',
        'Use informal expressions while maintaining clarity',
      ],
      motivational: [
        'Use inspiring, empowering, and action-oriented language',
        'Focus on positive outcomes, growth, and possibilities',
        'Include clear calls-to-action and next steps',
        'Create emotional connections and resonance',
        'Emphasize achievement, progress, and transformation'
      ]
    }
  }



}