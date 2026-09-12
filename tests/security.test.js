import test from 'node:test';
import assert from 'node:assert/strict';

import { validateGeneratedMarkdown, validateProfileConfig } from '../src/utils/validation.js';
import { START_MARKER, END_MARKER } from '../src/generator/template.js';

test('validateProfileConfig flags missing name or username', () => {
  const invalidConfig = { name: '' };
  const res = validateProfileConfig(invalidConfig);
  assert.equal(res.valid, false);
  assert.ok(res.errors.length >= 2);

  const validConfig = { name: 'Pinak', username: 'pinakthummar' };
  const res2 = validateProfileConfig(validConfig);
  assert.equal(res2.valid, true);
});

test('validateGeneratedMarkdown checks for markers', () => {
  const noMarkers = 'Plain text without markers';
  const res = validateGeneratedMarkdown(noMarkers);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('Missing start marker')));
});

test('validateGeneratedMarkdown aborts when token pattern is detected', () => {
  const secretToken = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const contentWithSecret = `${START_MARKER}\nMy secret is ${secretToken}\n${END_MARKER}`;

  const res = validateGeneratedMarkdown(contentWithSecret, [secretToken]);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('SECURITY VIOLATION')));
});

test('validateGeneratedMarkdown allows clean markdown', () => {
  const cleanContent = `${START_MARKER}\n# Clean Content\n${END_MARKER}`;
  const res = validateGeneratedMarkdown(cleanContent, ['my_dummy_secret_key_12345']);
  assert.equal(res.valid, true);
});
