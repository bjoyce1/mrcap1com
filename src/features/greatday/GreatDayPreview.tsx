import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, MotionConfig, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, type MotionValue } from 'framer-motion';
import { ArrowUpRight, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import concept from '@/assets/greatday/houston-sunrise-concept.jpg';
import pendantFrame from '@/assets/greatday/render/pendant.webp';
import locketFrame from '@/assets/greatday/render/locket.webp';
import { TIERS } from './model';
import { CLIPS, COVER, HASHTAG, LYRICS, PREVIEW_SECONDS, SAMPLE_STORIES, THEME_LINE, VOICES } from './content';
import { PREVIEW_URL, formatTime, usePreviewAudio, type PreviewAudio } from './usePreviewAudio';
import './world.css';

/** A jeweler's string tag. Used only where the preview holds a placeholder. */
function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`gdc-tag ${className}`}>
    <svg className="gdc-tag-string" viewBox="0 0 40 16" aria-hidden="true"><path d="M1 3c12 13 24-6 38 6" /></svg>
    <span className="gdc-tag-paper">{children}</span>
  </span>;
}

function PlayButton({ audio, small = false }: { audio: PreviewAudio; small?: boolean }) {
  const { status } = audio;
  const busy = status === 'playing' || status === 'loading';
  const label = busy ? 'Pause the preview' : status === 'ended' ? 'Play the preview again' : 'Play the original single preview';
  const size = small ? 18 : 26;
  return <button type="button" className={`gdc-play ${small ? 'is-small' : ''}`} onClick={audio.toggle} aria-label={label}>
    {status === 'loading' ? <Loader2 size={size} className="gdc-spin" aria-hidden /> : status === 'playing' ? <Pause size={size} fill="currentColor" aria-hidden /> : status === 'ended' ? <RotateCcw size={size} aria-hidden /> : <Play size={size} fill="currentColor" aria-hidden className="gdc-play-icon" />}
  </button>;
}

// where the gold stops on the chain: the clasp is 34px wide, so the fill tracks its center
const chainFill = (value: number) => `calc(${value} * (100% - 34px) + 17px)`;

/** The seek bar is a rope chain; the thumb is its lobster clasp. */
function ChainSeek({ audio }: { audio: PreviewAudio }) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress } = audio;
  useMotionValueEvent(progress, 'change', (value) => ref.current?.style.setProperty('--p', chainFill(value)));
  useEffect(() => { ref.current?.style.setProperty('--p', chainFill(progress.get())); }, [progress]);
  return <input ref={ref} type="range" className="gdc-chain" min={0} max={PREVIEW_SECONDS} step={1} value={Math.min(audio.time, PREVIEW_SECONDS)}
    onChange={(event) => audio.seek(Number(event.target.value))} aria-label="Seek within the preview"
    aria-valuetext={`${formatTime(audio.time)} of ${formatTime(PREVIEW_SECONDS)}`} />;
}

function statusLine(status: PreviewAudio['status']) {
  switch (status) {
    case 'loading': return 'Loading the preview';
    case 'playing': return 'Now playing the original single';
    case 'paused': return 'Paused';
    case 'ended': return 'That was the 30-second preview';
    case 'error': return 'The preview did not load. Press play to try again.';
    default: return 'Play the original single';
  }
}

function Pendant({ tilt }: { tilt: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rotate = useSpring(tilt, { stiffness: 70, damping: 10, mass: 1.1 });
  useEffect(() => {
    if (reduce) return;
    // hung a little off true, then let it settle
    rotate.jump(-6);
    rotate.set(0);
  }, [reduce, rotate]);
  return <motion.figure className="gdc-pendant" style={reduce ? undefined : { rotate }}>
    <span className="gdc-hook-chain" aria-hidden />
    <span className="gdc-bail" aria-hidden />
    <div className="gdc-bezel">
      <img className="gdc-bezel-cover" src={COVER} alt="Temporary cover art: Mr. CAP, Paul Wall and Lil Keke over the Houston skyline, with all four artists named" width={480} height={480} fetchPriority="high" />
      <img className="gdc-bezel-frame" src={pendantFrame} alt="" width={1000} height={1000} />
    </div>
    <figcaption><Tag>Temporary cover art</Tag></figcaption>
  </motion.figure>;
}

function Lyrics({ audio }: { audio: PreviewAudio }) {
  const listRef = useRef<HTMLOListElement>(null);
  const timed = LYRICS.some((line) => typeof line.at === 'number');
  let active = -1;
  if (timed) LYRICS.forEach((line, index) => { if (line.at !== undefined && line.at <= audio.time) active = index; });
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (!list || !item || audio.status !== 'playing') return;
    list.scrollTo({ top: item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2, behavior: 'smooth' });
  }, [active, audio.status]);
  return <ol ref={listRef} className={`gdc-lyrics ${timed ? 'is-timed' : ''}`} tabIndex={0} aria-label="Lyrics">
    {LYRICS.map((line, index) => <li key={index} className={index === active ? 'is-active' : index < active ? 'is-past' : undefined} aria-current={index === active ? 'true' : undefined}>{line.line}</li>)}
  </ol>;
}

function Engraver() {
  const [draft, setDraft] = useState('');
  return <div className="gdc-bench">
    <label htmlFor="gdc-engrave" className="gdc-label">Try the engraver</label>
    <input id="gdc-engrave" className="gdc-field" value={draft} maxLength={80} onChange={(event) => setDraft(event.target.value)} placeholder="What made today great?" autoComplete="off" aria-describedby="gdc-engrave-note" />
    <p id="gdc-engrave-note" className="gdc-note">Preview only. What you type stays on this screen. Nothing is saved or sent.</p>
    <div className="gdc-bracelet" aria-hidden>
      <span className="gdc-bracelet-link" />
      <p className="gdc-idplate"><span className={draft ? undefined : 'is-ghost'}>{draft || 'What made today great?'}</span><i className="gdc-needle" /></p>
      <span className="gdc-bracelet-link" />
    </div>
  </div>;
}

export default function GreatDayPreview() {
  const audio = usePreviewAudio();
  const heroRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const controlsVisible = useInView(controlsRef, { margin: '0px 0px -8% 0px' });
  const tilt = useMotionValue(0);
  const showMini = !controlsVisible && audio.status !== 'idle';

  const lean = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !heroRef.current) return;
    const box = heroRef.current.getBoundingClientRect();
    tilt.set((((event.clientX - box.left) / box.width) * 2 - 1) * 2.4);
  };

  return <MotionConfig reducedMotion="user">
    <div className="gd-case">
      <Helmet><title>Today Was A Great Day (Remix) private preview | Mr. CAP</title><meta name="description" content="Private preview of the Today Was A Great Day (Remix) release world. Not public." /><meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" /></Helmet>
      <audio ref={audio.audioRef} src={PREVIEW_URL} preload="none" />

      <header className="gdc-strip">
        <p><span className="gdc-strip-dot" aria-hidden />Private preview<span className="gdc-strip-more">. Not public. Remix audio, sales and signups open after approval.</span></p>
        <nav aria-label="Preview"><Link to="/admin/greatday">Release Studio</Link><Link to="/">mrcap1.com</Link></nav>
      </header>

      <main>
        <section ref={heroRef} className="gdc-hero gdc-velvet" aria-labelledby="gdc-title" onPointerMove={lean} onPointerLeave={() => tilt.set(0)}>
          <Pendant tilt={tilt} />
          <div className="gdc-hero-copy">
            <h1 id="gdc-title"><span className="gdc-nameplate">Today Was A Great Day</span> <span className="gdc-remix">Remix</span></h1>
            <p className="gdc-roster"><strong>Mr. CAP</strong> featuring Paul Wall, Lil Keke &amp; Lisa Dinero</p>
            <p className="gdc-bar">{THEME_LINE}</p>
            <div ref={controlsRef} className="gdc-player">
              <PlayButton audio={audio} />
              <div className="gdc-player-body">
                <p className="gdc-player-label" aria-live="polite">{statusLine(audio.status)}</p>
                <ChainSeek audio={audio} />
                <p className="gdc-time"><span>{formatTime(audio.time)}</span><span>{formatTime(PREVIEW_SECONDS)}</span></p>
              </div>
            </div>
            <Tag>Original 2024 single, 30-second preview. Remix master pending.</Tag>
          </div>
        </section>

        <section className="gdc-words" aria-labelledby="gdc-words-title">
          <h2 id="gdc-words-title" className="gdc-h2">The Words</h2>
          {LYRICS.length ? <Lyrics audio={audio} /> : <div className="gdc-words-empty">
            <p className="gdc-plate">Lyrics are being engraved</p>
            <p className="gdc-note">When the words arrive, each line lights up here as the song plays.</p>
            <Tag>Lyrics to be supplied</Tag>
          </div>}
        </section>

        <section className="gdc-film gdc-velvet" aria-labelledby="gdc-film-title">
          <div className="gdc-film-copy">
            <h2 id="gdc-film-title" className="gdc-h2">Behind the Record</h2>
            {!CLIPS.length && <Tag>Concept image. Clips to be supplied.</Tag>}
          </div>
          {CLIPS.length ? <div className="gdc-clips">{CLIPS.map((clip) => <figure key={clip.src} className="gdc-window"><video src={clip.src} poster={clip.poster} controls preload="none" playsInline /><figcaption>{clip.title}</figcaption></figure>)}</div>
            : <figure className="gdc-window">
              <img src={concept} alt="Concept image: a chrome-trimmed slab car against the Houston skyline at sunrise" width={1920} height={1280} loading="lazy" />
            </figure>}
        </section>

        <section className="gdc-voices gdc-velvet" aria-labelledby="gdc-voices-title">
          <div className="gdc-voices-head">
            <h2 id="gdc-voices-title" className="gdc-h2">The Voices</h2>
            {VOICES.some((voice) => !voice.photo) && <Tag>Portraits to be supplied</Tag>}
          </div>
          <span className="gdc-rail" aria-hidden />
          <ul className="gdc-lockets">
            {VOICES.map((voice) => <li key={voice.name} className={voice.role === 'Lead artist' ? 'is-lead' : undefined}>
              <span className="gdc-locket-chain" aria-hidden />
              <div className="gdc-locket">
                {voice.photo ? <img className="gdc-locket-photo" src={voice.photo} alt={voice.name} loading="lazy" /> : <span className="gdc-locket-face" aria-hidden><span className="gdc-monogram">{voice.monogram}</span></span>}
                <img className="gdc-locket-frame" src={locketFrame} alt="" width={600} height={600} loading="lazy" />
              </div>
              <h3>{voice.name}</h3>
              <p className="gdc-role">{voice.role}</p>
              {voice.note && <p className="gdc-note">{voice.note}</p>}
            </li>)}
          </ul>
        </section>

        <section className="gdc-wall" aria-labelledby="gdc-wall-title">
          <div className="gdc-wall-head">
            <h2 id="gdc-wall-title" className="gdc-h2">The Great Day Wall</h2>
            <p className="gdc-lede">Fans say what made their day great. Approved stories get engraved and hung here, every one under {HASHTAG}.</p>
          </div>
          <div className="gdc-rack">
            <span className="gdc-rack-rail" aria-hidden />
            <ul>{SAMPLE_STORIES.map((story) => <li key={story} className="gdc-dogtag"><span className="gdc-ballchain" aria-hidden /><p>{story}</p></li>)}</ul>
            <Tag>Sample stories, written for the preview</Tag>
          </div>
          <div className="gdc-wall-foot">
            <Engraver />
            <div className="gdc-hashtag">
              <p className="gdc-hashtag-text">{HASHTAG}</p>
              <Tag>Campaign starts at launch</Tag>
            </div>
          </div>
        </section>

        <section className="gdc-editions gdc-velvet" aria-labelledby="gdc-editions-title">
          <h2 id="gdc-editions-title" className="gdc-h2">The Editions</h2>
          <p className="gdc-lede">Digital editions, direct from CAP Distributions. No middleman.</p>
          <ul className="gdc-boxes">
            {TIERS.map((tier, index) => <li key={tier.name} className={`gdc-box gdc-box-${index + 1}`}>
              <div className="gdc-case-box" aria-hidden>
                <div className="gdc-lid"><span className="gdc-lid-plate">{tier.name}</span></div>
                <div className="gdc-insert"><span className="gdc-disc" style={{ '--cover': `url(${COVER})` } as CSSProperties} /></div>
              </div>
              <h3>{tier.name} Edition</h3>
              <p className="gdc-note">Digital. Contents pending approval.</p>
              <Tag>{tier.price} proposed</Tag>
              <button type="button" className="gdc-btn" disabled>Not for sale yet</button>
            </li>)}
          </ul>
        </section>

        <section className="gdc-hold" aria-labelledby="gdc-hold-title">
          <h2 id="gdc-hold-title" className="gdc-h2">Be First When It Drops</h2>
          <form className="gdc-hold-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="gdc-hold-email" className="gdc-label">Email</label>
            <div className="gdc-hold-row">
              <input id="gdc-hold-email" className="gdc-field" type="email" placeholder="you@example.com" disabled aria-describedby="gdc-hold-note" />
              <button type="submit" className="gdc-btn" disabled>Hold my spot</button>
            </div>
            <p id="gdc-hold-note" className="gdc-note">Nothing can be entered or sent from this preview.</p>
          </form>
          <Tag>Signups open at launch</Tag>
        </section>
      </main>

      <footer className="gdc-foot">
        <p className="gdc-foot-mark">Presented by CAP Distributions</p>
        <p className="gdc-foot-line">Stream Direct. No Middleman.</p>
        <p className="gdc-note">Private preview. Credits, licensing and the release date are pending, and nothing here is for sale yet.</p>
        <nav aria-label="Leave the preview"><Link to="/admin/greatday">Release Studio <ArrowUpRight size={15} aria-hidden /></Link><Link to="/">mrcap1.com <ArrowUpRight size={15} aria-hidden /></Link></nav>
      </footer>

      <AnimatePresence>
        {showMini && <motion.div key="mini" className="gdc-mini" role="region" aria-label="Preview player"
          initial={{ y: 110, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 110, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}>
          <PlayButton audio={audio} small />
          <div className="gdc-mini-body">
            <p className="gdc-mini-title">Today Was A Great Day <span>original single preview</span></p>
            <ChainSeek audio={audio} />
          </div>
          <span className="gdc-time">{formatTime(audio.time)}</span>
        </motion.div>}
      </AnimatePresence>
    </div>
  </MotionConfig>;
}
