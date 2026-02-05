import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  slug: string;
  artist: string;
  album_id: string | null;
  track_number: number | null;
  duration: number;
  audio_url: string | null;
  cover_art_url: string | null;
  explicit: boolean;
  release_year: number | null;
  credits: string | null;
  featured_artists: string | null;
  is_public: boolean;
  play_count: number;
  requires_nft: boolean;
  spotify_url: string | null;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  artist: string;
  release_year: number;
  cover_art_url: string | null;
  description: string | null;
  credits: string | null;
  track_count: number;
  is_public: boolean;
}

interface PlayerStore {
  // State
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isPlayerVisible: boolean;
  isMinimized: boolean;

  // Actions
  playTrack: (track: Track, queue?: Track[], queueIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMinimized: (minimized: boolean) => void;
  closePlayer: () => void;
  isQueueOpen: boolean;
  toggleQueue: () => void;
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isPlayerVisible: false,
  isMinimized: false,
  isQueueOpen: false,

  playTrack: (track, queue, queueIndex) => {
    const newQueue = queue || [track];
    const newIndex = queueIndex ?? 0;
    set({
      currentTrack: track,
      queue: newQueue,
      queueIndex: newIndex,
      isPlaying: true,
      currentTime: 0,
      isPlayerVisible: true,
      isMinimized: false,
    });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  nextTrack: () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      set({
        currentTrack: queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
      });
    }
  },

  prevTrack: () => {
    const { queue, queueIndex, currentTime } = get();
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      set({
        currentTrack: queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
      });
    }
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMinimized: (minimized) => set({ isMinimized: minimized }),
  closePlayer: () => set({ isPlayerVisible: false, isPlaying: false, currentTrack: null, isQueueOpen: false }),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
}));
