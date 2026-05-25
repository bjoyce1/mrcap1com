import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mr. CAP's Spotify Artist ID (from structured data)
const ARTIST_ID = '69pjfQNXA1xjusnI2wfgug';
const MARKET = 'US';

// Simple in-memory token cache (persists for the life of the function instance)
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  // Reuse cached token if still valid (with 60s safety buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Spotify token request failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
  return cachedToken.value;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = await getAccessToken(clientId, clientSecret);
    const authHeader = { 'Authorization': `Bearer ${token}` };

    // Fetch artist profile, top tracks, and albums in parallel
    const [artistRes, topTracksRes, albumsRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, { headers: authHeader }),
      fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=${MARKET}`, { headers: authHeader }),
      fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=${MARKET}&limit=20`, { headers: authHeader }),
    ]);

    if (!artistRes.ok) {
      const errText = await artistRes.text();
      console.error('Spotify artist API error:', artistRes.status, errText);
      return new Response(JSON.stringify({ error: 'Failed to load artist data' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const artistData = await artistRes.json();
    const topTracksData = topTracksRes.ok ? await topTracksRes.json() : { tracks: [] };
    const albumsData = albumsRes.ok ? await albumsRes.json() : { items: [] };

    // Shape the artist profile
    const artist = {
      id: artistData.id,
      name: artistData.name,
      followers: artistData.followers?.total ?? 0,
      popularity: artistData.popularity ?? 0,
      genres: artistData.genres ?? [],
      image: artistData.images?.[0]?.url ?? null,
      spotifyUrl: artistData.external_urls?.spotify ?? `https://open.spotify.com/artist/${ARTIST_ID}`,
    };

    // Shape top tracks
    const topTracks = (topTracksData.tracks ?? []).slice(0, 10).map((t: any) => ({
      id: t.id,
      name: t.name,
      album: t.album?.name ?? '',
      albumImage: t.album?.images?.[0]?.url ?? null,
      durationMs: t.duration_ms ?? 0,
      popularity: t.popularity ?? 0,
      previewUrl: t.preview_url ?? null,
      spotifyUrl: t.external_urls?.spotify ?? null,
      explicit: t.explicit ?? false,
    }));

    // Shape albums (dedupe by name, newest first)
    const seen = new Set<string>();
    const albums = (albumsData.items ?? [])
      .filter((a: any) => {
        const key = a.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((a: any) => ({
        id: a.id,
        name: a.name,
        type: a.album_type,
        releaseDate: a.release_date,
        totalTracks: a.total_tracks ?? 0,
        image: a.images?.[0]?.url ?? null,
        spotifyUrl: a.external_urls?.spotify ?? null,
      }));

    console.log(`Spotify: ${artist.followers} followers, ${topTracks.length} top tracks, ${albums.length} albums`);

    return new Response(JSON.stringify({ artist, topTracks, albums }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        // Cache at the CDN edge for 1 hour to reduce Spotify API calls
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error: unknown) {
    console.error('Error in spotify-artist function:', error);
    return new Response(JSON.stringify({ error: 'Failed to load Spotify data' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
