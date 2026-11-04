// Win soundtrack: reward-specific songs from "The Ties That Bind Us".
// Audio is presentation only; it never changes XP, outcomes, or prize eligibility.
import { tiersFor } from "./fx";

const BASE = "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/The-Ties-That-Bind-Us/";

export interface WinSong { title: string; file: string; }
const song = (title: string, file: string): WinSong => ({ title, file });

/**
 * Every named win level gets a DISTINCT track. These filenames are drawn from the
 * pre-existing album mapping; new tracks should be verified before adding.
 *
 * The priority is: Legend Sweep > Legendary > Mega > Big > Unity > Supreme >
 * 713 Bonus > other major/multiplier > ordinary line (rotating).
 *
 * XP tiers take precedence over overlapping achievements (e.g. a Supreme + Unity
 * + Mega result gets the Mega song). This prevents Supreme from masking a bigger win.
 */
export const WIN_SONGS = {
  sweep: song("Ties That Bind Us", "02.%20TIES%20THAT%20BIND%20US%20(M).mp3"),
  legendary: song("If I Say So", "14.%20IF%20I%20SAY%20SO%20(M).mp3"),
  mega: song("New Better Do Better", "09.%20NEW%20BETTER%20DO%20BETTER%20(M).mp3"),
  big: song("Bet'n On Me", "06.%20BET%20ON%20ME%20(M).mp3"),
  unity: song("The Coalition", "19.%20THE%20COALITION%20(M).mp3"),
  supreme: song("Eternal Legacy", "11.%20ETERNAL%20LEGACY%20(M).mp3"),
  bonus: song("Recon the Opp", "12.%20RECON%20THE%20OPP%20(M).mp3"),
  // This is distinct from XP tiers: a bonus multiplier with a sub-1,000 XP
  // award should still sound different from ordinary 3-of-a-kind line matches.
  major: song("Come Get It If You Want It", "04.%20COME%20GET%20IF%20YOU%20WANT%20IT%20(M).mp3"),
  line: [
    song("So Thankful", "08.%20SO%20THANKFUL%20(M).mp3"),
    song("Lips N Hips", "13.%20LIPS%20N%20HIPS%20(M).mp3"),
  ],
} as const;

export interface WinKind {
  supreme: boolean;
  unity: boolean;
  sweep: boolean;
  major: boolean;
  bonus: boolean;
  xp: number;
}

/** Choose one track per spin according to its HIGHEST award category. */
export function pickWinSong(k: WinKind, lineIndex = 0): WinSong | null {
  if (!Number.isFinite(k.xp) || k.xp <= 0) return null;
  if (k.sweep) return WIN_SONGS.sweep;
  const highestTier = tiersFor(k.xp).at(-1)?.tier;
  if (highestTier === "legendary") return WIN_SONGS.legendary;
  if (highestTier === "mega") return WIN_SONGS.mega;
  if (highestTier === "big") return WIN_SONGS.big;
  if (k.unity) return WIN_SONGS.unity;
  if (k.supreme) return WIN_SONGS.supreme;
  if (k.bonus) return WIN_SONGS.bonus;
  if (k.major) return WIN_SONGS.major;
  return WIN_SONGS.line[Math.abs(Math.trunc(lineIndex)) % WIN_SONGS.line.length];
}

export const songUrl = (s: WinSong) => BASE + s.file;

/** Cue into tracks instead of always playing their intros. */
export const WIN_CUE_SECONDS = 15;

/** One audio element: later wins replace previous tracks; a new spin fades out music. */
export class WinSoundtrack {
  private el: HTMLAudioElement | null = null;
  private fade = 0;
  private lines = 0;

  play(k: WinKind, enabled: boolean): WinSong | null {
    const s = pickWinSong(k, this.lines);
    if (!s) return null;
    if (!k.sweep && !tiersFor(k.xp).length && !k.unity && !k.supreme && !k.bonus && !k.major) this.lines++;
    if (!enabled) return s;
    this.stopNow();
    const el = new Audio(songUrl(s));
    el.volume = 0.7;
    el.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(el.duration)) el.currentTime = Math.min(WIN_CUE_SECONDS, Math.max(0, el.duration - 1));
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
