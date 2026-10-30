import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PlasmaProvider, PlasmaCanvas, Plasma } from '@cruxgarden/plasma-ui';

/** Liquid glass wall: prints float on draggable Plasma panels on capable desktops, plain grid elsewhere. */
export function useLiquidCapable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return ok;
}

export function LiquidWall({ items, className }: { items: { key: string; node: ReactNode; className?: string }[]; className?: string }) {
  const bounds = useRef<HTMLUListElement>(null);
  return (
    <PlasmaProvider mood="ember" theme="dark" ground="clear" canvas={false} tint="#d4a24c" opacity={0.08} frost={0.15} radius={22} elevation={0.5}>
      <div className="relative isolate">
        <PlasmaCanvas zIndex={0} style={{ pointerEvents: 'none' }} />
        <ul ref={bounds} className={`relative z-[1] ${className ?? ''}`} aria-label="Sample stories and photos made for the preview. Drag a print to move it.">
          {items.map((it) => <li key={it.key} className={it.className}>
            <Plasma draggable bounds={bounds} padding={10} lean={8}>{it.node}</Plasma>
          </li>)}
        </ul>
      </div>
    </PlasmaProvider>
  );
}
