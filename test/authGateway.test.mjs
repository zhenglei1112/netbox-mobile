import assert from 'node:assert/strict';
import test from 'node:test';

import { createMobileAuthGateway } from '../server/authGateway.js';

test('mobile auth gateway creates a pairing payload and authenticates once', () => {
  const gateway = createMobileAuthGateway({ now: () => new Date('2026-07-03T02:00:00.000Z') });
  const pairing = gateway.createPairing();

  assert.equal(pairing.payload.type, 'netbox_mobile_pairing');
  assert.ok(pairing.payload.pairing_id);
  assert.ok(pairing.payload.nonce);
  assert.equal(pairing.payload.expires_at, '2026-07-03T02:02:00.000Z');

  const result = gateway.pairDevice({
    ...pairing.payload,
    device_name: 'iPhone',
    platform: 'ios',
    user_agent: 'node-test'
  });

  assert.equal(result.success, true);
  assert.ok(result.sessionId);
  assert.equal(gateway.getSession(result.sessionId).authenticated, true);
  assert.equal(gateway.getMe(result.sessionId).username, 'zhenglei');
});

test('mobile auth gateway rejects reused and expired pairings', () => {
  let currentTime = new Date('2026-07-03T02:00:00.000Z');
  const gateway = createMobileAuthGateway({ now: () => currentTime });
  const pairing = gateway.createPairing();

  gateway.pairDevice(pairing.payload);
  const reused = gateway.pairDevice(pairing.payload);
  assert.equal(reused.success, false);
  assert.equal(reused.code, 'PAIRING_USED');

  const expiredPairing = gateway.createPairing();
  currentTime = new Date('2026-07-03T02:03:00.000Z');
  const expired = gateway.pairDevice(expiredPairing.payload);
  assert.equal(expired.success, false);
  assert.equal(expired.code, 'PAIRING_EXPIRED');
});

test('mobile auth gateway logout removes the session', () => {
  const gateway = createMobileAuthGateway({ now: () => new Date('2026-07-03T02:00:00.000Z') });
  const pairing = gateway.createPairing();
  const result = gateway.pairDevice(pairing.payload);

  assert.equal(gateway.logout(result.sessionId).success, true);
  assert.deepEqual(gateway.getSession(result.sessionId), { authenticated: false });
});
