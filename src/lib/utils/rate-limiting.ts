import { RATE_LIMITING } from '@/lib/constants/app';

interface ClientData {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, ClientData>();

export const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  // Create new window or reset expired window
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMITING.WINDOW_MS,
    });
    return true;
  }
  
  // Check if limit exceeded
  if (clientData.count >= RATE_LIMITING.MAX_REQUESTS) {
    return false;
  }
  
  // Increment counter
  clientData.count += 1;
  return true;
};

export const getRateLimitInfo = (clientId: string) => {
  const clientData = requestCounts.get(clientId);
  const now = Date.now();
  
  if (!clientData || now > clientData.resetTime) {
    return {
      remaining: RATE_LIMITING.MAX_REQUESTS,
      resetTime: now + RATE_LIMITING.WINDOW_MS,
    };
  }
  
  return {
    remaining: Math.max(0, RATE_LIMITING.MAX_REQUESTS - clientData.count),
    resetTime: clientData.resetTime,
  };
};

export const clearRateLimit = (clientId: string): void => {
  requestCounts.delete(clientId);
};