export function createHealthPayload({ now = new Date().toISOString() } = {}) {
  return {
    ok: true,
    service: 'netbox-mobile',
    mode: 'scaffold',
    timestamp: now
  };
}

export function createNetboxStatusPayload() {
  return {
    connected: false,
    mode: 'scaffold',
    message: 'NetBox integration is not configured in this scaffold.'
  };
}
