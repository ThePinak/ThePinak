/**
 * Markdown Section Builders for PINAK.OS (Clean Terminal Aesthetic, No Emojis)
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
  const name = profileConfig.name || 'Developer';
  const tagline = profileConfig.tagline || 'Build → Learn → Ship → Improve';
  const bio = profileConfig.bio || '';

  const socialLinks = [];
  if (profileConfig.social?.github) socialLinks.push(`[GitHub](${profileConfig.social.github})`);
  if (profileConfig.social?.linkedin) socialLinks.push(`[LinkedIn](${profileConfig.social.linkedin})`);
  if (profileConfig.social?.portfolio) socialLinks.push(`[Portfolio](${profileConfig.social.portfolio})`);
  if (profileConfig.social?.email) socialLinks.push(`[Email](mailto:${profileConfig.social.email})`);

  const linksRow = socialLinks.length > 0 ? socialLinks.join(' | ') : '';

  return `# ${name.toUpperCase()}

### \`PINAK.OS // DEVELOPER OPERATING SYSTEM\`

> **\`${tagline}\`**

${bio ? `${bio}\n` : ''}
${linksRow ? `${linksRow}\n` : ''}
---`;
}

/**
 * 2. Current Mission Section
 */
export function buildMissionSection(profileConfig) {
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
    width: 52,
    style: 'double'
  });

  return `\`\`\`text
${asciiCard}
\`\`\``;
}

/**
 * 3. Terminal Interface Simulation Section
 */
export function buildTerminalSection(profileConfig, featuredProjects = []) {
  const whoami = profileConfig.name || profileConfig.username || 'Developer';
  const mission = profileConfig.currentMission || 'Better than yesterday';
  const interests = (profileConfig.interests && profileConfig.interests.length > 0)
    ? profileConfig.interests.join('\n')
    : 'Software Engineering\nSystem Design';
  const projectList = featuredProjects.map(p => p.name).slice(0, 4).join('\n');

  return `\`\`\`bash
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
export function buildEngineeringDnaSection(dnaList) {
  const rows = dnaList.map(item => {
    const categoryName = padRight(item.category, 18);
    const bar = createProgressBar(item.percentage, 16);
    const pct = `${item.percentage}%`.padStart(4, ' ');
    return `${categoryName} ${bar}  ${pct}`;
  });

  return `### ENGINEERING DNA

\`\`\`text
${rows.join('\n')}
\`\`\`

> *DNA represents the distribution of technologies and engineering domains across my public work — not a measure of expertise.*`;
}

/**
 * 5. Developer Telemetry Section
 */
export function buildTelemetrySection(telemetry) {
  const metrics = [
    ['PUBLIC REPOSITORIES', telemetry.publicRepositories ?? 0],
    ['ORIGINAL PROJECTS', telemetry.originalProjects ?? 0],
    ['FOLLOWERS', telemetry.followers ?? 0],
    ['LANGUAGES', telemetry.languages ?? 0],
    ['ACTIVE PROJECTS', telemetry.activeProjects ?? 0],
    ['RECENT COMMITS', telemetry.recentCommits ?? 0]
  ];

  const lines = [''];
  for (const [label, val] of metrics) {
    const paddedLabel = padRight(`  ${label}`, 34);
    const paddedVal = String(val).padStart(6, ' ');
    lines.push(`${paddedLabel}${paddedVal}`);
  }
  lines.push('');

  const box = renderAsciiBox({
    title: 'DEVELOPER TELEMETRY',
    lines,
    width: 48,
    style: 'rounded'
  });

  return `### DEVELOPER TELEMETRY

\`\`\`text
${box}
\`\`\``;
}

/**
 * 6. Featured Projects Section
 */
export function buildFeaturedProjectsSection(projects = []) {
  if (!projects || projects.length === 0) {
    return '';
  }

  const cards = projects.map(proj => {
    const techStack = Array.isArray(proj.technologies)
      ? proj.technologies.join(' · ')
      : proj.technologies || '';

    const lines = [
      `[PROJECT] ${proj.displayName || proj.name.toUpperCase()}`,
      '',
      proj.description || 'Software engineering project',
      '',
      techStack ? `${techStack}` : '',
      '',
      `Stars: ${proj.stars || 0}   |   Forks: ${proj.forks || 0}`
    ].filter((_, idx) => idx !== 4 || techStack.length > 0);

    const asciiBox = renderAsciiBox({
      title: '',
      lines,
      width: 52,
      style: 'single'
    });

    const repoLink = proj.repoUrl ? `[View Repository](${proj.repoUrl})` : '';
    const liveLink = proj.liveUrl ? `[Live Demo](${proj.liveUrl})` : '';
    const links = [repoLink, liveLink].filter(Boolean).join('  |  ');

    return `\`\`\`text
${asciiBox}
\`\`\`
${links ? `↳ ${links}\n` : ''}`;
  });

  return `### FEATURED PROJECTS

${cards.join('\n')}`;
}

/**
 * 7. Recent Activity Section
 */
export function buildRecentActivitySection(activities = []) {
  if (!activities || activities.length === 0) {
    return `### RECENT ACTIVITY

\`\`\`text
* Pushed regular updates to active repositories
  System
  Recently
\`\`\``;
  }

  const lines = activities.map(act => {
    return `* ${act.summary}\n  ${act.repository}\n  ${act.timeAgo}`;
  });

  return `### RECENT ACTIVITY

\`\`\`text
${lines.join('\n\n')}
\`\`\``;
}

/**
 * 8. Engineering Philosophy Section
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

  return `### ENGINEERING PHILOSOPHY

\`\`\`text
${formatted.join('\n')}
\`\`\``;
}

/**
 * 9. System Architecture Section
 */
export function buildArchitectureSection() {
  return `### SYSTEM ARCHITECTURE

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
\`\`\`

> *This profile is dynamically synchronized using PINAK.OS via GitHub Actions automation.*`;
}

/**
 * 10. Contact / Footer Section
 */
export function buildFooterSection() {
  const timestamp = formatUtcDateTime();

  return `---

\`\`\`text
────────────────────────────────────────────────────────────
PINAK.OS // Automated Profile Sync System
Build → Learn → Ship → Improve

Last Telemetry Sync : ${timestamp}
System Status       : ONLINE
────────────────────────────────────────────────────────────
\`\`\``;
}
