/**
 * Markdown Section Builders for PINAK.OS
 * Fastfetch / Neofetch System Information UI Style
 */

import {
  renderDottedLine,
  renderSectionDivider,
  renderDualDottedLine,
  formatUtcDateTime
} from '../utils/formatting.js';

/**
 * 1. Hero Header
 */
export function buildHeroSection(profileConfig, profileData) {
  const name = (profileConfig.name || 'Developer').toUpperCase();
  const headline = (profileConfig.headline || 'Software Engineer').toUpperCase();
  const tagline = profileConfig.tagline || 'Build → Learn → Ship → Improve';
  const bio = profileConfig.bio || '';

  const badges = [];
  if (profileConfig.social?.github) {
    badges.push(`[![GitHub](https://img.shields.io/badge/GitHub-0D1117?style=flat-square&logo=github&logoColor=white)](${profileConfig.social.github})`);
  }
  if (profileConfig.social?.linkedin) {
    badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](${profileConfig.social.linkedin})`);
  }
  if (profileConfig.social?.portfolio) {
    badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-0D1117?style=flat-square&logo=googlechrome&logoColor=white)](${profileConfig.social.portfolio})`);
  }
  if (profileConfig.social?.email) {
    badges.push(`[![Email](https://img.shields.io/badge/Email-0D1117?style=flat-square&logo=gmail&logoColor=white)](mailto:${profileConfig.social.email})`);
  }

  // System status badge
  badges.push(`![Status](https://img.shields.io/badge/System-ONLINE-161B22?style=flat-square&logo=gnubash&logoColor=white)`);

  const badgesRow = badges.join('&nbsp;&nbsp;');

  return `<div align="center">

# \`${name}\`
### \`PINAK.OS // ${headline}\`

> **\`${tagline}\`**

${bio ? `_${bio}_\n` : ''}
${badgesRow}

</div>

---`;
}

/**
 * 2. Main Neofetch / System Info Terminal Card
 */
export function buildNeofetchTerminalSection(profileConfig, profileData, totalWidth = 72) {
  const sys = profileConfig.systemInfo || {};
  const sysHeader = profileConfig.systemName || `${(profileConfig.username || 'user').toLowerCase()}@host`;
  const dashesCount = Math.max(2, totalWidth - sysHeader.length - 1);
  const headerLine = `${sysHeader} ${'-'.repeat(dashesCount)}`;

  const lines = [headerLine];

  // OS & System Info
  lines.push(renderDottedLine('OS', sys.os || 'Windows 11, Linux', totalWidth));
  lines.push(renderDottedLine('Uptime', sys.uptime || '20 years, 5 months', totalWidth));
  lines.push(renderDottedLine('Host', sys.host || 'Software Engineering Lab', totalWidth));
  lines.push(renderDottedLine('Kernel', sys.kernel || profileConfig.headline || 'Software Engineer', totalWidth));
  lines.push(renderDottedLine('IDE', sys.ide || 'VS Code, Neovim', totalWidth));
  lines.push('.');

  // Languages
  const progLangs = (profileData.languages && profileData.languages.length > 0)
    ? profileData.languages.map(l => l.language).join(', ')
    : 'JavaScript, TypeScript, Python, C++';
  lines.push(renderDottedLine('Languages.Programming', progLangs, totalWidth));
  if (sys.languagesComputer) {
    lines.push(renderDottedLine('Languages.Computer', sys.languagesComputer, totalWidth));
  }
  if (sys.languagesReal) {
    lines.push(renderDottedLine('Languages.Real', sys.languagesReal, totalWidth));
  }
  lines.push('.');

  // Focus & Hobbies
  const primaryFocus = profileConfig.interests?.slice(0, 2).join(', ') || 'Backend Engineering, System Design';
  const currentLearning = profileConfig.currentlyLearning?.join(', ') || 'Machine Learning, System Design';
  lines.push(renderDottedLine('Focus.Primary', primaryFocus, totalWidth));
  lines.push(renderDottedLine('Focus.Exploring', currentLearning, totalWidth));
  if (sys.hobbiesSoftware) {
    lines.push(renderDottedLine('Hobbies.Software', sys.hobbiesSoftware, totalWidth));
  }
  if (sys.hobbiesHardware) {
    lines.push(renderDottedLine('Hobbies.Hardware', sys.hobbiesHardware, totalWidth));
  }

  // Contact
  lines.push(renderSectionDivider('Contact', totalWidth));
  if (profileConfig.social?.email) {
    lines.push(renderDottedLine('Email.Personal', profileConfig.social.email, totalWidth));
  }
  if (profileConfig.social?.linkedin) {
    const handle = profileConfig.social.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
    lines.push(renderDottedLine('LinkedIn', handle, totalWidth));
  }
  if (profileConfig.social?.github || profileConfig.username) {
    const gh = profileConfig.username || profileConfig.social?.github;
    lines.push(renderDottedLine('GitHub', gh, totalWidth));
  }
  if (profileConfig.social?.portfolio) {
    const port = profileConfig.social.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, '');
    lines.push(renderDottedLine('Portfolio', port, totalWidth));
  }

  // GitHub Stats
  const tel = profileData.telemetry || {};
  lines.push(renderSectionDivider('GitHub Stats', totalWidth));

  const reposVal = `${tel.publicRepositories ?? 0} {Contributed: ${tel.originalProjects ?? 0}}`;
  const starsVal = `${tel.totalStars ?? 0}`;
  lines.push(renderDualDottedLine('Repos', reposVal, 'Stars', starsVal, totalWidth));

  const commitsVal = `${tel.recentCommits ?? 0}`;
  const followersVal = `${tel.followers ?? 0}`;
  lines.push(renderDualDottedLine('Commits', commitsVal, 'Followers', followersVal, totalWidth));

  const langsCount = `${tel.languages ?? 2}`;
  const activeCount = `${tel.activeProjects ?? 0}`;
  lines.push(renderDualDottedLine('Languages', langsCount, 'Active Repos (90d)', activeCount, totalWidth));

  return `\`\`\`text
${lines.join('\n')}
\`\`\``;
}

/**
 * 3. Recent Activity Section
 */
export function buildRecentActivitySection(activities = []) {
  if (!activities || activities.length === 0) {
    return '';
  }

  const lines = activities.slice(0, 5).map(act => {
    return `* [ ${act.repository} ] ${act.timeAgo} — ${act.summary}`;
  });

  return `### \`[ RECENT ACTIVITY ]\`

\`\`\`text
${lines.join('\n')}
\`\`\``;
}

/**
 * 4. Footer Section
 */
export function buildFooterSection() {
  const timestamp = formatUtcDateTime();

  return `---

<div align="center">

\`\`\`text
────────────────────────────────────────────────────────────────────────────
PINAK.OS // AUTOMATED DEVELOPER TELEMETRY ENGINE
SYSTEM STATUS: ONLINE  |  NODE.JS v20  |  LAST SYNC: ${timestamp}
────────────────────────────────────────────────────────────────────────────
\`\`\`

</div>`;
}
