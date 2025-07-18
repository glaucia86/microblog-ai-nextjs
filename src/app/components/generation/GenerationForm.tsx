'use client';

import React from 'react';
import { FormState, ToneOfVoice, GenerateApiRequest } from '@/types';
import { MICROBLOG_LIMITS } from '@/lib/constants/app';
import EnhancedTextInput from '../EnhancedTextInput';
import ToneSelector from '../ToneSelector';
import CharacterCounter from '../CharacterCounter';

interface GenerationFormProps {
  formData: FormState;
  errors: Partial<FormState>;
  isLoading: boolean;
  onFieldChange: (field: keyof FormState, value: string | ToneOfVoice) => void;
  onSubmit: (request: GenerateApiRequest) => void;
}

export const GenerationForm: React.FC<GenerationFormProps> = ({
  formData,
  errors,
  isLoading,
  onFieldChange,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      topic: formData.topic,
      tone: formData.toneOfVoice as string,
      keywords: formData.keywords,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-8 relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormHeader />
        
        <TopicInput
          value={formData.topic}
          error={errors.topic}
          onChange={(value) => onFieldChange('topic', value)}
          disabled={isLoading}
        />

        <ToneSelector
          value={formData.toneOfVoice as ToneOfVoice}
          onChange={(tone) => onFieldChange('toneOfVoice', tone)}
          disabled={isLoading}
        />

        <KeywordsInput
          value={formData.keywords}
          error={errors.keywords}
          onChange={(value) => onFieldChange('keywords', value)}
          disabled={isLoading}
        />

        {formData.topic && (
          <CharacterCounter
            value={formData.topic}
            maxLength={MICROBLOG_LIMITS.MAX_TOPIC_LENGTH}
            warningThreshold={MICROBLOG_LIMITS.CHARACTER_WARNING_THRESHOLD}
          />
        )}

        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

const FormHeader: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Create Your Content
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Fill in the details below to generate engaging microblog content
    </p>
  </div>
);

interface TopicInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ value, error, onChange, disabled }) => (
  <EnhancedTextInput
    label="Topic"
    value={value}
    onChange={onChange}
    placeholder="Enter your main topic or idea..."
    error={error}
    helperText="What do you want to write about? Be specific for better results."
    required
    autoFocus
    rows={3}
    disabled={disabled}
  />
);

interface KeywordsInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({ value, error, onChange, disabled }) => (
  <EnhancedTextInput
    label="Keywords (Optional)"
    value={value}
    onChange={onChange}
    placeholder="keyword1, keyword2, keyword3"
    error={error}
    helperText={`Add up to ${MICROBLOG_LIMITS.MAX_KEYWORDS} keywords separated by commas`}
    rows={2}
    disabled={disabled}
  />
);

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`
      w-full py-3 px-4 border border-transparent rounded-lg
      text-white font-medium text-lg
      transition-all duration-200 transform
      ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
      }
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `}
  >
    {isLoading ? 'Generating...' : 'Generate Content'}
  </button>
);