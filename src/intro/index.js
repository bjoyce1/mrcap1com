// ═══════════════════════════════════════════════════════════════════════════════
// Mr. CAP — "Step inside the ISM" immersive intro
//
//   const intro = await mountIntro(hostElement, { onEnter, onNavigate, insert });
//   intro.destroy();
//
// Everything (WebGL, audio, Lenis scroll, DOM, listeners) lives inside `host`
// and is torn down by destroy(), so the React site can mount/unmount it freely.
// ═══════════════════════════════════════════════════════════════════════════════
import '@fontsource/archivo/600.css';
import './intro.css';

import * as THREE from 'three';
import Lenis from 'lenis';
import { createEngine } from './gl/engine.js';
import { createBooth, RECORD_CENTER } from './gl/booth.js';
import { createUniverse, uForAlbum } from './gl/universe.js';
import { railSample } from './gl/path.js';
import { loadImage } from './gl/textures.js';
import { createAudio } from './audio/engine.js';
import { createStations } from './ui/stations.js';
import { createPlayer } from './ui/player.js';
import { createModals } from './ui/modals.js';
import { createNav } from './ui/nav.js';
import { TOTAL, SCENE_SWITCH, MOMENTS, WORDS, STATIONS, range, smooth, clamp } from './core/timeline.js';
import { TRACKS, ALBUMS, HERO_TRACK, LATEST, SINGLES, HOUSE_CHARTS, albumTracks, bySlug } from './data/catalog.js';
import { CONTACT } from './data/content.js';

const SKELETON = /* html */ `
  <div class="loader" data-el="loader" aria-live="polite">
    <div class="loader__inner">
      <img class="loader__coin" src="/intro/img/brand/cap-coin.webp" alt="" width="120" height="120" />
      <div class="loader__bar"><span data-el="loader-fill"></span></div>
      <p class="loader__label"><span data-el="loader-text">Pressing the vinyl</span> · <span data-el="loader-pct">0%</span></p>
      <div class="loader__gate" data-el="gate" hidden>
        <button class="btn btn--candy" data-enter="sound"><span class="i-sound"></span>Enter with sound</button>
        <button class="btn btn--ghost" data-enter="silent">Enter in silence</button>
        <p class="loader__hint">Headphones up. Scroll to drop the needle.</p>
        <button class="loader__skip" data-action="enter-site">Skip the intro →</button>
      </div>
    </div>
  </div>
  <canvas id="gl" aria-hidden="true"></canvas>
  <div class="flash" data-el="flash" aria-hidden="true"></div>
  <div class="vignette" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="topbar">
    <a class="brand" href="#top" data-goto="0" aria-label="Mr. CAP — back to the top of the intro">
      <img src="/intro/img/brand/cap-coin.webp" alt="" width="36" height="36" />
      <span><b>MR. CAP</b><small>EST. HOUSTON TX</small></span>
    </a>
    <nav class="topbar__right" aria-label="Quick actions">
      <button class="link-btn" data-open="crate">The Crate <em>${TRACKS.length}</em></button>
      <button class="btn btn--candy btn--sm" data-open="booking">Book Mr. CAP <span class="arrow">→</span></button>
      <button class="btn btn--enter" data-action="enter-site">Enter site <span class="arrow">→</span></button>
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

export async function mountIntro(host, { onEnter, onNavigate, insert } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ac = new AbortController();
  const { signal } = ac;
  let destroyed = false, raf = 0;

  host.classList.add('cap-intro');
  host.innerHTML = SKELETON;
  document.documentElement.classList.add('intro-active');
  const el = (k) => host.querySelector(`[data-el="${k}"]`);
  history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  // ── loader ──────────────────────────────────────────────────────────────────
  const fillEl = el('loader-fill'), pctEl = el('loader-pct');
  const manager = new THREE.LoadingManager();
  let pct = 0;
  const setProgress = (p) => { pct = Math.max(pct, p); fillEl.style.transform = `scaleX(${pct})`; pctEl.textContent = `${Math.round(pct * 100)}%`; };
  manager.onProgress = (_, loaded, total) => setProgress(loaded / total);
  const texLoader = new THREE.TextureLoader(manager);
  const texCache = new Map();
  const tex = (url) => {
    if (texCache.has(url)) return texCache.get(url);
    const t = texLoader.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    texCache.set(url, t);
    return t;
  };

  // ── boot ────────────────────────────────────────────────────────────────────
  const engine = createEngine(host.querySelector('#gl'), { signal });
  const { camera, renderer } = engine;
  const audio = createAudio();

  await Promise.all([
    document.fonts.load('120px "Alfa Slab One"'),
    document.fonts.load('italic 64px "Instrument Serif"'),
    document.fonts.load('700 30px "Space Mono"'),
    document.fonts.load('30px "Space Mono"'),
    document.fonts.load('180px "Anton"'),
  ]).catch(() => {});
  setProgress(0.08);
  const [logoImg, fontAnton] = await Promise.all([
    loadImage('/intro/img/brand/logo.webp').catch(() => null),
    fetch('/intro/fonts/anton.typeface.json').then((r) => r.json()),
  ]);
  if (destroyed) return { destroy() {} };
  setProgress(0.15);

  const booth = createBooth({ envMap: engine.envMap, assets: { portrait: tex('/intro/img/brand/cap-portrait.webp'), logoImg } });
  const universe = await createUniverse({ envMap: engine.envMap, tex, assets: { fontAnton, logoImg } });
  renderer.compile(booth.scene, camera);
  renderer.compile(universe.scene, camera);
  await new Promise((res) => {
    if (manager.itemsTotal === 0 || pct >= 1) return res();
    manager.onLoad = res;
    setTimeout(res, 12000); // never trap anyone behind a slow image
  });
  setProgress(1);

  // ── scroll ──────────────────────────────────────────────────────────────────
  const track = el('track');
  let vh = innerHeight, vw = innerWidth;
  const sizeTrack = () => { track.style.height = `${(TOTAL + 1) * vh}px`; };
  sizeTrack();
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.2, smoothWheel: !reduced });
  lenis.stop();
  let currentU = 0;
  const goto = (u, opts = {}) => lenis.scrollTo(u * vh, { duration: opts.immediate ? 0 : Math.min(6, 1.2 + Math.abs(u - currentU) * 0.12), immediate: !!opts.immediate, force: true, lock: false });

  // ── UI ──────────────────────────────────────────────────────────────────────
  const toastEl = el('toast');
  let toastTimer;
  const toast = (html, ms = 5200) => {
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
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
  cue.innerHTML = '<span class="cue__mouse"></span>Scroll to drop the needle<span class="cue__arrow">↓</span>';
  cue.style.opacity = 0;
  host.appendChild(cue);

  // ── leaving the intro ───────────────────────────────────────────────────────
  let exiting = false;
  function exit(path = '/') {
    if (exiting) return;
    exiting = true;
    modals.close(true);
    audio.fadeOut(0.9);
    el('veil').classList.add('is-on');
    setTimeout(() => (path === '/' ? onEnter?.() : onNavigate?.(path)), reduced ? 80 : 720);
  }

  // ── actions ─────────────────────────────────────────────────────────────────
  let soundOn = false, autoDropped = false, entered = false;
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
    if (!f.email.checkValidity()) { status.textContent = 'That email doesn’t look right.'; return; }
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
  let hovered = null;
  addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    if (e.pointerType === 'mouse') { parallax.tx = pointer.x; parallax.ty = pointer.y; }
  }, { passive: true, signal });
  const shown = (o) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
  function pick() {
    if (currentU < SCENE_SWITCH || modals.isOpen) return null;
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(universe.clickables.filter(shown), false);
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
  const sample = railSample();
  const flash = el('flash');
  const cueWorld = RECORD_CENTER.clone().add(new THREE.Vector3(0.1, 1.55, 0));
  const proj = new THREE.Vector3(), right = new THREE.Vector3(), upv = new THREE.Vector3();
  let lastT = performance.now(), lastFlash = -1, lastFov = 0, crackle = -1;

  function step(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    const time = now / 1000;
    lenis.raf(now);
    currentU = clamp(lenis.animatedScroll / vh, 0, TOTAL);
    const u = currentU;
    const levels = audio.sample(time);

    if (soundOn && !autoDropped && u >= MOMENTS.needleDrop[1] - 0.05 && u < SCENE_SWITCH) {
      autoDropped = true;
      if (!audio.state.track) audio.play([HERO_TRACK, ...catalogQueue()]);
    }
    const wantCrackle = soundOn && entered && !exiting && u < SCENE_SWITCH && !levels.playing ? 0.55 : 0;
    if (wantCrackle !== crackle) { crackle = wantCrackle; audio.setCrackle(crackle); }

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
    if (Math.abs(sample.fov - lastFov) > 0.01) { camera.fov = lastFov = sample.fov; camera.updateProjectionMatrix(); }

    let frontAlbum;
    if (inBooth) booth.update(u, time, dt, levels);
    else frontAlbum = universe.update(u, time, dt, levels, camera).frontAlbum;
    engine.bloom.strength = inBooth ? 0.5 + range(u, ...MOMENTS.dive) * 0.5 + levels.bass * 0.25 : 0.8 + levels.bass * 0.45;
    // photos/covers top out ~0.84 linear → only emissive light (rings, nodes, beams) blooms
    engine.bloom.threshold = inBooth ? 0.82 : 0.9;
    engine.render(inBooth ? booth.scene : universe.scene, dt);

    const [fa, fb, fc] = MOMENTS.flash;
    const fl = u < fa || u > fc ? 0 : u < fb ? smooth(range(u, fa, fb)) : 1 - smooth(range(u, fb, fc));
    if (Math.abs(fl - lastFlash) > 0.002) { lastFlash = fl; flash.style.opacity = fl; }

    if (inBooth && u < 1) {
      proj.copy(cueWorld).project(camera);
      const x = (proj.x * 0.5 + 0.5) * innerWidth, y = (-proj.y * 0.5 + 0.5) * innerHeight;
      cue.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      cue.style.opacity = entered ? String(1 - smooth(range(u, 0.15, 0.7))) : '0';
    } else if (cue.style.opacity !== '0') cue.style.opacity = '0';

    if (!inBooth && canHover) {
      const o = pick();
      if (o !== hovered) {
        if (hovered) hovered.userData.hovered = false;
        hovered = o;
        if (o) o.userData.hovered = true;
        host.style.cursor = o ? 'pointer' : '';
      }
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
        c.width = 960; c.height = Math.round(960 * innerHeight / innerWidth);
        c.getContext('2d').drawImage(renderer.domElement, 0, 0, c.width, c.height);
        await fetch(`/__snap?name=${encodeURIComponent(name)}`, { method: 'POST', body: c.toDataURL('image/jpeg', 0.84).split(',')[1] });
        return name;
      },
    };
  }

  return {
    exit,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(raf);
      ac.abort();
      clearTimeout(toastTimer);
      lenis.destroy();
      audio.destroy();
      universe.dispose();
      engine.dispose([booth.scene, universe.scene]);
      texCache.clear();
      host.innerHTML = '';
      host.classList.remove('cap-intro');
      host.style.cursor = '';
      document.documentElement.classList.remove('intro-active', 'modal-open', 'lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      history.scrollRestoration = 'auto';
      if (import.meta.env.DEV) delete window.__intro;
    },
  };
}
