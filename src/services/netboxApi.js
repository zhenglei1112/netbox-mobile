const API_PREFIX = '/api';

export function buildApiUrl(path, query = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return `${API_PREFIX}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
}

export async function requestJson(path, options = {}) {
  const response = await fetch(buildApiUrl(path, options.query), {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export function getNetboxStatus() {
  return requestJson('/netbox/status');
}
