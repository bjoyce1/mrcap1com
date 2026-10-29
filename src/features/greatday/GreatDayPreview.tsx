import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, MotionConfig, motion, useInView, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SectionShell from '@/components/home/SectionShell';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import { Button } from '@/components/ui/button';
import sunrise from '@/assets/greatday/houston-sunrise-concept.jpg';
import { TIERS } from './model';
import { CLIPS, COVER, HASHTAG, LYRICS, PREVIEW_SECONDS, SAMPLE_STORIES, THEME_LINE, VOICES } from './content';
import { PREVIEW_URL, formatTime, usePreviewAudio, type PreviewAudio } from './usePreviewAudio';
import './greatday-site.css';

const MARQUEE = ['Today Was a Great Day', 'Mr. CAP', 'Paul Wall', 'Lil Keke', 'Lisa Dinero', HASHTAG, THEME_LINE];
const ease = [0.16, 1, 0.3, 1] as const;

/** Small gold pill marking a placeholder. The page carries these only where content is not final. */
function Pending({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border border-[hsl(var(--accent-gold)/0.45)] bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold ${className}`}>{children}</span>;
}

/** The cover as a record: the label is the art, the grooves catch the light, and it turns while the song plays. */
function Record({ playing, className = '' }: { playing: boolean; className?: string }) {
  return <div className={`gd2-record ${playing ? 'is-playing' : ''} ${className}`} aria-hidden="true">
    <div className="gd2-record__disc"><span className="gd2-record__label" style={{ '--cover': `url(${COVER})` } as CSSProperties} /></div>
  </div>;
}

function PlayButton({ audio, size = 'lg' }: { audio: PreviewAudio; size?: 'lg' | 'sm' }) {
  const { status } = audio;
  const busy = status === 'playing' || status === 'loading';
  const label = busy ? 'Pause' : status === 'ended' ? 'Play it again' : 'Play the original';
  const icon = status === 'loading' ? <Loader2 className="animate-spin" /> : status === 'playing' ? <Pause fill="currentColor" /> : status === 'ended' ? <RotateCcw /> : <Play fill="currentColor" />;
  if (size === 'sm') {
    return <button type="button" onClick={audio.toggle} aria-label={`${label}, 30-second preview`} className="candy-sheen grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</button>;
  }
  return <Button variant="flux" size="lg" onClick={audio.toggle} className="h-12 gap-2.5 rounded-full px-7 text-sm [&_svg]:h-4 [&_svg]:w-4" aria-label={`${label}, 30-second preview of the original single`}>{icon}{label}</Button>;
}

/** Gold-to-magenta progress line, the same gradient as the site's scroll rail. */
function Progress({ audio }: { audio: PreviewAudio }) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress } = audio;
  const paint = (v: number) => ref.current?.style.setProperty('--p', `${v * 100}%`);
  useMotionValueEvent(progress, 'change', paint);
  useEffect(() => { paint(progress.get()); }, [progress]);
  return <input ref={ref} type="range" className="gd2-progress" min={0} max={PREVIEW_SECONDS} step={1} value={Math.min(audio.time, PREVIEW_SECONDS)}
    onChange={(e) => audio.seek(Number(e.target.value))} aria-label="Seek within the preview" aria-valuetext={`${formatTime(audio.time)} of ${formatTime(PREVIEW_SECONDS)}`} />;
}

function Lyrics({ audio }: { audio: PreviewAudio }) {
  const timed = LYRICS.some((l) => typeof l.at === 'number');
  let active = -1;
  if (timed) LYRICS.forEach((l, i) => { if (l.at !== undefined && l.at <= audio.time) active = i; });
  return <ol className="mx-auto max-w-3xl space-y-4 text-center" aria-label="Lyrics">
    {LYRICS.map((l, i) => <li key={i} aria-current={i === active ? 'true' : undefined}
      className={`font-display text-2xl leading-snug transition-colors duration-300 md:text-4xl ${!timed || i === active ? 'text-foreground' : i < active ? 'text-foreground/45' : 'text-foreground/25'} ${i === active ? 'text-gold' : ''}`}>{l.line}</li>)}
  </ol>;
}

/** An instant print on the wall: the photo, the caption written on the bottom margin. */
function Print({ caption, focus, tilt, sample = false, className = '' }: { caption: string; focus: string; tilt: number; sample?: boolean; className?: string }) {
  return <figure className={`gd2-print ${className}`} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
    <div className="gd2-print__photo" style={{ backgroundImage: `url(${sunrise})`, backgroundPosition: focus }} />
    <figcaption>{caption}</figcaption>
    {sample && <Pending className="absolute -right-2 -top-3 rotate-3 shadow-lg">Sample</Pending>}
  </figure>;
}

const PRINT_FOCUS = ['18% 70%', '62% 40%', '84% 78%', '40% 55%', '92% 30%'];
const PRINT_TILT = [-3.5, 2.5, -1.5, 3, -2.5];

export default function GreatDayPreview() {
  const audio = usePreviewAudio();
  const heroCtas = useRef<HTMLDivElement>(null);
  const ctasVisible = useInView(heroCtas, { margin: '0px 0px -10% 0px' });
  const [draft, setDraft] = useState('');
  const playing = audio.status === 'playing';
  const showDock = !ctasVisible && audio.status !== 'idle';

  return <MotionConfig reducedMotion="user">
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Helmet>
        <title>Today Was a Great Day (Slowed &amp; Chopped) | private preview | Mr. CAP</title>
        <meta name="description" content="Private preview of the Today Was a Great Day (Slowed & Chopped) campaign page. Not public." />
        <meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <audio ref={audio.audioRef} src={PREVIEW_URL} preload="none" />
      <Navigation />

      <main>
        {/* the sun comes up over Houston, and the record is the sun */}
        <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-6 pb-14 pt-28 text-center" aria-labelledby="gd2-title">
          <p className="absolute inset-x-0 top-[72px] z-10 flex items-center justify-center gap-2 bg-background/70 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/75 backdrop-blur md:hidden"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-gold))]" aria-hidden="true" />Private preview · <Link to="/admin/greatday" className="text-gold">Studio</Link></p>
          <img src={sunrise} alt="" className="gd2-sky absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
          <div className="gd2-grade absolute inset-0 -z-10" />

          <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.4, ease }} className="relative z-0 mb-6 md:mb-8">
            <Record playing={playing} className="gd2-record--sun h-[min(36vh,360px)] w-[min(36vh,360px)]" />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.36em] text-gold">Slowed &amp; Chopped by Lil Randy</motion.p>
          <motion.h1 id="gd2-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1, ease }} className="font-display text-balance leading-[0.92] text-foreground drop-shadow-[0_8px_40px_rgba(10,4,16,0.6)]">
            <span className="block text-[clamp(30px,4vw,60px)]">Today Was a</span>
            <span className="block text-[clamp(62px,9.4vw,152px)] text-gold">Great Day</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9, ease }} className="mt-5 flex flex-col items-center gap-3">
            <p className="text-balance text-xs font-medium uppercase tracking-[0.3em] text-foreground/85 md:text-sm"><span className="whitespace-nowrap">Mr. CAP</span> <span className="text-gold">featuring</span> <span className="whitespace-nowrap">Paul Wall</span> · <span className="whitespace-nowrap">Lil Keke</span> · <span className="whitespace-nowrap">Lisa Dinero</span></p>
            <p className="text-base text-foreground/75 md:text-lg">{THEME_LINE}.</p>
          </motion.div>

          <motion.div ref={heroCtas} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease }} className="mt-8 flex w-full max-w-md flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PlayButton audio={audio} />
              <Button variant="fluxOutline" size="lg" asChild className="h-12 rounded-full px-6 text-sm"><a href="#wall">Share your great day</a></Button>
            </div>
            <div className={`w-full transition-opacity duration-500 ${audio.status === 'idle' ? 'opacity-0' : 'opacity-100'}`} aria-hidden={audio.status === 'idle'}>
              <Progress audio={audio} />
              <div className="mt-1 flex justify-between text-[11px] tabular-nums text-foreground/60"><span>{formatTime(audio.time)}</span><span>{audio.status === 'error' ? 'The preview did not load. Press play to try again.' : 'Original single · 30-second preview'}</span><span>{formatTime(PREVIEW_SECONDS)}</span></div>
            </div>
            <Pending>Original 2024 single · slowed &amp; chopped preview coming</Pending>
          </motion.div>
        </section>

        <MarqueeStrip items={MARQUEE} />

        <SectionShell id="words" eyebrow="The Words" align="center" title={<>Read along, <span className="text-gold">line by line.</span></>}
          description="When it drops, every lyric lights up here in time with the record.">
          {LYRICS.length ? <Lyrics audio={audio} /> : <div className="flex flex-col items-center gap-5 text-center">
            <p className="gd2-outline font-display text-[clamp(40px,7vw,96px)] leading-none">Lyrics drop<br />with the record</p>
            <Pending>Lyrics to come</Pending>
          </div>}
        </SectionShell>

        <section className="relative overflow-hidden border-y border-border/60 bg-card/40 py-20 md:py-28" aria-labelledby="gd2-voices">
          <div className="gd2-voices-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <div className="mb-10 flex items-center justify-center gap-3">
              <span className="h-[1px] w-10 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              <h2 id="gd2-voices" className="font-ui text-[11px] font-medium uppercase tracking-[0.3em] text-primary">The Voices</h2>
              <span className="hidden h-[1px] w-10 bg-gradient-to-r from-primary via-primary/0 to-primary/0 md:block" />
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}>
              <p className="font-display text-[clamp(64px,11vw,168px)] leading-[0.9] text-foreground">Mr. CAP</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground/60">{VOICES[0].note}</p>
              <p className="my-8 text-[11px] font-semibold uppercase tracking-[0.5em] text-gold md:my-10">featuring</p>
              <ul className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-0">
                {VOICES.slice(1).map((v, i) => <li key={v.name} className="flex items-center whitespace-nowrap font-display text-[clamp(36px,4.4vw,64px)] leading-none text-foreground">
                  {i > 0 && <span className="mx-6 hidden h-3 w-3 rounded-full bg-[hsl(var(--accent-gold))] md:inline-block" aria-hidden="true" />}{v.name}
                </li>)}
              </ul>
            </motion.div>
            {VOICES.some((v) => v.photo) ? <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">{VOICES.map((v) => <li key={v.name} className="overflow-hidden rounded-2xl border border-border bg-card">{v.photo && <img src={v.photo} alt={v.name} className="aspect-[4/5] w-full object-cover" loading="lazy" />}<p className="p-4 font-display text-lg">{v.name}</p></li>)}</ul>
              : <Pending className="mt-12">Artist portraits to come</Pending>}
          </div>
        </section>

        <SectionShell id="wall" eyebrow={HASHTAG} title={<>The Great Day <span className="text-gold">Wall</span></>}
          description="Fans post what made their day great. Approved stories hang here as prints, every one tagged #TodayWasAGreatDay.">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <ul className="gd2-wall grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3" aria-label="Sample stories written for the preview">
              {SAMPLE_STORIES.map((s, i) => <li key={s} className={i === 1 ? 'sm:mt-10' : i === 3 ? 'sm:-mt-4' : ''}>
                <Print caption={s} focus={PRINT_FOCUS[i]} tilt={PRINT_TILT[i]} sample={i === 0} />
              </li>)}
            </ul>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease }}
              className="rounded-3xl border border-border bg-card/70 p-6 shadow-[var(--shadow-card)] md:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-2xl text-foreground md:text-3xl">Add your great day</h3>
              <p className="mt-2 text-sm text-muted-foreground">Write it and watch it print. In this preview nothing is saved or sent.</p>
              <label htmlFor="gd2-story" className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">What made today great?</label>
              <textarea id="gd2-story" value={draft} maxLength={90} rows={2} onChange={(e) => setDraft(e.target.value)} placeholder="Windows down, the whole family in the car."
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <div className="mx-auto mt-6 w-[min(100%,260px)]"><Print caption={draft || 'Your great day, in your words.'} focus="50% 60%" tilt={-1.5} className={draft ? '' : 'is-ghost'} /></div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="flux" disabled className="rounded-full">Post to the wall</Button>
                <Pending>Opens at launch</Pending>
              </div>
            </motion.div>
          </div>
        </SectionShell>

        <SectionShell id="behind" eyebrow="Behind the Record" title={<>Houston, <span className="text-gold">sunup to sundown.</span></>} className="pt-0 md:pt-0 lg:pt-0">
          {CLIPS.length ? <div className="grid gap-6 md:grid-cols-2">{CLIPS.map((c) => <figure key={c.src} className="overflow-hidden rounded-3xl border border-border bg-card"><video src={c.src} poster={c.poster} controls preload="none" playsInline className="aspect-video w-full" /><figcaption className="p-4 text-sm">{c.title}</figcaption></figure>)}</div>
            : <figure className="relative overflow-hidden rounded-3xl border border-border">
              <img src={sunrise} alt="Concept image: a slab car against the Houston skyline at sunrise" className="aspect-[21/9] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 flex flex-wrap gap-2"><Pending>Concept image</Pending><Pending>Clips to come</Pending></figcaption>
            </figure>}
        </SectionShell>

        <SectionShell id="editions" eyebrow="Own the Day" align="center" title={<>Three ways to <span className="text-gold">own it.</span></>}
          description="Digital editions, direct from CAP Distributions. No middleman.">
          <ul className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t, i) => <motion.li key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay: i * 0.1, ease }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card p-6 text-left ${i === 1 ? 'border-[hsl(var(--accent-gold)/0.5)] shadow-[var(--shadow-gold)]' : 'border-border'}`}>
              <div className="gd2-edition-art relative mb-6 grid aspect-square place-items-center overflow-hidden rounded-2xl">
                <Record playing={false} className="w-[70%] transition-transform duration-700 ease-out group-hover:rotate-[30deg]" />
              </div>
              <h3 className="font-display text-2xl text-foreground">{t.name} Edition</h3>
              <p className="mt-1 text-sm text-muted-foreground">Digital. What's inside is still being decided.</p>
              <div className="mt-5 flex items-center gap-3"><span className="font-display text-3xl text-gold">{t.price}</span><Pending>Proposed</Pending></div>
              <Button variant={i === 1 ? 'flux' : 'fluxOutline'} disabled className="mt-6 rounded-full">Not for sale yet</Button>
            </motion.li>)}
          </ul>
        </SectionShell>

        <section className="border-y border-border/60 bg-card/40 py-14" aria-labelledby="gd2-first">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="gd2-first" className="font-display text-3xl text-foreground md:text-4xl">Be first when it <span className="text-gold">drops.</span></h2>
              <p className="mt-2 text-sm text-muted-foreground">New music, the release date and first access to the editions.</p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="gd2-email" className="sr-only">Email</label>
              <input id="gd2-email" type="email" disabled placeholder="you@email.com" className="h-12 flex-1 rounded-full border border-input bg-background/70 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-70" />
              <Button type="submit" variant="flux" disabled className="h-12 rounded-full px-6">Join</Button>
            </form>
          </div>
          <div className="mx-auto mt-4 max-w-6xl px-6"><Pending>Signups open at launch</Pending></div>
        </section>
      </main>

      <Footer />

      {/* quiet, in the corner the home page uses for its motion control */}
      <div className={`fixed bottom-4 left-4 z-40 items-center gap-3 rounded-full border border-border bg-background/85 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur ${showDock ? 'hidden' : 'hidden md:flex'}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-gold))]" aria-hidden="true" />Private preview
        <Link to="/admin/greatday" className="inline-flex items-center gap-1 text-gold hover:underline">Studio <ArrowUpRight className="h-3 w-3" /></Link>
      </div>

      <AnimatePresence>
        {showDock && <motion.div key="dock" role="region" aria-label="Preview player" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
          className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(520px,calc(100%-24px))] items-center gap-3 rounded-2xl border border-border bg-card/95 p-2 pr-4 shadow-[var(--shadow-card)] backdrop-blur">
          <Record playing={playing} className="h-11 w-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Today Was a Great Day <span className="font-normal text-muted-foreground">· original single</span></p>
            <Progress audio={audio} />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{formatTime(audio.time)}</span>
          <PlayButton audio={audio} size="sm" />
        </motion.div>}
      </AnimatePresence>
    </div>
  </MotionConfig>;
}
