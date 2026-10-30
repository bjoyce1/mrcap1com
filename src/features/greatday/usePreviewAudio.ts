import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import { PREVIEW_SECONDS } from './content';
import previewClip from '@/assets/greatday/audio/twagd-slowed-chopped-preview.mp3';

// A one-minute excerpt of the Slowed & Chopped version (0:15 to 1:15, faded at both ends); the
// full master stays out of the site. The cap is enforced here too, and nothing is reported:
// Great Day analytics stay off during the private review.
export const PREVIEW_URL = previewClip;

/**
 * The host sends the clip whole and never in byte ranges, so Chrome will not seek in it and
 * Safari may not play it at all. On the first press the clip (about 1.2 MB) downloads once and
 * plays from a copy held in memory, which seeks anywhere. Kept for the session.
 */
let held: Promise<string> | null = null;
const holdClip = () => (held ??= fetch(PREVIEW_URL)
  .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(`preview ${r.status}`))))
  .then((blob) => URL.createObjectURL(blob))
  .catch((error: unknown) => { held = null; throw error; }));

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface PreviewAudio {
  audioRef: RefObject<HTMLAudioElement>;
  status: AudioStatus;
  /** seconds, updated with the element's timeupdate events */
  time: number;
  /** 0 to 1, updated every frame while playing */
  progress: MotionValue<number>;
  toggle: () => void;
  seek: (seconds: number) => void;
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function usePreviewAudio(): PreviewAudio {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [time, setTime] = useState(0);
  const progress = useMotionValue(0);
  /** a press is waiting on the download; a second press cancels it */
  const wanted = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlaying = () => setStatus('playing');
    const onWaiting = () => setStatus('loading');
    const onPause = () => setStatus((s) => (s === 'ended' || s === 'error' ? s : 'paused'));
    const onEnded = () => setStatus('ended');
    const onError = () => setStatus('error');
    const onTime = () => {
      if (audio.currentTime >= PREVIEW_SECONDS) {
        setStatus('ended');
        audio.pause();
        setTime(PREVIEW_SECONDS);
        progress.set(1);
        return;
      }
      setTime(audio.currentTime);
    };
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', onTime);
    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', onTime);
    };
  }, [progress]);

  // timeupdate fires a few times a second; the chain fills every frame instead
  useEffect(() => {
    if (status !== 'playing') return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) progress.set(Math.min(audio.currentTime / PREVIEW_SECONDS, 1));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, progress]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === 'playing' || status === 'loading') {
      wanted.current = false;
      audio.pause();
      if (status === 'loading') setStatus('paused');
      return;
    }
    if (status === 'ended' || audio.currentTime >= PREVIEW_SECONDS) {
      audio.currentTime = 0;
      setTime(0);
      progress.set(0);
    }
    const retry = status === 'error';
    setStatus('loading');
    wanted.current = true;
    holdClip().then((url) => {
      if (!wanted.current) return;
      if (audio.src !== url) {
        const at = audio.currentTime;
        audio.src = url;
        audio.currentTime = at;
      } else if (retry) audio.load();
      return audio.play();
    }).catch((error: unknown) => {
      // a pause during loading rejects the play promise; that is not a failure
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('error');
    });
  }, [status, progress]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(Math.max(seconds, 0), PREVIEW_SECONDS - 0.25);
    audio.currentTime = next;
    setTime(next);
    progress.set(next / PREVIEW_SECONDS);
    setStatus((s) => (s === 'ended' ? 'paused' : s));
  }, [progress]);

  return { audioRef, status, time, progress, toggle, seek };
}
