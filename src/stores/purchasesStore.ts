import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface PurchasesStore {
  ownedTrackIds: Set<string>;
  ownedAlbumIds: Set<string>;
  loaded: boolean;
  hydrate: (userId: string | null) => Promise<void>;
  ownsTrack: (trackId: string, albumId?: string | null) => boolean;
  ownsAlbum: (albumId: string) => boolean;
  markOwned: (itemType: "track" | "album", itemId: string) => void;
}

export const usePurchasesStore = create<PurchasesStore>()((set, get) => ({
  ownedTrackIds: new Set(),
  ownedAlbumIds: new Set(),
  loaded: false,

  hydrate: async (userId) => {
    if (!userId) {
      set({ ownedTrackIds: new Set(), ownedAlbumIds: new Set(), loaded: true });
      return;
    }
    const { data, error } = await supabase
      .from("purchases")
      .select("item_type, item_id")
      .eq("user_id", userId)
      .eq("status", "paid");
    if (error) {
      console.error("hydrate purchases:", error);
      set({ loaded: true });
      return;
    }
    const tracks = new Set<string>();
    const albums = new Set<string>();
    for (const row of data || []) {
      if (row.item_type === "track") tracks.add(row.item_id);
      else if (row.item_type === "album") albums.add(row.item_id);
    }
    set({ ownedTrackIds: tracks, ownedAlbumIds: albums, loaded: true });
  },

  ownsTrack: (trackId, albumId) => {
    const { ownedTrackIds, ownedAlbumIds } = get();
    if (ownedTrackIds.has(trackId)) return true;
    if (albumId && ownedAlbumIds.has(albumId)) return true;
    return false;
  },

  ownsAlbum: (albumId) => get().ownedAlbumIds.has(albumId),

  markOwned: (itemType, itemId) => {
    set((s) => {
      if (itemType === "track") {
        const next = new Set(s.ownedTrackIds);
        next.add(itemId);
        return { ownedTrackIds: next };
      } else {
        const next = new Set(s.ownedAlbumIds);
        next.add(itemId);
        return { ownedAlbumIds: next };
      }
    });
  },
}));
