import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowUpRight, LockKeyhole, Play, Pause, Sun, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import houston from '@/assets/greatday/houston-sunrise-concept.jpg';
import SharePreflight from './SharePreflight';
import { TIERS } from './model';
import './greatday.css';

const stories = [
  { place: 'THE MORNING', story: 'A slow morning. A long conversation. Nothing to rush.', name: 'Demo story 01' },
  { place: 'THE CITY', story: 'Windows down. Familiar streets. A little room to breathe.', name: 'Demo story 02' },
  { place: 'THE PEOPLE', story: 'Everybody made it to the table. That was enough.', name: 'Demo story 03' },
];

export default function GreatDayPreview() {
  const [playerDemo, setPlayerDemo] = useState(false);
  const [wallDemo, setWallDemo] = useState(false);
  return <div className="greatday-world">
    <Helmet><title>Great Day Universe private review | Mr. CAP</title><meta name="description" content="Private, admin-only Great Day Universe concept review. No audio, sales or signups are active." /><meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" /></Helmet>
    <Navigation />
    <div className="gd-review-bar"><span><LockKeyhole size={13} /> PRIVATE CONCEPT REVIEW</span><Link to="/admin/greatday">Release Studio <ArrowUpRight size={14} /></Link></div>
    <main>
      <section className="gd-hero" aria-labelledby="gd-title">
        <img src={houston} width={1920} height={1280} alt="Generated campaign concept of a chrome-accented slab car against the Houston skyline at sunrise" className="gd-hero-image" fetchPriority="high" />
        <div className="gd-hero-shade" />
        <div className="gd-hero-copy">
          <p className="gd-kicker">MR. CAP / HOUSTON, TEXAS / REMIX</p>
          <h1 id="gd-title">TODAY WAS<br />A GREAT DAY<span className="gd-title-dot">.</span></h1>
          <p className="gd-roster">Mr. CAP ft. Paul Wall, Lil Keke &amp; Lisa Dinero</p>
          <p className="gd-manifesto">A GREAT DAY IS A STATE OF MIND</p>
          <Button asChild variant="secondary" className="gd-button gd-hero-button"><a href="#gd-record">Step into the day <ArrowDown size={17} /></a></Button>
        </div>
        <div className="gd-hero-bottom"><span>INDEPENDENT RE-RELEASE / DATE NOT SET</span><span>GENERATED CAMPAIGN VISUAL / DRAFT</span></div>
      </section>

      <section id="gd-record" className="gd-section gd-record">
        <div className="gd-cover-wrap"><img src="/images/covers/opt/today-great-day-cover-480.webp" alt="Existing Today Was A Great Day cover, temporary draft artwork, not final approval" width={480} height={480} loading="lazy" className="gd-cover" /><span className="gd-art-label">TEMPORARY ARTWORK / NOT FINAL</span></div>
        <div className="gd-record-copy"><p className="gd-kicker">01 / THE RECORD</p><h2>Houston.<br />On repeat.</h2><p className="gd-large">Today Was A Great Day (Remix)</p><p className="gd-muted">Mr. CAP ft. Paul Wall, Lil Keke &amp; Lisa Dinero</p>
          <div className="gd-player"><div className="gd-player-top"><Button variant="secondary" size="icon" aria-label={playerDemo ? 'Stop silent player demo' : 'Start silent player demo'} aria-pressed={playerDemo} onClick={() => setPlayerDemo(!playerDemo)} className="gd-button">{playerDemo ? <Pause size={20} /> : <Play size={20} />}</Button><div><strong>SILENT PLAYER DEMO</strong><p className="gd-muted">No audio loaded. Rights and master pending.</p></div><LockKeyhole size={17} /></div><div className={`gd-wave ${playerDemo ? 'gd-wave-active' : ''}`} aria-hidden="true">{Array.from({ length: 36 }, (_, i) => <span key={i} />)}</div><p role="status" className="gd-muted">{playerDemo ? 'Visual demo running. No sound or streaming.' : 'Remix playback unavailable in this review.'}</p></div>
        </div>
      </section>

      <section className="gd-city" aria-labelledby="gd-city-title"><img src={houston} alt="Draft Houston sunrise campaign scene" loading="lazy" width={1920} height={1280} className="gd-city-image" /><div className="gd-city-shade" /><div className="gd-city-copy"><p className="gd-kicker">02 / A DAY IN THE CITY</p><h2 id="gd-city-title">Sun up.<br />Windows down.<br />Head high.</h2><p>EDITORIAL DRAFT / NOT AN ARTIST BIOGRAPHY</p><div className="gd-city-moments"><span><Sun size={17} /> Morning light</span><span>Chrome in the afternoon</span><span>Skyline after hours</span></div></div></section>

      <section className="gd-section gd-story"><div><p className="gd-kicker">03 / THE PEOPLE BEHIND THE RECORD</p><h2>Four voices.<br />One great day.</h2></div><div><p className="gd-large">Mr. CAP<br />Paul Wall<br />Lil Keke<br />Lisa Dinero</p><p className="gd-muted">Lead artist: Mr. CAP. Featured artists: Paul Wall, Lil Keke &amp; Lisa Dinero.</p><p className="gd-muted">Independent re-release in planning. Production, songwriting, publishing and final license credits pending verification.</p><p className="gd-kicker">STORY COPY IS EDITORIAL DRAFT</p><p className="gd-muted">A visual direction built around Houston light, chrome and everyday gratitude. No artist quotes or personal histories are represented here.</p></div></section>

      <section className="gd-section gd-wall"><div className="gd-section-heading"><div><p className="gd-kicker">04 / DEMO ONLY</p><h2>The Great Day Wall</h2></div><span className="gd-muted">FICTIONAL SAMPLES / NOT FAN TESTIMONIALS</span></div><div className="gd-wall-grid">{stories.map((story) => <article key={story.name} className="gd-wall-card"><p className="gd-kicker">{story.place}</p><p className="gd-story-text">{story.story}</p><p className="gd-muted">{story.name} / DEMO ONLY</p></article>)}</div><div className="gd-wall-action"><div><h3>Your great day belongs here.</h3><p className="gd-muted">Submission simulation only. No text, identity or story is collected.</p></div><Button variant="secondary" className="gd-button" onClick={() => setWallDemo(true)}><Check size={16} /> Simulate a submission</Button></div><p role="status" className="gd-muted">{wallDemo ? 'DEMO: sample submission acknowledged locally. Nothing was saved or sent.' : ''}</p></section>

      <section className="gd-optin gd-section"><p className="gd-kicker">05 / PRE-RELEASE LIST / DEMO ONLY</p><h2>Be there for<br />the next great day.</h2><p className="gd-muted">No release date yet. Signups are not open in this private review.</p><div className="gd-email-mock"><label htmlFor="gd-email">Email address mockup</label><input id="gd-email" type="text" value="DEMO ONLY: no email collected" disabled aria-describedby="gd-email-note" /><Button variant="secondary" disabled className="gd-button">Signup unavailable</Button></div><p id="gd-email-note" className="gd-muted">This is a disabled mockup, not a mailing-list form. Do not enter a real address.</p></section>

      <section className="gd-section gd-editions"><p className="gd-kicker">06 / PROPOSED EDITIONS</p><h2>Own the day.<br />When it is ready.</h2><div className="gd-tier-grid">{TIERS.map((tier, i) => <article key={tier.name} className="gd-tier"><span className="gd-kicker">EDITION 0{i + 1} / PROPOSED PRICE</span><h3>{tier.name}</h3><p className="gd-price">{tier.price}</p><p className="gd-muted">{tier.detail}</p><Button variant="secondary" disabled className="gd-button"><LockKeyhole size={15} /> NOT FOR SALE</Button></article>)}</div><p className="gd-muted">No checkout, payment collection or download is connected.</p></section>

      <section className="gd-section gd-preflight"><p className="gd-kicker">07 / SHARE PREFLIGHT</p><h2>A great day.<br />Worth passing on.</h2><SharePreflight /></section>
    </main>
    <footer className="gd-footer"><strong>CAP Distributions</strong><p>Great Day Universe / Private review only</p><p>Recording rights, composition clearance, licenses and final credits pending. No audio distribution. No release date set.</p><Link to="/admin/greatday">Back to Release Studio <ArrowUpRight size={14} /></Link></footer>
  </div>;
}