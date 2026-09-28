import { STREAM } from '../config.js';

// One <audio> element → Web Audio graph (analyser → gain → out).
// The analyser feeds the whole world: bass/mid/high/energy + raw bins.

export function createAudio() {
  const el = new Audio();
  el.crossOrigin = 'anonymous';
  el.preload = 'metadata';

  let ctx = null, analyser = null, gain = null, data = null, crackleGain = null;
  const listeners = new Set();
  const peaks = { bass: 0.35, mid: 0.3, high: 0.2 };

  const levels = { bass: 0, mid: 0, high: 0, energy: 0, bins: null, playing: false, progress: 0 };
  const state = { queue: [], index: -1, track: null, preview: false, cap: 0, ended: false };

  const emit = (type, extra) => listeners.forEach((fn) => fn(type, state, extra));

  function ensureContext() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaElementSource(el);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    gain = ctx.createGain();
    src.connect(analyser);
    analyser.connect(gain);
    gain.connect(ctx.destination);
    data = new Uint8Array(analyser.frequencyBinCount);
    levels.bins = data;
    buildCrackle();
  }

  // Needle-on-wax ambience for the booth before the beat drops.
  function buildCrackle() {
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      let v = (Math.random() * 2 - 1) * 0.012; // hiss
      if (Math.random() < 0.0009) v += (Math.random() * 2 - 1) * (0.4 + Math.random() * 0.6); // pops
      ch[i] = v;
    }
    const node = ctx.createBufferSource();
    node.buffer = buf; node.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.6;
    crackleGain = ctx.createGain();
    crackleGain.gain.value = 0;
    node.connect(bp); bp.connect(crackleGain); crackleGain.connect(ctx.destination);
    node.start();
  }

  function sourceFor(t) {
    if (t.audio.startsWith('/')) return t.audio;
    return STREAM.previewSeconds > 0 ? `${STREAM.preview}?track_id=${encodeURIComponent(t.id)}` : STREAM.storage + t.audio;
  }

  async function load(index) {
    const t = state.queue[index];
    if (!t) return;
    state.index = index;
    state.track = t;
    state.ended = false;
    state.preview = STREAM.previewSeconds > 0 && !t.free && !t.audio.startsWith('/');
    state.cap = state.preview ? STREAM.previewSeconds : 0;
    el.src = sourceFor(t);
    if (gain) gain.gain.cancelScheduledValues(0), gain.gain.setValueAtTime(volume, ctx.currentTime);
    emit('track');
    updateMediaSession(t);
    try { await el.play(); } catch (e) { emit('blocked', e); }
  }

  let volume = 0.9;

  const api = {
    el, levels, state,
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get unlocked() { return !!ctx; },
    unlock() {
      ensureContext();
      ctx.resume();
    },
    // queue: array of playable tracks; start: index or track
    play(queue, start = 0) {
      ensureContext();
      ctx.resume();
      const playable = queue.filter((t) => t.audio);
      const idx = typeof start === 'number' ? start : Math.max(0, playable.findIndex((t) => t.id === start.id));
      state.queue = playable;
      return load(idx);
    },
    toggle() {
      if (!state.track) return false;
      ensureContext(); ctx.resume();
      if (el.paused) el.play().catch(() => {}); else el.pause();
      return !el.paused;
    },
    pause() { el.pause(); },
    next() { if (state.queue.length) load((state.index + 1) % state.queue.length); },
    prev() {
      if (el.currentTime > 3) { el.currentTime = 0; return; }
      if (state.queue.length) load((state.index - 1 + state.queue.length) % state.queue.length);
    },
    seek(frac) {
      if (!el.duration) return;
      const limit = state.cap || el.duration;
      el.currentTime = Math.min(frac * el.duration, limit - 0.25);
    },
    setVolume(v) { volume = v; if (gain) gain.gain.setTargetAtTime(v, ctx.currentTime, 0.05); else el.volume = v; },
    get volume() { return volume; },
    setCrackle(v) { if (crackleGain) crackleGain.gain.setTargetAtTime(v, ctx.currentTime, 0.25); },

    // soft landing when the visitor enters the site
    fadeOut(seconds = 1) {
      if (gain) gain.gain.setTargetAtTime(0, ctx.currentTime, seconds / 4);
      if (crackleGain) crackleGain.gain.setTargetAtTime(0, ctx.currentTime, seconds / 4);
      else el.volume = 0;
    },

    destroy() {
      listeners.clear();
      el.pause();
      el.removeAttribute('src');
      el.load();
      if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
      ctx?.close().catch(() => {});
      ctx = null;
    },

    // called every frame
    sample(time) {
      levels.playing = !el.paused && !el.ended && el.readyState > 2;
      levels.progress = el.duration ? el.currentTime / el.duration : 0;
      if (analyser && levels.playing) {
        analyser.getByteFrequencyData(data);
        const band = (a, b) => { let s = 0; for (let i = a; i <= b; i++) s += data[i]; return s / (b - a + 1) / 255; };
        const raw = { bass: band(1, 4), mid: band(5, 40), high: band(41, 150) };
        for (const k of ['bass', 'mid', 'high']) {
          peaks[k] = Math.max(raw[k], peaks[k] * 0.9985, 0.08);
          const v = Math.pow(raw[k] / peaks[k], k === 'bass' ? 2.2 : 1.6);
          levels[k] += (v - levels[k]) * (v > levels[k] ? 0.5 : 0.12);
        }
      } else {
        // idle breathing so the world never feels dead
        const idle = 0.05 + Math.sin(time * 1.3) * 0.03;
        levels.bass += (idle - levels.bass) * 0.05;
        levels.mid += (idle * 0.8 - levels.mid) * 0.05;
        levels.high += (idle * 0.5 - levels.high) * 0.05;
      }
      levels.energy = levels.bass * 0.5 + levels.mid * 0.35 + levels.high * 0.15;
      levels.bins = levels.playing ? data : null;
      return levels;
    },
  };

  // 30-second preview cap — fade out, tell the UI, roll to the next record
  el.addEventListener('timeupdate', () => {
    emit('time');
    if (!state.cap || state.ended) return;
    if (el.currentTime >= state.cap - 1.6 && gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    if (el.currentTime >= state.cap) {
      state.ended = true;
      el.pause();
      emit('preview-end');
      setTimeout(() => { if (state.ended && state.queue.length > 1) api.next(); }, 1600);
    }
  });
  el.addEventListener('ended', () => { emit('ended'); if (state.queue.length > 1) api.next(); });
  el.addEventListener('play', () => {
    // replaying a finished preview starts it over (and re-arms the cap)
    if (state.cap && el.currentTime >= state.cap - 0.3) el.currentTime = 0;
    if (state.ended) {
      state.ended = false;
      if (gain) gain.gain.cancelScheduledValues(0), gain.gain.setValueAtTime(volume, ctx.currentTime);
    }
    emit('play');
  });
  el.addEventListener('pause', () => emit('pause'));
  el.addEventListener('loadedmetadata', () => emit('meta'));
  el.addEventListener('error', () => { emit('error'); setTimeout(() => state.queue.length > 1 && api.next(), 1200); });

  function updateMediaSession(t) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.ft ? `${t.artist} ft. ${t.ft}` : t.artist,
      album: t.album ? t.album.replace(/-/g, ' ') : 'Single',
      artwork: [{ src: t.cover, sizes: '512x512', type: t.cover.endsWith('.png') ? 'image/png' : 'image/webp' }],
    });
    navigator.mediaSession.setActionHandler('play', () => el.play());
    navigator.mediaSession.setActionHandler('pause', () => el.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => api.next());
    navigator.mediaSession.setActionHandler('previoustrack', () => api.prev());
  }

  return api;
}
