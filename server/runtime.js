export function getServerRuntimeConfig({ env = process.env, argv = process.argv.slice(2) } = {}) {
  const httpsEnabled = env.NETBOX_MOBILE_HTTPS === 'true' || argv.includes('--https');
  const defaultPort = httpsEnabled ? 8443 : 8088;
  const port = Number(env.PORT || defaultPort);

  return {
    port,
    httpsEnabled,
    protocol: httpsEnabled ? 'https' : 'http'
  };
}
