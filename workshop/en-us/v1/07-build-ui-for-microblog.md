# Building an Advanced User Interface for Microblog AI

Now that our robust API is working flawlessly, it's time to create a user interface that matches the quality of our backend architecture. In this session, we’ll develop sophisticated React components that deliver an exceptional user experience — including real-time visual feedback, elegant loading states, and intuitive interactions that give users a sense of control throughout the content generation process.

## Learning Objectives

By the end of this session, you will be able to:

* Create reusable and accessible React components
* Implement sophisticated visual feedback with smooth animations
* Develop real-time validation systems on the frontend
* Build interfaces that respond elegantly to different application states
* Apply user experience design principles in practical components
* And integrate complex components into a cohesive workflow

We will be building the following components:

* **CharacterCounter.tsx**
* **EnhancedTextInput.tsx**
* **LoadingOverlay.tsx**
* **PreviewCard.tsx**
* **SuccessNotification.tsx**
* **ToneSelector.tsx**

Let’s get started!

## Step 1: Building the `PreviewCard` Component

### Creating a Sophisticated Preview Experience

The `PreviewCard` is where all the magic becomes visible to the user. This component needs to present the AI-generated content in a clear, organized, and actionable way. Let’s create the file `src/app/components/PreviewCard.tsx`:

<details><summary><b>src/app/components/PreviewCard.tsx</b></summary>
<br/>

```tsx
'use client';

import React, { useState } from 'react';
import { GeneratedContent } from '@/types';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

interface PreviewCardProps {
  content: GeneratedContent;
  onShare?: (content: string) => void;
}

export default function PreviewCard({ content, onShare }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedItem(itemId);
      setTimeout(() => {
        setCopied(false);
        setCopiedItem(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatHashtags = (hashtags: string[]): string => {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  const fullContent = `${content.mainContent}\n\n${formatHashtags(content.hashtags)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">Generated Content</h3>
      </div>

      {/* Main Content Section */}
      <div className="p-6 space-y-6">
        {/* Microblog Content */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Microblog Post
            </h4>
            <button
              onClick={() => handleCopy(content.mainContent, 'main')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy to clipboard"
            >
              {copied && copiedItem === 'main' ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
            {content.mainContent}
          </p>
        </div>

        {/* Hashtags Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Optimized Hashtags
            </h4>
            <button
              onClick={() => handleCopy(formatHashtags(content.hashtags), 'hashtags')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy hashtags"
            >
              {copied && copiedItem === 'hashtags' ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Strategic Insights
          </h4>
          <ul className="space-y-2">
            {content.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => handleCopy(fullContent, 'full')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {copied && copiedItem === 'full' ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
              Copy All
            </>
          )}
        </button>
        
        {onShare && (
          <button
            onClick={() => onShare(fullContent)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}
```

</details>  
<br/>

### Understanding the Component Architecture

The component uses local state to manage temporary visual feedback related to the copy functionality. This approach keeps state responsibility close to where it's used, following principles of cohesion in React.

The `PreviewCardProps` interface clearly defines the component’s expectations. The `content` field is required because the component doesn’t make sense without data to display, while `onShare` is optional, allowing flexibility in different usage contexts.

The `copiedItem` state allows us to track which specific element was copied, enabling individual visual feedback for each copy action. This significantly improves user experience by providing accurate confirmation of their actions.

### Analyzing Usability Strategies

The `handleCopy` function implements the modern Clipboard API with graceful error handling. Using `navigator.clipboard.writeText()` is preferred over legacy methods because it's more secure and works better in modern HTTPS contexts.

The 2-second timeout for resetting the visual state is based on UX research, which shows that this is the ideal time for users to process feedback without creating anxiety about whether the action was successful.

The `formatHashtags` function ensures formatting consistency by adding the `#` symbol only when necessary. This normalization prevents duplicated hashtags like "##javascript" and creates a more polished experience.

The `fullContent` string intelligently combines the main text with formatted hashtags, creating a ready-to-publish piece of content that users can copy with a single click.

### Understanding Visual Design Decisions

The blue gradient header creates a clear visual hierarchy and establishes a consistent visual identity with the rest of the application. The gradient adds depth without being overly flashy.

The use of `space-y-6` creates consistent visual rhythm between sections, following interface design principles that enhance readability and content comprehension.

Copy buttons are strategically positioned in the top-right corner of each section, following established interface conventions where secondary actions remain close to but visually separate from the main content.

The icon transition between `ClipboardDocumentIcon` and `CheckIcon` provides immediate and satisfying feedback, using green to indicate success—a universal UI convention.

## Step 2: Creating the `CharacterCounter` Component

### Developing Real-Time Visual Feedback

The `CharacterCounter` is essential for giving users control over the length of the content they're creating. Let’s create `src/app/components/CharacterCounter.tsx`:

<details><summary><b>src/app/components/CharacterCounter.tsx</b></summary>
<br/>

```tsx
'use client';

import React, { useMemo } from 'react';

interface CharacterCounterProps {
  value: string;
  maxLength?: number;
  warningThreshold?: number;
}

export default function CharacterCounter({
  value,
  maxLength = 280,
  warningThreshold = 0.9,
}: CharacterCounterProps) {
  const characterCount = useMemo(() => value.length, [value]);
  const percentage = useMemo(() => characterCount / maxLength, [characterCount, maxLength]);
  const isWarning = useMemo(() => percentage >= warningThreshold, [percentage, warningThreshold]);
  const isError = useMemo(() => characterCount > maxLength, [characterCount, maxLength]);
```

</details>
<br/>

### Optimizing Performance with `useMemo`

Using `useMemo` for seemingly simple calculations may appear excessive, but it's a valuable practice in components that may re-render frequently. When the user is typing, each keystroke can trigger re-renders, and these memoized calculations help avoid unnecessary work.

The `warningThreshold` of 0.9 (90%) is based on UX research showing that users prefer early warnings rather than discovering limits only when they exceed them. This early warning allows proactive content adjustment.

The separation between warning and error states creates a logical progression of visual feedback that gently guides the user toward the desired behavior.

### Implementing Dynamic Color Logic

<details><summary><b>src/app/components/CharacterCounter.tsx</b></summary>
<br/>

```tsx
 const getColorClasses = (): string => {
    if (isError) return 'text-red-600 font-semibold';
    if (isWarning) return 'text-yellow-600 font-medium';
    return 'text-gray-500';
  };

  const getProgressBarColor = (): string => {
    if (isError) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-blue-500';
  };
```

</details>
<br/>

### Visual Feedback Strategy

The color functions implement a progressive feedback system that intuitively guides users through different states. Blue represents a normal and safe state, yellow signals caution, and red indicates an issue that needs resolution.

The progression in font weight (`font-semibold` for error, `font-medium` for warning) adds an additional layer of visual communication, reinforcing the significance of each state through typography.

This multi-dimensional feedback approach accommodates different user types and usage contexts—whether they rely more on color cues or typographic emphasis.

### Creating the Visual Progress Interface

<details><summary><b>src/app/components/CharacterCounter.tsx</b></summary>
<br/>

```tsx
return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
          style={{
            width: `${Math.min(percentage * 100, 100)}%`,
            transform: isError ? 'scaleY(1.5)' : 'scaleY(1)',
          }}
        />
      </div>
      
      {/* Counter Text */}
      <div className="flex justify-between items-center">
        <span className={`text-sm transition-colors duration-200 ${getColorClasses()}`}>
          {characterCount} / {maxLength} characters
        </span>
        {isError && (
          <span className="text-xs text-red-600 animate-pulse">
            Exceeds limit by {characterCount - maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
```

</details>
<br/>

### Analyzing Micro-Interactions

The progress bar uses `Math.min(percentage * 100, 100)` to ensure it never visually exceeds 100%, even when the text goes over the limit. The `scaleY(1.5)` effect in the error state causes the bar to “grow” vertically, adding a visual indicator of the issue.

The `duration-300 ease-out` transition is carefully chosen to be responsive without being distracting. Anything too fast (<200ms) may be imperceptible; too slow (>500ms) may feel laggy.

The pulsing text in the error state (`animate-pulse`) gently draws attention using motion, signaling that action is needed without being alarming.

## Step 3: Developing the `EnhancedTextInput` Component

### Creating a Sophisticated Text Input

The `EnhancedTextInput` is where the user directly interacts with our application. Let’s create `src/app/components/EnhancedTextInput.tsx`:

<details><summary><b>src/app/components/EnhancedTextInput.tsx</b></summary>
<br/>

```tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface EnhancedTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rows?: number;
}
```

</details>
<br/>

### Understanding the Component's Design Philosophy

The component's interface was designed to be comprehensive yet not overwhelming. Each prop has a specific purpose and allows granular customization without making the component overly complex for basic use.

The use of optional props with sensible default values ensures that the component can be used simply in most scenarios, while still offering flexibility for more advanced cases.

The separation between `error` and `helperText` enables the component to act both as a validator and as an educational guide, improving both error prevention and the user learning experience.

### Implementing Smart Auto-Focus

<details><summary><b>src/app/components/EnhancedTextInput.tsx</b></summary>
<br/>

```tsx
export default function EnhancedTextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  maxLength,
  required = false,
  disabled = false,
  autoFocus = false,
  rows = 4,
}: EnhancedTextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);
```

</details>
<br/>

### Focus Management Strategy

Auto-focus is implemented using `useEffect` instead of simply using the HTML `autoFocus` prop because it provides more control over when and how focus occurs. This is especially important in single-page applications where component mounting timing can vary.

The use of `useRef` to access the DOM element directly is a standard practice in React for cases where we need imperative control over elements, such as managing focus, scrolling, or measuring dimensions.

Conditional focusing only occurs when explicitly requested via the `autoFocus` prop, avoiding unexpected behaviors that could harm accessibility or user experience.

### Implementing Real-Time Input Validation

<details><summary><b>src/app/components/EnhancedTextInput.tsx</b></summary>
<br/>

```tsx
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const hasError = Boolean(error);
  const characterCount = value.length;
  const showCounter = maxLength && characterCount > maxLength * 0.8;
```

</details>
<br/>

### Prevention vs. Correction Logic

The validation in `handleChange` implements prevention instead of correction. Rather than allowing the user to type beyond the limit and then correcting it, it simply prevents extra characters from being entered. This approach reduces frustration and confusion.

The 80% threshold to show the character counter `(maxLength * 0.8)` is based on progressive disclosure principles—contextual information appears when it becomes relevant, without overloading the user with unnecessary data upfront.

Casting `error` to a boolean using `Boolean(error)` is a defensive practice that works correctly whether `error` is an empty string, null, undefined, or an actual message.

Below is the full implementation of the component:

<details><summary><b>src/app/components/EnhancedTextInput.tsx</b></summary>
<br/>

```tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface EnhancedTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rows?: number;
}

export default function EnhancedTextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  maxLength,
  required = false,
  disabled = false,
  autoFocus = false,
  rows = 4,
}: EnhancedTextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const hasError = Boolean(error);
  const characterCount = value.length;
  const showCounter = maxLength && characterCount > maxLength * 0.8;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showCounter && (
          <span
            className={`text-xs ${
              characterCount >= maxLength ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id={label}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm resize-none
            transition-all duration-200
            ${
              hasError
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${
              disabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            dark:border-gray-600 dark:text-white
          `}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${label}-error` : helperText ? `${label}-description` : undefined
          }
        />
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`text-sm ${
            hasError ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
          }`}
          id={hasError ? `${label}-error` : `${label}-description`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
```

</details>
<br/>

## Step 4: Implementing the `LoadingOverlay` Component

### Developing Elegant Loading States

The `LoadingOverlay` turns waiting moments into pleasant visual experiences. Let’s create `src/app/components/LoadingOverlay.tsx`:

<details><summary><b>src/app/components/LoadingOverlay.tsx</b></summary>
<br/>

```tsx
'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Generating Your Content',
}: LoadingOverlayProps) {
  if (!isLoading) return null;
```

</details>
<br/>

### Design Philosophy for Loading States

The component implements the concept of *graceful loading*, where wait time becomes part of the user experience rather than an interruption. The flexibility between fullscreen and localized overlay allows it to adapt to different usage contexts.

The early return when `isLoading` is false prevents unnecessary rendering and keeps the DOM clean when the component is inactive. This optimization is especially important in applications with many conditional components.

Customizing the message provides specific context for different operations, helping users understand what is happening and how long it might take.

### Creating Sophisticated Animations

<details><summary><b>src/app/components/LoadingOverlay.tsx</b></summary>
<br/>

```tsx
return (
    <div
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex items-center space-x-4">
        <SparklesIcon className="w-6 h-6 text-blue-500 animate-spin" />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This might take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
```

</details>
<br/>

### Anatomy of Compound Animations

The spinning animation of the `SparklesIcon` uses `animate-spin`, a Tailwind CSS utility class that applies continuous rotation. This animation is lightweight and does not negatively impact performance, even on mobile devices.

The semi-transparent overlay (`bg-black/20 dark:bg-black/40`) creates visual contrast that highlights the loading content, while `backdrop-blur-xs` adds a subtle blur effect that enhances aesthetics without being distracting.

The combination of `fixed inset-0` ensures the overlay covers the entire screen, while `flex items-center justify-center` centers the content, creating a visually balanced experience.

## Step 5: Implementing the `SuccessNotification` Component

### Creating Satisfying Success Feedback

Success notifications turn task completion into moments of satisfaction. Let’s create `src/app/components/SuccessNotification.tsx`:

<details><summary><b>src/app/components/SuccessNotification.tsx</b></summary>
<br/>

```tsx
'use client';

import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function SuccessNotification({
  show,
  message,
  onClose,
  autoHideDuration = 5000,
}: SuccessNotificationProps) {
  useEffect(() => {
    if (show && autoHideDuration > 0) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHideDuration, onClose]);
```

</details>
<br/>

### Smart Auto-dismiss Strategy

The default 5-second auto-dismiss duration is based on UX research indicating that this is enough time for users to read and process success messages without being too intrusive.

Clearing the timer in the `useEffect` cleanup prevents memory leaks and unexpected behavior if the component is unmounted while the timer is still active.

The option to disable auto-dismiss (`autoHideDuration = 0`) provides flexibility for cases where the notification should remain until explicitly dismissed by the user.

### Positioning and Visual Hierarchy

<details><summary><b>src/app/components/SuccessNotification.tsx</b></summary>
<br/>

```tsx
if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4 pr-12 max-w-md">
        <div className="flex items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

</details>
<br/>

### Notification Design Patterns

Positioning in the bottom-right corner follows established conventions for non-intrusive notifications. This area is traditionally reserved for feedback that does not interrupt the main workflow.

Consistent use of green for success elements creates a cohesive visual language. The `CheckCircleIcon` is universally recognized as an indicator of positive success.

The close button is positioned to be accessible without competing visually with the main message. Its size and placement allow easy dismissal without accidental clicks.

## Step 6: Implementing the `ToneSelector` Component

### Creating an Intuitive Tone of Voice Selector

The `ToneSelector` allows users to easily choose between different content styles. Let’s create `src/app/components/ToneSelector.tsx`:

<details><summary><b>src/app/components/ToneSelector.tsx</b></summary>
<br/>

```tsx
'use client';

import React from 'react';
import { ToneOfVoice } from '@/types';
import {
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

interface ToneOption {
  value: ToneOfVoice;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

interface ToneSelectorProps {
  value: ToneOfVoice;
  onChange: (tone: ToneOfVoice) => void;
  disabled?: boolean;
}

const toneOptions: ToneOption[] = [
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise, data-driven, professional',
    icon: <CpuChipIcon className="w-5 h-5" />,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200 hover:border-blue-400',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly, conversational, relatable',
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200 hover:border-purple-400',
  },
  {
    value: 'motivational',
    label: 'Motivational',
    description: 'Inspiring, empowering, action-oriented',
    icon: <RocketLaunchIcon className="w-5 h-5" />,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200 hover:border-green-400',
  },
];
```

</details>
<br/>

### Tone Selection UI Design Strategy

Each tone option is carefully designed with icons that intuitively convey the concept. The `CpuChipIcon` for technical suggests precision and technology, `ChatBubbleLeftRightIcon` for casual implies conversation, and `RocketLaunchIcon` for motivational suggests action and progress.

The descriptions are concise yet informative, using three adjectives that capture the essence of each tone. This approach allows for quick understanding without overwhelming the user with excess information.

The color system is consistent with the rest of the application, using blue for technical, purple for casual, and green for motivational. This palette creates visual associations that aid memorability and recognition.

### Implementing Complex Visual States

<details><summary><b>src/app/components/ToneSelector.tsx</b></summary>
<br/>

```tsx
export default function ToneSelector({
  value,
  onChange,
  disabled = false,
}: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Tone of Voice
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toneOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? `${option.borderClass} ${option.bgClass} ring-2 ring-offset-2 ${option.colorClass.replace('text-', 'ring-')}`
                    : `border-gray-200 hover:${option.borderClass} hover:shadow-md`
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`
                    flex-shrink-0 mt-0.5
                    ${isSelected ? option.colorClass : 'text-gray-400'}
                  `}
                >
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`
                      font-medium
                      ${isSelected ? option.colorClass : 'text-gray-900 dark:text-white'}
                    `}
                  >
                    {option.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div
                  className={`
                    absolute top-2 right-2 w-2 h-2 rounded-full
                    ${option.bgClass.replace('bg-', 'bg-').replace('-50', '-500')}
                  `}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

</details>
<br/>

### Micro-interactions and Visual Feedback

The visual state system implements multiple layers of feedback. The selected state uses a visual ring, a subtle background color, and a color-specific indicator. Hover states add shadow and border color transitions.

The `duration-200` transition is optimized to feel responsive without being distracting. Faster transitions may go unnoticed, while slower ones can feel laggy.

The circular indicator in the top-right corner when selected provides extra visual confirmation, especially helpful for users who may have difficulty distinguishing subtle color or background differences.

## Session Summary

### What Did We Achieve?

In this session, we built a complete library of React components that work harmoniously to create an exceptional user experience. Each component was designed with usability, accessibility, and performance principles in mind.

We developed visual feedback systems that guide the user through each step of the process, from data input to result visualization. The components implement modern UI patterns that are familiar to users, yet distinctive enough to create a unique visual identity.

The component architecture is modular and reusable, allowing for easy maintenance and future expansion. Each component encapsulates its own logic and state when appropriate, while also integrating smoothly with global state when needed.

## Getting Ready for the Next Session

In Session 8, we’ll integrate all these components into a complete content generation page. We'll build the full user flow, implement advanced state management, and add features like generation history and customizable settings.
We’ll also implement sophisticated error handling that works in tandem with our robust API, creating an end-to-end experience that is both powerful and elegant.

> **Pro Tip:** Well-designed components are like instruments in an orchestra—each has its own role, but together they create a symphony of user experience. Invest time in visual and behavioral consistency across components, as this directly impacts the user's perception of your app’s quality.

**[⬅️ Back: Integration with the Content Generation API](./06-integration-with-api-content-generated.md) | [Next: Session 08 ➡️](./08-create-microblog-generator-page.md)**
