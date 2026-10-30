// The hero player in liquid glass (@cruxgarden/plasma-ui): one surface, desktops only, loaded on
// demand. The material is WebGL and cannot see the page, so the glass refracts a copy of the hero
// scene drawn to a small canvas that follows the hero as it scrolls: the night photo placed like
// .gd3-sky, under the desktop .gd3-grade. Its canvas sits in the hero, above the photo and below
// the record, so the record rides out in front of the glass.
import { useEffect, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Plasma, PlasmaCanvas, PlasmaProvider, usePlasmaRuntime } from '@cruxgarden/plasma-ui';

/** the glass blurs and bends what it sees; half resolution is plenty */
const SCALE = 0.5;
const night = (a: number) => `hsla(248, 55%, 5%, ${a})`;

function useScene(scene: RefObject<HTMLElement>, image: string) {
  const [canvas] = useState(() => document.createElement('canvas'));
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const el = scene.current;
      if (!ctx || !el || !img.naturalWidth) return;
      const w = Math.round(innerWidth * SCALE), h = Math.round(innerHeight * SCALE);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.fillStyle = night(1);
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      const r = el.getBoundingClientRect();
      const k = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
      const iw = img.naturalWidth * k, ih = img.naturalHeight * k;
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.left, r.top, r.width, r.height);
      ctx.clip();
      ctx.drawImage(img, r.left + (r.width - iw) * 0.5, r.top + (r.height - ih) * 0.45, iw, ih);
      const shade = (g: CanvasGradient, stops: [number, number][]) => {
        stops.forEach(([at, a]) => g.addColorStop(at, night(a)));
        ctx.fillStyle = g;
        ctx.fillRect(r.left, r.top, r.width, r.height);
      };
      shade(ctx.createLinearGradient(0, r.top, 0, r.bottom), [[0, 0.82], [0.22, 0.2], [0.6, 0.1], [1, 1]]);
      shade(ctx.createLinearGradient(r.left, 0, r.right, 0), [[0, 0.1], [0.5, 0.35], [1, 0.78]]);
      ctx.restore();
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
    img.addEventListener('load', queue);
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    queue();
    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener('load', queue);
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
    };
  }, [canvas, scene, image]);
  return canvas;
}

/** Pressing a button in the glass sends a ripple through it from the pointer. */
function Surface({ className, children }: { className: string; children: ReactNode }) {
  const { pulse } = usePlasmaRuntime();
  const press = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) pulse(e.clientX, e.clientY, 0.6);
  };
  return <Plasma lean={3} fuse={false} className={className} onPointerDown={press}>{children}</Plasma>;
}

export default function GlassPanel({ scene, image, className, children }: { scene: RefObject<HTMLElement>; image: string; className: string; children: ReactNode }) {
  const background = useScene(scene, image);
  const host = scene.current;
  return <PlasmaProvider canvas={false} ground="clear" background={background} theme="dark" maxSurfaces={1}
    pointerDrop={false} grain={0} viscosity={0.9} radius={26}
    tint="#1c1240" opacity={0.4} frost={0.3} elevation={0.5} rim={0.7} rimColor="#cfc6ff" shimmer={0.4} glow={0.3}>
    {host && createPortal(<PlasmaCanvas zIndex={-5} />, host)}
    <Surface className={className}>{children}</Surface>
  </PlasmaProvider>;
}
