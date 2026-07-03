import assert from 'node:assert/strict';
import test from 'node:test';

import config from '../vite.config.js';

function flattenPlugins(plugins) {
  return plugins.flatMap((plugin) => Array.isArray(plugin) ? flattenPlugins(plugin) : [plugin]);
}

test('vite config enables the React plugin', () => {
  const plugins = flattenPlugins(config.plugins || []);
  assert.ok(plugins.some((plugin) => plugin?.name === 'vite:react-babel'));
});
