---
name: release-launch
description: Checklist for launching a new Mr. CAP single, album, video or merch drop across mrcap1.com and social. Use when the owner says a release is coming or just dropped.
---

# Release launch

Ask only for what is missing: title, release date, type (single/album/video/merch), streaming links,
artwork, and the one call to action (stream, buy, pre-save, book).

## Site (on a `claude/release-<slug>` branch — never publish)
- Add or update the track/album entry and its page; confirm it appears on `/music`, `/new-releases`
  and the discography.
- Title, description, Open Graph image and MusicRecording/MusicAlbum schema present (`npm run seo:verify`).
- Home page or hero points at the release for launch week.

## Content drafts (drafts only — the owner posts)
- 5 captions: TikTok, Instagram, X, Facebook, YouTube Shorts, each with the release link.
- 3 short-clip ideas (hook in first 2 seconds) and, if asked, Higgsfield drafts.
- One newsletter draft for `newsletter_subscribers` (do not send).
- One press blurb for `/press` and outreach.

## Report
Branch link, preview steps, every draft in one list, and the date to re-check numbers
(run `growth-report` 7 days after release).
