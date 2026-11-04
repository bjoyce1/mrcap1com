// Win soundtrack: reward-specific songs from "The Ties That Bind Us".
// Audio is presentation only; it never changes XP, outcomes, or prize eligibility.

const BASE = "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/The-Ties-That-Bind-Us/";

export interface WinSong { title: string; file: string; }
const song = (title: string, file: string): WinSong => ({ title, file });

/** Disjoint song pools keyed only to total credited XP, not achievement flags. */
export const WIN_SONGS = {
  line: [
    song("Lips N Hips", "13.%20LIPS%20N%20HIPS%20(M).mp3"),
    song("So Thankful", "08.%20SO%20THANKFUL%20(M).mp3"),
    song("Letter to Me", "16.%20LETTER%20TO%20ME%20(M).mp3"),
    song("Something You're Not", "15.%20SOMETHING%20YOUR%20NOT%20(M).mp3"),
  ],
  supreme: [
    song("Eternal Legacy", "11.%20ETERNAL%20LEGACY%20(M).mp3"),
    song("Respect", "03.%20RESPECT%20(M).mp3"),
    song("A.C. Chill", "18.%20A.C%20CHILL%20(M).mp3"),
  ],
  major: [song("Come Get It If You Want It", "04.%20COME%20GET%20IF%20YOU%20WANT%20IT%20(M).mp3")],
  unity: [song("The Coalition", "19.%20THE%20COALITION%20(M).mp3")],
  big: [
    song("Bet'n On Me", "06.%20BET%20ON%20ME%20(M).mp3"),
    song("Nobody Comes Close", "17.%20NOBODY%20COMES%20CLOSE%20(M).mp3"),
  ],
  mega: [
    song("New Better Do Better", "09.%20NEW%20BETTER%20DO%20BETTER%20(M).mp3"),
    song("If I Say So", "14.%20IF%20I%20SAY%20SO%20(M).mp3"),
  ],
  legendary: [song("Ties That Bind Us", "02.%20TIES%20THAT%20BIND%20US%20(M).mp3")],
} as const;

export interface WinKind {
  supreme: boolean;
  unity: boolean;
  sweep: boolean;
  major: boolean;
  bonus: boolean;
  xp: number;
}

export function winSongTier(xp: number): keyof typeof WIN_SONGS | null {
  if (!Number.isFinite(xp) || xp <= 0) return null;
  if (xp >= 10000) return 'legendary';
  if (xp >= 2000) return 'mega';
  if (xp >= 1000) return 'big';
  if (xp >= 750) return 'unity';
  if (xp >= 500) return 'major';
  if (xp >= 250) return 'supreme';
  return 'line';
}

/** One song for the spin's total XP, with a caller-owned per-tier rotation. */
export function pickWinSong(k: WinKind, rotationIndex = 0): WinSong | null {
  const tier = winSongTier(k.xp);
  if (!tier) return null;
  const pool = WIN_SONGS[tier];
  const index = Number.isFinite(rotationIndex) ? Math.abs(Math.trunc(rotationIndex)) : 0;
  return pool[index % pool.length];
}

export const songUrl = (s: WinSong) => BASE + s.file;

/** Cue into tracks instead of always playing their intros. */
export const WIN_CUE_SECONDS = 15;

/** One audio element: later wins replace previous tracks; a new spin fades out music. */
export class WinSoundtrack {
  private el: HTMLAudioElement | null = null;
  private fade = 0;
  private rotations: Partial<Record<keyof typeof WIN_SONGS, number>> = {};

  play(k: WinKind, enabled: boolean): WinSong | null {
    const tier = winSongTier(k.xp);
    if (!tier) return null;
    const index = this.rotations[tier] ?? 0;
    const s = pickWinSong(k, index);
    if (!s) return null;
    this.rotations[tier] = index + 1;
    if (!enabled) return s;
    this.stopNow();
    const el = new Audio(songUrl(s));
    el.volume = 0.7;
    el.addEventListener("loadedmetadata", () => {
      if (this.el === el && Number.isFinite(el.duration)) el.currentTime = Math.min(WIN_CUE_SECONDS, Math.max(0, el.duration - 1));
    }, { once: true });
    this.el = el;
    void el.play().catch(() => { /* blocked by user gesture policy or offline */ });
    return s;
  }
  fadeOut(ms = 600) {
    const el = this.el; if (!el) return;
    clearInterval(this.fade);
    const step = el.volume / Math.max(1, ms / 50);
    this.fade = window.setInterval(() => {
      if (el.volume <= step) { clearInterval(this.fade); el.pause(); if (this.el === el) this.el = null; }
      else el.volume -= step;
    }, 50);
  }
  stopNow() { clearInterval(this.fade); if (this.el) { this.el.pause(); this.el = null; } }
}
