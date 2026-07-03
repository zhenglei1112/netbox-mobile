import assert from 'node:assert/strict';
import test from 'node:test';

import { buildApiUrl } from '../src/services/netboxApi.js';

test('buildApiUrl prefixes API paths and encodes query parameters', () => {
  assert.equal(
    buildApiUrl('/netbox/status', { module: '故障', search: 'core sw' }),
    '/api/netbox/status?module=%E6%95%85%E9%9A%9C&search=core+sw'
  );
});
