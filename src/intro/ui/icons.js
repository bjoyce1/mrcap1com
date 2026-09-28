// Minimal inline SVG icon set (stroke/fill = currentColor).
const P = {
  play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" fill="currentColor" stroke="none"/>',
  prev: '<path d="M6 5v14M19 5.5 9 12l10 6.5z" fill="currentColor"/>',
  next: '<path d="M18 5v14M5 5.5 15 12 5 18.5z" fill="currentColor"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  queue: '<path d="M4 6h16M4 12h10M4 18h10M17 14v6l4-3z"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  disc: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/>',
  ext: '<path d="M8 16 16 8M9.5 8H16v6.5"/>',
  spotify: '<circle cx="12" cy="12" r="9.5"/><path d="M7.2 9.4c3.4-1 7.2-.7 10 .9M7.8 12.4c2.8-.8 5.8-.5 8.2.8M8.4 15.2c2.2-.6 4.4-.4 6.3.6"/>',
  apple: '<path d="M9 17.5V7l10-2v10.5"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="15.5" r="2"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.3-2.5z" fill="currentColor"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M13.5 4v10.2a3.3 3.3 0 1 1-3.3-3.3M13.5 4c.4 2.3 2 3.9 4.5 4.1"/>',
  x: '<path d="M5 5l14 14M19 5 5 19"/>',
  facebook: '<path d="M14.5 20v-7h2.6l.4-3h-3V8.3c0-.9.3-1.5 1.6-1.5h1.5V4.1a19 19 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9V10H9v3h2.5v7"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
};

export function icon(name, size = 18) {
  return `<svg class="ico ico--${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
}
