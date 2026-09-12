/**
 * GitHub User Public Activity Fetcher
 */

import { githubFetch } from './githubClient.js';

/**
 * Fetch public events for a GitHub user.
 * @param {string} username
 * @param {Object} [options]
 */
export async function fetchUserActivity(username, options = {}) {
  const cacheKey = `activity_${username}`;
  const events = await githubFetch(
    `/users/${encodeURIComponent(username)}/events/public?per_page=50`,
    {
      cacheKey,
      ...options
    }
  );

  if (!Array.isArray(events)) {
    return [];
  }

  return events;
}
