/**
 * Project Intelligence & Ranking Engine
 */

/**
 * Calculate an internal ranking score for a repository.
 * @param {Object} repo
 * @returns {number}
 */
export function calculateProjectScore(repo) {
  let score = 0;

  // Star score (10 pts per star, max 100)
  const starScore = Math.min(100, (repo.stars || 0) * 10);
  score += starScore;

  // Recency score (based on last updated/pushed date)
  if (repo.updatedAt) {
    const updatedDate = new Date(repo.updatedAt);
    const daysAgo = Math.max(0, (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 7) score += 50;
    else if (daysAgo <= 30) score += 35;
    else if (daysAgo <= 90) score += 20;
    else if (daysAgo <= 180) score += 10;
  }

  // Completeness score (has description, homepage, topics)
  if (repo.description && repo.description.trim().length > 10) score += 25;
  if (repo.homepage && repo.homepage.trim().length > 0) score += 20;
  if (repo.topics && repo.topics.length > 0) score += Math.min(25, repo.topics.length * 5);

  // Fork/Star activity
  score += Math.min(30, (repo.forks || 0) * 15);

  // Penalize archived repositories
  if (repo.isArchived) score -= 50;

  return score;
}

/**
 * Select and format featured projects.
 * Combines manually pinned projects with highest scored auto-detected projects.
 * @param {Array<Object>} repos
 * @param {Array<Object>} [manualFeatured=[]]
 * @param {number} [maxCount=6]
 */
export function selectFeaturedProjects(repos = [], manualFeatured = [], maxCount = 6) {
  const result = [];
  const addedNames = new Set();

  // 1. First add manual featured projects
  for (const feat of manualFeatured) {
    if (result.length >= maxCount) break;
    const nameLower = (feat.name || '').toLowerCase();
    addedNames.add(nameLower);

    // Find corresponding repo for live stats if available
    const liveRepo = repos.find(r => r.name.toLowerCase() === nameLower);

    result.push({
      name: feat.name,
      displayName: feat.displayName || feat.name.toUpperCase(),
      icon: feat.icon || '',
      description: feat.description || liveRepo?.description || 'Software engineering project',
      technologies: feat.technologies || (liveRepo?.topics?.length ? liveRepo.topics : [liveRepo?.language || 'JavaScript']),
      stars: liveRepo?.stars ?? 0,
      forks: liveRepo?.forks ?? 0,
      updatedAt: liveRepo?.updatedAt || new Date().toISOString(),
      repoUrl: feat.repoUrl || liveRepo?.htmlUrl || `https://github.com`,
      liveUrl: feat.liveUrl || liveRepo?.homepage || ''
    });
  }

  // 2. Score and select remaining automatic projects if capacity remains
  const scoredRepos = repos
    .filter(r => !addedNames.has(r.name.toLowerCase()) && !r.isFork && !r.isArchived)
    .map(r => ({ ...r, _score: calculateProjectScore(r) }))
    .sort((a, b) => b._score - a._score);

  for (const repo of scoredRepos) {
    if (result.length >= maxCount) break;

    const techList = [];
    if (repo.language && repo.language !== 'Plain Text') techList.push(repo.language);
    if (Array.isArray(repo.topics)) {
      techList.push(...repo.topics.slice(0, 3));
    }

    result.push({
      name: repo.name,
      displayName: repo.name.replace(/[-_]/g, ' ').toUpperCase(),
      icon: '',
      description: repo.description || 'Open source engineering project',
      technologies: techList.length > 0 ? techList : ['JavaScript'],
      stars: repo.stars,
      forks: repo.forks,
      updatedAt: repo.updatedAt,
      repoUrl: repo.htmlUrl,
      liveUrl: repo.homepage || ''
    });
  }

  return result;
}
