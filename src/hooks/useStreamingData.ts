import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Track, Album } from "@/stores/playerStore";

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .eq("is_public", true)
        .order("release_year", { ascending: false });
      if (error) throw error;
      return data as Album[];
    },
  });
}

export function useAlbumBySlug(slug: string) {
  return useQuery({
    queryKey: ["album", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();
      if (error) throw error;
      return data as Album | null;
    },
    enabled: !!slug,
  });
}

export function useAlbumTracks(albumId: string | undefined) {
  return useQuery({
    queryKey: ["album-tracks", albumId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("album_id", albumId!)
        .eq("is_public", true)
        .order("track_number", { ascending: true });
      if (error) throw error;
      return data as Track[];
    },
    enabled: !!albumId,
  });
}

export function useTrackBySlug(slug: string) {
  return useQuery({
    queryKey: ["track", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();
      if (error) throw error;
      return data as Track | null;
    },
    enabled: !!slug,
  });
}

export function useAllTracks() {
  return useQuery({
    queryKey: ["all-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("is_public", true)
        .order("release_year", { ascending: false });
      if (error) throw error;
      return data as Track[];
    },
  });
}

export function useLatestTracks(limit = 10) {
  return useQuery({
    queryKey: ["latest-tracks", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("is_public", true)
        .order("release_year", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Track[];
    },
  });
}
