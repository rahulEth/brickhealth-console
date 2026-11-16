# BrickHealth console — Cloudflare deployment

Support engineer console and field engineer app, hosted on Cloudflare Workers with static assets.

```
brickhealth-console/
├── public/              # static site (served from Cloudflare's edge)
│   ├── index.html
│   ├── favicon.svg
│   ├── _headers         # security + cache headers
│   └── assets/
│       ├── config.js    # runtime settings (API base, demo mode)
│       ├── styles.css
│       └── app.js
├── src/worker.js        # /api/* only: health check + proxy to your Core API
├── wrangler.jsonc       # Cloudflare config
└── package.json
```

## Deploy (first time)

1. Install Node.js 20+ and a free Cloudflare account.
2. In this folder:
   ```bash
   npm install
   npx wrangler login        # opens browser to authorise
   npx wrangler dev          # test locally at http://localhost:8787
   npx wrangler deploy       # publishes to https://brickhealth-console.<your-subdomain>.workers.dev
   ```

## Custom domain

Add your domain to Cloudflare, then in `wrangler.jsonc` add:
```jsonc
"routes": [{ "pattern": "console.yourdomain.com", "custom_domain": true }]
```
and run `npx wrangler deploy` again.

## Auto-deploy from GitHub

Cloudflare dashboard → Workers & Pages → your Worker → Settings → Builds → connect the repo.
Deploy command: `npx wrangler deploy`. Every push to `main` deploys.

## Connect the real Core API

1. Set `CORE_API_URL` in `wrangler.jsonc` (e.g. `https://api.yourdomain.com/v1/`).
2. Store the service token as a secret: `npx wrangler secret put CORE_API_TOKEN`.
3. Set `demoMode: false` in `public/assets/config.js` and replace the demo arrays in `app.js`
   with `fetch('/api/...')` calls (e.g. `/api/faults`, `/api/machines`, `/api/workorders`).
4. `/api/health` reports `mode: "live"` once the URL is set; the header shows "API connected".

## Protect the console (recommended before real data)

Use **Cloudflare Access** (Zero Trust → Access → Applications → Self-hosted) on your domain so only
staff emails or your Google Workspace / Microsoft login can open it. No code change needed.
Give support and field engineers separate Access groups if you split roles later.

## Notes

- Routing uses `#hash` URLs (`#machines`, `#my-jobs`), so deep links work with no server rules.
- Everything shown is demo data until step "Connect the real Core API" is done.
- HTTPS on Cloudflare also allows Web Bluetooth and camera access in Chrome on Android,
  which the field app can use later for gateway connection and QR scanning.
