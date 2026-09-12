/**
 * PINAK.OS Terminal Logger
 */

const PREFIX = '[PINAK.OS]';

export const logger = {
  info: (msg, ...args) => {
    console.log(`${PREFIX} \x1b[36mℹ\x1b[0m ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`${PREFIX} \x1b[32m✔\x1b[0m ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`${PREFIX} \x1b[33m⚠\x1b[0m ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`${PREFIX} \x1b[31m✖\x1b[0m ${msg}`, ...args);
  },
  header: (title) => {
    console.log(`\n\x1b[1m\x1b[35m=== ${title} ===\x1b[0m\n`);
  }
};
