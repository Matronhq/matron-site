# matron.chat

Static promotional site for Matron, plus the privacy policy and support page
required for App Store submission. No build step — every file deploys as-is
to Cloudflare Pages.

```
index.html            landing page
dev-boxer/index.html  dev-boxer product page → https://matron.chat/dev-boxer/
privacy/index.html    privacy policy  → https://matron.chat/privacy/
support/index.html    support page    → https://matron.chat/support/
404.html              Pages serves this for unknown paths
_headers              Cloudflare Pages security/cache headers
style.css             shared styles
assets/               icons (from the app's asset catalogs) + screenshots (assets/screens/)
docs/                 superpowers specs and plans (internal, not linked from the site)
```

## Preview locally

```bash
python3 -m http.server 8788    # http://localhost:8788
# or, with the Pages runtime (respects _headers):
npx wrangler pages dev .
```

## Deploy to Cloudflare Pages

The `matron.chat` zone is already on Cloudflare (gail/jay nameservers), so
either path ends with a one-click custom domain.

**Option A — direct upload (fastest):**

```bash
wrangler login
wrangler pages project create matron-site --production-branch main
wrangler pages deploy . --project-name matron-site
```

**Option B — connect this repo:** Cloudflare dashboard → Workers & Pages →
Create → Pages → connect `matron-site`. Build command: *none*. Output
directory: `/`.

**Then:** Pages project → Custom domains → add `matron.chat` (and optionally
`www.matron.chat`; Cloudflare creates the records since the zone is local).

## After deploy

- **`support@matron.chat`** — the site uses this address. Set up Cloudflare
  Email Routing on the zone (Email → Email Routing → forward
  `support@matron.chat` → your inbox). One click, free.
- **App Store Connect** — privacy policy URL `https://matron.chat/privacy/`,
  support URL `https://matron.chat/support/`, marketing URL
  `https://matron.chat/`.
- **Beta CTA** — the "Join the beta" button is a `mailto:` for now. When the
  TestFlight public link exists, swap the `href` in `index.html` (#beta
  section and hero button).

## Contributing

Suggestions and fixes are welcome — copy improvements, typos, accessibility,
broken links. Open an issue or a PR. Two ground rules:

- No build step, ever: the site deploys as-is, so changes are plain HTML/CSS.
- The privacy policy (`privacy/index.html`) describes what the software
  actually does; changes there need to track real behavior, not just wording.
