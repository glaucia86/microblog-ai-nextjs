import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';
import { LangChainServiceConfig } from '@/types/langchain-types';

const OutputSchema = z.object({
  mainContent: z.string().max(280),
  hashtags: z.array(z.string()).min(1).max(10),
  insights: z.array(z.string()).min(1).max(5),
});

export class LangChainClient {
  private model!: ChatOpenAI;
  private parser!: StructuredOutputParser<typeof OutputSchema>;
  private chain!: RunnableSequence;

  constructor(private config: LangChainServiceConfig) {
    this.validateEnvironment();
    this.initializeModel();
    this.initializeParser();
    this.buildChain();
  }

  async generateContent(systemPrompt: string, userPrompt: string): Promise<string> {
    const result = await this.chain.invoke({
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      format_instructions: this.parser.getFormatInstructions(),
    });

    return result;
  }

  private validateEnvironment(): void {
    if (!process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN) {
      throw new Error('Missing GITHUB_MODELS_TOKEN environment variable');
    }
  }

  private initializeModel(): void {
    this.model = new ChatOpenAI({
      modelName: this.config.modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      openAIApiKey: process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN,
      configuration: {
        baseURL: process.env.NEXT_PUBLIC_GITHUB_MODELS_ENDPOINT,
      },
    });
  }

  private initializeParser(): void {
    this.parser = StructuredOutputParser.fromZodSchema(OutputSchema);
  }

  private buildChain(): void {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate('{system_prompt}\n\n{format_instructions}'),
      HumanMessagePromptTemplate.fromTemplate('{user_prompt}'),
    ]);

    this.chain = RunnableSequence.from([
      promptTemplate,
      this.model,
      this.parser,
    ]);
  }
}