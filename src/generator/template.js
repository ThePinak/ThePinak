/**
 * PINAK.OS Template & Marker Replacement Engine
 */

export const START_MARKER = '<!-- PINAK_OS_START -->';
export const END_MARKER = '<!-- PINAK_OS_END -->';

/**
 * Safely inject generated content between dynamic markers.
 * Preserves all manual content above and below the markers.
 * @param {string} templateContent
 * @param {string} generatedContent
 * @returns {string}
 */
export function injectGeneratedContent(templateContent, generatedContent) {
  const startIndex = templateContent.indexOf(START_MARKER);
  const endIndex = templateContent.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    // If markers are missing or malformed, wrap generated content with markers
    return `${START_MARKER}\n\n${generatedContent.trim()}\n\n${END_MARKER}\n`;
  }

  const prefix = templateContent.substring(0, startIndex + START_MARKER.length);
  const suffix = templateContent.substring(endIndex);

  return `${prefix}\n\n${generatedContent.trim()}\n\n${suffix}`;
}
