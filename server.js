import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHealthPayload, createUnauthenticatedSession } from './server/status.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 8088);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

app.get('/mobile-api/health', (req, res) => {
  res.json(createHealthPayload());
});

app.get('/mobile-api/session', (req, res) => {
  res.json(createUnauthenticatedSession());
});

app.get('/mobile-api/me', (req, res) => {
  res.status(401).json({ code: 'UNAUTHENTICATED', message: '当前登录已失效，请重新扫码绑定。' });
});

app.post('/mobile-api/auth/pair', (req, res) => {
  res.status(501).json({ success: false, code: 'SERVER_ERROR', message: '真实扫码认证后端尚未接入，请使用前端 Mock 模式。' });
});

app.post('/mobile-api/auth/logout', (req, res) => {
  res.json({ success: true, message: '已退出登录' });
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
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`InfraOps Mobile listening on http://localhost:${port}/mobile/`);
});
