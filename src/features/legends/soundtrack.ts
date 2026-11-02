// Win soundtrack: songs from "The Ties That Bind Us" play on hits. Presentation only; never affects outcomes.
const BASE = "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/The-Ties-That-Bind-Us/";

export interface WinSong { title: string; file: string; }
const song = (title: string, file: string): WinSong => ({ title, file });

export const WIN_SONGS = {
  supreme: song("Eternal Legacy", "11.%20ETERNAL%20LEGACY%20(M).mp3"),
  unity: song("The Coalition", "19.%20THE%20COALITION%20(M).mp3"),
  sweep: song("Ties That Bind Us", "02.%20TIES%20THAT%20BIND%20US%20(M).mp3"),
  major: song("Bet'n On Me", "06.%20BET%20ON%20ME%20(M).mp3"),
  bonus: song("Recon the Opp", "12.%20RECON%20THE%20OPP%20(M).mp3"),
  line: [
    song("Come Get It If You Want It", "04.%20COME%20GET%20IF%20YOU%20WANT%20IT%20(M).mp3"),
    song("New Better Do Better", "09.%20NEW%20BETTER%20DO%20BETTER%20(M).mp3"),
    song("So Thankful", "08.%20SO%20THANKFUL%20(M).mp3"),
    song("If I Say So", "14.%20IF%20I%20SAY%20SO%20(M).mp3"),
    song("Lips N Hips", "13.%20LIPS%20N%20HIPS%20(M).mp3"),
  ],
};

export interface WinKind { supreme: boolean; unity: boolean; sweep: boolean; major: boolean; bonus: boolean; xp: number; }

/** Picks the song for a hit, biggest event first. Line hits rotate through album cuts. */
export function pickWinSong(k: WinKind, lineIndex = 0): WinSong | null {
  if (k.xp <= 0) return null;
  if (k.supreme) return WIN_SONGS.supreme;
  if (k.unity) return WIN_SONGS.unity;
  if (k.sweep) return WIN_SONGS.sweep;
  if (k.major) return WIN_SONGS.major;
  if (k.bonus) return WIN_SONGS.bonus;
  return WIN_SONGS.line[Math.abs(lineIndex) % WIN_SONGS.line.length];
}

export const songUrl = (s: WinSong) => BASE + s.file;

/** Win songs skip the intro and start at this many seconds in. */
export const WIN_CUE_SECONDS = 15;

/** One audio element; a new hit replaces the current song, a new spin fades it out. */
export class WinSoundtrack {
  private el: HTMLAudioElement | null = null;
  private fade = 0;
  private lines = 0;
  play(k: WinKind, enabled: boolean): WinSong | null {
    const s = pickWinSong(k, this.lines);
    if (!s) return null;
    if (!k.supreme && !k.unity && !k.sweep && !k.major && !k.bonus) this.lines++;
    if (!enabled) return s;
    this.stopNow();
    const el = new Audio(songUrl(s));
    el.volume = 0.7;
    el.addEventListener("loadedmetadata", () => {
      el.currentTime = Math.min(WIN_CUE_SECONDS, Math.max(0, el.duration - 1));
    }, { once: true });
    this.el = el;
    el.play().catch(() => { /* autoplay blocked or offline */ });
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
