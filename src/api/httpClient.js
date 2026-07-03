import { AuthError, AUTH_ERROR_MESSAGES } from '../utils/errors.js';

const DEFAULT_API_BASE = '/mobile-api';

export function getApiBase() {
  return import.meta.env.VITE_API_BASE || DEFAULT_API_BASE;
}

export function shouldUseMock() {
  return import.meta.env.VITE_USE_MOCK === 'true';
}

export function buildMobileApiUrl(path, query = {}) {
  const normalizedBase = getApiBase().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return `${normalizedBase}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
}

export async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(buildMobileApiUrl(path, options.query), {
      method: options.method || 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new AuthError('NETWORK_ERROR', AUTH_ERROR_MESSAGES.NETWORK_ERROR, 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (response.status === 401) {
    throw new AuthError('UNAUTHENTICATED', AUTH_ERROR_MESSAGES.UNAUTHENTICATED, 401);
  }

  if (response.status === 403) {
    throw new AuthError('PERMISSION_DENIED', AUTH_ERROR_MESSAGES.PERMISSION_DENIED, 403);
  }

  if (!response.ok) {
    throw new AuthError(payload?.code || 'SERVER_ERROR', payload?.message || AUTH_ERROR_MESSAGES.SERVER_ERROR, response.status);
  }

  return payload;
}

