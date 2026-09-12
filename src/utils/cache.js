import fs from 'node:fs';
import path from 'node:path';

const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 hour

/**
 * Ensure the cache directory exists.
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Read cached data if not expired.
 * @param {string} key
 * @param {number} [ttlMs]
 * @returns {any|null}
 */
export function getCache(key, ttlMs = DEFAULT_TTL_MS) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry = JSON.parse(raw);

    const isExpired = Date.now() - entry.timestamp > ttlMs;
    if (isExpired) {
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Read cached data even if expired (stale fallback for offline or API errors).
 * @param {string} key
 * @returns {any|null}
 */
export function getStaleCache(key) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry = JSON.parse(raw);
    return entry.data || null;
  } catch {
    return null;
  }
}

/**
 * Save data to cache.
 * @param {string} key
 * @param {any} data
 */
export function setCache(key, data) {
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const entry = {
      timestamp: Date.now(),
      data
    };
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal if caching fails
    console.error(`Failed to write cache for ${key}:`, err.message);
  }
}

/**
 * Clear the cache directory.
 */
export function clearCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
    }
  } catch (err) {
    console.error('Failed to clear cache:', err.message);
  }
}
