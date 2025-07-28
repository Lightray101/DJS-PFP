/**
 * Convert external image URLs to use placeholder images to avoid CDN restrictions
 * @param {string} originalUrl - The original image URL
 * @returns {string} - The placeholder URL or original URL
 */
export function getProxiedImageUrl(originalUrl) {
  // Check if the URL is from the art19 CDN
  if (originalUrl && originalUrl.includes("content.production.cdn.art19.com")) {
    // Use a placeholder image service instead of trying to proxy the CDN
    // This avoids 403 Forbidden errors from CDN anti-bot protection
    return `https://via.placeholder.com/400x400/6366f1/ffffff?text=Podcast+Image`;
  }

  // Return the original URL for other domains
  return originalUrl;
}

/**
 * Check if an image URL is from an external CDN that might have CORS issues
 * @param {string} url - The image URL to check
 * @returns {boolean} - True if the URL is from an external CDN
 */
export function isExternalCdnUrl(url) {
  if (!url) return false;

  const externalDomains = [
    "content.production.cdn.art19.com",
    "cdn.art19.com",
    "images.art19.com",
  ];

  return externalDomains.some((domain) => url.includes(domain));
}

/**
 * Get the best available image URL for a podcast
 * @param {string} podcastTitle - The podcast title
 * @param {string} originalUrl - The original image URL
 * @param {boolean} isArt19 - Whether this is an Art19 CDN image
 * @returns {string} - The image URL to use
 */
export function getPlaceholderImageUrl(
  podcastTitle,
  originalUrl,
  isArt19 = false
) {
  console.log("getPlaceholderImageUrl called with:", {
    podcastTitle,
    originalUrl,
    isArt19,
  });

  // Just use the original URL directly
  if (originalUrl) {
    console.log("Using original URL:", originalUrl);
    return originalUrl;
  }

  // Fallback to placeholder images
  const seed = podcastTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
  const placeholderUrl = `https://picsum.photos/seed/${seed}/400/400`;

  console.log("Generated placeholder URL:", placeholderUrl);
  return placeholderUrl;
}

/**
 * Try to fetch an image with different approaches
 * @param {string} url - The image URL to try
 * @returns {Promise<string>} - The working image URL or placeholder
 */
export async function tryImageUrl(url) {
  try {
    // Try the original URL first
    const response = await fetch(url, {
      mode: "cors",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (response.ok) {
      return url;
    }
  } catch (error) {
    console.log("Failed to fetch image:", error);
  }

  return null;
}
