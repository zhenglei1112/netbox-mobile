import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('httpClient only enables mock mode when VITE_USE_MOCK is explicitly true', () => {
  const source = readFileSync('src/api/httpClient.js', 'utf8');
  assert.match(source, /return import\.meta\.env\.VITE_USE_MOCK === 'true';/);
  assert.doesNotMatch(source, /VITE_USE_MOCK !== 'false'/);
});
