/**
 * GitHub API Client using Node.js native fetch with caching and graceful fallbacks.
 */

import { getCache, setCache, getStaleCache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch data from GitHub API with caching and error resilience.
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {string} [options.token]
 * @param {string} [options.cacheKey]
 * @param {number} [options.ttlMs]
 * @returns {Promise<any>}
 */
export async function githubFetch(endpoint, options = {}) {
  const {
    token = process.env.GITHUB_TOKEN,
    cacheKey,
    ttlMs = 1000 * 60 * 60 // 1 hour default
  } = options;

  // 1. Check fresh cache first if cacheKey is provided
  if (cacheKey) {
    const cached = getCache(cacheKey, ttlMs);
    if (cached) {
      return cached;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PINAK.OS-README-Generator/1.0'
  };

  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }

  try {
    const res = await fetch(url, { headers });

    // Handle Rate Limiting
    if (res.status === 403 || res.status === 429) {
      const resetTime = res.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : 'later';
      logger.warn(`GitHub API Rate Limit reached (status ${res.status}). Resets at ${resetDate}.`);

      if (cacheKey) {
        const stale = getStaleCache(cacheKey);
        if (stale) {
          logger.info(`Using cached data for ${cacheKey}.`);
          return stale;
        }
      }
      throw new Error(`GitHub API rate limit exceeded. Set a GITHUB_TOKEN or wait until ${resetDate}.`);
    }

    if (res.status === 404) {
      throw new Error(`Resource not found at ${url} (404). Check GITHUB_USERNAME.`);
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // Cache successful response
    if (cacheKey) {
      setCache(cacheKey, data);
    }

    return data;
  } catch (err) {
    // Attempt to recover using stale cache on network failures
    if (cacheKey) {
      const stale = getStaleCache(cacheKey);
      if (stale) {
        logger.warn(`Network request failed (${err.message}). Using previous cached data for ${cacheKey}.`);
        return stale;
      }
    }
    throw err;
  }
}
