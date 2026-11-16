/**
 * BrickHealth console — Cloudflare Worker.
 * Static files in /public are served directly by Workers static assets.
 * This script only runs for /api/* (see run_worker_first in wrangler.jsonc).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, mode: env.CORE_API_URL ? 'live' : 'demo', time: new Date().toISOString() });
    }

    if (url.pathname.startsWith('/api/')) {
      if (!env.CORE_API_URL) return json({ ok: false, error: 'CORE_API_URL not set; console is in demo mode' }, 503);
      // Proxy to the Core API so the browser never sees its address or service token.
      const target = new URL(url.pathname.replace(/^\/api/, '') + url.search, env.CORE_API_URL);
      const headers = new Headers(request.headers);
      headers.delete('cookie');
      if (env.CORE_API_TOKEN) headers.set('authorization', `Bearer ${env.CORE_API_TOKEN}`);
      const init = { method: request.method, headers, body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body };
      const resp = await fetch(target, init);
      const out = new Response(resp.body, resp);
      out.headers.set('cache-control', 'no-store');
      return out;
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
