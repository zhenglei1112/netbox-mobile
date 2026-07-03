import assert from 'node:assert/strict';
import test from 'node:test';

import { getCameraUnavailableMessage } from '../src/utils/camera.js';

test('getCameraUnavailableMessage explains insecure mobile HTTP access', () => {
  assert.equal(
    getCameraUnavailableMessage({ isSecureContext: false, mediaDevices: undefined }),
    '摄像头扫码需要 HTTPS。请使用 HTTPS 地址打开 PWA，或先使用手动输入绑定码。'
  );
});

test('getCameraUnavailableMessage reports unsupported browser when media devices are missing in a secure context', () => {
  assert.equal(
    getCameraUnavailableMessage({ isSecureContext: true, mediaDevices: undefined }),
    '当前浏览器不支持扫码。'
  );
});
