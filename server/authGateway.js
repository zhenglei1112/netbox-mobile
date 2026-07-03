import { randomBytes, randomUUID } from 'node:crypto';

const PAIRING_TTL_MS = 120_000;

const defaultUser = {
  id: 1,
  username: 'zhenglei',
  display_name: 'zhenglei',
  groups: ['运维人员'],
  permissions: ['mobile.login']
};

function toIsoString(value) {
  return new Date(value).toISOString();
}

function createNonce() {
  return randomBytes(24).toString('base64url');
}

function normalizeDevice(payload = {}) {
  return {
    id: payload.device_id || randomUUID(),
    name: payload.device_name || 'Mobile Browser',
    platform: payload.platform || 'web',
    status: 'active',
    created_at: toIsoString(Date.now()),
    last_seen_at: toIsoString(Date.now())
  };
}

export function createMobileAuthGateway({ now = () => new Date(), user = defaultUser } = {}) {
  const pairings = new Map();
  const sessions = new Map();

  function getNowMs() {
    return new Date(now()).getTime();
  }

  function createPairing() {
    const createdAt = getNowMs();
    const pairing = {
      pairing_id: randomUUID(),
      nonce: createNonce(),
      expires_at: toIsoString(createdAt + PAIRING_TTL_MS),
      used: false,
      user
    };

    pairings.set(pairing.pairing_id, pairing);

    return {
      payload: {
        type: 'netbox_mobile_pairing',
        pairing_id: pairing.pairing_id,
        nonce: pairing.nonce,
        expires_at: pairing.expires_at
      },
      expiresInSeconds: PAIRING_TTL_MS / 1000
    };
  }

  function pairDevice(payload = {}) {
    const pairing = pairings.get(payload.pairing_id);
    if (!pairing || pairing.nonce !== payload.nonce) {
      return { success: false, code: 'PAIRING_NOT_FOUND', message: '绑定请求不存在，请重新生成二维码' };
    }

    if (pairing.used) {
      return { success: false, code: 'PAIRING_USED', message: '二维码已使用，请重新生成' };
    }

    if (Date.parse(pairing.expires_at) <= getNowMs()) {
      return { success: false, code: 'PAIRING_EXPIRED', message: '二维码已过期，请重新生成' };
    }

    if (!pairing.user.permissions?.includes('mobile.login')) {
      return { success: false, code: 'PERMISSION_DENIED', message: '当前用户没有移动端登录权限' };
    }

    pairing.used = true;
    const sessionId = randomUUID();
    const loginTime = toIsoString(getNowMs());
    const device = normalizeDevice(payload);
    device.last_seen_at = loginTime;

    sessions.set(sessionId, {
      authenticated: true,
      user: {
        id: pairing.user.id,
        username: pairing.user.username,
        display_name: pairing.user.display_name
      },
      userDetail: {
        ...pairing.user,
        device,
        last_login_at: loginTime
      },
      device: {
        id: device.id,
        name: device.name,
        status: device.status
      },
      last_login_at: loginTime
    });

    return { success: true, message: '设备绑定成功', sessionId };
  }

  function getSession(sessionId) {
    if (!sessionId || !sessions.has(sessionId)) {
      return { authenticated: false };
    }

    const session = sessions.get(sessionId);
    return {
      authenticated: true,
      user: session.user,
      device: session.device,
      last_login_at: session.last_login_at
    };
  }

  function getMe(sessionId) {
    if (!sessionId || !sessions.has(sessionId)) {
      return null;
    }

    return sessions.get(sessionId).userDetail;
  }

  function logout(sessionId) {
    if (sessionId) {
      sessions.delete(sessionId);
    }
    return { success: true, message: '已退出登录' };
  }

  return {
    createPairing,
    pairDevice,
    getSession,
    getMe,
    logout
  };
}
