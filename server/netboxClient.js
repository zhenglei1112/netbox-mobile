const DEFAULT_TIMEOUT_MS = 10_000;

export function createNetboxClient({
  baseUrl = process.env.NETBOX_BASE_URL,
  token = process.env.NETBOX_TOKEN,
  timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
  return {
    isConfigured: Boolean(baseUrl && token),
    baseUrl,
    timeoutMs
  };
}
