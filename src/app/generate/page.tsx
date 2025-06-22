'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { FormState, GeneratedContent, ToneOfVoice } from '@/types';

// Import components
import EnhancedTextInput from '../components/EnhancedTextInput';
import ToneSelector from '../components/ToneSelector';
import CharacterCounter from '../components/CharacterCounter';
import LoadingOverlay from '../components/LoadingOverlay';
import PreviewCard from '../components/PreviewCard';
import SuccessNotification from '../components/SuccessNotification';

export default function GeneratePage() {
  const router = useRouter();
  
  // Form state management
  const [formData, setFormData] = useState<FormState>({
    topic: '',
    toneOfVoice: 'casual',
    keywords: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation logic
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormState> = {};
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (formData.topic.length < 10) {
      newErrors.topic = 'Topic must be at least 10 characters';
    }
    
    if (formData.keywords && formData.keywords.split(',').length > 5) {
      newErrors.keywords = 'Maximum 5 keywords allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setGeneratedContent(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          tone: formData.toneOfVoice,
          keywords: formData.keywords,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      if (data.success && data.content) {
        setGeneratedContent(data.content);
        setShowSuccess(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setErrors({
        topic: error instanceof Error ? error.message : 'Failed to generate content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Form field handlers
  const handleFieldChange = (field: keyof FormState, value: string | ToneOfVoice) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Share functionality
  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my microblog post!',
          text: content,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(content);
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generate Microblog
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-8 relative">
            <LoadingOverlay isLoading={isLoading} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Create Your Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill in the details below to generate engaging microblog content
                </p>
              </div>

              {/* Topic Input */}
              <EnhancedTextInput
                label="Topic"
                value={formData.topic}
                onChange={(value) => handleFieldChange('topic', value)}
                placeholder="Enter your main topic or idea..."
                error={errors.topic}
                helperText="What do you want to write about? Be specific for better results."
                required
                autoFocus
                rows={3}
              />

              {/* Tone Selector */}
              <ToneSelector
                value={formData.toneOfVoice as ToneOfVoice}
                onChange={(tone) => handleFieldChange('toneOfVoice', tone)}
                disabled={isLoading}
              />

              {/* Keywords Input */}
              <EnhancedTextInput
                label="Keywords (Optional)"
                value={formData.keywords}
                onChange={(value) => handleFieldChange('keywords', value)}
                placeholder="keyword1, keyword2, keyword3"
                error={errors.keywords}
                helperText="Add up to 5 keywords separated by commas"
                rows={2}
              />

              {/* Character Counter for Topic */}
              {formData.topic && (
                <CharacterCounter
                  value={formData.topic}
                  maxLength={200}
                  warningThreshold={0.8}
                />
              )}

              {/* Submit Button */}
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
            </form>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {generatedContent ? (
              <PreviewCard
                content={generatedContent}
                onShare={handleShare}
              />
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <svg
                    className="mx-auto h-24 w-24 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No content generated yet</p>
                  <p className="mt-2 text-sm">
                    Fill in the form and click generate to see your content here
                  </p>
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Be specific with your topic for more targeted content
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Choose a tone that matches your audience
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Keywords help optimize for search and discovery
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Review and personalize the generated content before posting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Success Notification */}
      <SuccessNotification
        show={showSuccess}
        message="Content copied to clipboard!"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}