/**
 * Reading Time Estimator Utility
 */

/**
 * Calculates estimated reading time for a given text or markdown body.
 * Assumes average reading speed of 200 words per minute.
 * @param {string} text - Content text or markdown
 * @param {number} [wpm=200] - Words per minute speed benchmark
 * @returns {string} Human-readable reading time (e.g. '5 min read')
 */
export const calculateReadTime = (text = '', wpm = 200) => {
  if (!text || typeof text !== 'string') {
    return '1 min read';
  }

  // Count non-empty whitespace-separated words
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return '1 min read';
  }

  const minutes = Math.max(1, Math.ceil(wordCount / wpm));
  return `${minutes} min read`;
};

export default calculateReadTime;
