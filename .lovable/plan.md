
# Mr. CAP Unified API System

Stand up a single API on this project's Lovable Cloud backend that:
1. Exposes your data (music, merch, press, NFTs, blog, events) to external apps/partners.
2. Powers your other sites (theartofism.com, themilkmoney.com, dabsheets.com, 713mixhouse.com, themaasaproject.com, absoulutelycaptivating.com) from one source of truth.
3. Gives you internal admin/automation endpoints for scripts, dashboards, and cross-posting.

Auth: **API keys** you issue and revoke from an admin panel. Each key has a name, owner site, scopes (read/write per resource), rate limit, and an expiry.

---

## What gets built

### 1. Database (new tables)

- `api_keys` — id, name, hashed_key, key_prefix (for display), owner_site, scopes[], rate_limit_per_min, expires_at, revoked_at, last_used_at, created_by
- `api_key_usage` — key_id, endpoint, method, status, ip, ts (for analytics + rate limiting)
- `api_webhooks` — key_id, target_url, events[], secret, active (for outbound webhooks on new release / new order / etc.)

RLS: admin-only. Keys stored hashed (SHA-256); raw key shown **once** at creation.

### 2. Edge function: `api-v1` (single router)

One deployed function that routes by path. Handles auth, scope check, rate limit, logging, CORS for all six domains.

**Public read endpoints** (require key with `read:*` scope):
```
GET  /api/v1/music/albums           list + filter
GET  /api/v1/music/albums/:slug     album + tracks
GET  /api/v1/music/tracks           list, filter by era/year
GET  /api/v1/music/tracks/:slug     track detail + streaming links
GET  /api/v1/press                  press entries
GET  /api/v1/blog                   posts (paginated)
GET  /api/v1/blog/:slug             single post
GET  /api/v1/merch/products         Printful catalog (cached)
GET  /api/v1/nfts                   OpenSea-backed listing
GET  /api/v1/events                 upcoming shows
GET  /api/v1/tiktok                 latest videos (proxied)
```

**Admin / automation endpoints** (require `admin:*` scope):
```
POST /api/v1/fans                   add newsletter/fan signup
POST /api/v1/orders/lookup          order status by email
POST /api/v1/analytics/event        cross-site event ingest
POST /api/v1/webhooks/test          fire a test webhook
```

Every response: JSON, versioned envelope `{ data, meta, error }`, CORS allowlist covering all six sites + `*` for public GET routes with a valid key.

### 3. Admin UI at `/admin/api`

Behind existing admin role. Lets you:
- Create a key (choose name, site, scopes, rate limit, expiry) → shows raw key **once**.
- List keys with prefix, last used, request count (7d), status.
- Revoke / rotate.
- View recent requests + errors per key.
- Configure webhooks per key.

### 4. Consumer helper

A tiny `mrcap-api` JS client (single file, no build) you can drop into any of the other Lovable sites:
```js
const api = createMrCapClient({ key: "mck_live_…" });
const albums = await api.music.albums();
```
Handles base URL, auth header, retries, typed responses.

### 5. Docs page at `/api/docs`

Public page listing every endpoint, params, example curl, example response, and a "Get an API key" CTA that links to the admin panel.

---

## Rollout order

1. Migration: `api_keys`, `api_key_usage`, `api_webhooks` + RLS + grants.
2. `api-v1` edge function with auth middleware, rate limiter, and the `music/*` + `press` + `blog` routes.
3. Admin UI at `/admin/api` (create/list/revoke keys, usage view).
4. Add remaining routes (`merch`, `nfts`, `events`, `tiktok`, admin/automation).
5. Webhooks + `mrcap-api` JS helper + `/api/docs` page.
6. You issue keys to each of your other six sites and swap their fetches to the client.

## Technical details

- Key format: `mck_live_<32 random chars>`; stored as SHA-256 hash + 8-char prefix.
- Auth header: `Authorization: Bearer <key>` or `x-api-key: <key>`.
- Rate limit: per-key sliding window in `api_key_usage` (default 60/min, configurable per key).
- Scopes: `read:music`, `read:press`, `read:blog`, `read:merch`, `read:nfts`, `read:events`, `admin:fans`, `admin:orders`, `admin:analytics`, `admin:webhooks`, plus `read:*` / `admin:*` wildcards.
- Logging: every request logged to `api_key_usage`; feeds admin usage view and existing analytics dashboard.
- CORS allowlist: your six domains hardcoded + `*.lovable.app` for previews.
- No breaking changes to existing edge functions (`printful-*`, `paypal-*`, `tiktok-videos`, etc.) — the API layer calls them or the DB directly.
