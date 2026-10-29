import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, MotionConfig, motion, useInView, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import '@fontsource/bebas-neue/400.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SectionShell from '@/components/home/SectionShell';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import { Button } from '@/components/ui/button';
import heroNight from '@/assets/greatday/slab/hero-night.webp';
import heroNightPhone from '@/assets/greatday/slab/hero-night-phone.webp';
import swangaNight from '@/assets/greatday/slab/swanga-night.webp';
import meetupNight from '@/assets/greatday/slab/meetup-night.webp';
import trunkGreatDay from '@/assets/greatday/slab/trunk-great-day.webp';
import wall0 from '@/assets/greatday/slab/wall-0.webp';
import wall1 from '@/assets/greatday/slab/wall-1.webp';
import wall2 from '@/assets/greatday/slab/wall-2.webp';
import wall3 from '@/assets/greatday/slab/wall-3.webp';
import wall4 from '@/assets/greatday/slab/wall-4.webp';
import { TIERS } from './model';
import { CHOPPED_BY, CLIPS, COVER, COVER_SMALL, HASHTAG, LYRICS, PREVIEW_SECONDS, PRODUCTION, SAMPLE_STORIES, THEME_LINE, TITLE, VERSION, VOICES } from './content';
import { PREVIEW_URL, formatTime, usePreviewAudio, type PreviewAudio } from './usePreviewAudio';
import './greatday-sc.css';

const MARQUEE = [TITLE, VERSION, 'Mr. CAP', 'Paul Wall', 'Lil Keke', 'Lisa Dinero', CHOPPED_BY, HASHTAG];
const WALL_PHOTOS = [wall0, wall1, wall2, wall3, wall4];
const ease = [0.16, 1, 0.3, 1] as const;

/** Small chrome pill marking a placeholder. The page carries these only where content is not final. */
function Pending({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`gd3-pending ${className}`}>{children}</span>;
}

/** The crown from the cover, between two chrome rules. */
function Crown({ className = '' }: { className?: string }) {
  return <div className={`gd3-crown ${className}`} aria-hidden="true">
    <span />
    <svg viewBox="0 0 48 30" width="40" height="25"><path d="M4 26 L2 6 L14 16 L24 2 L34 16 L46 6 L44 26 Z" /><path d="M5 28.5 H43" /><circle cx="24" cy="18" r="3" /></svg>
    <span />
  </div>;
}

/** A record whose label is the cover. While the preview plays it turns at a slowed-down speed. */
function Record({ playing, className = '' }: { playing: boolean; className?: string }) {
  return <div className={`gd3-record ${playing ? 'is-playing' : ''} ${className}`} aria-hidden="true">
    <div className="gd3-record__disc"><span className="gd3-record__label" style={{ '--cover': `url(${COVER_SMALL})` } as CSSProperties} /></div>
  </div>;
}

function PlayButton({ audio, size = 'lg' }: { audio: PreviewAudio; size?: 'lg' | 'sm' }) {
  const { status } = audio;
  const busy = status === 'playing' || status === 'loading';
  const label = busy ? 'Pause' : status === 'ended' ? 'Play it again' : 'Play the preview';
  const icon = status === 'loading' ? <Loader2 className="animate-spin" /> : status === 'playing' ? <Pause fill="currentColor" /> : status === 'ended' ? <RotateCcw /> : <Play fill="currentColor" />;
  if (size === 'sm') {
    return <button type="button" onClick={audio.toggle} aria-label={`${label}, 30-second preview`} className="candy-sheen grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</button>;
  }
  return <Button variant="flux" size="lg" onClick={audio.toggle} className="h-12 gap-2.5 rounded-full px-7 text-sm [&_svg]:h-4 [&_svg]:w-4" aria-label={`${label}, 30-second preview of the Slowed & Chopped version`}>{icon}{label}</Button>;
}

/** Violet-to-ice progress line. */
function Progress({ audio }: { audio: PreviewAudio }) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress } = audio;
  const paint = (v: number) => ref.current?.style.setProperty('--p', `${v * 100}%`);
  useMotionValueEvent(progress, 'change', paint);
  useEffect(() => { paint(progress.get()); }, [progress]);
  return <input ref={ref} type="range" className="gd3-progress" min={0} max={PREVIEW_SECONDS} step={1} value={Math.min(audio.time, PREVIEW_SECONDS)}
    onChange={(e) => audio.seek(Number(e.target.value))} aria-label="Seek within the preview" aria-valuetext={`${formatTime(audio.time)} of ${formatTime(PREVIEW_SECONDS)}`} />;
}

function Lyrics({ audio }: { audio: PreviewAudio }) {
  const timed = LYRICS.some((l) => typeof l.at === 'number');
  let active = -1;
  if (timed) LYRICS.forEach((l, i) => { if (l.at !== undefined && l.at <= audio.time) active = i; });
  return <ol className="mx-auto max-w-3xl space-y-4 text-center" aria-label="Lyrics">
    {LYRICS.map((l, i) => <li key={i} aria-current={i === active ? 'true' : undefined}
      className={`font-display text-2xl leading-snug transition-colors duration-300 md:text-4xl ${!timed || i === active ? 'text-foreground' : i < active ? 'text-foreground/45' : 'text-foreground/25'} ${i === active ? 'gd3-chrome' : ''}`}>{l.line}</li>)}
  </ol>;
}

/** An instant print on the wall: the photo, the caption written on the bottom margin. */
function Print({ caption, photo, focus = '50% 50%', tilt, sample = false, className = '' }: { caption: string; photo: string; focus?: string; tilt: number; sample?: boolean; className?: string }) {
  return <figure className={`gd3-print ${className}`} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
    <div className="gd3-print__photo" style={{ backgroundImage: `url(${photo})`, backgroundPosition: focus }} />
    <figcaption>{caption}</figcaption>
    {sample && <Pending className="absolute -right-2 -top-3 rotate-3 shadow-lg">Sample</Pending>}
  </figure>;
}

const PRINT_TILT = [-3.5, 2.5, -1.5, 3, -2.5];

/** While the preview plays, the title gets chopped: a short stutter every few seconds. */
function useChop(playing: boolean) {
  const [chopping, setChopping] = useState(false);
  useEffect(() => {
    if (!playing || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let off = 0;
    const id = window.setInterval(() => {
      setChopping(true);
      off = window.setTimeout(() => setChopping(false), 520);
    }, 5200);
    return () => { clearInterval(id); clearTimeout(off); setChopping(false); };
  }, [playing]);
  return chopping;
}

export default function GreatDayPreview() {
  const audio = usePreviewAudio();
  const heroCtas = useRef<HTMLDivElement>(null);
  const ctasVisible = useInView(heroCtas, { margin: '0px 0px -10% 0px' });
  const [draft, setDraft] = useState('');
  const playing = audio.status === 'playing';
  const showDock = !ctasVisible && audio.status !== 'idle';
  const chopping = useChop(playing);

  return <MotionConfig reducedMotion="user">
    <div className="gd3 min-h-screen overflow-x-clip bg-background text-foreground">
      <Helmet>
        <title>{`${TITLE} (${VERSION}) | private preview | Mr. CAP`}</title>
        <meta name="description" content={`Private preview of the ${TITLE} (${VERSION}) campaign page. Not public.`} />
        <meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <audio ref={audio.audioRef} src={PREVIEW_URL} preload="none" />
      <Navigation />

      <main>
        {/* Houston after dark, the way the cover sees it: the record in the middle of the city */}
        <section className="relative isolate overflow-hidden" aria-labelledby="gd3-title">
          <p className="absolute inset-x-0 top-16 z-10 flex items-center justify-center gap-2 bg-background/70 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/75 backdrop-blur md:hidden"><span className="gd3-dot" aria-hidden="true" />Private preview · <Link to="/admin/greatday" className="gd3-ice">Studio</Link></p>
          <picture>
            <source media="(max-width: 767px)" srcSet={heroNightPhone} />
            <img src={heroNight} alt="" className="gd3-sky absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
          </picture>
          <div className="gd3-grade absolute inset-0 -z-10" />

          <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.6, ease }} className="gd3-sleeve-wrap mx-auto w-[min(82vw,560px)] lg:w-full">
              <Record playing={playing} className="gd3-sleeve-record" />
              <img src={COVER} alt={`${TITLE} cover: Mr. CAP with Paul Wall, Lil Keke and Lisa Dinero over the Houston skyline at night. ${CHOPPED_BY}.`} width={1254} height={1254} className="gd3-sleeve" />
            </motion.div>

            <div className="relative z-10 text-center lg:text-left">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.2 }} className="gd3-script gd3-glow text-[clamp(22px,2.2vw,30px)] leading-none">{CHOPPED_BY}</motion.p>
              <motion.h1 id="gd3-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.4, ease }} className={`mt-4 leading-[0.9] ${chopping ? 'is-chopped' : ''}`}>
                <span className="gd3-script gd3-chrome block text-[clamp(40px,5vw,76px)]">Today Was a</span>
                <span className="gd3-skyfill font-display block text-[clamp(44px,12.4vw,64px)] sm:text-[clamp(64px,10vw,96px)] lg:text-[clamp(64px,6.3vw,96px)]" style={{ '--sky': `url(${heroNight})` } as CSSProperties}>Great Day</span>
                <span className="gd3-cond mt-2 block text-[clamp(20px,2vw,28px)] tracking-[0.32em] text-[hsl(var(--ice))]">({VERSION})</span>
              </motion.h1>
              <Crown className="mx-auto mt-5 lg:mx-0" />
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1.2, ease }} className="mt-5">
                <p className="gd3-chrome font-display text-[clamp(34px,3.6vw,52px)] leading-none">Mr. CAP</p>
                <p className="gd3-cond mt-2 text-[clamp(18px,1.7vw,24px)] tracking-[0.14em] text-foreground/90"><span className="text-[hsl(var(--violet))]">Ft.</span> Paul Wall · Lil Keke <span className="text-[hsl(var(--violet))]">&amp;</span> Lisa Dinero</p>
                <p className="mt-4 text-base text-foreground/75 md:text-lg">{THEME_LINE}.</p>
              </motion.div>

              <motion.div ref={heroCtas} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2, ease }} className="mx-auto mt-7 flex w-full max-w-md flex-col gap-4 lg:mx-0">
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <PlayButton audio={audio} />
                  <Button variant="fluxOutline" size="lg" asChild className="gd3-outline-btn h-12 rounded-full px-6 text-sm"><a href="#wall">Share your great day</a></Button>
                </div>
                <div className={`w-full transition-opacity duration-500 ${audio.status === 'idle' ? 'opacity-0' : 'opacity-100'}`} aria-hidden={audio.status === 'idle'}>
                  <Progress audio={audio} />
                  <div className="mt-1 flex justify-between text-[11px] tabular-nums text-foreground/60"><span>{formatTime(audio.time)}</span><span>{audio.status === 'error' ? 'The preview did not load. Press play to try again.' : '30-second preview'}</span><span>{formatTime(PREVIEW_SECONDS)}</span></div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/55">{PRODUCTION} · CAP Distributions</p>
              </motion.div>
            </div>
          </div>
        </section>

        <MarqueeStrip items={MARQUEE} />

        <SectionShell id="words" eyebrow="The Words" align="center" title={<>Read along, <span className="gd3-chrome">line by line.</span></>}
          description="When it drops, every lyric lights up here in time with the record.">
          {LYRICS.length ? <Lyrics audio={audio} /> : <div className="flex flex-col items-center gap-5 text-center">
            <p className="gd3-outline-text font-display text-[clamp(40px,7vw,96px)] leading-none">Lyrics drop<br />with the record</p>
            <Pending>Lyrics to come</Pending>
          </div>}
        </SectionShell>

        <section className="gd3-voices relative overflow-hidden border-y border-border/60 py-20 md:py-28" aria-labelledby="gd3-voices">
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 id="gd3-voices" className="gd3-script gd3-chrome text-[clamp(40px,5vw,64px)] leading-none">The Voices</h2>
              <Crown className="mx-auto mt-4" />
            </div>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {VOICES.map((v, i) => <motion.li key={v.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, delay: i * 0.12, ease }}
                className={`gd3-portrait ${i === 0 ? 'is-lead' : ''}`}>
                {v.photo && <img src={v.photo} alt={v.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />}
                <div className="gd3-portrait__label">
                  <p className="gd3-cond text-[13px] tracking-[0.28em] text-[hsl(var(--ice))]">{i === 0 ? 'Lead artist' : 'Featuring'}</p>
                  <p className="gd3-chrome font-display text-[clamp(20px,2.2vw,30px)] leading-tight">{v.name}</p>
                  {v.note && <p className="mt-1 text-[11px] leading-snug text-foreground/70">{v.note}</p>}
                </div>
              </motion.li>)}
            </ul>
            <p className="mt-10 text-center">
              <span className="gd3-script gd3-glow text-[clamp(22px,2.4vw,32px)]">{CHOPPED_BY}</span>
            </p>
          </div>
        </section>

        <SectionShell id="wall" eyebrow={HASHTAG} title={<>The Great Day <span className="gd3-chrome">Wall</span></>}
          description="Fans post what made their day great. Approved stories hang here as prints, every one tagged #TodayWasAGreatDay.">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3" aria-label="Sample stories and photos made for the preview">
              {SAMPLE_STORIES.map((s, i) => <li key={s} className={i === 1 ? 'sm:mt-10' : i === 3 ? 'sm:-mt-4' : ''}>
                <Print caption={s} photo={WALL_PHOTOS[i]} tilt={PRINT_TILT[i]} sample={i === 0} />
              </li>)}
            </ul>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease }}
              className="gd3-panel p-6 md:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-2xl text-foreground md:text-3xl">Add your great day</h3>
              <p className="mt-2 text-sm text-muted-foreground">Write it and watch it print. In this preview nothing is saved or sent.</p>
              <label htmlFor="gd3-story" className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--ice))]">What made today great?</label>
              <textarea id="gd3-story" value={draft} maxLength={90} rows={2} onChange={(e) => setDraft(e.target.value)} placeholder="Windows down, the whole family in the car."
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <div className="mx-auto mt-6 w-[min(100%,260px)]"><Print caption={draft || 'Your great day, in your words.'} photo={trunkGreatDay} focus="42% 22%" tilt={-1.5} className={draft ? '' : 'is-ghost'} /></div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="flux" disabled className="rounded-full">Post to the wall</Button>
                <Pending>Opens at launch</Pending>
              </div>
            </motion.div>
          </div>
        </SectionShell>

        <SectionShell id="behind" eyebrow="Behind the Record" title={<>Houston, <span className="gd3-chrome">after dark.</span></>} className="pt-0 md:pt-0 lg:pt-0">
          {CLIPS.length ? <div className="grid gap-6 md:grid-cols-2">{CLIPS.map((c) => <figure key={c.src} className="gd3-panel overflow-hidden"><video src={c.src} poster={c.poster} controls preload="none" playsInline className="aspect-video w-full" /><figcaption className="p-4 text-sm">{c.title}</figcaption></figure>)}</div>
            : <figure className="gd3-frame relative overflow-hidden">
              <img src={meetupNight} alt="Concept image: a late-night slab meetup under the Houston skyline, trunks popped and glowing violet" className="aspect-[21/9] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 flex flex-wrap gap-2"><Pending>Concept image</Pending><Pending>Clips to come</Pending></figcaption>
            </figure>}
        </SectionShell>

        <SectionShell id="editions" eyebrow="Own the Day" align="center" title={<>Three ways to <span className="gd3-chrome">own it.</span></>}
          description="Digital editions, direct from CAP Distributions. No middleman.">
          <ul className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t, i) => <motion.li key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, delay: i * 0.12, ease }}
              className={`gd3-edition group ${i === 1 ? 'is-featured' : ''}`}>
              <div className="gd3-edition__art relative mb-6 grid aspect-square place-items-center overflow-hidden rounded-2xl">
                <Record playing={false} className="w-[70%] transition-transform duration-[1400ms] ease-out group-hover:rotate-[30deg]" />
              </div>
              <h3 className="font-display text-2xl text-foreground">{t.name} Edition</h3>
              <p className="mt-1 text-sm text-muted-foreground">Digital. What's inside is still being decided.</p>
              <div className="mt-5 flex items-center gap-3"><span className="gd3-chrome font-display text-3xl">{t.price}</span><Pending>Proposed</Pending></div>
              <Button variant={i === 1 ? 'flux' : 'fluxOutline'} disabled className="gd3-outline-btn mt-6 rounded-full">Not for sale yet</Button>
            </motion.li>)}
          </ul>
        </SectionShell>

        <section className="relative isolate overflow-hidden border-y border-border/60 py-20" aria-labelledby="gd3-first">
          <img src={swangaNight} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" loading="lazy" />
          <div className="gd3-first-grade absolute inset-0 -z-10" />
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
            <div>
              <h2 id="gd3-first" className="font-display text-3xl text-foreground md:text-5xl">Be first when it <span className="gd3-chrome">drops.</span></h2>
              <p className="mt-3 max-w-md text-sm text-foreground/75">New music, the release date and first access to the editions.</p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="gd3-email" className="sr-only">Email</label>
              <input id="gd3-email" type="email" disabled placeholder="you@email.com" className="h-12 flex-1 rounded-full border border-input bg-background/80 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-80" />
              <Button type="submit" variant="flux" disabled className="h-12 rounded-full px-6">Join</Button>
            </form>
            <div><Pending>Signups open at launch</Pending></div>
          </div>
        </section>
      </main>

      <Footer />

      <div className={`fixed bottom-4 left-4 z-40 items-center gap-3 rounded-full border border-border bg-background/85 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur ${showDock ? 'hidden' : 'hidden md:flex'}`}>
        <span className="gd3-dot" aria-hidden="true" />Private preview
        <Link to="/admin/greatday" className="gd3-ice inline-flex items-center gap-1 hover:underline">Studio <ArrowUpRight className="h-3 w-3" /></Link>
      </div>

      <AnimatePresence>
        {showDock && <motion.div key="dock" role="region" aria-label="Preview player" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(520px,calc(100%-24px))] items-center gap-3 rounded-2xl border border-border bg-card/95 p-2 pr-4 shadow-[var(--shadow-card)] backdrop-blur">
          <Record playing={playing} className="h-11 w-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{TITLE} <span className="font-normal text-muted-foreground">· {VERSION}</span></p>
            <Progress audio={audio} />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{formatTime(audio.time)}</span>
          <PlayButton audio={audio} size="sm" />
        </motion.div>}
      </AnimatePresence>
    </div>
  </MotionConfig>;
}
