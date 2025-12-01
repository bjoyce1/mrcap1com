import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const CHANNEL_ID = 'UCmrcap1'; // Mr. CAP's channel

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching YouTube videos for channel...');

    // First, get the channel's uploads playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=mrcap1&key=${YOUTUBE_API_KEY}`;
    
    console.log('Fetching channel info...');
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok) {
      console.error('Channel API error:', channelData);
      throw new Error(channelData.error?.message || 'Failed to fetch channel');
    }

    if (!channelData.items || channelData.items.length === 0) {
      console.error('No channel found');
      throw new Error('Channel not found');
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    console.log('Uploads playlist ID:', uploadsPlaylistId);

    // Get videos from the uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=9&key=${YOUTUBE_API_KEY}`;
    
    console.log('Fetching playlist items...');
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    if (!playlistResponse.ok) {
      console.error('Playlist API error:', playlistData);
      throw new Error(playlistData.error?.message || 'Failed to fetch videos');
    }

    // Get video statistics for view counts
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    // Map video data with statistics
    const videos = playlistData.items.map((item: any) => {
      const videoId = item.contentDetails.videoId;
      const stats = statsData.items?.find((s: any) => s.id === videoId);
      
      // Parse duration from ISO 8601 format
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching YouTube videos:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
