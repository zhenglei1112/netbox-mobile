import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePairingQrPayload } from '../src/utils/qr.js';

test('parsePairingQrPayload accepts a valid NetBox mobile pairing QR payload', () => {
  const payload = parsePairingQrPayload(JSON.stringify({
    type: 'netbox_mobile_pairing',
    pairing_id: 'pair-001',
    nonce: 'nonce-001',
    expires_at: '2099-07-03T10:00:00+08:00'
  }));

  assert.equal(payload.pairing_id, 'pair-001');
  assert.equal(payload.nonce, 'nonce-001');
});

test('parsePairingQrPayload rejects QR payloads with the wrong type', () => {
  assert.throws(
    () => parsePairingQrPayload(JSON.stringify({
      type: 'netbox_token',
      pairing_id: 'pair-001',
      nonce: 'nonce-001',
      expires_at: '2099-07-03T10:00:00+08:00'
    })),
    /二维码格式不正确/
  );
});

test('parsePairingQrPayload rejects expired QR payloads', () => {
  assert.throws(
    () => parsePairingQrPayload(JSON.stringify({
      type: 'netbox_mobile_pairing',
      pairing_id: 'pair-001',
      nonce: 'nonce-001',
      expires_at: '2020-07-03T10:00:00+08:00'
    })),
    /二维码已过期/
  );
});
