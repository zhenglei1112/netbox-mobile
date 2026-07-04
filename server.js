import express from 'express';
import http from 'node:http';
import https from 'node:https';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

import { createMobileAuthGateway } from './server/authGateway.js';
import { ensureDevHttpsOptions } from './server/devHttps.js';
import { getServerRuntimeConfig, getViteServerOptions } from './server/runtime.js';
import { createHealthPayload } from './server/status.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const { port, httpsEnabled, protocol } = getServerRuntimeConfig();
const isProduction = process.env.NODE_ENV === 'production';
const gateway = createMobileAuthGateway();
const sessionCookieName = '__Host-netbox_mobile_session';
const server = httpsEnabled
  ? https.createServer(await ensureDevHttpsOptions(), app)
  : http.createServer(app);

app.use(express.json());

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(cookieHeader.split(';').map((part) => {
    const [key, ...value] = part.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  }).filter(([key]) => key));
}

function getSessionId(req) {
  return parseCookies(req.headers.cookie)[sessionCookieName];
}

function buildSessionCookie(sessionId) {
  const securePart = httpsEnabled ? '; Secure' : '';
  return `${sessionCookieName}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax${securePart}`;
}

function buildClearSessionCookie() {
  const securePart = httpsEnabled ? '; Secure' : '';
  return `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax${securePart}; Max-Age=0`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

async function renderPairingPage(pairing) {
  const qrText = JSON.stringify(pairing.payload);
  const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 280 });
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>绑定 InfraOps Mobile</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #eef4f2; color: #10231f; }
    main { max-width: 720px; margin: 0 auto; padding: 40px 20px; }
    section { background: #fff; border: 1px solid #d7e2de; border-radius: 8px; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { color: #5d6c67; line-height: 1.6; }
    img { display: block; width: 280px; height: 280px; margin: 24px auto; }
    pre { overflow: auto; padding: 12px; background: #f4f7f6; border-radius: 8px; }
    a { color: #0f766e; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>绑定 InfraOps Mobile</h1>
      <p>请用手机打开 InfraOps Mobile，扫描下面的一次性二维码。二维码有效期 ${pairing.expiresInSeconds} 秒，扫码成功后不能重复使用。</p>
      <img src="${qrDataUrl}" alt="移动端绑定二维码" />
      <p>手机测试地址：<a href="/mobile/">/mobile/</a></p>
      <pre>${escapeHtml(qrText)}</pre>
    </section>
  </main>
</body>
</html>`;
}

app.get('/mobile-api/health', (req, res) => {
  res.json(createHealthPayload());
});

app.get('/gateway-api/pairing/new', async (req, res) => {
  const pairing = gateway.createPairing();
  const qr_data_url = await QRCode.toDataURL(JSON.stringify(pairing.payload), { margin: 1, width: 280 });
  res.json({ ...pairing, qr_data_url });
});

app.get('/gateway/pairing/new', async (req, res) => {
  const pairing = gateway.createPairing();
  res.type('html').send(await renderPairingPage(pairing));
});

app.get('/mobile-api/session', (req, res) => {
  res.json(gateway.getSession(getSessionId(req)));
});

app.get('/mobile-api/me', (req, res) => {
  const me = gateway.getMe(getSessionId(req));
  if (!me) {
    res.status(401).json({ code: 'UNAUTHENTICATED', message: '当前登录已失效，请重新扫码绑定。' });
    return;
  }
  res.json(me);
});

app.post('/mobile-api/auth/pair', (req, res) => {
  const result = gateway.pairDevice(req.body);
  if (!result.success) {
    const status = result.code === 'PERMISSION_DENIED' ? 403 : 400;
    res.status(status).json(result);
    return;
  }
  res.setHeader('Set-Cookie', buildSessionCookie(result.sessionId));
  res.json({ success: true, message: result.message });
});

app.post('/mobile-api/auth/logout', (req, res) => {
  const result = gateway.logout(getSessionId(req));
  res.setHeader('Set-Cookie', buildClearSessionCookie());
  res.json(result);
});

if (isProduction) {
  const distDir = resolve(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: getViteServerOptions({ httpsEnabled, port, hmrServer: server }),
    appType: 'spa'
  });

  app.use(vite.middlewares);
}


server.listen(port, '0.0.0.0', () => {
  const localUrl = `${protocol}://localhost:${port}/mobile/`;
  console.log(`InfraOps Mobile listening on ${localUrl}`);
  console.log(`Desktop pairing page: ${protocol}://localhost:${port}/gateway/pairing/new`);
  if (httpsEnabled) {
    console.log('Local HTTPS uses a generated self-signed certificate from .certs/.');
    console.log('For phone testing, open the same URL with this computer LAN IP and accept or trust the certificate.');
  }
});
