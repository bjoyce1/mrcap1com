import { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export interface ChromaGridItem {
  image?: string;
  title?: string;
  subtitle?: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  renderCard?: (item: ChromaGridItem, index: number) => ReactNode;
}

export const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  renderCard,
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<ReturnType<typeof gsap.quickSetter> | null>(null);
  const setY = useRef<ReturnType<typeof gsap.quickSetter> | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.MouseEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (item: ChromaGridItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{ '--cols': columns, '--r': `${radius}px` } as CSSProperties}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {items.map((c, i) => (
        <div
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient || 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))',
            cursor: c.url || c.onClick ? 'pointer' : 'default',
          } as CSSProperties}
        >
          {renderCard ? (
            <div className="chroma-card-content">{renderCard(c, i)}</div>
          ) : (
            <>
              {c.image && (
                <div className="chroma-img-wrapper">
                  <img src={c.image} alt={c.title || ''} />
                </div>
              )}
              <div className="chroma-info">
                {c.title && <h3 className="text-base font-semibold">{c.title}</h3>}
                {c.handle && <span className="handle text-sm">{c.handle}</span>}
                {c.subtitle && <p className="role text-sm">{c.subtitle}</p>}
                {c.location && <span className="role text-sm">{c.location}</span>}
              </div>
            </>
          )}
        </div>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
