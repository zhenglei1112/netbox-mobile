export const mockUser = {
  id: 1,
  username: 'zhenglei',
  display_name: 'zhenglei'
};

export const mockDevice = {
  id: 'mock-device-001',
  name: 'Mock iPhone',
  platform: 'ios',
  status: 'active',
  created_at: '2026-07-03T10:00:00+08:00',
  last_seen_at: '2026-07-03T10:05:00+08:00'
};

export const mockMe = {
  ...mockUser,
  groups: ['运维人员'],
  permissions: ['mobile.login'],
  device: mockDevice
};
