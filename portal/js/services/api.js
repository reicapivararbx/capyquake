/**
 * Centralized fetch for portal → Capyquake API (cookie cq_session).
 */

/**
 * @typedef {{ ok: true, status: number, data: any } | { ok: false, status: number, error: string, code?: string, data?: any }} ApiResult
 */

/**
 * @param {string} path absolute API path e.g. /api/users/me
 * @param {RequestInit & { json?: unknown }} [opts]
 * @returns {Promise<ApiResult>}
 */
export async function api(path, opts = {}) {
  const { json, headers: extraHeaders, ...rest } = opts;
  /** @type {Record<string, string>} */
  const headers = { Accept: 'application/json', ...(extraHeaders || {}) };
  /** @type {RequestInit} */
  const init = {
    credentials: 'include',
    ...rest,
    headers,
  };
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  }

  let res;
  try {
    res = await fetch(path, init);
  } catch {
    return { ok: false, status: 0, error: 'Falha de rede. Verifique sua conexão.' };
  }

  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const error =
      (data && (data.message || data.error || data.code)) ||
      `Erro HTTP ${res.status}`;
    return {
      ok: false,
      status: res.status,
      error: String(error),
      code: data?.code,
      data,
    };
  }

  return { ok: true, status: res.status, data };
}
