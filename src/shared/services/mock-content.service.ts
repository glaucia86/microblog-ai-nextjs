import { GeneratedContent, ToneOfVoice } from '@/types';

export class MockContentService {
  private static mockContents: Record<string, GeneratedContent[]> = {
    technical: [
      {
        mainContent: "🚀 Exploring the latest in AI technology: GPT models are revolutionizing how we interact with data. The precision and adaptability are game-changing! #TechTrends #AI",
        hashtags: ["TechTrends", "AI", "Innovation", "GPT", "MachineLearning"],
        insights: [
          "AI technology is rapidly advancing with new model capabilities",
          "Data interaction patterns are evolving with AI integration",
          "Technical precision in AI models improves business outcomes"
        ]
      },
      {
        mainContent: "⚡ Performance optimization tip: Implementing proper caching strategies can reduce API calls by 80%. Always measure before optimizing! #DevTips #Performance",
        hashtags: ["DevTips", "Performance", "Optimization", "Caching", "API"],
        insights: [
          "Caching significantly reduces server load and response times",
          "Measurement is crucial before implementing optimizations",
          "API efficiency directly impacts user experience"
        ]
      }
    ],
    casual: [
      {
        mainContent: "Just discovered an amazing coffee shop in downtown! ☕ The atmosphere is perfect for remote work and their WiFi is lightning fast. Highly recommend! #CoffeeLovers",
        hashtags: ["CoffeeLovers", "RemoteWork", "Downtown", "Productivity"],
        insights: [
          "Good work environments significantly boost productivity",
          "Local businesses often provide unique working experiences",
          "Fast internet is essential for modern remote work"
        ]
      },
      {
        mainContent: "Weekend project: Building a small garden in my backyard 🌱 There's something therapeutic about getting your hands dirty and watching things grow! #Gardening",
        hashtags: ["Gardening", "WeekendProject", "Nature", "SelfCare"],
        insights: [
          "Gardening provides mental health benefits and stress relief",
          "DIY projects offer sense of accomplishment and creativity",
          "Connecting with nature improves overall well-being"
        ]
      }
    ],
    motivational: [
      {
        mainContent: "💪 Every expert was once a beginner. The key is to keep pushing forward even when progress feels slow. Your breakthrough is closer than you think! #NeverGiveUp",
        hashtags: ["NeverGiveUp", "Growth", "Persistence", "Success", "Motivation"],
        insights: [
          "Expertise develops gradually through consistent practice",
          "Progress often feels slow but compounds over time",
          "Breakthrough moments come after sustained effort"
        ]
      },
      {
        mainContent: "🌟 Challenge yourself to learn one new thing today. Growth happens outside your comfort zone. What will you discover? #PersonalGrowth #Learning",
        hashtags: ["PersonalGrowth", "Learning", "Challenge", "ComfortZone"],
        insights: [
          "Daily learning habits accelerate personal development",
          "Comfort zones limit potential for growth and discovery",
          "Small daily improvements lead to significant long-term results"
        ]
      }
    ]
  };

  static async generateMockContent(
    topic: string,
    tone: ToneOfVoice,
    keywords?: string
  ): Promise<GeneratedContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockData = this.mockContents[tone] || this.mockContents.casual;
    const selectedContent = mockData[Math.floor(Math.random() * mockData.length)];

    // Customize content based on topic if provided
    if (topic && topic.length > 10) {
      const customContent = this.customizeContent(selectedContent, topic, keywords);
      return customContent;
    }

    return selectedContent;
  }

  private static customizeContent(
    baseContent: GeneratedContent,
    topic: string,
    keywords?: string
  ): GeneratedContent {
    const topicWords = topic.toLowerCase().split(' ');
    const keywordList = keywords ? keywords.split(',').map(k => k.trim()) : [];
    
    // Create a more relevant main content
    const customContent = `💡 ${topic}: This is exactly the kind of topic that sparks innovation and creativity! Let's explore the possibilities together. #Innovation`;
    
    // Mix original hashtags with topic-relevant ones
    const relevantHashtags = [...baseContent.hashtags.slice(0, 3)];
    if (keywordList.length > 0) {
      relevantHashtags.push(...keywordList.slice(0, 2).map(k => k.replace(/\s+/g, '')));
    }
    
    const customInsights = [
      `The topic "${topic}" offers unique opportunities for exploration`,
      `Understanding this subject can lead to valuable insights and growth`,
      ...baseContent.insights.slice(1)
    ];

    return {
      mainContent: customContent.substring(0, 280),
      hashtags: relevantHashtags,
      insights: customInsights
    };
  }
}
