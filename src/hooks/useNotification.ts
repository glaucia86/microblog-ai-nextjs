import { useState, useCallback } from 'react';
import { UI_CONFIG } from '@/lib/constants/app';

interface UseNotificationReturn {
  showNotification: boolean;
  notificationMessage: string;
  showSuccess: (message: string) => void;
  hideNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccess = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  }, []);

  const hideNotification = useCallback(() => {
    setShowNotification(false);
    setNotificationMessage('');
  }, []);

  return {
    showNotification,
    notificationMessage,
    showSuccess,
    hideNotification
  };
};