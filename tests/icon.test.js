import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const ORIGINAL_ICON_SHA256 = '13ebdec0efbfa024c4b51a609307a56efc379a2c74a70693dce8b15cf6e3daa7';

test('the original user-provided icon PNG is preserved byte-for-byte', async () => {
  const bytes = await readFile(new URL('../public/icon.png', import.meta.url));
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(digest, ORIGINAL_ICON_SHA256);
});

test('install-sized PNG icon derivatives are present', async () => {
  const icon192 = await readFile(new URL('../public/icon-192.png', import.meta.url));
  const icon512 = await readFile(new URL('../public/icon-512.png', import.meta.url));
  assert.ok(icon192.byteLength > 10_000);
  assert.ok(icon512.byteLength > 50_000);
});
