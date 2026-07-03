import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

function findJsxFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return findJsxFiles(path);
    return path.endsWith('.jsx') ? [path] : [];
  });
}

test('JSX files import React for the current Vite middleware runtime', () => {
  const missing = findJsxFiles('src').filter((path) => {
    const source = readFileSync(path, 'utf8');
    return !source.includes("import React from 'react';") && !source.includes("import React, ");
  });

  assert.deepEqual(missing, []);
});
