/**
 * Activity Stream Analyzer
 */

import { formatRelativeTime } from '../utils/formatting.js';

/**
 * Filter and format raw GitHub events into clean human-readable activity items.
 * @param {Array<Object>} events
 * @param {number} [limit=5]
 * @returns {Array<{ summary: string, repository: string, timeAgo: string, date: string, type: string }>}
 */
export function analyzeRecentActivity(events = [], limit = 5) {
  const meaningfulActivities = [];

  for (const event of events) {
    if (meaningfulActivities.length >= limit) break;

    const repoName = (event.repo?.name || '').replace(/^[^/]+\//, '');
    const createdAt = event.created_at;
    const timeAgo = formatRelativeTime(createdAt);

    switch (event.type) {
      case 'PushEvent': {
        const commits = event.payload?.commits || [];
        const commitMsg = commits[0]?.message ? commits[0].message.split('\n')[0] : 'Updated codebase';
        meaningfulActivities.push({
          summary: commitMsg.length > 55 ? `${commitMsg.substring(0, 52)}...` : commitMsg,
          repository: repoName || 'Repository',
          timeAgo,
          date: createdAt,
          type: 'Push'
        });
        break;
      }

      case 'CreateEvent': {
        if (event.payload?.ref_type === 'repository') {
          meaningfulActivities.push({
            summary: 'Created new repository',
            repository: repoName,
            timeAgo,
            date: createdAt,
            type: 'Create'
          });
        } else if (event.payload?.ref_type === 'tag') {
          meaningfulActivities.push({
            summary: `Created tag ${event.payload?.ref || ''}`,
            repository: repoName,
            timeAgo,
            date: createdAt,
            type: 'Tag'
          });
        }
        break;
      }

      case 'ReleaseEvent': {
        meaningfulActivities.push({
          summary: `Shipped release ${event.payload?.release?.name || event.payload?.release?.tag_name || 'new release'}`,
          repository: repoName,
          timeAgo,
          date: createdAt,
          type: 'Release'
        });
        break;
      }

      case 'PullRequestEvent': {
        const action = event.payload?.action || 'updated';
        const title = event.payload?.pull_request?.title || 'Pull Request';
        meaningfulActivities.push({
          summary: `${action.charAt(0).toUpperCase() + action.slice(1)} PR: ${title}`,
          repository: repoName,
          timeAgo,
          date: createdAt,
          type: 'PR'
        });
        break;
      }

      case 'IssuesEvent': {
        const action = event.payload?.action || 'updated';
        meaningfulActivities.push({
          summary: `${action.charAt(0).toUpperCase() + action.slice(1)} issue: ${event.payload?.issue?.title || 'Issue'}`,
          repository: repoName,
          timeAgo,
          date: createdAt,
          type: 'Issue'
        });
        break;
      }

      default:
        // Ignore noise like WatchEvent, StarEvent for recent activity stream
        break;
    }
  }

  return meaningfulActivities;
}
