function detectPlatform(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'ios';
  if (ua.includes('android')) return 'android';
  return 'web';
}

export function collectDeviceInfo({ navigatorRef = globalThis.navigator, screenRef = globalThis.screen } = {}) {
  const userAgent = navigatorRef?.userAgent || 'unknown';
  const platform = detectPlatform(userAgent);
  const fallbackName = platform === 'ios' ? 'iPhone' : platform === 'android' ? 'Android Phone' : 'Browser';

  return {
    device_name: navigatorRef?.platform || fallbackName,
    platform,
    user_agent: userAgent,
    screen_width: screenRef?.width || 0,
    screen_height: screenRef?.height || 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigatorRef?.language || 'zh-CN'
  };
}
