/**
 * Calculates estimated reading time in minutes based on word count.
 * Uses the industry-standard reading speed of 200 words per minute.
 */
export function estimateReadingTime(content?: string | null): number {
  if (!content) return 1;

  // Strip HTML tags and entities
  const cleanText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim();

  if (!cleanText) return 1;

  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return Math.max(1, Math.ceil(wordCount / 200));
}
