import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import selfsigned from 'selfsigned';

const __dirname = dirname(fileURLToPath(import.meta.url));
const certDir = resolve(__dirname, '..', '.certs');
const keyPath = join(certDir, 'infraops-mobile-dev.key');
const certPath = join(certDir, 'infraops-mobile-dev.crt');

function getLanIpAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => item.address);
}

async function createCertificate() {
  const altNames = [
    { type: 2, value: 'localhost' },
    { type: 7, ip: '127.0.0.1' },
    { type: 7, ip: '::1' },
    ...getLanIpAddresses().map((ip) => ({ type: 7, ip }))
  ];

  return selfsigned.generate(
    [{ name: 'commonName', value: 'InfraOps Mobile Local Dev' }],
    {
      algorithm: 'sha256',
      days: 365,
      keySize: 2048,
      extensions: [
        { name: 'basicConstraints', cA: false },
        { name: 'keyUsage', keyCertSign: false, digitalSignature: true, keyEncipherment: true },
        { name: 'extKeyUsage', serverAuth: true },
        { name: 'subjectAltName', altNames }
      ]
    }
  );
}

export async function ensureDevHttpsOptions() {
  if (!existsSync(certDir)) {
    mkdirSync(certDir, { recursive: true });
  }

  if (!existsSync(keyPath) || !existsSync(certPath)) {
    const certificate = await createCertificate();
    writeFileSync(keyPath, certificate.private, { mode: 0o600 });
    writeFileSync(certPath, certificate.cert);
  }

  return {
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
    keyPath,
    certPath
  };
}

