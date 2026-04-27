const DEFAULT_TIMEOUT_MS = 15000;

const PARKING_PATTERNS = [
  /domain\s+for\s+sale/i,
  /buy\s+this\s+domain/i,
  /this\s+domain\s+is\s+for\s+sale/i,
  /parking/i,
  /sedo/i,
  /afternic/i,
  /dan\.com/i,
  /hugedomains/i,
];

function controllerWithTimeout(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

function normalizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function classifyStatus({ status, finalUrl, startUrl, body }) {
  if (status >= 200 && status < 400) {
    if (PARKING_PATTERNS.some((pattern) => pattern.test(body || ''))) return 'parked_or_for_sale';
    if (finalUrl && startUrl && finalUrl !== startUrl) return 'redirected';
    return 'ok';
  }
  if (status === 404 || status === 410) return 'not_found';
  if (status >= 500) return 'server_error';
  return 'http_error';
}

export async function checkHttpUrl(urlLike, options = {}) {
  const url = normalizeUrl(urlLike);
  if (!url) {
    return {
      input_url: urlLike,
      normalized_url: null,
      status: 'unchecked',
      http_status: null,
      final_url: null,
      error: 'empty_url',
    };
  }

  const { controller, timeout } = controllerWithTimeout(options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'HEI-Monitoring/0.1' },
    });
    const contentType = response.headers.get('content-type') || '';
    let body = '';
    if (/text|html|xml|json/i.test(contentType)) {
      body = (await response.text()).slice(0, options.maxBodyChars || 20000);
    }

    return {
      input_url: urlLike,
      normalized_url: url,
      status: classifyStatus({ status: response.status, finalUrl: response.url, startUrl: url, body }),
      http_status: response.status,
      final_url: response.url,
      content_type: contentType,
      error: null,
    };
  } catch (error) {
    const message = error?.message || String(error);
    let status = 'server_error';
    if (/ENOTFOUND|getaddrinfo|Name or service not known|fetch failed/i.test(message)) status = 'dns_failure';
    if (/certificate|SSL|TLS/i.test(message)) status = 'tls_failure';
    if (/aborted|timeout/i.test(message)) status = 'timeout';

    return {
      input_url: urlLike,
      normalized_url: url,
      status,
      http_status: null,
      final_url: null,
      content_type: null,
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}
