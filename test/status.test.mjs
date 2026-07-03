import assert from 'node:assert/strict';
import test from 'node:test';

import { createHealthPayload } from '../server/status.js';

test('createHealthPayload returns scaffold service status', () => {
  const payload = createHealthPayload({ now: '2026-07-03T00:00:00.000Z' });

  assert.deepEqual(payload, {
    ok: true,
    service: 'netbox-mobile',
    mode: 'scaffold',
    timestamp: '2026-07-03T00:00:00.000Z'
  });
});
