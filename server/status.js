export function createHealthPayload({ now = new Date().toISOString() } = {}) {
  return {
    ok: true,
    service: 'infraops-mobile',
    mode: 'auth-scaffold',
    timestamp: now
  };
}

export function createUnauthenticatedSession() {
  return { authenticated: false };
}
