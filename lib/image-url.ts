/**
 * Helper to normalize any image source into a browser-loadable URL.
 * Handles:
 * - App-relative URLs (e.g. /api/drive-image?fileId=...)
 * - External URLs (e.g. https://images.unsplash.com/...)
 * - Google Drive web export URLs (https://drive.google.com/uc?export=view&id=...)
 * - Raw Google Drive file IDs (e.g. 1dxA00FKN-Kj39ZzgZVZIHI8WFuBeSA)
 */
export function getImageUrl(source?: string | null): string {
  if (!source || typeof source !== "string") return "";

  const trimmed = source.trim();
  if (!trimmed) return "";

  // Already an app-relative URL (e.g. /api/drive-image?fileId=...)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Google Drive export/view link format
  if (trimmed.includes("drive.google.com")) {
    const idMatch =
      trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `/api/drive-image?fileId=${idMatch[1]}`;
    }
  }

  // Google User Content CDN link format
  if (trimmed.includes("googleusercontent.com")) {
    return trimmed;
  }

  // Other standard web URLs (Unsplash, external CDNs, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Raw Google Drive file ID (alphanumeric with dashes/underscores)
  return `/api/drive-image?fileId=${encodeURIComponent(trimmed)}`;
}
