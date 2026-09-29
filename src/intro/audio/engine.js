import { STREAM } from '../config.js';

// One <audio> element → Web Audio graph (analyser → gain → out).
// The analyser feeds the whole world: bass/mid/high/energy + raw bins.

export function createAudio() {
  const el = new Audio();
  el.crossOrigin = 'anonymous';
  el.preload = 'metadata';

  let ctx = null, analyser = null, gain = null, data = null, crackleGain = null, sfx = null, noise = null;
  let kAvg = 0, lastKick = 0, lastSample = 0;
  const listeners = new Set();
  let dead = false;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (!dead) fn(); }, ms); timers.add(id); };
  const peaks = { bass: 0.35, mid: 0.3, high: 0.2 };

  // kick: 0–1 punch that decays after each detected kick drum; beat: running count of kicks
  const levels = { bass: 0, mid: 0, high: 0, energy: 0, kick: 0, beat: 0, bins: null, playing: false, progress: 0 };
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
    // sound design bus (whoosh/boom) — rides the master volume
    sfx = ctx.createGain();
    sfx.gain.value = 0.9;
    sfx.connect(ctx.destination);
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nch = nb.getChannelData(0);
    for (let i = 0; i < nch.length; i++) nch[i] = Math.random() * 2 - 1;
    noise = nb;
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
    node.connect(bp); bp.connect(crackleGain); crackleGain.connect(gain);
    node.start();
  }

  function sourceFor(t) {
    if (t.audio.startsWith('/')) return t.audio;
    return STREAM.previewSeconds > 0 ? `${STREAM.preview}?track_id=${encodeURIComponent(t.id)}` : STREAM.storage + t.audio;
  }

  async function load(index) {
    if (dead) return;
    const t = state.queue[index];
    if (!t) return;
    state.index = index;
    state.track = t;
    state.ended = false;
    state.preview = STREAM.previewSeconds > 0 && !t.free && !t.audio.startsWith('/');
    state.cap = state.preview ? STREAM.previewSeconds : 0;
    el.playbackRate = 1;
    el.preservesPitch = true;
    el.src = sourceFor(t);
    if (gain) gain.gain.cancelScheduledValues(0), gain.gain.setValueAtTime(volume, ctx.currentTime);
    emit('track');
    updateMediaSession(t);
    try { await el.play(); } catch (e) { emit('blocked', e); }
  }

  let volume = 0.9, stopping = false;

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

    // turntable power-off: pitch and speed sag together, then silence
    recordStop(seconds = 0.85) {
      stopping = true;
      if (el.paused || !ctx) { this.fadeOut(seconds); return; }
      el.preservesPitch = false;
      el.mozPreservesPitch = false;
      el.webkitPreservesPitch = false;
      const t0 = performance.now();
      const tick = (n) => {
        if (dead) return;
        const k = Math.min(1, (n - t0) / (seconds * 1000));
        try { el.playbackRate = Math.max(0.07, 1 - k * k); } catch { /* rate out of range */ }
        if (k < 1) requestAnimationFrame(tick); else el.pause();
      };
      requestAnimationFrame(tick);
      gain.gain.setTargetAtTime(0, ctx.currentTime + seconds * 0.6, seconds * 0.15);
      crackleGain?.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    },

    // chopped & screwed: while held the record sags to a syrup tempo, pitch and all (0..1, eased by the caller)
    screw(amount) {
      if (stopping || el.paused) return;
      const pitchFree = amount > 0;
      if (el.preservesPitch === pitchFree) { el.preservesPitch = !pitchFree; el.mozPreservesPitch = !pitchFree; el.webkitPreservesPitch = !pitchFree; }
      const want = pitchFree ? 1 - 0.3 * amount : 1;
      if (Math.abs(el.playbackRate - want) > 0.003 || (want === 1 && el.playbackRate !== 1)) {
        try { el.playbackRate = want; } catch { /* rate out of range */ }
      }
    },
    // ...and letting go chops it: the last half-beat plays again
    chop(seconds = 0.42) {
      if (stopping || el.paused || !el.duration) return false;
      el.currentTime = Math.max(0, el.currentTime - seconds);
      return true;
    },

    // sound design for the word fly-throughs (only after the visitor chose sound)
    whoosh(d = 0.8) {
      if (!ctx || !noise) return;
      const t = ctx.currentTime, s = ctx.createBufferSource();
      s.buffer = noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(260, t);
      bp.frequency.exponentialRampToValueAtTime(5200, t + d);
      const g = ctx.createGain();
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(0.28 * volume, t + d * 0.85);
      g.gain.exponentialRampToValueAtTime(1e-4, t + d + 0.12);
      s.connect(bp).connect(g).connect(sfx);
      s.start(t);
      s.stop(t + d + 0.2);
    },
    boom() {
      if (!ctx) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(68, t);
      o.frequency.exponentialRampToValueAtTime(32, t + 0.7);
      g.gain.setValueAtTime(0.8 * volume, t);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.8);
      o.connect(g).connect(sfx);
      o.start(t);
      o.stop(t + 0.85);
      // sidechain duck: the music dips under the hit
      if (!el.paused) {
        gain.gain.setTargetAtTime(volume * 0.45, t, 0.015);
        gain.gain.setTargetAtTime(volume, t + 0.25, 0.12);
      }
    },

    destroy() {
      dead = true;
      timers.forEach(clearTimeout);
      timers.clear();
      listeners.clear();
      el.pause();
      el.removeAttribute('src');
      el.load();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        for (const a of ['play', 'pause', 'nexttrack', 'previoustrack']) { try { navigator.mediaSession.setActionHandler(a, null); } catch { /* unsupported */ } }
      }
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
        // kick onsets: spectral flux in the lowest bins against a running average
        const kb = band(1, 2);
        const flux = Math.max(0, kb - kAvg);
        kAvg += (kb - kAvg) * 0.1;
        if (flux > 0.07 + kAvg * 0.15 && time - lastKick > 0.23) { lastKick = time; levels.kick = 1; levels.beat++; }
      } else {
        // idle breathing so the world never feels dead
        const idle = 0.05 + Math.sin(time * 1.3) * 0.03;
        levels.bass += (idle - levels.bass) * 0.05;
        levels.mid += (idle * 0.8 - levels.mid) * 0.05;
        levels.high += (idle * 0.5 - levels.high) * 0.05;
      }
      levels.energy = levels.bass * 0.5 + levels.mid * 0.35 + levels.high * 0.15;
      levels.kick *= Math.exp(-Math.max(0, time - lastSample) * 7);
      lastSample = time;
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
      later(() => { if (state.ended && state.queue.length > 1) api.next(); }, 1600);
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
  el.addEventListener('error', () => { if (dead) return; emit('error'); later(() => state.queue.length > 1 && api.next(), 1200); });

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
