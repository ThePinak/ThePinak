/**
 * Markdown Section Builders for PINAK.OS
 * Sleek Minimalist Engineer Aesthetic (Dark-mode monochrome, capsule badges, high-density telemetry)
 */

import {
  createProgressBar,
  renderAsciiBox,
  padRight,
  formatUtcDateTime
} from '../utils/formatting.js';

/**
 * 1. Hero / Identity Section
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
 * 2. Current Mission Section
 */
export function buildMissionSection(profileConfig, index = '01') {
  const mission = profileConfig.currentMission || 'BETTER THAN YESTERDAY';
  const learning = profileConfig.currentlyLearning || [];
  const building = profileConfig.currentlyBuilding || [];

  const boxLines = [
    '',
    `   ${mission.toUpperCase()}`
  ];

  if (learning.length > 0) {
    boxLines.push('');
    boxLines.push('   CURRENTLY EXPLORING:');
    for (const item of learning) {
      boxLines.push(`   -> ${item}`);
    }
  }

  if (building.length > 0) {
    boxLines.push('');
    boxLines.push('   CURRENTLY BUILDING:');
    for (const b of building) {
      boxLines.push(`   -> ${b}`);
    }
  }
  boxLines.push('');

  const asciiCard = renderAsciiBox({
    title: 'CURRENT MISSION',
    lines: boxLines,
    width: 54,
    style: 'double'
  });

  return `### \`[ ${index} // MISSION CONTROL ]\`

\`\`\`text
${asciiCard}
\`\`\``;
}

/**
 * 3. Terminal Interface Simulation Section
 */
export function buildTerminalSection(profileConfig, featuredProjects = [], index = '02') {
  const whoami = profileConfig.name || profileConfig.username || 'Developer';
  const mission = profileConfig.currentMission || 'Better than yesterday';
  const interests = (profileConfig.interests && profileConfig.interests.length > 0)
    ? profileConfig.interests.join('\n')
    : 'Software Engineering\nSystem Design';
  const projectList = featuredProjects.map(p => p.name).slice(0, 4).join('\n');

  return `### \`[ ${index} // TERMINAL SESSION ]\`

\`\`\`bash
$ whoami
${whoami}

$ current-mission
${mission}

$ focus
${interests}

$ ls projects/
${projectList || 'projects'}

$ _
\`\`\``;
}

/**
 * 4. Engineering DNA Section
 */
export function buildEngineeringDnaSection(dnaList, index = '03') {
  const rows = dnaList.map(item => {
    const categoryName = padRight(item.category.toUpperCase(), 16);
    const bar = createProgressBar(item.percentage, 18);
    const pct = `${item.percentage}%`.padStart(4, ' ');
    let tag = '';
    if (item.percentage >= 40) tag = ' [ PRIMARY FOCUS ]';
    else if (item.percentage >= 15) tag = ' [ ACTIVE DOMAIN ]';
    else tag = ' [ INTEGRATED ]';
    return `${categoryName} ${bar}  ${pct} ${tag}`;
  });

  return `### \`[ ${index} // ENGINEERING DNA ]\`

\`\`\`text
${rows.join('\n')}
\`\`\`

> *Note: DNA represents the distribution of technologies and engineering domains across public work — not a measure of expertise.*`;
}

/**
 * 5. Developer Telemetry Section
 */
export function buildTelemetrySection(telemetry, index = '04') {
  const publicRepos = telemetry.publicRepositories ?? 0;
  const originalProjects = telemetry.originalProjects ?? 0;
  const followers = telemetry.followers ?? 0;
  const languages = telemetry.languages ?? 0;
  const activeProjects = telemetry.activeProjects ?? 0;
  const recentCommits = telemetry.recentCommits ?? 0;

  return `### \`[ ${index} // DEVELOPER TELEMETRY ]\`

| Metric | Telemetry Count | Operational Scope |
| :--- | :---: | :--- |
| **Public Repositories** | \`${publicRepos}\` | Verified GitHub Artifacts |
| **Original Projects** | \`${originalProjects}\` | Non-Fork Codebases |
| **Followers** | \`${followers}\` | Developer Network |
| **Primary Languages** | \`${languages}\` | Active Polyglot Stack |
| **Active Projects (90d)** | \`${activeProjects}\` | Continuous Engineering |
| **Recent Commit Cadence** | \`${recentCommits}\` | Event Velocity |`;
}

/**
 * 6. Featured Projects Section
 */
export function buildFeaturedProjectsSection(projects = [], index = '05') {
  if (!projects || projects.length === 0) {
    return '';
  }

  const cards = projects.map(proj => {
    const techBadges = Array.isArray(proj.technologies)
      ? proj.technologies.map(t => `\`${t}\``).join(' ')
      : `\`${proj.technologies || 'JavaScript'}\``;

    const starsPill = `⭐ \`${proj.stars || 0}\``;
    const forksPill = `⑂ \`${proj.forks || 0}\``;

    const actionLinks = [];
    if (proj.repoUrl) actionLinks.push(`[**View Codebase ↗**](${proj.repoUrl})`);
    if (proj.liveUrl) actionLinks.push(`[**Live Deployment ↗**](${proj.liveUrl})`);
    const linksRow = actionLinks.join('&nbsp;&nbsp;|&nbsp;&nbsp;');

    return `
<table>
  <tr>
    <td>
      <strong><code>${proj.displayName || proj.name.toUpperCase()}</code></strong> &nbsp;&nbsp; ${starsPill} &nbsp; ${forksPill}
      <br/><br/>
      ${proj.description || 'Software engineering project.'}
      <br/><br/>
      <strong>Stack:</strong> ${techBadges}
      <br/><br/>
      ${linksRow}
    </td>
  </tr>
</table>`;
  });

  return `### \`[ ${index} // FEATURED PROJECTS ]\`

${cards.join('\n')}`;
}

/**
 * 7. Recent Activity Section
 */
export function buildRecentActivitySection(activities = [], index = '05') {
  if (!activities || activities.length === 0) {
    return `### \`[ ${index} // RECENT ACTIVITY ]\`

\`\`\`text
* Regular engineering activity across public repositories
\`\`\``;
  }

  const lines = activities.map(act => {
    const repoPadded = padRight(`[ ${act.repository} ]`, 28);
    const timePadded = padRight(act.timeAgo, 14);
    return `${repoPadded} ${timePadded} ${act.summary}`;
  });

  return `### \`[ ${index} // RECENT ACTIVITY ]\`

\`\`\`text
${lines.join('\n')}
\`\`\``;
}

/**
 * 8. Engineering Philosophy Section (optional)
 */
export function buildPhilosophySection(profileConfig) {
  const items = profileConfig.engineeringPhilosophy || [
    'Understand before implementing.',
    'Prefer simple systems that solve real problems.',
    'Design for maintainability.',
    'Learn by building.',
    'Ship, measure, improve.'
  ];

  const formatted = items.map((item, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    return `${num} — ${item}`;
  });

  return `### \`[ 07 // ENGINEERING PHILOSOPHY ]\`

\`\`\`text
${formatted.join('\n')}
\`\`\``;
}

/**
 * 9. System Architecture Section (optional)
 */
export function buildArchitectureSection() {
  return `### \`[ 08 // SYSTEM ARCHITECTURE ]\`

\`\`\`text
                    GitHub API
                         │
                         ▼
                 Data Collection
                         │
                         ▼
                    Analysis
                 ┌───────┼───────┐
                 ▼       ▼       ▼
              Projects Skills Telemetry
                 │       │       │
                 └───────┼───────┘
                         ▼
                  README Generator
                         │
                         ▼
                     README.md
\`\`\``;
}

/**
 * 10. Footer Section
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
