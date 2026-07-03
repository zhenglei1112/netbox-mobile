import assert from 'node:assert/strict';
import test from 'node:test';

import { getServerRuntimeConfig } from '../server/runtime.js';

test('getServerRuntimeConfig uses HTTP port 8088 by default', () => {
  assert.deepEqual(getServerRuntimeConfig({ env: {}, argv: [] }), {
    port: 8088,
    httpsEnabled: false,
    protocol: 'http'
  });
});

test('getServerRuntimeConfig enables HTTPS with default port 8443 from --https', () => {
  assert.deepEqual(getServerRuntimeConfig({ env: {}, argv: ['--https'] }), {
    port: 8443,
    httpsEnabled: true,
    protocol: 'https'
  });
});

test('getServerRuntimeConfig lets PORT override the HTTPS default port', () => {
  assert.deepEqual(getServerRuntimeConfig({ env: { PORT: '9443' }, argv: ['--https'] }), {
    port: 9443,
    httpsEnabled: true,
    protocol: 'https'
  });
});
