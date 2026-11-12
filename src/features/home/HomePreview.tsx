// Homepage mockup (private, /home-preview): the direction for a more polished mrcap1.com.
// One gold, taken from the backdrop of Mr. CAP's own portrait; Besley headlines with the accent
// word in italic; one button family; every section does one job. Styles in home-preview.css.
// Copy comes from lines already on the site (the intro's stations and the current homepage).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ArrowUpRight, Pause, Play, X } from 'lucide-react';
import ObfuscatedMailto from '@/components/ObfuscatedMailto';
import mrCapCoin from '@/assets/mr-cap-coin.webp';
import albumTies from '@/assets/album-ties.webp';
import './home-preview.css';

const HERO_PHOTO = '/images/mrcap-hero-bg.webp';
const PREVIEW_TRACK = { title: 'Bet’n On Me', src: '/audio/betn-on-me.mp3' };

const NAV = [
  { to: '/music', label: 'Music' },
  { to: '/live', label: 'Shows' },
  { to: '/merch', label: 'Store' },
  { to: '/who-is-mr-cap', label: 'About' },
  { to: '/press', label: 'Press' },
];

const TENETS = [
  { n: 'I', title: 'Own the work', text: 'Masters, publishing, direct catalog. No landlord.' },
  { n: 'II', title: 'Build the audience', text: 'Show by show, tape by tape, city by city. Compound.' },
  { n: 'III', title: 'Outlast the hype', text: 'Longevity is the flex. Careers over cycles.' },
];

const FACTS = ['30+ years in hip-hop', '5 albums on record', 'First Houston rapper to sell a hip-hop NFT'];

const CATALOG = [
  { slug: 'the-art-of-ism', title: 'The Art of ISM', year: 2019, cover: '/intro/img/covers/art-of-ism@640.webp' },
  { slug: '2-tha-grave', title: '2 Tha Grave', year: 2011, cover: '/intro/img/covers/grave@640.webp' },
  { slug: 'tha-cold-ass-pimp', title: 'Tha Cold Ass Pimp', year: 2006, cover: '/intro/img/covers/cold-ass-pimp@640.webp' },
  { slug: 'one-on-one', title: 'O.N.E. on O.N.E.', year: 2005, cover: '/intro/img/covers/one-on-one.jpg' },
];

const FOOT = [
  { head: 'Listen', links: [['Music', '/music'], ['Discography', '/mr-cap-discography'], ['Videos', '/videos'], ['Live shows', '/live']] },
  { head: 'Story', links: [['About Mr. CAP', '/who-is-mr-cap'], ['South Park Coalition', '/south-park-coalition'], ['Houston hip-hop history', '/houston-hip-hop-history'], ['Press', '/press']] },
  { head: 'Own', links: [['Store', '/merch'], ['The Art of ISM', '/art-of-ism'], ['NFT gallery', '/nft'], ['Self Love Art', '/self-love']] },
] as const;

const SOCIAL = [
  ['Instagram', 'https://www.instagram.com/mrcapism/'],
  ['YouTube', 'https://www.youtube.com/@mrcap1'],
  ['TikTok', 'https://www.tiktok.com/@mrcapism'],
  ['Facebook', 'https://www.facebook.com/mrcap11'],
  ['X', 'https://x.com/mrcap1'],
] as const;

/**
 * Scroll reveals. Everything is visible by default; with motion allowed, sections marked
 * data-reveal start hidden (set before first paint) and get `is-in` as they enter the view.
 */
function useReveal() {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.dataset.js = '';
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    el.querySelectorAll('[data-reveal]').forEach((n) => io.observe(n));
    return () => { io.disconnect(); delete el.dataset.js; };
  }, []);
  return root;
}

/** One line of a headline, rising out of a mask. */
function Rise({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  return <span className="hp-rise" style={{ '--i': i } as React.CSSProperties}><span>{children}</span></span>;
}

/** The album preview: one audio element, a play button and a thin meter. */
function usePreview() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  };
  const bind = {
    ref,
    src: PREVIEW_TRACK.src,
    preload: 'none' as const,
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => { setPlaying(false); setProgress(0); },
    onTimeUpdate: () => { const a = ref.current; if (a?.duration) setProgress(a.currentTime / a.duration); },
  };
  return { bind, playing, progress, toggle };
}

export default function HomePreview() {
  const root = useReveal();
  const preview = usePreview();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.body.classList.add('hp-body');
    return () => document.body.classList.remove('hp-body');
  }, []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={root} id="top" className="hp">
    <Helmet>
      <title>Mr. CAP | homepage mockup</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    <header className={`hp-head ${solid ? 'is-solid' : ''}`}>
      <a href="#top" className="hp-logo" aria-label="Mr. CAP, home">
        <img src={mrCapCoin} alt="" width={36} height={36} />
        <span>MR. CAP</span>
      </a>
      <nav className="hp-nav" aria-label="Main">
        {NAV.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
      </nav>
      <Link to="/booking" className="hp-btn hp-btn--ink hp-head__cta">Book Mr. CAP <ArrowUpRight aria-hidden="true" /></Link>
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Trigger className="hp-menu-btn">Menu</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content className="hp hp-menu" aria-describedby={undefined}>
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <div className="hp-menu__top">
              <span className="hp-logo"><img src={mrCapCoin} alt="" width={36} height={36} /><span>MR. CAP</span></span>
              <Dialog.Close className="hp-menu-btn" aria-label="Close menu"><X aria-hidden="true" /></Dialog.Close>
            </div>
            <nav aria-label="Main">
              {[...NAV, { to: '/booking', label: 'Booking' }].map((l, i) => <Link key={l.to} to={l.to} style={{ '--i': i } as React.CSSProperties} onClick={() => setMenu(false)}>{l.label}</Link>)}
            </nav>
            <p className="hp-menu__foot">Houston, Texas · South Park Coalition</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>

    <main>
      {/* The portrait's own gold backdrop is the field; the statement stands on it in ink. */}
      <section className="hp-hero" data-reveal aria-labelledby="hp-title">
        <div className="hp-hero__plate" aria-hidden="true"><img src={HERO_PHOTO} alt="" width={1600} height={1066} {...{ fetchpriority: 'high' }} /></div>
        <div className="hp-hero__copy">
          <h1 id="hp-title">
            <span className="sr-only">Mr. CAP. </span>
            <Rise i={0}>Own the</Rise>
            <Rise i={1}>work.</Rise>
            <Rise i={2}>Outlast</Rise>
            <Rise i={3}>the <em>hype.</em></Rise>
          </h1>
          <p className="hp-hero__sub hp-fade" style={{ '--d': 520 } as React.CSSProperties}>
            Mr. CAP is a Houston hip-hop artist and an Original Member of the South Park Coalition. Three decades of music, straight from the source.
          </p>
          <div className="hp-actions hp-fade" style={{ '--d': 640 } as React.CSSProperties}>
            <Link to="/music" className="hp-btn hp-btn--ink">Listen now <ArrowRight aria-hidden="true" /></Link>
            <Link to="/booking" className="hp-btn hp-btn--line">Book Mr. CAP</Link>
          </div>
        </div>
        <a href="#music" className="hp-chip hp-fade" style={{ '--d': 900 } as React.CSSProperties}>
          <img src={albumTies} alt="" width={56} height={56} />
          <span><small>New album</small>The Ties That Bind Us</span>
          <ArrowRight aria-hidden="true" />
        </a>
      </section>

      {/* The code: pure type, the quiet stretch between two pictures. */}
      <section className="hp-creed" aria-labelledby="hp-creed-title">
        <div className="hp-wrap">
          <div className="hp-creed__lede" data-reveal>
            <h2 id="hp-creed-title">
              <Rise i={0}>Long before streaming,</Rise>
              <Rise i={1}>the South Park Coalition</Rise>
              <Rise i={2}>built a <em>direct-to-fan</em></Rise>
              <Rise i={3}>machine.</Rise>
            </h2>
            <p className="hp-fade" style={{ '--d': 420 } as React.CSSProperties}>
              Masters retained, product moved hand to hand, artists carried on tour by artists. Mr. CAP has spent a career inside that model, and building on top of it.
            </p>
          </div>
          <ol className="hp-tenets" data-reveal>
            {TENETS.map((t, i) => <li key={t.n} style={{ '--i': i } as React.CSSProperties}>
              <span className="hp-tenets__n" aria-hidden="true">{t.n}</span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </li>)}
          </ol>
          <div className="hp-creed__foot" data-reveal>
            <ul className="hp-facts hp-fade">{FACTS.map((f) => <li key={f}>{f}</li>)}</ul>
            <Link to="/who-is-mr-cap" className="hp-link hp-fade" style={{ '--d': 120 } as React.CSSProperties}>The whole story <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* The music: the newest record, one play button, then the shelf. */}
      <section id="music" className="hp-music" aria-labelledby="hp-music-title">
        <div className="hp-wrap">
          <div className="hp-release" data-reveal>
            <button type="button" className="hp-cover" onClick={preview.toggle} aria-label={preview.playing ? `Pause ${PREVIEW_TRACK.title}` : `Play ${PREVIEW_TRACK.title}`}>
              <img src={albumTies} alt="The Ties That Bind Us, the South Park Coalition group album cover" width={1500} height={1500} loading="lazy" />
              <span className="hp-cover__play" aria-hidden="true">{preview.playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</span>
            </button>
            <div className="hp-release__info">
              <h2 id="hp-music-title">
                <Rise i={0}>The Ties That</Rise>
                <Rise i={1}><em>Bind Us.</em></Rise>
              </h2>
              <p className="hp-meta hp-fade" style={{ '--d': 260 } as React.CSSProperties}>South Park Coalition <span aria-hidden="true">/</span> 19 tracks <span aria-hidden="true">/</span> 2024</p>
              <p className="hp-release__desc hp-fade" style={{ '--d': 340 } as React.CSSProperties}>
                A grown-man statement album, honest, reflective, and unflinching. Featuring K-Rino, Point Blank, Klondike Kat and more.
              </p>
              <div className="hp-actions hp-fade" style={{ '--d': 440 } as React.CSSProperties}>
                <button type="button" className="hp-btn hp-btn--gold" onClick={preview.toggle}>
                  {preview.playing ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />}
                  {preview.playing ? 'Pause' : `Play “${PREVIEW_TRACK.title}”`}
                </button>
                <Link to="/albums/the-ties-that-bind-us" className="hp-btn hp-btn--line">The full album</Link>
              </div>
              <div className={`hp-meter ${preview.playing || preview.progress > 0 ? 'is-on' : ''}`} style={{ '--p': preview.progress } as React.CSSProperties} aria-hidden="true" />
              <audio {...preview.bind} />
            </div>
          </div>

          <div className="hp-shelf" data-reveal>
            <div className="hp-shelf__head">
              <h3>The catalog</h3>
              <Link to="/mr-cap-discography" className="hp-link">Full discography <ArrowRight aria-hidden="true" /></Link>
            </div>
            <ul>
              {CATALOG.map((a, i) => <li key={a.slug} className="hp-fade" style={{ '--d': i * 90 } as React.CSSProperties}>
                <Link to={`/albums/${a.slug}`}>
                  <img src={a.cover} alt="" width={640} height={640} loading="lazy" />
                  <span className="hp-shelf__title">{a.title}</span>
                  <span className="hp-shelf__year">{a.year}</span>
                </Link>
              </li>)}
            </ul>
          </div>
        </div>
      </section>
    </main>

    {/* The close: the same gold as the hero, the ask, then the name as big as the page. */}
    <footer className="hp-close">
      <div className="hp-wrap">
        <div className="hp-close__ask" data-reveal>
          <h2>
            <Rise i={0}>Bring the ISM</Rise>
            <Rise i={1}>to your <em>stage.</em></Rise>
          </h2>
          <div className="hp-close__side">
            <p className="hp-fade" style={{ '--d': 300 } as React.CSSProperties}>
              Concerts, festivals, features and speaking, booked straight with the artist’s team. Every inquiry gets a response within 48 hours.
            </p>
            <div className="hp-actions hp-fade" style={{ '--d': 400 } as React.CSSProperties}>
              <Link to="/booking" className="hp-btn hp-btn--ink">Book Mr. CAP <ArrowRight aria-hidden="true" /></Link>
              <ObfuscatedMailto user="music" domain="mrcap1.com" subject="Booking Inquiry" className="hp-btn hp-btn--line">Email the team</ObfuscatedMailto>
            </div>
          </div>
        </div>
        <nav className="hp-foot" aria-label="Site" data-reveal>
          {FOOT.map((col) => <div key={col.head}>
            <h3>{col.head}</h3>
            <ul>{col.links.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
          </div>)}
          <div>
            <h3>Follow</h3>
            <ul>{SOCIAL.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
          </div>
        </nav>
      </div>
      <p className="hp-wordmark" aria-hidden="true" data-reveal><span>MR. CAP</span></p>
      <div className="hp-legal">
        <span>© 2026 South Park Coalition LLC · Houston, Texas</span>
        <span><Link to="/privacy">Privacy</Link><Link to="/intro">Replay the intro</Link></span>
      </div>
    </footer>
  </div>;
}
