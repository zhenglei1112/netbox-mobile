import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHealthPayload, createNetboxStatusPayload } from './server/status.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 8088);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json(createHealthPayload());
});

app.get('/api/netbox/status', (req, res) => {
  res.json(createNetboxStatusPayload());
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
  console.log(`NetBox mobile scaffold listening on http://localhost:${port}`);
});
