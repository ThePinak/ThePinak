/**
 * GitHub User Profile Fetcher
 */

import { githubFetch } from './githubClient.js';

/**
 * Fetch GitHub user profile.
 * @param {string} username
 * @param {Object} [options]
 */
export async function fetchUserProfile(username, options = {}) {
  const cacheKey = `profile_${username}`;
  const data = await githubFetch(`/users/${encodeURIComponent(username)}`, {
    cacheKey,
    ...options
  });

  return {
    username: data.login,
    name: data.name || data.login,
    bio: data.bio || '',
    avatarUrl: data.avatar_url || '',
    publicRepos: data.public_repos || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    htmlUrl: data.html_url || `https://github.com/${username}`
  };
}
