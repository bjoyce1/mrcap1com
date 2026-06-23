import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/tiktok';
const VIDEO_FIELDS = [
  'id',
  'title',
  'cover_image_url',
  'share_url',
  'embed_link',
  'view_count',
  'like_count',
  'comment_count',
  'share_count',
  'create_time',
  'duration',
  'video_description',
].join(',');

let cache: { at: number; payload: unknown } | null = null;
const TTL_MS = 10 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const force = url.searchParams.get('refresh') === '1';
    if (!force && cache && Date.now() - cache.at < TTL_MS) {
      return new Response(JSON.stringify({ cached: true, ...(cache.payload as object) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TIKTOK_API_KEY = Deno.env.get('TIKTOK_API_KEY');
    if (!LOVABLE_API_KEY || !TIKTOK_API_KEY) {
      return new Response(JSON.stringify({ error: 'TikTok connector not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': TIKTOK_API_KEY,
      'Content-Type': 'application/json',
    };

    // Profile (with stats)
    const profileRes = await fetch(
      `${GATEWAY_URL}/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,follower_count,following_count,likes_count,video_count`,
      { method: 'GET', headers },
    );
    const profileJson = profileRes.ok ? await profileRes.json() : null;

    // Videos
    const videoRes = await fetch(`${GATEWAY_URL}/video/list/?fields=${VIDEO_FIELDS}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ max_count: 20 }),
    });

    if (!videoRes.ok) {
      const text = await videoRes.text();
      return new Response(JSON.stringify({ error: 'TikTok API error', status: videoRes.status, detail: text }), {
        status: videoRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const videoJson = await videoRes.json();
    const payload = {
      profile: profileJson?.data?.user ?? null,
      videos: videoJson?.data?.videos ?? [],
      fetched_at: new Date().toISOString(),
    };

    cache = { at: Date.now(), payload };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
