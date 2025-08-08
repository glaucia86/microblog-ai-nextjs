import { 
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import { ComponentType } from "react";

export interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export const HOMEPAGE_FEATURES: Feature[] = [
  {
    icon: SparklesIcon,
    title: "Smart Insights",
    description: "Trend analysis and optimized hashtag suggestions to maximize your reach and engagement.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: 'Adaptive Tone of Voice',
    description: 'Choose between technical, casual, or motivational tones to effectively reach your target audience.',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: ArrowsRightLeftIcon,
    title: 'Multiple Variations',
    description: 'Generate different versions of your content to find the perfect approach for your message.',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
];

export const PRO_TIPS = [
  "Be specific with your topic for more targeted content",
  "Choose a tone that matches your audience", 
  "Keywords help optimize for search and discovery",
  "Review and personalize the generated content before posting"
] as const;