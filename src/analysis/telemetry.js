/**
 * Developer Telemetry Metrics Calculator
 */

/**
 * Derive telemetry metrics from collected profile, repositories, and activity.
 * @param {Object} data
 * @param {Object} data.profile
 * @param {Array<Object>} data.repositories
 * @param {Array<Object>} data.events
 * @returns {Object}
 */
export function calculateTelemetry({ profile = {}, repositories = [], events = [] }) {
  const originalRepos = repositories.filter(r => !r.isFork);
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  // Active projects (updated in last 90 days)
  const activeProjects = originalRepos.filter(r => {
    if (!r.updatedAt) return false;
    const updated = new Date(r.updatedAt).getTime();
    return now - updated <= ninetyDaysMs;
  }).length;

  // Distinct languages
  const distinctLanguages = new Set(
    repositories
      .map(r => r.language)
      .filter(l => Boolean(l) && l !== 'Plain Text')
  ).size;

  // Total stars
  const totalStars = repositories.reduce((sum, r) => sum + (r.stars || 0), 0);

  // Total forks
  const totalForks = repositories.reduce((sum, r) => sum + (r.forks || 0), 0);

  // Recent commits count from PushEvents in public event stream
  let recentCommits = 0;
  for (const event of events) {
    if (event.type === 'PushEvent' && event.payload) {
      if (Array.isArray(event.payload.commits)) {
        recentCommits += event.payload.commits.length;
      } else if (typeof event.payload.size === 'number') {
        recentCommits += event.payload.size;
      } else {
        recentCommits += 1;
      }
    }
  }

  return {
    publicRepositories: profile.publicRepos || repositories.length,
    originalProjects: originalRepos.length,
    followers: profile.followers || 0,
    following: profile.following || 0,
    languages: distinctLanguages,
    activeProjects,
    recentCommits,
    totalStars,
    totalForks
  };
}
