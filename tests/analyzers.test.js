import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateEngineeringDNA, detectRepoCategories } from '../src/analysis/techDetector.js';
import { calculateProjectScore, selectFeaturedProjects } from '../src/analysis/projectAnalyzer.js';
import { calculateTelemetry } from '../src/analysis/telemetry.js';
import { analyzeLanguages } from '../src/analysis/languageAnalyzer.js';
import { analyzeRecentActivity } from '../src/analysis/activityAnalyzer.js';

test('detectRepoCategories maps repositories accurately', () => {
  const repo1 = { name: 'finance-api', language: 'JavaScript', topics: ['express', 'backend', 'postgresql'] };
  const cats1 = detectRepoCategories(repo1);
  assert.ok(cats1.includes('Backend'), 'Should detect Backend');
  assert.ok(cats1.includes('Databases'), 'Should detect Databases');

  const repo2 = { name: 'ai-pipeline', language: 'Python', topics: ['machine-learning', 'pytorch'] };
  const cats2 = detectRepoCategories(repo2);
  assert.ok(cats2.includes('AI/ML'), 'Should detect AI/ML');
});

test('calculateEngineeringDNA computes percentage distribution', () => {
  const repos = [
    { name: 'repo1', language: 'JavaScript', topics: ['backend'] },
    { name: 'repo2', language: 'Python', topics: ['ai'] },
    { name: 'repo3', language: 'HTML', topics: ['frontend', 'react'] }
  ];

  const dna = calculateEngineeringDNA(repos);
  assert.ok(Array.isArray(dna));
  assert.ok(dna.length > 0);
  const totalPct = dna.reduce((sum, item) => sum + item.percentage, 0);
  assert.ok(totalPct > 80 && totalPct <= 105, `Percentages should sum close to 100%, got ${totalPct}`);
});

test('calculateProjectScore ranks active repositories with completeness higher', () => {
  const completeRepo = {
    stars: 10,
    forks: 2,
    updatedAt: new Date().toISOString(),
    description: 'A comprehensive production platform with full test coverage',
    homepage: 'https://example.com',
    topics: ['nodejs', 'express', 'database']
  };

  const emptyRepo = {
    stars: 0,
    forks: 0,
    updatedAt: '2020-01-01T00:00:00Z',
    description: '',
    homepage: '',
    topics: []
  };

  assert.ok(calculateProjectScore(completeRepo) > calculateProjectScore(emptyRepo));
});

test('calculateTelemetry calculates correct derived numbers', () => {
  const mockData = {
    profile: { publicRepos: 5, followers: 42, following: 10 },
    repositories: [
      { name: 'repo1', language: 'JavaScript', stars: 10, forks: 2, isFork: false, updatedAt: new Date().toISOString() },
      { name: 'repo2', language: 'Python', stars: 5, forks: 1, isFork: false, updatedAt: new Date().toISOString() },
      { name: 'repo3', language: 'JavaScript', stars: 0, forks: 0, isFork: true, updatedAt: '2020-01-01T00:00:00Z' }
    ],
    events: [
      { type: 'PushEvent', payload: { commits: [{ message: 'feat: add auth' }, { message: 'fix: typo' }] } },
      { type: 'PushEvent', payload: { size: 3 } }
    ]
  };

  const telemetry = calculateTelemetry(mockData);
  assert.equal(telemetry.originalProjects, 2);
  assert.equal(telemetry.followers, 42);
  assert.equal(telemetry.languages, 2);
  assert.equal(telemetry.totalStars, 15);
  assert.equal(telemetry.recentCommits, 5);
  assert.equal(telemetry.activeProjects, 2);
});

test('analyzeRecentActivity formats meaningful events cleanly', () => {
  const events = [
    {
      type: 'PushEvent',
      created_at: new Date().toISOString(),
      repo: { name: 'pinakthummar/pinak-os' },
      payload: { commits: [{ message: 'feat: implement telemetry engine' }] }
    },
    {
      type: 'CreateEvent',
      created_at: new Date().toISOString(),
      repo: { name: 'pinakthummar/new-project' },
      payload: { ref_type: 'repository' }
    }
  ];

  const activities = analyzeRecentActivity(events, 5);
  assert.equal(activities.length, 2);
  assert.equal(activities[0].repository, 'pinak-os');
  assert.equal(activities[0].summary, 'feat: implement telemetry engine');
  assert.equal(activities[1].type, 'Create');
});
