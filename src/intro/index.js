// ═══════════════════════════════════════════════════════════════════════════════
// Mr. CAP — "Step inside the ISM" immersive intro
//
//   const intro = await mountIntro(hostElement, { onEnter, onNavigate, insert, signal });
//   intro.destroy();
//
// Everything (WebGL, audio, Lenis scroll, DOM, listeners, timers) lives inside `host`
// and is torn down by destroy() — or by aborting `signal` while it is still booting.
// ═══════════════════════════════════════════════════════════════════════════════
import '@fontsource/archivo/600.css';
import './intro.css';

import * as THREE from 'three';
import Lenis from 'lenis';
import { createEngine } from './gl/engine.js';
import { createBooth, RECORD_CENTER } from './gl/booth.js';
import { createUniverse, uForAlbum } from './gl/universe.js';
import { railSample } from './gl/path.js';
import { loadImage, recordLabel } from './gl/textures.js';
import { createAudio } from './audio/engine.js';
import { createStations } from './ui/stations.js';
import { createPlayer } from './ui/player.js';
import { createModals } from './ui/modals.js';
import { createNav } from './ui/nav.js';
import { TOTAL, SCENE_SWITCH, MOMENTS, WORDS, STATIONS, range, smooth, clamp } from './core/timeline.js';
import { TRACKS, ALBUMS, HERO_TRACK, LATEST, SINGLES, HOUSE_CHARTS, albumTracks, bySlug } from './data/catalog.js';
import { CONTACT } from './data/content.js';

const SKELETON = /* html */ `
  <div class="loader" data-el="loader" role="dialog" aria-modal="true" aria-label="Mr. CAP intro">
    <div class="loader__inner">
      <img class="loader__coin" src="/intro/img/brand/cap-coin.webp" alt="" width="120" height="120" />
      <div class="loader__bar" data-el="loader-bar" role="progressbar" aria-label="Loading the intro" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-el="loader-fill"></span></div>
      <p class="loader__label" aria-hidden="true"><span data-el="loader-text">Pressing the vinyl</span> · <span data-el="loader-pct">0%</span></p>
      <div class="loader__gate" data-el="gate" hidden>
        <button class="btn btn--candy" data-enter="sound"><span class="i-sound" aria-hidden="true"></span>Enter with sound</button>
        <button class="btn btn--ghost" data-enter="silent">Enter in silence</button>
        <p class="loader__hint">Headphones up. Scroll to drop the needle.</p>
      </div>
      <button class="loader__skip" data-action="enter-site">Skip the intro <span aria-hidden="true">→</span></button>
    </div>
  </div>
  <canvas id="gl" aria-hidden="true"></canvas>
  <header class="topbar">
    <a class="brand" href="#top" data-goto="0" aria-label="Mr. CAP — back to the top of the intro">
      <img src="/intro/img/brand/cap-coin.webp" alt="" width="36" height="36" />
      <span><b>MR. CAP</b><small>EST. HOUSTON TX</small></span>
    </a>
    <nav class="topbar__right" aria-label="Quick actions">
      <button class="link-btn" data-action="toggle-motion" aria-pressed="false">Pause motion</button>
      <button class="link-btn" data-open="crate">The Crate <em>${TRACKS.length}</em></button>
      <button class="btn btn--candy btn--sm" data-open="booking">Book Mr. CAP <span class="arrow" aria-hidden="true">→</span></button>
      <button class="btn btn--enter" data-action="enter-site">Enter site <span class="arrow" aria-hidden="true">→</span></button>
    </nav>
  </header>
  <main class="stations" data-el="stations"></main>
  <nav class="chapters" data-el="chapters" aria-label="Chapters"></nav>
  <div class="progress-rail" aria-hidden="true"><span data-el="progress-fill"></span></div>
  <aside class="player" data-el="player" aria-label="Intro music player"></aside>
  <div data-el="modals" data-lenis-prevent></div>
  <div class="toast" data-el="toast" role="status" aria-live="polite"></div>
  <div class="exit-veil" data-el="veil" aria-hidden="true"></div>
  <div class="scroll-track" data-el="track" aria-hidden="true"></div>
`;

// Page-level state (html classes, scroll restoration) is reference-counted so a stale
// instance finishing its teardown can never strip it from a live one.
let live = 0, prevRestore = 'auto';
function claimPage() {
  if (live++ === 0) {
    prevRestore = history.scrollRestoration;
    document.documentElement.classList.add('intro-active');
    history.scrollRestoration = 'manual';
  }
}
function releasePage() {
  if (--live > 0) return;
  live = 0;
  document.documentElement.classList.remove('intro-active', 'modal-open', 'lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
  history.scrollRestoration = prevRestore;
}

const coarse = matchMedia('(pointer: coarse)').matches;
// phones load the @640 variants of the 3D textures (generated next to the originals)
const sized = (url) => (coarse && url.startsWith('/intro/img/') ? url.replace(/(\.\w+)$/, '@640$1') : url);

export async function mountIntro(host, { onEnter, onNavigate, insert, signal: outer } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ac = new AbortController();
  const { signal } = ac;
  if (outer?.aborted) return { exit() {}, destroy() {} };
  outer?.addEventListener('abort', () => ac.abort(), { once: true });
  let destroyed = false, released = false, raf = 0, exitTimer = 0, lostTimer = 0;

  host.classList.add('cap-intro');
  host.innerHTML = SKELETON;
  claimPage();
  const release = () => { if (!released) { released = true; releasePage(); } };
  const el = (k) => host.querySelector(`[data-el="${k}"]`);
  scrollTo(0, 0);

  // Everything behind the loader stays inert until the visitor walks in.
  const behind = [...host.children].filter((n) => !n.matches('.loader, .toast'));
  behind.forEach((n) => (n.inert = true));

  // Skip works from the very first frame — even if loading stalls or fails.
  let booted = false;
  host.addEventListener('click', (e) => {
    if (!booted && e.target.closest('[data-action="enter-site"]')) { e.preventDefault(); onEnter?.(); }
  }, { signal });

  // ── loader ──────────────────────────────────────────────────────────────────
  const fillEl = el('loader-fill'), pctEl = el('loader-pct'), barEl = el('loader-bar');
  let pct = 0;
  const setProgress = (p) => {
    pct = Math.max(pct, p);
    fillEl.style.transform = `scaleX(${pct})`;
    pctEl.textContent = `${Math.round(pct * 100)}%`;
    barEl.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
  };
  // Only the booth gates the loader; the universe streams in while the visitor is in the booth.
  const bootMgr = new THREE.LoadingManager();
  bootMgr.onProgress = (_, loaded, total) => setProgress(0.25 + 0.35 * (loaded / total));
  const bootLoader = new THREE.TextureLoader(bootMgr);
  const lazyLoader = new THREE.TextureLoader();
  const texCache = new Map();
  const makeTex = (loader, url) => {
    const key = sized(url);
    if (texCache.has(key)) return texCache.get(key);
    const t = loader.load(key, undefined, undefined, () => {
      if (key !== url) loader.load(url, (img) => { t.image = img.image; t.needsUpdate = true; }); // fall back to the full-size file
    });
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    texCache.set(key, t);
    return t;
  };
  const bootTex = (url) => makeTex(bootLoader, url);
  const lazyTex = (url) => makeTex(lazyLoader, url);

  // ── boot (no WebGL, blocked fetch → straight into the site; abort → silent cleanup) ──
  let engine, audio, booth, universe, exit = () => onEnter?.();
  const checkAborted = () => { if (signal.aborted) throw new DOMException('intro aborted', 'AbortError'); };
  try {
    engine = createEngine(host.querySelector('#gl'), {
      signal,
      onContextLost: () => { cancelAnimationFrame(raf); raf = 0; lostTimer = setTimeout(() => exit('/'), 2500); },
      onContextRestored: (envs) => {
        clearTimeout(lostTimer);
        if (booth) booth.scene.environment = envs.room;
        if (universe) universe.scene.environment = envs.brand;
        if (!destroyed && !raf) raf = requestAnimationFrame(frame);
      },
    });
    audio = createAudio();
    await Promise.all([
      document.fonts.load('120px "Alfa Slab One"'),
      document.fonts.load('italic 64px "Instrument Serif"'),
      document.fonts.load('700 30px "Space Mono"'),
      document.fonts.load('30px "Space Mono"'),
      document.fonts.load('180px "Anton"'),
    ]).catch(() => {});
    checkAborted();
    setProgress(0.1);
    const [logoImg, fontAnton] = await Promise.all([
      loadImage('/intro/img/brand/logo.webp').catch(() => null),
      fetch('/intro/fonts/anton.typeface.json').then((r) => { if (!r.ok) throw new Error(`typeface ${r.status}`); return r.json(); }),
    ]);
    checkAborted();
    setProgress(0.25);
    const label = recordLabel(logoImg);
    booth = createBooth({ envMap: engine.envs.room, assets: { portrait: bootTex('/intro/img/brand/cap-portrait.webp'), label } });
    universe = await createUniverse({ envMap: engine.envs.brand, tex: lazyTex, assets: { fontAnton, label }, renderer: engine.renderer });
    checkAborted();
    await new Promise((res) => {
      if (bootMgr.itemsTotal === 0 || bootMgr.itemsLoaded >= bootMgr.itemsTotal) return res();
      bootMgr.onLoad = res;
      setTimeout(res, 8000); // never trap anyone behind a slow image
    });
    checkAborted();
    setProgress(0.7);
    await engine.compile([booth.scene, universe.scene]).catch(() => {});
    checkAborted();
    setProgress(1);
  } catch (err) {
    const aborted = signal.aborted;
    if (!aborted) console.warn('[intro] could not start — continuing to the site', err);
    ac.abort();
    audio?.destroy();
    try { universe?.dispose(); engine?.dispose([booth?.scene, universe?.scene].filter(Boolean)); } catch { /* context already gone */ }
    host.innerHTML = '';
    host.classList.remove('cap-intro');
    release();
    if (!aborted) onEnter?.();
    return { exit() {}, destroy() {} };
  }
  const { camera, renderer } = engine;

  // textures upload one per frame while the visitor is in the booth (no mid-flight hitches)
  const warm = [];
  universe.scene.traverse((o) => {
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      for (const v of Object.values(m.uniforms ?? m)) {
        const t = v?.value?.isTexture ? v.value : v?.isTexture ? v : null;
        if (t && !t.isVideoTexture && !t.isCubeTexture && !warm.includes(t)) warm.push(t);
      }
    }
  });

  // ── scroll ──────────────────────────────────────────────────────────────────
  const track = el('track');
  let vh = innerHeight, vw = innerWidth;
  const sizeTrack = () => { track.style.height = `${(TOTAL + 1) * vh}px`; };
  sizeTrack();
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.2, smoothWheel: !reduced });
  lenis.stop();
  let currentU = 0;
  const goto = (u, opts = {}) => {
    const immediate = reduced || !!opts.immediate;
    lenis.scrollTo(u * vh, { duration: immediate ? 0 : Math.min(6, 1.2 + Math.abs(u - currentU) * 0.12), immediate, force: true, lock: false });
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  const toastEl = el('toast');
  let toastTimer;
  const hideToast = () => { toastEl.classList.remove('is-on'); toastTimer = setTimeout(() => { if (!toastEl.classList.contains('is-on')) toastEl.textContent = ''; }, 500); };
  const toast = (html, ms = 5200) => {
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, ms);
  };
  // a keyboard user tabbing into the toast's link keeps it on screen
  toastEl.addEventListener('focusin', () => clearTimeout(toastTimer), { signal });
  toastEl.addEventListener('focusout', () => { toastTimer = setTimeout(hideToast, 2500); }, { signal });

  // Motion pause (topbar) — freezes every autonomous animation; scroll still drives the camera.
  let still = reduced;
  const motionBtn = host.querySelector('[data-action="toggle-motion"]');
  const setStill = (v) => {
    still = v;
    host.classList.toggle('is-still', v);
    motionBtn.setAttribute('aria-pressed', String(v));
    motionBtn.textContent = v ? 'Resume motion' : 'Pause motion';
  };
  setStill(still);

  const catalogQueue = () => {
    const seen = new Set();
    return [...LATEST, ...SINGLES, ...HOUSE_CHARTS, ...TRACKS].filter((t) => t.audio && !seen.has(t.id) && seen.add(t.id));
  };
  const stations = createStations(el('stations'));
  const player = createPlayer(el('player'), audio, { toast, defaultQueue: () => [HERO_TRACK, ...catalogQueue()] });
  const modals = createModals(el('modals'), { audio, lenis, toast, insert, signal });
  const nav = createNav(el('chapters'), { goto, fill: el('progress-fill') });
  const measureMerch = () => {
    const t = host.querySelector('.merch__track');
    if (t) t.style.setProperty('--track-w', `${t.scrollWidth}px`);
  };
  measureMerch();

  const cue = document.createElement('div');
  cue.className = 'cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.innerHTML = '<span class="cue__mouse"></span>Scroll to drop the needle<span class="cue__arrow">↓</span>';
  cue.style.opacity = 0;
  host.appendChild(cue);

  // ── leaving the intro: a turntable power-off, a flare, then the site ──────────
  let exiting = false, exitK = 0;
  exit = (path = '/') => {
    if (exiting) return;
    exiting = true;
    modals.close(true);
    audio.recordStop(reduced ? 0.2 : 0.85);
    el('veil').classList.add('is-on');
    exitTimer = setTimeout(() => {
      if (destroyed) return;
      if (path === '/') onEnter?.(); else onNavigate?.(path);
    }, reduced ? 80 : 850);
  };

  // ── actions ─────────────────────────────────────────────────────────────────
  let soundOn = false, autoDropped = false, entered = false, userPaused = false;
  // a deliberate pause silences the booth crackle too
  audio.on((t) => {
    if (t === 'pause' && !audio.state.ended && !exiting) userPaused = true;
    if (t === 'play') userPaused = false;
  });
  booted = true;
  host.addEventListener('click', (e) => {
    // same-site links leave the intro and route inside the SPA
    const a = e.target.closest('a[href^="/"]');
    if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); exit(a.getAttribute('href')); return; }
    const act = e.target.closest('[data-action]');
    const open = e.target.closest('[data-open]');
    const go = e.target.closest('[data-goto]');
    if (go) { e.preventDefault(); goto(Number(go.dataset.goto)); }
    if (open) {
      if (open.dataset.open === 'crate') modals.crate();
      if (open.dataset.open === 'booking') modals.booking();
    }
    if (!act) return;
    const k = act.dataset.action;
    if (k === 'enter-site') exit('/');
    if (k === 'toggle-motion') setStill(!still);
    if (k === 'play-hero') {
      soundOn = true;
      audio.play([HERO_TRACK, ...catalogQueue()]);
      autoDropped = true;
      if (currentU < MOMENTS.needleDrop[1]) goto(3.3);
    }
    if (k === 'play-catalog') audio.play(catalogQueue());
    if (k === 'play-track') {
      const q = catalogQueue();
      const t = bySlug[act.dataset.slug];
      if (t) audio.play(q, q.findIndex((x) => x.id === t.id));
    }
    if (k === 'play-album') audio.play(albumTracks(act.dataset.album));
    if (k === 'open-crate') modals.crate(act.dataset.album);
    if (k === 'open-booking') modals.booking();
    if (k === 'open-video') modals.video(act.dataset.id);
    if (k === 'wall-prev' || k === 'wall-next') goto(uForAlbum(clamp(stations.wallIndex + (k === 'wall-next' ? 1 : -1), 0, ALBUMS.length - 1)));
  }, { signal });

  host.addEventListener('submit', async (e) => {
    const f = e.target.closest('[data-form="legacy"]');
    if (!f) return;
    e.preventDefault();
    const email = f.email.value.trim().toLowerCase();
    const status = f.querySelector('[data-form-status]');
    if (!f.email.checkValidity()) {
      f.email.setAttribute('aria-invalid', 'true');
      status.textContent = 'That email doesn’t look right — check it and try again.';
      f.email.focus();
      return;
    }
    f.email.removeAttribute('aria-invalid');
    status.textContent = 'Adding you…';
    const ok = await modals.insert('newsletter_subscribers', { email, source: 'immersive_intro' });
    if (ok) { status.textContent = 'You’re on the Legacy List. New music hits your inbox first.'; f.reset(); }
    else location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Add me to the Legacy List')}&body=${encodeURIComponent(email)}`;
  }, { signal });

  // ── 3D interaction (universe only) ──────────────────────────────────────────
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  const canHover = matchMedia('(hover: hover)').matches;
  let hovered = null, pointerMoved = false, lastPickU = -1;
  addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    pointerMoved = true;
    if (e.pointerType === 'mouse') { parallax.tx = pointer.x; parallax.ty = pointer.y; }
  }, { passive: true, signal });
  const shown = (o) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
  const candidates = [];
  function pick() {
    if (currentU < SCENE_SWITCH || modals.isOpen) return null;
    candidates.length = 0;
    for (const c of universe.clickables) if (shown(c)) candidates.push(c);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(candidates, false);
    const hit = hits.find((h) => (h.object.material.uniforms?.uOpacity?.value ?? 1) > 0.4);
    return hit ? hit.object : null;
  }
  host.querySelector('#gl').addEventListener('click', () => {
    const o = pick();
    if (!o) return;
    const d = o.userData;
    if (d.album) { if (d.album.streamOnly) modals.crate(d.album.slug); else audio.play(albumTracks(d.album.slug)); toast(`Now spinning <b>${d.album.title}</b>`, 2600); }
    else if (d.track) {
      if (d.track.audio) { const q = catalogQueue(); audio.play(q, q.findIndex((x) => x.id === d.track.id)); }
      else window.open(d.track.spotify || d.track.apple, '_blank', 'noopener');
    } else if (d.video) modals.video(d.video);
    else if (d.onClick) d.onClick();
    else if (d.href?.startsWith('/')) exit(d.href);
    else if (d.href) window.open(d.href, '_blank', 'noopener');
  }, { signal });

  // ── sound gate ──────────────────────────────────────────────────────────────
  el('loader-text').textContent = 'Ready';
  el('gate').hidden = false;
  el('gate').querySelector('[data-enter="sound"]').focus({ preventScroll: true });
  el('loader').addEventListener('click', (e) => {
    const b = e.target.closest('[data-enter]');
    if (!b) return;
    soundOn = b.dataset.enter === 'sound';
    if (soundOn) audio.unlock();
    enter();
  }, { signal });
  function enter() {
    if (entered) return;
    entered = true;
    el('loader').classList.add('is-done');
    el('loader').inert = true;
    behind.forEach((n) => (n.inert = false));
    const h1 = host.querySelector('.hero__title');
    if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    lenis.start();
    const h = location.hash.slice(1);
    const w = WORDS.find((x) => x.id === h);
    if (w) goto(w.u[0] + 0.05, { immediate: true });
    else if (STATIONS[h]) goto(STATIONS[h][0] + 0.4, { immediate: true });
  }
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('skip')) queueMicrotask(enter);

  // ── resize ──────────────────────────────────────────────────────────────────
  addEventListener('resize', () => {
    const widthChanged = innerWidth !== vw;
    const bigHeight = Math.abs(innerHeight - vh) / vh > 0.2;
    if (!widthChanged && !bigHeight) return;
    const u = currentU;
    vw = innerWidth; vh = innerHeight;
    sizeTrack();
    booth.buildRail(innerWidth / innerHeight);
    universe.buildRail(innerWidth / innerHeight);
    measureMerch();
    lenis.resize();
    goto(u, { immediate: true });
  }, { signal });

  // ── the loop ────────────────────────────────────────────────────────────────
  const sample = railSample(), ahead = railSample();
  const film = engine.film.uniforms;
  const canvas = host.querySelector('#gl');
  const cueWorld = RECORD_CENTER.clone().add(new THREE.Vector3(0.1, 1.55, 0));
  const proj = new THREE.Vector3(), right = new THREE.Vector3(), upv = new THREE.Vector3(), tmp = new THREE.Vector3();
  let lastT = performance.now(), lastFov = 0, crackle = -1, clock = 0, bank = 0, lastU = 0;

  function step(now) {
    const realDt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    // the world's clock stops when motion is paused; scroll still moves the camera
    const dt = still ? 0 : realDt;
    clock += dt;
    const time = clock;
    lenis.raf(now);
    currentU = clamp(lenis.animatedScroll / vh, 0, TOTAL);
    const u = currentU;
    const levels = audio.sample(now / 1000);

    if (soundOn && !autoDropped && u >= MOMENTS.needleDrop[1] - 0.05 && u < SCENE_SWITCH) {
      autoDropped = true;
      if (!audio.state.track) audio.play([HERO_TRACK, ...catalogQueue()]);
    }
    const wantCrackle = soundOn && entered && !exiting && !userPaused && u < SCENE_SWITCH && !levels.playing ? 0.55 : 0;
    if (wantCrackle !== crackle) { crackle = wantCrackle; audio.setCrackle(crackle); }

    // word crossings: a rising whoosh on approach, a sub boom as you punch through
    if (soundOn && entered && !exiting && u > lastU) {
      for (const w of WORDS) {
        if (lastU < w.u[1] - 0.25 && u >= w.u[1] - 0.25) audio.whoosh(0.8);
        if (lastU < w.u[2] && u >= w.u[2]) { audio.boom(); navigator.vibrate?.(16); }
      }
    }
    lastU = u;

    // ── camera
    const inBooth = u < SCENE_SWITCH;
    const world = inBooth ? booth : universe;
    world.rail.sample(u, sample);
    parallax.x += (parallax.tx - parallax.x) * 0.04;
    parallax.y += (parallax.ty - parallax.y) * 0.04;
    let calm = 1;
    if (inBooth) calm = 1 - range(u, 2.4, 3.6);
    else for (const w of WORDS) calm = Math.min(calm, clamp(Math.abs(u - w.u[2]) / 0.6));
    if (reduced) calm = 0;
    camera.position.copy(sample.p);
    camera.up.copy(sample.up);
    camera.lookAt(sample.t);
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    upv.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const amp = inBooth ? 0.35 : 0.9;
    camera.position
      .addScaledVector(right, (parallax.x * amp + Math.sin(time * 0.31) * 0.08) * calm)
      .addScaledVector(upv, (parallax.y * amp * 0.6 + Math.cos(time * 0.27) * 0.06) * calm);
    camera.lookAt(sample.t);
    // bank into the turns (universe only)
    if (!inBooth && !reduced) {
      universe.rail.sample(Math.min(u + 0.2, TOTAL), ahead);
      const swing = tmp.copy(ahead.t).sub(sample.t).dot(right);
      let wordNear = 0;
      for (const w of WORDS) wordNear = Math.max(wordNear, 1 - clamp(Math.abs(u - w.u[1]) / 1.4));
      bank += (clamp(-swing * 0.012, -0.06, 0.06) * calm * (1 - wordNear) - bank) * Math.min(1, realDt * 3);
    } else bank *= 0.9;
    if (Math.abs(bank) > 1e-4) camera.rotateZ(bank);
    // dolly-zoom as we thread each word + a tick on every kick
    let kick = 0;
    if (!reduced) {
      for (const w of WORDS) kick += Math.sin(Math.PI * range(u, w.u[1], w.u[2] + 0.15)) * 10;
      kick += levels.kick * 0.8;
    }
    const fov = sample.fov + kick;
    if (Math.abs(fov - lastFov) > 0.01) { camera.fov = lastFov = fov; camera.updateProjectionMatrix(); }

    // ── worlds
    let frontAlbum, speed = 0;
    if (inBooth) booth.update(u, time, dt, levels);
    else ({ frontAlbum, speed } = universe.update(u, time, dt, levels, camera, still));
    const dive = range(u, ...MOMENTS.dive);
    engine.bloom.strength = inBooth ? 0.5 + dive * 0.2 + levels.bass * 0.25 : 0.8 + levels.bass * 0.35 + levels.kick * 0.25;
    // photos/covers top out ~0.84 linear → only emissive light (rings, nodes, beams) blooms
    engine.bloom.threshold = inBooth ? 0.82 : 0.9;

    // ── the lens
    const [fa, fb, fc] = MOMENTS.flash;
    const fl = u < fa || u > fc ? 0 : u < fb ? smooth(range(u, fa, fb)) : 1 - smooth(range(u, fb, fc));
    if (exiting) exitK = Math.min(1, exitK + realDt / 0.85);
    film.uTime.value = time;
    film.uFlash.value = Math.max(reduced ? fl * 0.25 : fl, exitK * exitK * 0.9);
    film.uSpeed.value = reduced ? 0 : inBooth ? range(u, 4.6, 6) * 0.6 : clamp((speed - 0.35) / 0.65);
    film.uPunch.value = reduced ? 0 : levels.kick;

    const active = entered && !modals.isOpen;
    if (active || exiting) engine.render(inBooth ? booth.scene : universe.scene, realDt, active && !still);

    // ── overlays
    if (inBooth && u < 1) {
      proj.copy(cueWorld).project(camera);
      const x = (proj.x * 0.5 + 0.5) * canvas.clientWidth, y = (-proj.y * 0.5 + 0.5) * canvas.clientHeight;
      cue.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      cue.style.opacity = entered ? String(1 - smooth(range(u, 0.15, 0.7))) : '0';
    } else if (cue.style.opacity !== '0') cue.style.opacity = '0';

    if (!inBooth && canHover && (pointerMoved || Math.abs(u - lastPickU) > 0.002)) {
      pointerMoved = false;
      lastPickU = u;
      const o = pick();
      if (o !== hovered) {
        if (hovered) hovered.userData.hovered = false;
        hovered = o;
        if (o) o.userData.hovered = true;
        host.style.cursor = o ? 'pointer' : '';
      }
    }

    // upload one waiting texture per frame while we're still in the booth
    if (inBooth && warm.length) {
      const i = warm.findIndex((t) => t.image);
      if (i >= 0) renderer.initTexture(warm.splice(i, 1)[0]);
    }

    stations.update(u, { frontAlbum });
    nav.update(u, TOTAL);
    player.tick(levels);
  }
  function frame(now) {
    if (destroyed) return;
    step(now);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  if (import.meta.env.DEV) {
    // QA hooks: render frames by hand (works while the tab is hidden) and ship them to /__snap
    window.__intro = {
      goto, audio, lenis, engine, get u() { return currentU; },
      async shot(u) { goto(u, { immediate: true }); for (let i = 0; i < 40; i++) step(performance.now() + i * 16); return currentU.toFixed(2); },
      async snap(u, name = `u${u}`) {
        await this.shot(u); step(performance.now());
        const c = document.createElement('canvas');
        c.width = 960; c.height = Math.round(960 * canvas.clientHeight / canvas.clientWidth);
        c.getContext('2d').drawImage(renderer.domElement, 0, 0, c.width, c.height);
        await fetch(`/__snap?name=${encodeURIComponent(name)}`, { method: 'POST', body: c.toDataURL('image/jpeg', 0.84).split(',')[1] });
        return name;
      },
    };
  }

  return {
    exit: (path) => exit(path),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(lostTimer);
      clearTimeout(toastTimer);
      ac.abort();
      lenis.destroy();
      audio.destroy();
      universe.dispose();
      engine.dispose([booth.scene, universe.scene]);
      texCache.clear();
      host.innerHTML = '';
      host.classList.remove('cap-intro', 'is-still');
      host.style.cursor = '';
      release();
      if (import.meta.env.DEV) delete window.__intro;
    },
  };
}
