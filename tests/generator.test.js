import test from 'node:test';
import assert from 'node:assert/strict';

import { createProgressBar, renderAsciiBox, padRight, formatRelativeTime } from '../src/utils/formatting.js';
import { injectGeneratedContent, START_MARKER, END_MARKER } from '../src/generator/template.js';
import { renderSections } from '../src/generator/readmeGenerator.js';

test('createProgressBar returns valid meter length', () => {
  const bar50 = createProgressBar(50, 10);
  assert.equal(bar50.length, 10);
  assert.equal(bar50, '█████░░░░░');

  const bar100 = createProgressBar(100, 10);
  assert.equal(bar100, '██████████');

  const bar0 = createProgressBar(0, 10);
  assert.equal(bar0, '░░░░░░░░░░');
});

test('renderAsciiBox creates uniform box with title', () => {
  const box = renderAsciiBox({
    title: 'TELEMETRY',
    lines: ['TEST LINE 1', 'TEST LINE 2'],
    width: 30,
    style: 'rounded'
  });

  const lines = box.split('\n');
  assert.ok(lines.length >= 4);
  assert.ok(lines[0].startsWith('╭'));
  assert.ok(lines[0].includes('TELEMETRY'));
  assert.ok(lines[lines.length - 1].startsWith('╰'));
});

test('injectGeneratedContent preserves content outside markers', () => {
  const original = `# Top Manual Content

${START_MARKER}
Old auto-generated stuff
${END_MARKER}

## Bottom Custom Section
- Hand-written note
`;

  const newStuff = 'NEW TELEMETRY ENGINE CONTENT';
  const result = injectGeneratedContent(original, newStuff);

  assert.ok(result.includes('# Top Manual Content'));
  assert.ok(result.includes('## Bottom Custom Section'));
  assert.ok(result.includes('- Hand-written note'));
  assert.ok(result.includes('NEW TELEMETRY ENGINE CONTENT'));
  assert.ok(!result.includes('Old auto-generated stuff'));
});

test('renderSections generates all core sections', () => {
  const mockConfig = {
    name: 'Pinak Thummar',
    headline: 'Software Engineer',
    currentMission: 'Build production software',
    interests: ['Systems', 'AI'],
    social: { github: 'https://github.com/pinakthummar' },
    settings: {}
  };

  const mockData = {
    profile: { username: 'pinakthummar', followers: 10 },
    telemetry: { publicRepositories: 10, originalProjects: 8, followers: 10, languages: 4, activeProjects: 3, recentCommits: 20 },
    dna: [{ category: 'Backend', count: 4, percentage: 60 }, { category: 'Frontend', count: 2, percentage: 40 }],
    featuredProjects: [{ name: 'proj1', description: 'desc', technologies: ['JS'], stars: 5, forks: 1 }],
    recentActivities: [{ summary: 'Pushed code', repository: 'proj1', timeAgo: '2h ago' }]
  };

  const markdown = renderSections(mockConfig, mockData);

  assert.ok(markdown.includes('PINAK.OS // DEVELOPER OPERATING SYSTEM'));
  assert.ok(markdown.includes('CURRENT MISSION'));
  assert.ok(markdown.includes('ENGINEERING DNA'));
  assert.ok(markdown.includes('DEVELOPER TELEMETRY'));
  assert.ok(markdown.includes('System Status       : ONLINE'));
});
