export const AUTH_ERROR_MESSAGES = {
  INVALID_QR: '二维码格式不正确，请扫描 NetBox 移动端绑定二维码。',
  PAIRING_NOT_FOUND: '绑定请求不存在，请在电脑端重新生成二维码。',
  PAIRING_EXPIRED: '二维码已过期，请在电脑端重新生成。',
  PAIRING_USED: '二维码已使用，请在电脑端重新生成。',
  USER_DISABLED: '用户已禁用，无法登录移动端。',
  DEVICE_DISABLED: '设备已禁用，无法登录移动端。',
  PERMISSION_DENIED: '当前用户没有移动端登录权限。',
  SERVER_ERROR: '服务端异常，请稍后重试。',
  NETWORK_ERROR: '网络异常，请稍后重试。',
  CAMERA_DENIED: '无法打开摄像头，请检查浏览器权限。',
  CAMERA_UNSUPPORTED: '当前浏览器不支持扫码。',
  UNAUTHENTICATED: '当前登录已失效，请重新扫码绑定。'
};

export class AuthError extends Error {
  constructor(code, message = AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES.SERVER_ERROR, status = 400) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
  }
}

export function messageForAuthError(error) {
  if (!error) return '';
  if (error.message) return error.message;
  return AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.SERVER_ERROR;
}
