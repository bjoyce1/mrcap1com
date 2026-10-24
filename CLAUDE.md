# mrcap1.com — working notes for Claude

Official site of Mr. CAP (Houston recording artist, South Park Coalition). Built in Lovable;
Lovable commits to `main` and publishes from it. See `AGENTS.md` for Lovable's own architecture notes.

## Stack
- Vite + React + TypeScript + Tailwind + shadcn/ui. Routes in `src/App.tsx`, pages in `src/pages`.
- Backend: Lovable Cloud (Supabase). Edge functions in `supabase/functions` (PayPal, Printful,
  Spotify, YouTube, TikTok, OpenSea, transactional email, analytics). Migrations in `supabase/migrations`.
- Content: Sanity (`sanity/`). SEO prerender: `vite-plugin-prerender.ts`, `scripts/seo-*.mjs`.
- Lovable project id: `7f352d5d-72a0-4b6c-adeb-d26f44fc0b6c` (use with the Lovable connector for
  analytics and read-only SQL).

## Commands
- `npm ci` then `npm run build`, `npm run lint`, `npm test`
- `npm run seo:verify` checks prerendered SEO output after a build.

## Key tables (public schema)
`booking_requests`, `fan_signups`, `newsletter_subscribers` (`subscribed_at`), `purchases` (`paid_at`),
`merch_orders`, `analytics_events`, `stream_logs`, `share_events`, `tracks`, `albums`.

## Rules
- Work on a `claude/*` branch. Never push to `main`, never publish, never merge — the owner does that.
- Database: SELECT only. No INSERT/UPDATE/DELETE/DDL without explicit owner approval in the session.
- Never send email, post to social, charge money, or change PayPal/Printful/Stripe settings.
- Never commit secrets. `.env` holds only publishable Supabase values; keep it that way.
- Keep Great Day (`src/features/greatday`) isolated; never put unreleased audio in the bundle.
- Owner's time zone is US Central.

## Skills
- `site-health-check` — weekly build/test/SEO/link audit, fixes on a branch.
- `growth-report` — traffic, signups, bookings, sales; what to do next.
- `release-launch` — checklist for a new single, video or drop.
