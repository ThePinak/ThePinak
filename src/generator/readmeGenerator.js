/**
 * README Orchestrator & Generator Engine
 */

import fs from 'node:fs';
import path from 'node:path';
import { fetchUserProfile } from '../github/profile.js';
import { fetchUserRepositories } from '../github/repositories.js';
import { fetchUserActivity } from '../github/activity.js';
import { calculateEngineeringDNA } from '../analysis/techDetector.js';
import { calculateTelemetry } from '../analysis/telemetry.js';
import { selectFeaturedProjects } from '../analysis/projectAnalyzer.js';
import { analyzeRecentActivity } from '../analysis/activityAnalyzer.js';
import { analyzeLanguages } from '../analysis/languageAnalyzer.js';
import { injectGeneratedContent } from './template.js';
import { validateGeneratedMarkdown, validateProfileConfig } from '../utils/validation.js';
import { logger } from '../utils/logger.js';

import {
  buildHeroSection,
  buildCapabilitiesSection,
  buildTechStackSection,
  buildTelemetrySection,
  buildCurrentMissionSection,
  buildRecentActivitySection,
  buildFooterSection
} from './sections.js';

/**
 * Load profile configuration file.
 */
export function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'config/profile.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf-8');
  // Strip single line and multi-line comments for user convenience
  const cleanJson = raw
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
    .trim();
  return JSON.parse(cleanJson);
}

/**
 * Collect, analyze, and generate profile state.
 * @param {Object} [options]
 * @param {string} [options.username]
 * @param {string} [options.token]
 */
export async function collectAndAnalyzeData(options = {}) {
  const config = loadConfig();
  const configValidation = validateProfileConfig(config);
  if (!configValidation.valid) {
    throw new Error(`Invalid profile configuration:\n${configValidation.errors.join('\n')}`);
  }

  const username = options.username || process.env.GITHUB_USERNAME || config.username;
  const token = options.token || process.env.GITHUB_TOKEN;

  if (!username || username === 'YOUR_GITHUB_USERNAME') {
    throw new Error('Please set GITHUB_USERNAME in environment or config/profile.json');
  }

  logger.info(`Collecting GitHub data for user: ${username}`);

  let profile = {};
  let repositories = [];
  let events = [];

  try {
    profile = await fetchUserProfile(username, { token });
  } catch (err) {
    logger.warn(`Could not fetch profile: ${err.message}`);
    profile = { username, publicRepos: 0, followers: 0, following: 0 };
  }

  try {
    const excludeForks = config.settings?.excludeForks ?? true;
    repositories = await fetchUserRepositories(username, { token, excludeForks });
  } catch (err) {
    logger.warn(`Could not fetch repositories: ${err.message}`);
    repositories = [];
  }

  try {
    events = await fetchUserActivity(username, { token });
  } catch (err) {
    logger.warn(`Could not fetch public activity: ${err.message}`);
    events = [];
  }

  logger.info(`Analyzing data (Found ${repositories.length} repos, ${events.length} events)...`);

  const dna = calculateEngineeringDNA(repositories);
  const telemetry = calculateTelemetry({ profile, repositories, events });
  const languages = analyzeLanguages(repositories);
  const maxFeatured = config.settings?.maxFeaturedProjects ?? 6;
  const featuredProjects = selectFeaturedProjects(repositories, config.featuredRepositories, maxFeatured);
  const maxActivities = config.settings?.maxRecentActivities ?? 5;
  const recentActivities = analyzeRecentActivity(events, maxActivities);

  const normalizedData = {
    generatedAt: new Date().toISOString(),
    profile,
    telemetry,
    dna,
    languages,
    featuredProjects,
    recentActivities
  };

  // Save intermediate snapshot to generated/profile-data.json
  const generatedDir = path.resolve(process.cwd(), 'generated');
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(generatedDir, 'profile-data.json'),
    JSON.stringify(normalizedData, null, 2),
    'utf-8'
  );

  return { config, data: normalizedData };
}

/**
 * Render all markdown sections from collected data.
 * @param {Object} config
 * @param {Object} data
 * @returns {string}
 */
export function renderSections(config, data) {
  const sections = [];
  const settings = config.settings || {};

  // 1. Hero
  sections.push(buildHeroSection(config));

  // 2. Architecture & Capabilities Grid
  sections.push(buildCapabilitiesSection(config));

  // 3. Tech Stack & Ecosystem
  sections.push(buildTechStackSection(data));

  // 4. Developer Telemetry Metrics
  if (settings.showTelemetry !== false) {
    sections.push(buildTelemetrySection(data.telemetry));
  }

  // 5. Current Trajectory
  sections.push(buildCurrentMissionSection(config));

  // 6. Recent Activity
  if (settings.showRecentActivity !== false && data.recentActivities?.length > 0) {
    const act = buildRecentActivitySection(data.recentActivities);
    if (act) sections.push(act);
  }

  // 7. Footer
  sections.push(buildFooterSection());

  return sections.join('\n\n');
}

/**
 * Generate and write the complete README file.
 * @param {Object} [options]
 * @param {string} [options.targetFile]
 * @param {string} [options.templateFile]
 */
export async function generateReadme(options = {}) {
  const targetFile = path.resolve(process.cwd(), options.targetFile || 'README.md');
  const templateFile = path.resolve(process.cwd(), options.templateFile || 'templates/profile.md');

  const { config, data } = await collectAndAnalyzeData(options);
  const generatedMarkdown = renderSections(config, data);

  // Read template or existing file
  let baseContent = '';
  if (fs.existsSync(targetFile)) {
    baseContent = fs.readFileSync(targetFile, 'utf-8');
  } else if (fs.existsSync(templateFile)) {
    baseContent = fs.readFileSync(templateFile, 'utf-8');
  }

  const finalContent = injectGeneratedContent(baseContent, generatedMarkdown);

  // Validate security & markers
  const activeToken = process.env.GITHUB_TOKEN;
  const validation = validateGeneratedMarkdown(finalContent, [activeToken]);
  if (!validation.valid) {
    throw new Error(`Validation failed before write:\n${validation.errors.join('\n')}`);
  }

  fs.writeFileSync(targetFile, finalContent, 'utf-8');
  logger.success(`README successfully generated & updated at ${targetFile}`);

  return { targetFile, finalContent, data };
}
