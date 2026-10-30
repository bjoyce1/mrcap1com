import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Plasma, PlasmaCanvas, PlasmaProvider } from '@cruxgarden/plasma-ui';

export default function WallGlass({ scene, image, children }: { scene: RefObject<HTMLDivElement>; image: string; children: ReactNode[] }) {
  const [palette, setPalette] = useState<{ tint: string; rim: string }>();
  useEffect(() => {
    if (!scene.current) return;
    const styles = getComputedStyle(scene.current);
    setPalette({ tint: styles.getPropertyValue('--gd-wall-tint').trim(), rim: styles.getPropertyValue('--gd-wall-rim').trim() });
  }, [scene]);
  const host = scene.current;
  if (!host || !palette) return <div className="gd-wall-grid">{children.map((child, i) => <div className="gd-wall-item" key={i}>{child}</div>)}</div>;
  return <PlasmaProvider canvas={false} ground="clear" background={image} theme="dark" maxSurfaces={6}
    radius={8} quality={0.75} pointerDrop={false} ambientDrops={false} grain={0} formIn={false}
    tint={palette.tint} rimColor={palette.rim} opacity={0.65} frost={0.5} viscosity={0.9}
    refraction={1.3} dispersion={0.4} elevation={0.4} rim={0.5} edgeLine={0} shimmer={0.25} glow={0}>
    {createPortal(<PlasmaCanvas zIndex={0} className="gd-wall-canvas" />, host)}
    <div className="gd-wall-grid gd-wall-grid-glass">
      {children.map((child, i) => <Plasma key={i} lean={i === 5 ? false : 3} fuse={false} className="gd-wall-item">{child}</Plasma>)}
    </div>
  </PlasmaProvider>;
}