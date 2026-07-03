export function getCameraUnavailableMessage({ isSecureContext, mediaDevices } = {}) {
  if (!isSecureContext) {
    return '摄像头扫码需要 HTTPS。请使用 HTTPS 地址打开 PWA，或先使用手动输入绑定码。';
  }

  if (!mediaDevices?.getUserMedia) {
    return '当前浏览器不支持扫码。';
  }

  return '';
}
