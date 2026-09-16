import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

test('question UI uses one continuous range slider instead of reaction buttons', () => {
  assert.match(main, /data-reaction-slider[^>]+type="range"|type="range"[^>]+data-reaction-slider/);
  assert.doesNotMatch(main, /reaction-button/);
  assert.match(css, /\.reaction-slider/);
});

test('Safe Food keywords are tappable chips rather than a manual keyword textarea', () => {
  assert.match(main, /data-keyword=/);
  assert.match(main, /class="keyword-chip/);
  assert.doesNotMatch(main, /textarea name="keywords"/);
});

test('player UI no longer contains developer implementation notes', () => {
  assert.doesNotMatch(main, /No sign-in, cloud database/);
  assert.doesNotMatch(main, /plug this food directly into the same elimination engine/);
  assert.doesNotMatch(main, /permanently removes an item for this session/);
});
