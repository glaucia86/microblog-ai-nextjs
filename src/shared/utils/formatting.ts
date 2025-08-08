export const formatHashtags = (hashtags: string[]): string => {
  return hashtags
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');
};

export const createFullContent = (mainContent: string, hashtags: string[]): string => {
  return `${mainContent}\n\n${formatHashtags(hashtags)}`
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const getCharacterCountInfo = (
  current: number,
  max: number,
  warningThreshold: number = 0.9
) => {
  const percentage = current / max;
  const isWarning = percentage >= warningThreshold;
  const isError = current > max;

  return {
    percentage,
    isWarning,
    isError,
    remaining: max - current,
  };
};