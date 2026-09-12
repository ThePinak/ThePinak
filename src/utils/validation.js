/**
 * PINAK.OS Validation & Security Checks
 */

import { START_MARKER, END_MARKER } from '../generator/template.js';

/**
 * Validate configuration structure.
 * @param {Object} config
 */
export function validateProfileConfig(config) {
  const errors = [];
  if (!config) {
    errors.push('Configuration object is empty or missing.');
    return { valid: false, errors };
  }

  if (!config.name) errors.push('Profile "name" is required in profile.json.');
  if (!config.username) errors.push('Profile "username" is required in profile.json.');

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Perform security scan and structural validation on generated README content.
 * @param {string} content
 * @param {string[]} [tokensToCheck]
 */
export function validateGeneratedMarkdown(content, tokensToCheck = []) {
  const errors = [];

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Generated content is empty.');
  }

  // Check for presence of markers
  if (!content.includes(START_MARKER)) {
    errors.push(`Missing start marker: ${START_MARKER}`);
  }
  if (!content.includes(END_MARKER)) {
    errors.push(`Missing end marker: ${END_MARKER}`);
  }

  // Security Check: Look for token leakage
  const activeTokens = tokensToCheck
    .filter(t => typeof t === 'string' && t.trim().length > 4)
    .map(t => t.trim());

  for (const token of activeTokens) {
    if (content.includes(token)) {
      errors.push('CRITICAL SECURITY VIOLATION: GitHub Token found in generated content! Generation aborted.');
    }
  }

  // General regex check for standard GitHub tokens (ghp_, gho_, github_pat_)
  const tokenRegex = /(?:ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{50,})/i;
  if (tokenRegex.test(content)) {
    errors.push('CRITICAL SECURITY VIOLATION: GitHub Token pattern detected in generated content! Generation aborted.');
  }

  // Check reasonable size
  if (content.length > 500000) {
    errors.push(`Generated README exceeds safety size limit (Length: ${content.length} chars).`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
