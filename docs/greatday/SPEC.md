# Great Day Universe: private review and future public specification

## Current review

- `/greatday-preview`: open review link with no sign-in since commit 405e559 (`greatdayDemoAccess`), still noindex and outside navigation and the sitemap. `/admin/greatday` keeps the backend identity and role check.
- The preview is the campaign page in the site's own design: midnight lacquer, candy gradient buttons, Grill Gold accents, Alfa Slab One headlines, the site navigation and footer. The cover is a record rising like the sun over Houston; the wall is a set of instant prints. One quiet private-preview pill (a strip at the top on phones), and small gold pills only where content is a placeholder.
- Owner-supplied slots live in `content.ts`: `LYRICS` (lines with optional start seconds), `VOICES[].photo` (cleared portraits) and `CLIPS` (behind-the-record video). Empty slots render a tagged placeholder.
- `/admin/greatday`: private Release Studio. Readiness checklist and event dictionary are documentation, not database approval workflows. Tagged-link generation is deterministic and copying is local only. Existing `/admin/captions` is reused unchanged.
- The player plays the 30-second preview of the original 2024 single (catalog track `09aa34c7-b890-4929-99a8-2e87c2b4aa26`) through the existing `audio-preview` function, approved by the owner on 2026-10-22. It stops at 30 seconds and reports no events. No remix audio URL, commerce integration, signup submission, wall form persistence, newsletter insert or email action exists in this feature. The email field is disabled. The wall engraver is component-local state only; typed text is never saved or sent.
- Existing cover at `/images/covers/opt/today-great-day-cover-480.webp` is TEMPORARY, NOT FINAL. Generated Houston scene is campaign concept imagery, not final artwork or historical documentary evidence.
- Single $2.99, Deluxe $9.99 and Supporter $24.99 are PROPOSED PRICE / NOT FOR SALE. All purchase controls are disabled; contents are pending approval.
- No release date is approved. Artist roster: Mr. CAP ft. Paul Wall, Lil Keke & Lisa Dinero. All other credits and license statements remain pending verification.
- No public menu or footer entry. Private routes receive noindex/nofollow metadata, static access-only shells, optional host X-Robots-Tag headers and no sitemap URLs. Great Day analytics are suppressed. Existing public canonicals and redirects are unchanged.

## Privacy boundary

This is an existing client-side SPA. The route prevents unauthorized rendering and loading of the campaign page module through normal application navigation; the gate does not make shipped source bundles or concept images confidential. No unreleased master, private legal documents or sensitive data belong in browser assets. Truly confidential material later requires private storage and server-side authorization. Do not publish this revision until review is explicitly approved. `_headers` support must be confirmed before relying on host headers; static noindex shells and runtime access checks remain independent protections.

## Future hostname routing

After separate authorization, route by normalized `window.location.hostname` at the app boundary:

- `greatday.mrcap1.com` `/` serves the approved public Great Day world.
- `mrcap1.com` and `www.mrcap1.com` `/` remain the normal Mr. CAP Legacy site.
- Existing artist routes and commerce remain unchanged.
- Public Great Day SEO, canonical, sharing and analytics settings are separate and created only during launch work. The private review stays admin-only.

DNS, custom-domain verification and domain connection are a later manual phase. The planned URL `https://greatday.mrcap1.com/` is PLANNED, NOT LIVE, not a verified or activated destination. No current hostname switch is implemented.

## Publication gates

Every gate requires documented approval before public activation:

1. Signed recording rights and featured-performer agreements.
2. Approved master WAV with safe private storage.
3. New ISRC if this remix is a distinct version.
4. Composition and publisher clearance for interactive streaming and downloads.
5. Approved final artwork, visual assets and accurate credits.
6. Privacy notice, explicit consent and real signup implementation reviewed and tested.
7. Release-specific secure Stripe checkout, verified signature/idempotent webhook handling and private download entitlements, separately authorized. Existing PayPal merchandise flow is not replaced.
8. Final editorial copy, legal/licensing review and analytics QA.
9. Explicit publication approval and domain setup authorization. No date until owner approval.

## Future data model, no tables created now

| Entity | Planned fields and safeguards |
| --- | --- |
| releases | id, slug, title, artist credits, version, ISRC, status, approved_at, optional release_at; admin-managed publication state |
| assets | release_id, kind, private storage path, checksum, rights approval, public approval; masters private by default |
| fan_optins | release_id, email, consent text version, consent timestamp, verification, unsubscribed_at; no public reads, consent and retention reviewed |
| wall_submissions | release_id, story, optional display name, consent, moderation status; only approved stories public, no email disclosed |
| campaign_events | release_id, event name, platform, campaign, day, consent/session fields; exclude staff, minimize personal data |
| purchase_orders | release_id, provider order id, currency, exact price snapshot, payment status, webhook idempotency key; server-authoritative |
| entitlements | order_id, asset_id, authorized purchaser reference, expiry/download limits; short-lived signed access, no public master URLs |

Any future migration requires explicit authorization, RLS and grants, protected role validation and lifecycle tests. Do not create production records or tables during review.

## Seven-day organic test

Use Instagram, TikTok, X and a Facebook comparison. Links use `utm_medium=social`, `utm_campaign=great_day_remix_7day`, platform `utm_source` and `utm_content=day_1` through `day_7`. These are planned links only. Reuse Caption Studio, manually review facts, rights, tone and tagged destination before posting. Do not post, distribute, spend or send marketing emails from the review. Event dictionary in Release Studio is a future plan and emits no events now.

## QA boundaries

Verify signed-out redirect/return, signed-in non-admin denial, signed-in administrator access, delayed auth loading, all disabled purchase/signup states, one audio element playing only the original single preview and stopping at 30 seconds, local-only wall engraver, no Great Day analytics emissions, no public navigation links, no sitemap URLs, mobile/desktop layout and reduced motion. The project harness runs production builds automatically; do not start a second build manually. Record observed results honestly in the delivery summary.