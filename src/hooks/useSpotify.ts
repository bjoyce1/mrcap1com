import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SpotifyArtist {
  id: string;
  name: string;
  followers: number;
  popularity: number;
  genres: string[];
  image: string | null;
  spotifyUrl: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: string;
  albumImage: string | null;
  durationMs: number;
  popularity: number;
  previewUrl: string | null;
  spotifyUrl: string | null;
  explicit: boolean;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  totalTracks: number;
  image: string | null;
  spotifyUrl: string | null;
}

export interface SpotifyData {
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
}

/**
 * Fetches live Spotify data (artist profile, top tracks, albums) via the
 * spotify-artist edge function. Cached for 1 hour client-side to match the
 * edge function's CDN cache.
 */
export function useSpotify() {
  return useQuery<SpotifyData>({
    queryKey: ["spotify-artist"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("spotify-artist");
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "Failed to load Spotify data");
      return data as SpotifyData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: false,
    refetchOnWindowFocus: false,
  });
}

/** Format milliseconds as M:SS */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Format a follower count like 12345 → "12.3K" */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
