import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      console.error('YOUTUBE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching YouTube videos for channel...');

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=mrcap1&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok || !channelData.items || channelData.items.length === 0) {
      console.error('Channel API error:', channelData.error?.message || 'No channel found');
      return new Response(JSON.stringify({ error: 'Failed to load videos' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=9&key=${YOUTUBE_API_KEY}`;
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    if (!playlistResponse.ok) {
      console.error('Playlist API error:', playlistData.error?.message);
      return new Response(JSON.stringify({ error: 'Failed to load videos' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    const videos = playlistData.items.map((item: any) => {
      const videoId = item.contentDetails.videoId;
      const stats = statsData.items?.find((s: any) => s.id === videoId);
      
      const isoDuration = stats?.contentDetails?.duration || 'PT0M0S';
      const durationMatch = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(durationMatch?.[1] || '0');
      const minutes = parseInt(durationMatch?.[2] || '0');
      const seconds = parseInt(durationMatch?.[3] || '0');
      const duration = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: stats?.statistics?.viewCount || '0',
        duration,
      };
    });

    console.log(`Successfully fetched ${videos.length} videos`);

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error fetching YouTube videos:', error);
    return new Response(JSON.stringify({ error: 'Failed to load videos' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
