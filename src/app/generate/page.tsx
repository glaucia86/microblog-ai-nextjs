'use client';

import React, { useCallback } from 'react';
import { GenerateApiRequest } from '@/types';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import { useNotification } from '../../hooks/useNotification';
import { PageHeader } from '../components/generation/PageHeader';
import { GenerationForm } from '../components/generation/GenerationForm';
import { PreviewSection } from '../components/generation/PreviewSection';
import LoadingOverlay from '../components/LoadingOverlay';
import SuccessNotification from '../components/SuccessNotification';
import { useShareContent } from '@/hooks/useShareContent';

export default function GeneratePage() {
  const {
    formData,
    errors,
    updateField,
    validateForm,
  } = useFormValidation();

  const {
    generatedContent,
    isLoading,
    error: generationError,
    generateContent,
    clearError
  } = useContentGeneration();

  const { shareContent } = useShareContent();
  
  const {
    showNotification,
    notificationMessage,
    showSuccess,
    hideNotification
  } = useNotification();

  const handleFormSubmit = useCallback(async (request: GenerateApiRequest) => {
    if (!validateForm()) {
      return;
    }

    clearError();
    
    try {
      await generateContent(request);
      showSuccess('Content generated successfully!');
    } catch (error) {
    }
  }, [validateForm, clearError, generateContent, showSuccess]);

  const handleShare = useCallback(async (content: string) => {
    try {
      await shareContent(content);
      showSuccess('Content shared successfully!');
    } catch (error) {
      showSuccess('Content copied to clipboard!');
    }
  }, [shareContent, showSuccess]);

  React.useEffect(() => {
    if (generationError) {
    }
  }, [generationError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <PageHeader title="Generate Microblog" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="relative">
            <LoadingOverlay isLoading={isLoading} />
            <GenerationForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              onFieldChange={updateField}
              onSubmit={handleFormSubmit}
            />
          </div>

          {/* Preview Section */}
          <PreviewSection
            generatedContent={generatedContent}
            onShare={handleShare}
          />
        </div>
      </main>

      {/* Success Notification */}
      <SuccessNotification
        show={showNotification}
        message={notificationMessage}
        onClose={hideNotification}
      />
    </div>
  );
}