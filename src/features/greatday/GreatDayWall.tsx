import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import wall0 from '@/assets/greatday/slab/wall-0.webp';
import wall1 from '@/assets/greatday/slab/wall-1.webp';
import wall2 from '@/assets/greatday/slab/wall-2.webp';
import wall3 from '@/assets/greatday/slab/wall-3.webp';
import wall4 from '@/assets/greatday/slab/wall-4.webp';
import backdrop from '@/assets/greatday/slab/meetup-night.webp';
import { HASHTAG, SAMPLE_STORIES } from './content';
import './wall.css';

const WallGlass = lazy(() => import('./WallGlass'));
const PHOTOS = [wall0, wall1, wall2, wall3, wall4];

export default function GreatDayWall() {
  const scene = useRef<HTMLDivElement>(null);
  const near = useInView(scene, { margin: '150px' });
  const [reduced, setReduced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [draft, setDraft] = useState('');
  useEffect(() => {
    const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setDesktop(media.matches); setReduced(motion.matches); };
    update();
    media.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); motion.removeEventListener('change', update); };
  }, []);
  const cards = SAMPLE_STORIES.map((story, i) => <article className="gd-wall-story" key={story}>
    <div className="gd-wall-photo"><img src={PHOTOS[i]} alt={`Houston concept photograph for sample story ${i + 1}`} loading="lazy" width={640} height={640} /><span className="gd-wall-badge">Demo story</span></div>
    <div className="gd-wall-story-body"><p className="gd-wall-number">Great day / 0{i + 1}</p><p className="gd-wall-quote">{story}</p><span className="gd-wall-tag">{HASHTAG}</span></div>
  </article>);
  const composer = <div className="gd-wall-composer" key="composer">
    <div className="gd-wall-composer-heading"><MessageSquare aria-hidden="true" /><span className="gd-wall-badge">Demo only</span></div>
    <h3 className="font-display">Your day belongs here.</h3>
    <p className="gd-wall-muted">Nothing is saved or sent in this preview.</p>
    <label htmlFor="gd3-story">What made today great?</label>
    <textarea id="gd3-story" value={draft} maxLength={90} rows={3} onChange={(e) => setDraft(e.target.value)} placeholder="Windows down, the whole family in the car." />
    <div className="gd-wall-count" aria-live="polite">{draft.length}/90</div>
    <div className="gd-wall-draft"><span className="gd-wall-number">Your preview</span><p>{draft || 'Your great day, in your words.'}</p></div>
    <Button variant="flux" disabled className="w-full gap-2">Post to the wall <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Button>
    <p className="gd-wall-launch">Posting opens at launch</p>
  </div>;
  const children = [...cards, composer];
  const fallback = <div className="gd-wall-grid">{children.map((child, i) => <div className="gd-wall-item" key={i}>{child}</div>)}</div>;
  return <div ref={scene} className="gd-wall-scene">
    <img src={backdrop} alt="" loading="lazy" className="gd-wall-backdrop" />
    <p className="gd-wall-demo">Demo wall · Sample stories, not fan submissions</p>
    {desktop && near && !reduced ? <Suspense fallback={fallback}><WallGlass scene={scene} image={backdrop}>{children}</WallGlass></Suspense> : fallback}
  </div>;
}