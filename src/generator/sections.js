/**
 * Markdown Section Builders for PINAK.OS
 * Apple Cupertino Aesthetic: Clean, light/white theme, perfectly organized, elegant typography.
 */

import { formatUtcDateTime } from '../utils/formatting.js';

/**
 * 1. Hero Header (Apple Minimalist Typography)
 */
export function buildHeroSection(profileConfig) {
  const name = profileConfig.name || 'Pinak Thummar';
  const headline = profileConfig.headline || 'Software Engineer';
  const tagline = profileConfig.tagline || 'Build → Learn → Ship → Improve';
  const bio = profileConfig.bio || 'Intelligence Thrives in isolation.';

  const links = [];
  if (profileConfig.social?.github) {
    links.push(`[GitHub ↗](${profileConfig.social.github})`);
  }
  if (profileConfig.social?.linkedin) {
    links.push(`[LinkedIn ↗](${profileConfig.social.linkedin})`);
  }
  if (profileConfig.social?.portfolio) {
    links.push(`[Portfolio ↗](${profileConfig.social.portfolio})`);
  }
  if (profileConfig.social?.email) {
    links.push(`[Email ↗](mailto:${profileConfig.social.email})`);
  }

  const linksRow = links.join('&nbsp;&nbsp;•&nbsp;&nbsp;');

  return `<div align="center">

# ${name}

### ${headline}

_${bio}_

<br/>

${linksRow}

</div>

---`;
}

/**
 * 2. Overview / Capabilities (3-Column Minimalist Grid)
 */
export function buildCapabilitiesSection(profileConfig) {
  return `### Architecture & Focus

<table>
  <tr>
    <td width="33%" align="left" valign="top">
      <h4>Backend & Systems</h4>
      <p>Architecting scalable server-side systems, RESTful APIs, and distributed database models.</p>
    </td>
    <td width="33%" align="left" valign="top">
      <h4>Machine Learning</h4>
      <p>Exploring intelligent architectures, applied machine learning, and data pipelines.</p>
    </td>
    <td width="33%" align="left" valign="top">
      <h4>Automation & Tooling</h4>
      <p>Building automated CI/CD workflows, developer tools, and telemetry engines.</p>
    </td>
  </tr>
</table>`;
}

/**
 * 3. Ecosystem & Tech Stack
 */
export function buildTechStackSection(profileData) {
  const defaultStack = ['TypeScript', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'React', 'Git', 'Docker'];
  const detectedLangs = profileData.languages?.map(l => l.language) || [];
  const combined = Array.from(new Set([...detectedLangs, ...defaultStack]));

  const pills = combined.map(tech => `\`${tech}\``).join(' &nbsp; ');

  return `### Ecosystem & Stack

${pills}`;
}

/**
 * 4. Telemetry Metrics (Apple Clean KPI Cards)
 */
export function buildTelemetrySection(telemetry) {
  const publicRepos = telemetry.publicRepositories ?? 0;
  const originalProjects = telemetry.originalProjects ?? 0;
  const followers = telemetry.followers ?? 0;
  const recentCommits = telemetry.recentCommits ?? 0;

  return `### Developer Telemetry

<table>
  <tr>
    <td align="center" width="25%">
      <sub>PUBLIC REPOSITORIES</sub><br/>
      <h2>${publicRepos}</h2>
      <sub>${originalProjects} Original</sub>
    </td>
    <td align="center" width="25%">
      <sub>FOLLOWERS</sub><br/>
      <h2>${followers}</h2>
      <sub>Network</sub>
    </td>
    <td align="center" width="25%">
      <sub>RECENT COMMITS</sub><br/>
      <h2>${recentCommits}</h2>
      <sub>Event Velocity</sub>
    </td>
    <td align="center" width="25%">
      <sub>SYSTEM STATUS</sub><br/>
      <h2>Online</h2>
      <sub>Automated Sync</sub>
    </td>
  </tr>
</table>`;
}

/**
 * 5. Current Focus / Mission
 */
export function buildCurrentMissionSection(profileConfig) {
  const learning = profileConfig.currentlyLearning || [];
  const building = profileConfig.currentlyBuilding || [];
  const mission = profileConfig.currentMission || 'Better than yesterday';

  const lines = [];
  lines.push(`- **Mission**: ${mission}`);
  if (learning.length > 0) {
    lines.push(`- **Exploring**: ${learning.join(', ')}`);
  }
  if (building.length > 0) {
    lines.push(`- **Building**: ${building.join(', ')}`);
  }

  return `### Current Trajectory

${lines.join('\n')}`;
}

/**
 * 6. Recent Engineering Activity
 */
export function buildRecentActivitySection(activities = []) {
  if (!activities || activities.length === 0) {
    return '';
  }

  const items = activities.slice(0, 5).map(act => {
    return `- **${act.repository}** — ${act.summary} _(${act.timeAgo})_`;
  });

  return `### Recent Activity

${items.join('\n')}`;
}

/**
 * 7. Footer
 */
export function buildFooterSection() {
  const timestamp = formatUtcDateTime();

  return `---

<div align="center">
  <sub>Designed with precision. Automatically updated via GitHub Actions • ${timestamp}</sub>
</div>`;
}
