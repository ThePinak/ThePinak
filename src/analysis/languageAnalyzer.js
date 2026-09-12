/**
 * Repository Language Analyzer
 */

/**
 * Analyze language distribution from repositories.
 * @param {Array<Object>} repos
 * @returns {Array<{ language: string, count: number, percentage: number }>}
 */
export function analyzeLanguages(repos = []) {
  const languageCounts = {};
  let totalReposWithLang = 0;

  for (const repo of repos) {
    const lang = repo.language;
    if (lang && lang !== 'Plain Text') {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      totalReposWithLang += 1;
    }
  }

  if (totalReposWithLang === 0) {
    return [];
  }

  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalReposWithLang) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}
