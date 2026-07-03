import express from 'express';
import http from 'node:http';
import https from 'node:https';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureDevHttpsOptions } from './server/devHttps.js';
import { getServerRuntimeConfig } from './server/runtime.js';
import { createHealthPayload, createUnauthenticatedSession } from './server/status.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const { port, httpsEnabled, protocol } = getServerRuntimeConfig();
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

app.get('/mobile-api/health', (req, res) => {
  res.json(createHealthPayload());
});

app.get('/mobile-api/session', (req, res) => {
  res.json(createUnauthenticatedSession());
});

app.get('/mobile-api/me', (req, res) => {
  res.status(401).json({
    code: 'UNAUTHENTICATED',
    message: '\u5f53\u524d\u767b\u5f55\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u626b\u7801\u7ed1\u5b9a\u3002'
  });
});

app.post('/mobile-api/auth/pair', (req, res) => {
  res.status(501).json({
    success: false,
    code: 'SERVER_ERROR',
    message: '\u771f\u5b9e\u626b\u7801\u8ba4\u8bc1\u540e\u7aef\u5c1a\u672a\u63a5\u5165\uff0c\u8bf7\u4f7f\u7528\u524d\u7aef Mock \u6a21\u5f0f\u3002'
  });
});

app.post('/mobile-api/auth/logout', (req, res) => {
  res.json({ success: true, message: '\u5df2\u9000\u51fa\u767b\u5f55' });
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
    server: {
      middlewareMode: true,
      hmr: { protocol: httpsEnabled ? 'wss' : 'ws', port: port + 1 }
    },
    appType: 'spa'
  });

  app.use(vite.middlewares);
}

const server = httpsEnabled
  ? https.createServer(await ensureDevHttpsOptions(), app)
  : http.createServer(app);

server.listen(port, '0.0.0.0', () => {
  const localUrl = `${protocol}://localhost:${port}/mobile/`;
  console.log(`InfraOps Mobile listening on ${localUrl}`);
  if (httpsEnabled) {
    console.log('Local HTTPS uses a generated self-signed certificate from .certs/.');
    console.log('For phone testing, open the same URL with this computer LAN IP and accept or trust the certificate.');
  }
});
