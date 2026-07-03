import { requestJson, shouldUseMock } from './httpClient.js';
import { mockAuthServer } from '../mock/mockServer.js';
import { AuthError } from '../utils/errors.js';

const service = {
  async getSession() {
    if (shouldUseMock()) return mockAuthServer.getSession();
    return requestJson('/session');
  },

  async getMe() {
    if (shouldUseMock()) return mockAuthServer.getMe();
    return requestJson('/me');
  },

  async pair(payload) {
    const result = shouldUseMock()
      ? await mockAuthServer.pair(payload)
      : await requestJson('/auth/pair', { method: 'POST', body: payload });

    if (result?.success === false) {
      throw new AuthError(result.code || 'SERVER_ERROR', result.message);
    }

    return result;
  },

  async logout() {
    if (shouldUseMock()) return mockAuthServer.logout();
    return requestJson('/auth/logout', { method: 'POST' });
  }
};

export const authService = service;
