// ─── Streaming policy ──────────────────────────────────────────────────────────
// Same rules as the site's StickyPlayer: visitors hear a 30-second preview of each
// catalog track (streamed through the `audio-preview` edge function, so the House
// Charts play counts keep ticking), with an "Own it" link to the track page.
// Set previewSeconds to 0 to stream every track in full inside the intro.
const SUPABASE_PROJECT = 'https://qisamkiggoibjkkdtkxq.supabase.co';

export const STREAM = {
  storage: `${SUPABASE_PROJECT}/storage/v1/object/public/audio/`,
  preview: `${SUPABASE_PROJECT}/functions/v1/audio-preview`,
  previewSeconds: 30,
  buyUrl: (slug) => `/music/${slug}`,
};
