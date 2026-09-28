import { icon } from './icons.js';
import { esc, fmt } from './stations.js';
import { ALBUMS, TRACKS, SINGLES, albumTracks, albumBySlug } from '../data/catalog.js';
import { BOOKING_TYPES, CONTACT, VIDEOS, SOCIALS } from '../data/content.js';
import { STREAM } from '../config.js';

// `insert(table, row) → Promise<boolean>` is injected by the host app (the site's Supabase client).
export function createModals(root, { audio, lenis, toast, insert: dbInsert, signal }) {
  let open = null, lastFocus = null;

  function show(name, html, cls = '') {
    close(true);
    lastFocus = document.activeElement;
    root.innerHTML = `
      <div class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${name}" data-modal="${name}">
        <div class="modal__scrim" data-close></div>
        <div class="modal__sheet">
          <button class="modal__close" data-close aria-label="Close">${icon('close', 20)}</button>
          ${html}
        </div>
      </div>`;
    open = root.firstElementChild;
    requestAnimationFrame(() => open.classList.add('is-open'));
    lenis?.stop();
    document.documentElement.classList.add('modal-open');
    open.querySelector('input, button:not(.modal__close), a')?.focus({ preventScroll: true });
    return open;
  }

  function close(instant = false) {
    if (!open) return;
    const el = open;
    open = null;
    const iframe = el.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    el.classList.remove('is-open');
    setTimeout(() => el.remove(), instant ? 0 : 320);
    lenis?.start();
    document.documentElement.classList.remove('modal-open');
    lastFocus?.focus?.({ preventScroll: true });
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  }, { signal });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { signal });

  // ── The Crate ───────────────────────────────────────────────────────────────
  const row = (t, i) => {
    const links = [
      t.spotify && `<a href="${t.spotify}" target="_blank" rel="noopener" aria-label="${esc(t.title)} on Spotify">${icon('spotify', 16)}</a>`,
      t.apple && `<a href="${t.apple}" target="_blank" rel="noopener" aria-label="${esc(t.title)} on Apple Music">${icon('apple', 16)}</a>`,
      t.audio && STREAM.previewSeconds && `<a class="own" href="${STREAM.buyUrl(t.slug)}" target="_blank" rel="noopener">Own $0.99</a>`,
    ].filter(Boolean).join('');
    const play = t.audio
      ? `<button class="crow__play" data-crate-play="${t.slug}" aria-label="Play ${esc(t.title)}">${icon('play', 14)}</button>`
      : `<a class="crow__play crow__play--ext" href="${t.spotify || t.apple || SOCIALS[0].href}" target="_blank" rel="noopener" aria-label="Stream ${esc(t.title)}">${icon('ext', 14)}</a>`;
    return `
      <li class="crow" data-search="${esc((t.title + ' ' + t.artist + ' ' + (t.ft || '')).toLowerCase())}">
        ${play}
        <span class="crow__n">${i != null ? String(i + 1).padStart(2, '0') : `<img src="${t.cover}" alt="" width="36" height="36" loading="lazy"/>`}</span>
        <span class="crow__t"><b>${esc(t.title)}${t.e ? ' <abbr class="e" title="Explicit">E</abbr>' : ''}</b><small>${t.ft ? `${esc(t.artist)} ft. ${esc(t.ft)}` : esc(t.artist)}${t.year ? ` · ${t.year}` : ''}</small></span>
        <span class="crow__d">${fmt(t.d)}</span>
        <span class="crow__links">${links}</span>
      </li>`;
  };

  function albumBlock(a) {
    const tracks = albumTracks(a.slug);
    return `
      <section class="crate__album" id="crate-${a.slug}" data-album-block="${a.slug}">
        <div class="crate__cover"><img src="${a.cover}" alt="${esc(a.title)} cover" loading="lazy" width="260" height="260"/></div>
        <div class="crate__info">
          <p class="eyebrow"><span class="eyebrow__line"></span>${a.year} · ${a.count} tracks</p>
          <h3>${esc(a.title)}</h3>
          <p class="byline">${esc(a.artist)}</p>
          <p class="muted">${esc(a.desc)}</p>
          <div class="row">
            ${tracks.length ? `<button class="btn btn--candy btn--sm" data-crate-album="${a.slug}">${icon('play', 14)} Play album</button>` : ''}
            ${a.apple ? `<a class="btn btn--ghost btn--sm" href="${a.apple}" target="_blank" rel="noopener">Apple Music ↗</a>` : ''}
            ${!tracks.length ? `<a class="btn btn--ghost btn--sm" href="${SOCIALS[0].href}" target="_blank" rel="noopener">Stream on Spotify ↗</a>` : ''}
          </div>
          ${tracks.length ? `<ol class="crate__list">${tracks.map((t, i) => row(t, i)).join('')}</ol>` : '<p class="fine">This record streams on the major platforms.</p>'}
        </div>
      </section>`;
  }

  function crate(albumSlug) {
    const el = show('The Crate', `
      <header class="crate__head">
        <p class="eyebrow"><span class="eyebrow__line"></span>The Crate</p>
        <h2>${TRACKS.length} tracks. ${ALBUMS.length} albums. <em>Three decades.</em></h2>
        <div class="crate__tools">
          <div class="tabs" role="tablist">
            <button role="tab" aria-selected="true" data-tab="albums">Albums</button>
            <button role="tab" aria-selected="false" data-tab="singles">Singles & features</button>
            <button role="tab" aria-selected="false" data-tab="all">All tracks</button>
          </div>
          <label class="search">${icon('search', 16)}<input type="search" placeholder="Search the catalog" data-crate-search aria-label="Search the catalog"/></label>
        </div>
        ${STREAM.previewSeconds ? `<p class="fine">Tracks stream as ${STREAM.previewSeconds}-second previews. Own any record for $0.99 on mrcap1.com.</p>` : ''}
      </header>
      <div class="crate__body">
        <div data-pane="albums">${ALBUMS.map(albumBlock).join('')}</div>
        <div data-pane="singles" hidden><ol class="crate__list">${SINGLES.map((t) => row(t)).join('')}</ol></div>
        <div data-pane="all" hidden><ol class="crate__list">${[...TRACKS].sort((a, b) => (b.year || 0) - (a.year || 0)).map((t) => row(t)).join('')}</ol></div>
      </div>`, 'modal--crate');

    const body = el.querySelector('.crate__body');
    el.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
      el.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b));
      el.querySelectorAll('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== b.dataset.tab));
      body.scrollTop = 0;
    }));
    el.querySelector('[data-crate-search]').addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q) el.querySelector('[data-tab="all"]').click();
      el.querySelectorAll('[data-pane="all"] .crow').forEach((r) => (r.hidden = q && !r.dataset.search.includes(q)));
    });
    el.addEventListener('click', (e) => {
      const p = e.target.closest('[data-crate-play]');
      if (p) {
        const list = p.closest('.crate__list');
        const slugs = [...list.querySelectorAll('[data-crate-play]')].map((b) => b.dataset.cratePlay);
        const queue = slugs.map((s) => TRACKS.find((t) => t.slug === s));
        audio.play(queue, slugs.indexOf(p.dataset.cratePlay));
      }
      const a = e.target.closest('[data-crate-album]');
      if (a) audio.play(albumTracks(a.dataset.crateAlbum));
    });
    body.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    if (albumSlug && albumBySlug[albumSlug]) {
      requestAnimationFrame(() => el.querySelector(`#crate-${albumSlug}`)?.scrollIntoView({ block: 'start' }));
    }
  }

  // ── Booking ─────────────────────────────────────────────────────────────────
  function booking(type = 'show') {
    const el = show('Book Mr. CAP', `
      <header>
        <p class="eyebrow"><span class="eyebrow__line"></span>Booking inquiry</p>
        <h2>Bring the ISM <em>to your stage.</em></h2>
        <p class="muted">Every inquiry receives a response within 48 hours. Prefer email? <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>
      </header>
      <form class="form" data-booking novalidate>
        <div class="form__grid">
          <label>Name *<input name="name" required autocomplete="name"/></label>
          <label>Email *<input name="email" type="email" required autocomplete="email"/></label>
          <label>Organization / Venue<input name="venue" autocomplete="organization"/></label>
          <label>City / State<input name="city" autocomplete="address-level2"/></label>
          <label>Date<input name="event_date" type="date"/></label>
          <label>Request type<select name="booking_type">${BOOKING_TYPES.map((b) => `<option value="${b.value}" ${b.value === type ? 'selected' : ''}>${b.label}</option>`).join('')}</select></label>
          <label>Budget range<input name="budget" placeholder="e.g. $2,500 – $5,000"/></label>
          <label class="span-2">Details<textarea name="message" rows="4" placeholder="Event, set length, audience, anything we should know"></textarea></label>
        </div>
        <div class="row">
          <button class="btn btn--candy" type="submit">Submit inquiry <span class="arrow">→</span></button>
          <p class="fine" data-status></p>
        </div>
        <p class="fine">Performance deposits: CashApp ${CONTACT.cashapp} · Zelle ${CONTACT.zelle}</p>
      </form>`, 'modal--form');

    el.querySelector('[data-booking]').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const d = Object.fromEntries(new FormData(f));
      const status = f.querySelector('[data-status]');
      if (!d.name || !d.email || !f.email.checkValidity()) { status.textContent = 'Please add your name and a valid email.'; return; }
      const message = [d.budget && `Budget: ${d.budget}`, d.message].filter(Boolean).join('\n\n') || null;
      {
        status.textContent = 'Sending…';
        const ok = await insert('booking_requests', {
          name: d.name, email: d.email, venue: d.venue || null, city: d.city || null,
          event_date: d.event_date || null, booking_type: d.booking_type, message,
        });
        if (ok) { f.innerHTML = `<div class="done"><h3>Inquiry received.</h3><p class="muted">The team will reach out to ${esc(d.email)} within 48 hours.</p></div>`; return; }
        status.textContent = 'Couldn’t send — opening your email instead.';
      }
      const label = BOOKING_TYPES.find((b) => b.value === d.booking_type)?.label;
      const body = `Name: ${d.name}\nEmail: ${d.email}\nVenue: ${d.venue}\nCity: ${d.city}\nDate: ${d.event_date}\nType: ${label}\nBudget: ${d.budget}\n\n${d.message}`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Booking inquiry — ${label} — ${d.name}`)}&body=${encodeURIComponent(body)}`;
    });
  }

  // ── Video ───────────────────────────────────────────────────────────────────
  function video(id) {
    const v = VIDEOS.find((x) => x.id === id) || { title: 'Mr. CAP', kind: '' };
    if (!audio.el.paused) audio.pause();
    show(v.title, `
      <div class="theater"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
      <p class="theater__cap"><b>${esc(v.title)}</b> <span class="muted">${esc(v.kind)}</span></p>`, 'modal--video');
  }

  async function insert(table, row) {
    try { return dbInsert ? await dbInsert(table, row) : false; } catch { return false; }
  }

  return { crate, booking, video, close, insert, get isOpen() { return !!open; } };
}
