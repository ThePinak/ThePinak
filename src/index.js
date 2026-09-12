#!/usr/bin/env node

/**
 * PINAK.OS Command-Line Interface (CLI)
 */

import fs from 'node:fs';
import path from 'node:path';
import { generateReadme, collectAndAnalyzeData } from './generator/readmeGenerator.js';
import { validateGeneratedMarkdown, validateProfileConfig } from './utils/validation.js';
import { loadConfig } from './generator/readmeGenerator.js';
import { logger } from './utils/logger.js';

// Load .env if present without external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const args = process.argv.slice(2);
const command = args[0] || 'generate';

async function main() {
  try {
    switch (command) {
      case 'generate': {
        logger.header('PINAK.OS — GENERATING PROFILE README');
        await generateReadme({ targetFile: 'README.md' });
        break;
      }

      case 'preview': {
        logger.header('PINAK.OS — GENERATING LOCAL PREVIEW');
        const previewPath = 'preview-README.md';
        await generateReadme({ targetFile: previewPath });
        logger.info(`Preview saved to ${previewPath}. Open to inspect Markdown.`);
        break;
      }

      case 'analyze': {
        logger.header('PINAK.OS — ANALYZING GITHUB TELEMETRY');
        const { data } = await collectAndAnalyzeData();
        console.log('\n--- TELEMETRY METRICS ---');
        console.log(JSON.stringify(data.telemetry, null, 2));
        console.log('\n--- ENGINEERING DNA ---');
        console.log(JSON.stringify(data.dna, null, 2));
        console.log('\n--- FEATURED PROJECTS ---');
        console.log(JSON.stringify(data.featuredProjects.map(p => ({ name: p.name, stars: p.stars })), null, 2));
        logger.success('Analysis complete. Intermediate data saved in generated/profile-data.json');
        break;
      }

      case 'validate': {
        logger.header('PINAK.OS — VALIDATING CONFIG & ARTIFACTS');
        const config = loadConfig();
        const configVal = validateProfileConfig(config);
        if (!configVal.valid) {
          logger.error('Configuration validation failed:');
          configVal.errors.forEach(e => console.error(`  - ${e}`));
          process.exit(1);
        }
        logger.success('Profile configuration is valid.');

        const targetReadme = path.resolve(process.cwd(), 'README.md');
        if (fs.existsSync(targetReadme)) {
          const content = fs.readFileSync(targetReadme, 'utf-8');
          const contentVal = validateGeneratedMarkdown(content, [process.env.GITHUB_TOKEN]);
          if (!contentVal.valid) {
            logger.error('README.md validation failed:');
            contentVal.errors.forEach(e => console.error(`  - ${e}`));
            process.exit(1);
          }
          logger.success('README.md structure, markers & security scan passed.');
        } else {
          logger.warn('README.md does not exist yet. Run `npm run generate` first.');
        }
        break;
      }

      default:
        console.log(`
Usage: pinak-os <command>

Commands:
  generate   Collect data, analyze, and update README.md
  preview    Generate local preview-README.md
  analyze    Collect telemetry and output JSON metrics without modifying README.md
  validate   Validate profile configuration and check README.md for security & markers
`);
        break;
    }
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
}

main();
