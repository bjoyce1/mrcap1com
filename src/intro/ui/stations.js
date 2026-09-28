import { STATIONS, WORDS, envelope, range, clamp } from '../core/timeline.js';
import { ALBUMS, TRACKS, SINGLES, HOUSE_CHARTS, LATEST, bySlug } from '../data/catalog.js';
import {
  ROLES, BLUEPRINT, TIMELINE, STATS, NFT, BOOK, DOCUMENTARY, PRESS, VIDEOS, SHOWS,
  BOOKING_TYPES, MERCH, STORE_URL, SOCIALS, CONTACT, MORE_LINKS, JOURNAL,
} from '../data/content.js';
import { STREAM } from '../config.js';
import { icon } from './icons.js';

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmt = (s) => (s ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '—');
const ext = (href, label, cls = 'btn btn--ghost btn--sm') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${label} <span class="arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
const eyebrow = (t) => `<p class="eyebrow"><span class="eyebrow__line"></span>${t}</p>`;
const byline = (t) => (t.ft ? `${esc(t.artist)} ft. ${esc(t.ft)}` : esc(t.artist));

function trackRow(t, i, { plays = false } = {}) {
  return `
    <li class="trow">
      <button class="trow__play" data-action="play-track" data-slug="${t.slug}" aria-label="Play ${esc(t.title)}">
        <img src="${t.cover}" alt="" loading="lazy" width="44" height="44" /><span>${icon('play')}</span>
      </button>
      <div class="trow__meta">
        <b>${i != null ? `<i>${String(i + 1).padStart(2, '0')}</i>` : ''}${esc(t.title)}${t.e ? ' <abbr class="e" title="Explicit">E</abbr>' : ''}</b>
        <small>${byline(t)} · ${fmt(t.d)}${plays ? ` · <em>${t.plays} plays</em>` : ''}</small>
      </div>
    </li>`;
}

function build() {
  const S = [];
  const add = (id, cls, inner, extra = '') => S.push(`<section class="station ${cls}" data-station="${id}" id="${id}" ${extra}>${inner}</section>`);

  // HERO
  add('hero', 'station--hero', `
    <div class="hero">
      ${eyebrow('Houston · South Park Coalition')}
      <h1 class="hero__title">MR.<br/>CAP</h1>
      <p class="hero__lede">Three decades of Houston hip-hop. <br class="hide-sm"/>Independent by design. Own the work.</p>
      <div class="hero__ctas">
        <button class="btn btn--candy" data-action="play-hero">${icon('play')} Drop the needle</button>
        <button class="btn btn--ghost" data-action="open-booking">Book Mr. CAP</button>
      </div>
      <ul class="hero__facts"><li><b>30+</b> years deep</li><li><b>SPC</b> original</li><li><b>1st</b> Houston hip-hop NFT</li></ul>
    </div>`);

  add('caption', 'station--caption', `<p class="pill">Every record in this story was cut in South Park.</p>`);
  add('stepInside', 'station--center', `<h2 class="mega">Step inside<br/>the <em>ISM.</em></h2>`);

  // chapter word labels
  WORDS.forEach((w) => S.push(`
    <section class="station station--word" data-station="word-${w.id}" data-in="${w.u[0] + 0.25}" data-out="${w.u[2] - 0.15}">
      <p class="eyebrow eyebrow--center"><span class="eyebrow__line"></span>${w.index} · ${w.word}</p>
      <h2 class="word-tag">${esc(w.tagline)}</h2>
    </section>`));

  // ORIGIN
  add('who', 'station--left', `
    <article class="card">
      ${eyebrow('Who is Mr. CAP · File No. 001')}
      <h2>Two names.<br/><em>One code.</em></h2>
      <p>Cornelius A. Pratt is the son of two musicians, raised in Houston's Third Ward and South Park — on stage at eight years old, a Jack Yates Senior High graduate, and a veteran of the city's earliest independent circuits with The Raise Up Posse.</p>
      <p class="muted">One name signs the paperwork. The other signs the work. Both run on the same principle: own it, ship it, outlast the rest.</p>
      <ol class="roles">${ROLES.map(([n, t, d]) => `<li><i>${n}</i><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
      <blockquote>“The technology changed. The principle didn't: own the work.”</blockquote>
    </article>`);

  add('blueprint', 'station--left', `
    <article class="card">
      ${eyebrow('South Park Coalition')}
      <h2>Not a badge.<br/><em>A blueprint.</em></h2>
      <p>Long before streaming, the SPC built a direct-to-fan machine: masters retained, product moved hand to hand, artists carried on tour by artists. Mr. CAP has spent a career inside that model — and building on top of it.</p>
      <ol class="blueprint">${BLUEPRINT.map(([n, t, d]) => `<li><i>${n}</i><div><b>${t}</b><span>${d}</span></div></li>`).join('')}</ol>
      ${ext('/south-park-coalition', 'Enter the SPC archive')}
    </article>`);

  add('timeline', 'station--left', `
    <article class="card card--timeline">
      ${eyebrow('The Journey · 1987 — Now')}
      <h2 class="sr-only">Three decades, on record</h2>
      <div class="tl" aria-live="polite" aria-atomic="true">
        <div class="tl__year"><span data-tl="year">1987</span></div>
        <div class="tl__body"><p class="tl__tag" data-tl="tag"></p><h3 data-tl="title"></h3><p data-tl="text"></p></div>
      </div>
      <ol class="tl__rail">${TIMELINE.map((t, i) => `<li data-tl-dot="${i}"><span></span><em>${t.year}</em></li>`).join('')}</ol>
    </article>`);

  // SOUND
  add('listening', 'station--left', `
    <article class="card">
      ${eyebrow('The Listening Room')}
      <h2>Stream direct.<br/><em>No middleman.</em></h2>
      <p>Three decades of Houston hip-hop, straight from the source. Press play and the whole universe moves with the record.</p>
      <ul class="kpis"><li><b>${TRACKS.length}</b><span>Tracks</span></li><li><b>${ALBUMS.length}</b><span>Albums</span></li><li><b>${SINGLES.length}</b><span>Singles & features</span></li></ul>
      <div class="row">
        <button class="btn btn--candy btn--sm" data-action="play-catalog">${icon('play')} Play the catalog</button>
        <button class="btn btn--ghost btn--sm" data-action="open-crate">Open the Crate</button>
      </div>
      ${STREAM.previewSeconds ? `<p class="fine">Catalog tracks stream as ${STREAM.previewSeconds}-second previews — own any record for $0.99 to hear it all.</p>` : ''}
    </article>`);

  const her = bySlug['bet-on-her'];
  add('latest', 'station--left', `
    <article class="card">
      ${eyebrow('Latest drop · 2026')}
      <h2>${esc(her.title)}</h2>
      <p class="byline">${byline(her)} · ${fmt(her.d)}</p>
      <p>${esc(her.story)}</p>
      <p class="fine">${esc(her.credits)}</p>
      <div class="row">
        <button class="btn btn--candy btn--sm" data-action="play-track" data-slug="bet-on-her">${icon('play')} Play</button>
        <a class="btn btn--ghost btn--sm" href="${STREAM.buyUrl('bet-on-her')}" target="_blank" rel="noopener">Own it · $0.99 <span class="arrow" aria-hidden="true">↗</span></a>
      </div>
      <ul class="tracks tracks--compact">${LATEST.slice(1).map((t) => trackRow(t)).join('')}</ul>
    </article>`);

  add('charts', 'station--left', `
    <article class="card">
      ${eyebrow('House charts')}
      <h2>Most played,<br/><em>right here.</em></h2>
      <p class="muted">What listeners are streaming on the site.</p>
      <ol class="tracks">${HOUSE_CHARTS.map((t, i) => trackRow(t, i, { plays: true })).join('')}</ol>
    </article>`);

  add('wall', 'station--wall', `
    <div class="wall">
      <button class="wall__nav" data-action="wall-prev" aria-label="Previous album">${icon('prev')}</button>
      <div class="wall__info">
        <p class="eyebrow"><span class="eyebrow__line"></span><span data-wall="index">Album 01 / 05</span></p>
        <h2 data-wall="title"></h2>
        <p class="byline" data-wall="meta"></p>
        <p class="wall__desc" data-wall="desc"></p>
        <div class="row">
          <button class="btn btn--candy btn--sm" data-action="play-album" data-wall="play">${icon('play')} Play album</button>
          <button class="btn btn--ghost btn--sm" data-action="open-crate" data-wall="open">Tracklist</button>
        </div>
      </div>
      <button class="wall__nav" data-action="wall-next" aria-label="Next album">${icon('next')}</button>
    </div>`);

  // LEGACY
  add('first', 'station--left', `
    <article class="card">
      ${eyebrow('February 2021 · First of a kind')}
      <h2>The first Houston rapper to sell a <em>hip-hop NFT.</em></h2>
      <p>Same principle, new infrastructure. CAP Distributions puts independent artists on global platforms without giving up ownership — and in 2021 that ownership went on-chain.</p>
      <dl class="specs">
        <div><dt>Collection</dt><dd>${NFT.collection}</dd></div>
        <div><dt>Chain</dt><dd>${NFT.chain} · ${NFT.standard}</dd></div>
        <div><dt>Contract</dt><dd><code>${NFT.contract.slice(0, 8)}…${NFT.contract.slice(-6)}</code></dd></div>
      </dl>
      <div class="row">${ext(NFT.opensea, 'OpenSea', 'btn btn--candy btn--sm')}${ext(NFT.etherscan, 'Etherscan')}</div>
      <p class="fine hint-3d" aria-hidden="true">Tap the coin.</p>
    </article>`);

  add('book', 'station--left', `
    <article class="card">
      ${eyebrow('The Art of ISM · The Book')}
      <h2>${BOOK.kicker.replace('Movement,', 'Movement,<br/>')}</h2>
      <p>${esc(BOOK.text)}</p>
      <ul class="checks">${BOOK.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="row">${ext(BOOK.href, 'Enter the book', 'btn btn--candy btn--sm')}${ext(BOOK.vinyl, 'Order the vinyl')}</div>
    </article>`);

  add('receipts', 'station--left', `
    <article class="card">
      ${eyebrow('Receipts')}
      <h2>Cultural impact,<br/><em>documented.</em></h2>
      <ul class="kpis kpis--4">${STATS.map((s) => `<li><b data-count="${s.n}" data-suffix="${s.suffix}">0</b><span>${s.label}</span></li>`).join('')}</ul>
      <a class="doc" href="${DOCUMENTARY.href}" target="_blank" rel="noopener">
        <img src="${DOCUMENTARY.img}" alt="" loading="lazy" width="72" height="72" />
        <span><small>${DOCUMENTARY.note}</small><b>${DOCUMENTARY.title}</b></span><span class="arrow" aria-hidden="true">↗</span>
      </a>
      <ul class="press">${PRESS.map((p) => `<li><a href="${p.href}" target="_blank" rel="noopener"><small>${p.outlet} · ${p.date}</small><span>${esc(p.title)}</span></a></li>`).join('')}</ul>
    </article>`);

  add('screening', 'station--left', `
    <article class="card card--wide">
      ${eyebrow('The Screening Room')}
      <h2>Now <em>showing.</em></h2>
      <ul class="vids">${VIDEOS.map((v) => `
        <li><button data-action="open-video" data-id="${v.id}" aria-label="Watch ${esc(v.title)}">
          <img src="/intro/img/videos/${v.id}.jpg" alt="" loading="lazy" width="160" height="90" /><span class="vids__play">${icon('play')}</span><i>${v.len}</i>
        </button><b>${esc(v.title)}</b><small>${esc(v.kind)}</small></li>`).join('')}</ul>
      ${ext('https://www.youtube.com/@mrcap1', 'Subscribe on YouTube')}
    </article>`);

  // STAGE
  add('booking', 'station--left', `
    <article class="card">
      ${eyebrow('Now booking 2026 — 2027')}
      <h2>Bring the ISM<br/><em>to your stage.</em></h2>
      <p>Concerts, festivals, features and speaking — booked straight with the artist's team. Every inquiry gets a response within 48 hours.</p>
      <ul class="types">${BOOKING_TYPES.filter((b) => b.text).map((b) => `<li><b>${b.label}</b><span>${b.text}</span></li>`).join('')}</ul>
      <div class="row">
        <button class="btn btn--candy btn--sm" data-action="open-booking">Start a booking <span class="arrow" aria-hidden="true">→</span></button>
        <a class="btn btn--ghost btn--sm" href="mailto:${CONTACT.email}?subject=Booking%20inquiry%20—%20Mr.%20CAP">Email the team</a>
      </div>
      <ul class="shows">${SHOWS.map((s) => `<li><time>${s.date}</time><b>${s.venue}</b><span>${s.city}</span></li>`).join('')}</ul>
    </article>`);

  add('merch', 'station--merch', `
    <div class="merch">
      <header>${eyebrow('The Wearable Archive')}<h2>Trap University <em>×</em> SPC <em>×</em> Sabet</h2>
      ${ext(STORE_URL, 'Shop the full store', 'btn btn--candy btn--sm')}</header>
      <div class="merch__rail"><ul class="merch__track">${MERCH.map((m) => `
        <li><a href="${STORE_URL}" target="_blank" rel="noopener"><img src="${m.img}" alt="" loading="lazy" width="220" height="220" /><b>${esc(m.name)}</b><span>$${m.price.toFixed(2)}</span></a></li>`).join('')}
      </ul></div>
    </div>`);

  add('outro', 'station--outro', `
    <div class="outro">
      <p class="eyebrow eyebrow--center"><span class="eyebrow__line"></span>Closing statement</p>
      <h2 class="mega mega--outro">Built in South Park.<br/><em>Designed to outlast the industry.</em></h2>
      <div class="enter">
        <button class="enter__btn" data-action="enter-site">
          <span class="enter__ring" aria-hidden="true"></span>
          <span class="enter__label">Enter site</span>
          <span class="enter__arrow" aria-hidden="true">→</span>
        </button>
        <p class="enter__sub">Music · Shows · Store · The full archive</p>
      </div>
      <form class="legacy" data-form="legacy">
        <label for="legacy-email">Join the Legacy List — new music, shows and drops first.</label>
        <div class="legacy__row"><input id="legacy-email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" /><button class="btn btn--candy btn--sm" type="submit">Join</button></div>
        <p class="fine" data-form-status></p>
      </form>
      <ul class="socials">${SOCIALS.map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(s.id)}</a></li>`).join('')}</ul>
      <nav class="outro__links" aria-label="More from mrcap1.com">${MORE_LINKS.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</nav>
      <details class="journal"><summary>From the journal</summary><ul>${JOURNAL.map((j) => `<li><a href="${j.href}"><img src="${j.img}" alt="" loading="lazy" width="64" height="64"/><span><small>${j.cat} · ${j.date}</small><b>${esc(j.title)}</b></span></a></li>`).join('')}</ul></details>
      <footer class="legal"><span>© 2026 South Park Coalition LLC · Houston, TX</span><button class="link-btn" data-goto="0">Back to the top ↑</button></footer>
    </div>`);

  return S.join('');
}

export function createStations(root, { onWall } = {}) {
  root.innerHTML = build();
  const els = [...root.querySelectorAll('.station')].map((el) => {
    const id = el.dataset.station;
    const win = STATIONS[id] || [Number(el.dataset.in), Number(el.dataset.out)];
    return { el, id, a: win[0], b: win[1], alpha: -1, p: -1 };
  });

  // timeline scrub targets
  const tl = {
    year: root.querySelector('[data-tl="year"]'), tag: root.querySelector('[data-tl="tag"]'),
    title: root.querySelector('[data-tl="title"]'), text: root.querySelector('[data-tl="text"]'),
    dots: [...root.querySelectorAll('[data-tl-dot]')], index: -1,
  };
  const wall = {
    index: root.querySelector('[data-wall="index"]'), title: root.querySelector('[data-wall="title"]'),
    meta: root.querySelector('[data-wall="meta"]'), desc: root.querySelector('[data-wall="desc"]'),
    play: root.querySelector('[data-wall="play"]'), open: root.querySelector('[data-wall="open"]'), current: -1,
  };
  const counters = [...root.querySelectorAll('[data-count]')];
  let counted = false;

  function setTimeline(i) {
    if (i === tl.index) return;
    tl.index = i;
    const t = TIMELINE[i];
    tl.year.textContent = t.year;
    tl.year.parentElement.classList.remove('bump'); void tl.year.offsetWidth; tl.year.parentElement.classList.add('bump');
    tl.tag.textContent = t.tag;
    tl.title.textContent = t.title;
    tl.text.textContent = t.text;
    tl.dots.forEach((d, j) => { d.classList.toggle('on', j <= i); d.classList.toggle('now', j === i); });
  }
  setTimeline(0);

  function setWall(i) {
    if (i === wall.current) return;
    wall.current = i;
    const a = ALBUMS[i];
    wall.index.textContent = `Album ${String(i + 1).padStart(2, '0')} / ${String(ALBUMS.length).padStart(2, '0')}`;
    wall.title.textContent = a.title;
    wall.meta.textContent = `${a.year} · ${a.count} tracks · ${a.artist}`;
    wall.desc.textContent = a.desc;
    wall.play.dataset.album = a.slug;
    wall.play.hidden = !!a.streamOnly;
    wall.open.dataset.album = a.slug;
    onWall?.(i);
  }
  setWall(0);

  function countUp() {
    counted = true;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 1400);
      const e = 1 - Math.pow(1 - k, 3);
      counters.forEach((c) => (c.textContent = Math.round(Number(c.dataset.count) * e) + c.dataset.suffix));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return {
    update(u, { frontAlbum } = {}) {
      for (const s of els) {
        const alpha = s.b > 40 ? (u < s.a ? 0 : Math.min(1, (u - s.a) / 0.4)) : envelope(u, s.a, s.b, s.id === 'hero' ? 0.01 : 0.38);
        const heroAlpha = s.id === 'hero' ? 1 - range(u, 0.05, s.b) : alpha;
        const a = Math.round(heroAlpha * 1000) / 1000;
        if (a !== s.alpha) {
          s.alpha = a;
          s.el.style.opacity = a;
          s.el.style.visibility = a > 0.001 ? 'visible' : 'hidden';
          s.el.style.setProperty('--a', a);
          const live = a > 0.55;
          s.el.classList.toggle('is-live', live);
          // fading stations can't take focus; rescue focus that was inside one
          s.el.inert = !live;
          if (!live && s.el.contains(document.activeElement)) root.closest('.cap-intro')?.querySelector('.brand')?.focus({ preventScroll: true });
        }
        if (a > 0) {
          const p = Math.round(range(u, s.a, s.b) * 1000) / 1000;
          if (p !== s.p) { s.p = p; s.el.style.setProperty('--p', p); }
        }
      }
      const [ta, tb] = STATIONS.timeline;
      if (u > ta - 0.5 && u < tb + 0.5) setTimeline(Math.min(TIMELINE.length - 1, Math.floor(clamp((u - ta - 0.15) / (tb - ta - 0.5)) * TIMELINE.length)));
      if (frontAlbum != null && u > STATIONS.wall[0] - 0.5 && u < STATIONS.wall[1] + 0.5) setWall(frontAlbum);
      if (!counted && u > STATIONS.receipts[0] + 0.2 && u < STATIONS.receipts[1]) countUp();
    },
    get wallIndex() { return wall.current; },
  };
}
