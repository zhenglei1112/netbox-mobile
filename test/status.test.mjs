import assert from 'node:assert/strict';
import test from 'node:test';

import { createHealthPayload, createUnauthenticatedSession } from '../server/status.js';

test('createHealthPayload returns auth scaffold service status', () => {
  const payload = createHealthPayload({ now: '2026-07-03T00:00:00.000Z' });

  assert.deepEqual(payload, {
    ok: true,
    service: 'infraops-mobile',
    mode: 'auth-scaffold',
    timestamp: '2026-07-03T00:00:00.000Z'
  });
});

test('createUnauthenticatedSession returns the logged-out session shape', () => {
  assert.deepEqual(createUnauthenticatedSession(), { authenticated: false });
});
