import * as THREE from 'three';

export const GOLD = '#d9a441';
export const GOLD_HI = '#f3d58a';
export const MAGENTA = '#d12e7b';
export const VIOLET = '#5b31c9';
export const CREAM = '#ede4d3';
export const PLUM = '#120b19';

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, { srgb = true, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  t.needsUpdate = true;
  return t;
}

// Text laid out around a circle (for the record label rim).
function ringText(ctx, text, cx, cy, r, size, font, color, startAngle = -Math.PI / 2) {
  ctx.save();
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const total = ctx.measureText(text).width;
  let a = startAngle - total / r / 2;
  for (const ch of text) {
    const w = ctx.measureText(ch).width;
    a += w / 2 / r;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += w / 2 / r;
  }
  ctx.restore();
}

// The center label of the hero record — "Side A · The Art of ISM".
export function recordLabel(logoImg) {
  const S = 1024, C = S / 2;
  const [c, x] = canvas(S);
  const g = x.createRadialGradient(C, C * 0.8, 40, C, C, C);
  g.addColorStop(0, '#2a1a0a');
  g.addColorStop(0.55, '#140c06');
  g.addColorStop(1, '#070405');
  x.fillStyle = g; x.beginPath(); x.arc(C, C, C, 0, Math.PI * 2); x.fill();

  // gold foil sunburst
  x.save(); x.translate(C, C);
  for (let i = 0; i < 96; i++) {
    x.rotate((Math.PI * 2) / 96);
    x.fillStyle = i % 2 ? 'rgba(217,164,65,0.07)' : 'rgba(243,213,138,0.035)';
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-18, -C); x.lineTo(18, -C); x.fill();
  }
  x.restore();

  // rings
  const ring = (r, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.arc(C, C, r, 0, Math.PI * 2); x.stroke(); };
  ring(C - 10, 6, GOLD);
  ring(C - 26, 1.5, 'rgba(217,164,65,.6)');
  ring(C - 118, 1.5, 'rgba(217,164,65,.45)');
  ring(150, 3, GOLD);

  ringText(x, 'SOUTH PARK COALITION  ·  HOUSTON, TEXAS  ·  EST. 1987  ·  WRECKLESS ENTERTAINMENT  ·  CAP DISTRIBUTIONS  ·', C, C, C - 70, 34, '"Space Mono", monospace', GOLD_HI, -Math.PI / 2);

  if (logoImg) { x.globalAlpha = 0.95; x.drawImage(logoImg, C - 120, 175, 240, 243); x.globalAlpha = 1; }

  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = CREAM;
  x.font = '120px "Alfa Slab One", serif';
  x.fillText('MR. CAP', C, C + 10);
  x.fillStyle = GOLD;
  x.font = 'italic 64px "Instrument Serif", serif';
  x.fillText('The Art of ISM', C, C + 110);
  x.font = '26px "Space Mono", monospace';
  x.fillStyle = 'rgba(237,228,211,.75)';
  x.fillText('SIDE A', C - 250, C + 12);
  x.fillText('33⅓ RPM', C + 250, C + 12);
  x.fillStyle = MAGENTA;
  x.fillText('● OWN THE WORK ●', C, C + 196);

  // spindle hole
  x.fillStyle = '#000'; x.beginPath(); x.arc(C, C, 16, 0, Math.PI * 2); x.fill();
  return tex(c);
}

// Engraved plaque for the pedestal front.
export function plaque() {
  const [c, x] = canvas(1024, 512);
  x.fillStyle = 'rgba(0,0,0,0)'; x.fillRect(0, 0, 1024, 512);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  const g = x.createLinearGradient(0, 120, 0, 380);
  g.addColorStop(0, GOLD_HI); g.addColorStop(0.5, GOLD); g.addColorStop(1, '#8a6420');
  x.fillStyle = g;
  x.font = '118px "Alfa Slab One", serif';
  x.fillText('SOUTH PARK', 512, 210);
  x.font = '30px "Space Mono", monospace';
  x.fillStyle = 'rgba(243,213,138,.8)';
  x.fillText('FILE No. 001  ·  HOUSTON, TEXAS  ·  EST. 1987', 512, 320);
  x.strokeStyle = 'rgba(217,164,65,.5)'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(250, 372); x.lineTo(774, 372); x.stroke();
  return tex(c);
}

// Soft radial blob — contact shadows, glows, light pools.
export function radial(inner = 'rgba(0,0,0,0.85)', outer = 'rgba(0,0,0,0)', size = 256) {
  const [c, x] = canvas(size);
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return tex(c, { aniso: 1 });
}

// Big crisp label sprite (years on the timeline rail, captions).
export function textSprite(text, { font = '"Anton", sans-serif', size = 180, color = CREAM, sub = '', subColor = GOLD } = {}) {
  const [c, x] = canvas(1024, 512);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `${size}px ${font}`;
  x.fillStyle = color;
  x.fillText(text, 512, sub ? 220 : 256);
  if (sub) {
    x.font = '38px "Space Mono", monospace';
    x.fillStyle = subColor;
    x.fillText(sub.toUpperCase(), 512, 360);
  }
  const t = tex(c);
  const mat = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false });
  const s = new THREE.Sprite(mat);
  s.scale.set(8, 4, 1);
  return s;
}

export function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}
