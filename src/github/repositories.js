/**
 * GitHub Repositories Fetcher
 */

import { githubFetch } from './githubClient.js';

/**
 * Fetch public repositories for a GitHub user.
 * @param {string} username
 * @param {Object} [options]
 * @param {boolean} [options.excludeForks=true]
 */
export async function fetchUserRepositories(username, options = {}) {
  const { excludeForks = true, ...fetchOpts } = options;
  const cacheKey = `repos_${username}`;

  // Fetch up to 100 repositories sorted by recently updated
  const repos = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=public`,
    {
      cacheKey,
      ...fetchOpts
    }
  );

  if (!Array.isArray(repos)) {
    return [];
  }

  const normalized = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    htmlUrl: repo.html_url,
    homepage: repo.homepage || '',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    openIssues: repo.open_issues_count || 0,
    language: repo.language || 'Plain Text',
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    isFork: Boolean(repo.fork),
    isArchived: Boolean(repo.archived),
    createdAt: repo.created_at,
    updatedAt: repo.pushed_at || repo.updated_at,
    size: repo.size || 0,
    defaultBranch: repo.default_branch || 'main'
  }));

  if (excludeForks) {
    return normalized.filter(r => !r.isFork);
  }

  return normalized;
}
