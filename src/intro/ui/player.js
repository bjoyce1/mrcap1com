import { icon } from './icons.js';
import { esc, fmt } from './stations.js';
import { STREAM } from '../config.js';
import { HERO_TRACK } from '../data/catalog.js';

export function createPlayer(root, audio, { toast, defaultQueue = () => [HERO_TRACK] }) {
  root.innerHTML = `
    <div class="dock" data-state="idle">
      <button class="dock__art" data-p="toggle-panel" aria-label="Show queue and details" aria-expanded="false" aria-controls="intro-dock-panel">
        <img data-p="cover" src="${HERO_TRACK.cover}" alt="" width="48" height="48" />
        <span class="dock__viz" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      </button>
      <div class="dock__meta">
        <b data-p="title">Bet'n On Me</b>
        <small data-p="artist">South Park Coalition · press play</small>
        <div class="dock__bar" data-p="seek" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
          <span data-p="fill"></span><i data-p="cap" hidden></i>
        </div>
      </div>
      <div class="dock__ctrl">
        <button data-p="prev" aria-label="Previous track">${icon('prev', 16)}</button>
        <button class="dock__play" data-p="play" aria-label="Play">${icon('play', 18)}</button>
        <button data-p="next" aria-label="Next track">${icon('next', 16)}</button>
      </div>
    </div>
    <div class="dock__panel" data-p="panel" id="intro-dock-panel" hidden>
      <header>
        <p class="eyebrow"><span class="eyebrow__line"></span>Now spinning</p>
        <div class="dock__vol">${icon('volume', 16)}<input type="range" min="0" max="1" step="0.01" value="${audio.volume}" data-p="volume" aria-label="Volume" /></div>
      </header>
      <p class="dock__time"><span data-p="cur">0:00</span> / <span data-p="dur">0:00</span> <em data-p="preview" hidden>${STREAM.previewSeconds}s preview</em></p>
      <a class="btn btn--candy btn--sm dock__own" data-p="own" target="_blank" rel="noopener" hidden>Own it · $0.99 <span class="arrow" aria-hidden="true">↗</span></a>
      <p class="eyebrow eyebrow--small">Up next</p>
      <ol class="dock__queue" data-p="queue"></ol>
    </div>`;

  const $ = (k) => root.querySelector(`[data-p="${k}"]`);
  const dock = root.querySelector('.dock');
  const bars = [...root.querySelectorAll('.dock__viz i')];
  const panel = $('panel');

  $('play').addEventListener('click', () => {
    if (!audio.state.track) audio.play(defaultQueue());
    else audio.toggle();
  });
  $('prev').addEventListener('click', () => audio.prev());
  $('next').addEventListener('click', () => audio.next());
  $('toggle-panel').addEventListener('click', (e) => { panel.hidden = !panel.hidden; root.classList.toggle('is-open', !panel.hidden); e.currentTarget.setAttribute('aria-expanded', String(!panel.hidden)); });
  const vol = $('volume');
  const volText = () => vol.setAttribute('aria-valuetext', `${Math.round(Number(vol.value) * 100)}%`);
  volText();
  vol.addEventListener('input', (e) => { audio.setVolume(Number(e.target.value)); volText(); });
  const seek = $('seek');
  const seekTo = (e) => {
    const r = seek.getBoundingClientRect();
    audio.seek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };
  seek.addEventListener('pointerdown', (e) => { seekTo(e); seek.setPointerCapture(e.pointerId); });
  seek.addEventListener('pointermove', (e) => { if (seek.hasPointerCapture(e.pointerId)) seekTo(e); });
  seek.addEventListener('keydown', (e) => {
    const el = audio.el;
    if (!el.duration) return;
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key];
    if (step) { e.preventDefault(); audio.seek((el.currentTime + step) / el.duration); }
    if (e.key === 'Home') { e.preventDefault(); audio.seek(0); }
    if (e.key === 'End') { e.preventDefault(); audio.seek(1); }
  });
  $('queue').addEventListener('click', (e) => {
    const li = e.target.closest('[data-q]');
    if (li) audio.play(audio.state.queue, Number(li.dataset.q));
  });

  function renderTrack() {
    const t = audio.state.track;
    if (!t) return;
    $('cover').src = t.cover;
    $('title').textContent = t.title;
    $('artist').textContent = t.ft ? `${t.artist} ft. ${t.ft}` : t.artist;
    $('preview').hidden = !audio.state.preview;
    const own = $('own');
    own.hidden = !audio.state.preview;
    own.href = STREAM.buyUrl(t.slug);
    const cap = $('cap');
    cap.hidden = true;
    const q = audio.state.queue;
    const start = audio.state.index;
    $('queue').innerHTML = q.slice(start + 1, start + 8).map((x, i) => `
      <li><button data-q="${start + 1 + i}"><img src="${x.cover}" alt="" width="32" height="32" loading="lazy"/><span><b>${esc(x.title)}</b><small>${esc(x.artist)}</small></span></button></li>`).join('') || '<li class="muted">End of the queue. Open the Crate for more.</li>';
  }

  function renderTime() {
    const el = audio.el;
    const d = el.duration || 0;
    $('fill').style.transform = `scaleX(${d ? el.currentTime / d : 0})`;
    seek.setAttribute('aria-valuenow', d ? Math.round((el.currentTime / d) * 100) : 0);
    seek.setAttribute('aria-valuetext', `${fmt(el.currentTime)} of ${fmt(d)}`);
    $('cur').textContent = fmt(el.currentTime);
    $('dur').textContent = fmt(d);
    const cap = $('cap');
    if (audio.state.cap && d) { cap.hidden = false; cap.style.left = `${(audio.state.cap / d) * 100}%`; }
  }

  audio.on((type) => {
    if (type === 'track') renderTrack();
    if (type === 'time' || type === 'meta') renderTime();
    if (type === 'play' || type === 'pause') {
      const playing = type === 'play';
      dock.dataset.state = playing ? 'playing' : 'paused';
      $('play').innerHTML = icon(playing ? 'pause' : 'play', 18);
      $('play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    if (type === 'preview-end') {
      const t = audio.state.track;
      toast(`That's the ${STREAM.previewSeconds}-second preview of “${t.title}”. <a href="${STREAM.buyUrl(t.slug)}" target="_blank" rel="noopener">Own the full record ↗</a>`);
    }
    if (type === 'blocked') toast('Tap play to start the music.');
    if (type === 'error') toast('That record skipped. Moving to the next one.');
  });

  return {
    // mini visualizer, driven from the main loop
    tick(levels) {
      if (dock.dataset.state !== 'playing') return;
      const v = [levels.bass, levels.mid, levels.high, levels.mid * 0.8, levels.bass * 0.7];
      bars.forEach((b, i) => (b.style.transform = `scaleY(${0.15 + Math.min(1, v[i]) * 0.85})`));
    },
  };
}
