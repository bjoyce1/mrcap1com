import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TikTokVideo {
  id: string;
  title: string;
  cover_image_url: string;
  share_url: string;
  embed_link?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  duration: number;
  video_description: string;
}

export interface TikTokProfile {
  open_id: string;
  display_name: string;
  avatar_url: string;
  bio_description?: string;
  profile_deep_link?: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokFeed {
  profile: TikTokProfile | null;
  videos: TikTokVideo[];
  fetched_at: string;
  cached?: boolean;
}

export function useTikTokFeed() {
  return useQuery<TikTokFeed>({
    queryKey: ["tiktok-feed"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("tiktok-videos", { method: "GET" });
      if (error) throw error;
      return data as TikTokFeed;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
