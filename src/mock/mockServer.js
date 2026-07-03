import { AuthError } from '../utils/errors.js';
import { mockDevice, mockMe, mockUser } from './mockAuthData.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createMockAuthServer({ latencyMs = 120 } = {}) {
  let authenticated = false;
  let lastLoginAt = null;
  const usedPairings = new Set();

  async function withLatency(value) {
    await delay(latencyMs);
    return value;
  }

  return {
    async getSession() {
      if (!authenticated) return withLatency({ authenticated: false });
      return withLatency({
        authenticated: true,
        user: mockUser,
        device: {
          id: mockDevice.id,
          name: mockDevice.name,
          status: mockDevice.status
        },
        last_login_at: lastLoginAt
      });
    },

    async getMe() {
      if (!authenticated) throw new AuthError('UNAUTHENTICATED', undefined, 401);
      return withLatency({ ...mockMe, last_login_at: lastLoginAt });
    },

    async pair(payload) {
      await delay(latencyMs);
      if (payload.pairing_id === 'mock-expired') {
        return { success: false, code: 'PAIRING_EXPIRED', message: '二维码已过期，请在电脑端重新生成' };
      }
      if (payload.pairing_id === 'mock-used' || usedPairings.has(payload.pairing_id)) {
        return { success: false, code: 'PAIRING_USED', message: '二维码已使用，请在电脑端重新生成' };
      }
      if (payload.pairing_id === 'mock-forbidden') {
        return { success: false, code: 'PERMISSION_DENIED', message: '当前用户没有移动端登录权限' };
      }

      usedPairings.add(payload.pairing_id);
      authenticated = true;
      lastLoginAt = new Date().toISOString();
      return { success: true, message: '设备绑定成功' };
    },

    async logout() {
      authenticated = false;
      lastLoginAt = null;
      return withLatency({ success: true, message: '已退出登录' });
    }
  };
}

export const mockAuthServer = createMockAuthServer();
