import { AuthError } from './errors.js';

const REQUIRED_FIELDS = ['pairing_id', 'nonce', 'expires_at'];

function parseJson(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    throw new AuthError('INVALID_QR');
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    throw new AuthError('INVALID_QR');
  }
}

export function parsePairingQrPayload(rawValue, { now = Date.now() } = {}) {
  const payload = parseJson(rawValue);

  if (payload.type !== 'netbox_mobile_pairing') {
    throw new AuthError('INVALID_QR');
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof payload[field] !== 'string' || payload[field].trim() === '') {
      throw new AuthError('INVALID_QR');
    }
  }

  const expiresAt = Date.parse(payload.expires_at);
  if (Number.isNaN(expiresAt)) {
    throw new AuthError('INVALID_QR');
  }

  if (expiresAt <= now) {
    throw new AuthError('PAIRING_EXPIRED');
  }

  return {
    type: 'netbox_mobile_pairing',
    pairing_id: payload.pairing_id,
    nonce: payload.nonce,
    expires_at: payload.expires_at
  };
}
