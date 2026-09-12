/**
 * PINAK.OS Text & ASCII Formatting Utilities
 */

/**
 * Generate a visual block progress bar.
 * @param {number} percentage 0 to 100
 * @param {number} length Total character width
 * @returns {string} e.g. "██████████░░░░░"
 */
export function createProgressBar(percentage, length = 15) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const filledCount = Math.round((clamped / 100) * length);
  const emptyCount = Math.max(0, length - filledCount);
  return '█'.repeat(filledCount) + '░'.repeat(emptyCount);
}

/**
 * Right-pad string with spaces to fixed length.
 */
export function padRight(str, length) {
  const s = String(str ?? '');
  return s.length >= length ? s : s + ' '.repeat(length - s.length);
}

/**
 * Left-pad string with spaces to fixed length.
 */
export function padLeft(str, length) {
  const s = String(str ?? '');
  return s.length >= length ? s : ' '.repeat(length - s.length) + s;
}

/**
 * Center string within fixed length.
 */
export function centerText(str, length) {
  const s = String(str ?? '');
  if (s.length >= length) return s;
  const totalPad = length - s.length;
  const leftPad = Math.floor(totalPad / 2);
  const rightPad = totalPad - leftPad;
  return ' '.repeat(leftPad) + s + ' '.repeat(rightPad);
}

/**
 * Format a relative human-readable timestamp.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

/**
 * Format ISO Date into clean UTC string.
 * @param {Date} [date]
 * @returns {string} YYYY-MM-DD HH:mm UTC
 */
export function formatUtcDateTime(date = new Date()) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

/**
 * Wrap text into lines of max width.
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]}
 */
export function wrapText(text, maxWidth) {
  if (!text || text.length <= maxWidth) return [text || ''];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Create a rounded or double-line ASCII box.
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string[]} options.lines
 * @param {number} [options.width]
 * @param {'rounded'|'double'|'single'} [options.style]
 * @returns {string}
 */
export function renderAsciiBox({ title = '', lines = [], width = 48, style = 'rounded' }) {
  const chars = {
    rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' }
  }[style] || { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' };

  let result = [];
  const innerWidth = width - 2;
  const contentWidth = innerWidth - 2;

  // Header line
  if (title) {
    const titlePadded = ` ${title} `;
    const leftH = Math.floor((innerWidth - titlePadded.length) / 2);
    const rightH = Math.max(0, innerWidth - titlePadded.length - leftH);
    result.push(`${chars.tl}${chars.h.repeat(leftH)}${titlePadded}${chars.h.repeat(rightH)}${chars.tr}`);
  } else {
    result.push(`${chars.tl}${chars.h.repeat(innerWidth)}${chars.tr}`);
  }

  // Content lines with auto-wrapping
  for (const rawLine of lines) {
    const wrappedLines = wrapText(rawLine, contentWidth);
    for (const line of wrappedLines) {
      result.push(`${chars.v} ${padRight(line, contentWidth)} ${chars.v}`);
    }
  }

  // Bottom line
  result.push(`${chars.bl}${chars.h.repeat(innerWidth)}${chars.br}`);

  return result.join('\n');
}
