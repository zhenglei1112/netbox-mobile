import assert from 'node:assert/strict';
import test from 'node:test';

import { createMockAuthServer } from '../src/mock/mockServer.js';

test('mock auth server starts unauthenticated, pairs successfully, and logs out', async () => {
  const server = createMockAuthServer();

  assert.deepEqual(await server.getSession(), { authenticated: false });

  const pairResult = await server.pair({
    pairing_id: 'mock-success',
    nonce: 'nonce-001',
    expires_at: '2099-07-03T10:00:00+08:00',
    device_name: 'Mock iPhone',
    platform: 'ios',
    user_agent: 'node-test'
  });

  assert.equal(pairResult.success, true);
  const session = await server.getSession();
  assert.equal(session.authenticated, true);
  assert.equal(session.user.username, 'zhenglei');

  await server.logout();
  assert.deepEqual(await server.getSession(), { authenticated: false });
});

test('mock auth server reports expired and forbidden pairing failures', async () => {
  const server = createMockAuthServer();

  const expired = await server.pair({ pairing_id: 'mock-expired', nonce: 'x', expires_at: '2099-01-01T00:00:00+08:00' });
  assert.equal(expired.success, false);
  assert.equal(expired.code, 'PAIRING_EXPIRED');

  const forbidden = await server.pair({ pairing_id: 'mock-forbidden', nonce: 'x', expires_at: '2099-01-01T00:00:00+08:00' });
  assert.equal(forbidden.success, false);
  assert.equal(forbidden.code, 'PERMISSION_DENIED');
});
