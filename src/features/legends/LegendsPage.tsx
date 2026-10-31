import { memo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { routeSeo } from "@/seo/routes";
import { mountLegendsGame } from "./game";
import { symbolUrl } from "./motion";
import { Button } from "@/components/ui/button";
import "@fontsource/russo-one/400.css";
import "@fontsource/alfa-slab-one/400.css";
import "./legends.css";

/** Page art cut from the approved symbol sheet (scripts/build_ui_assets.py in the game package). */
const ui = (name: string) => `/games/spc-legends/ui/${name}.webp`;

/**
 * SPC Legends: Spin the Mix, the six reel South Park Coalition arcade game with account spins and PayPal packs.
 * The markup is static; mountLegendsGame drives it imperatively (reels, HUD, history, overlays),
 * so this component never re-renders its own content. See docs in the SPC Legends source package.
 */
const LegendsGame = memo(function LegendsGame() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(
    // Sign-in sends the player back here afterwards (see returnTo in pages/Auth.tsx).
    () => (root.current ? mountLegendsGame(root.current, { signIn: () => navigate("/auth", { state: { returnTo: "/legends" } }) }) : undefined),
    [navigate],
  );
  return (
    <div ref={root} className="legends-world">
      <div className="lg-smoke" aria-hidden="true"><span /><span /><span /></div>
      <section className="hero lg-container">
       <img className="hero-skyline is-left" src={ui("skyline-left")} alt="" />
       <img className="hero-skyline is-right" src={ui("skyline-right")} alt="" />
       <img className="hero-logo" src={ui("spc-logo")} alt="South Park Coalition, Houston, TX" width={420} height={384} />
       <div className="hero-kicker lg-label">SOUTH PARK COALITION PRESENTS</div>
       <h1 className="hero-title"><span className="lg-wordmark"><img src={ui("wordmark")} alt="SPC Legends" width={750} height={147} /></span></h1>
       <div className="hero-subtitle">SPIN <em>THE</em> MIX</div>
       <p className="hero-copy">Six legends. Six reels. One Houston legacy. Collect your favorites and light up the board in a Houston arcade experience.</p>
       <div className="hero-tags"><span>6 REELS × 3 ROWS</span><span><i className="tiny-star">✦</i> 20 PAYLINES</span><span>25 FREE SPINS TO START</span><span>VIRTUAL XP ONLY</span></div>
      </section>
      <section className="lg-container game-layout" data-lg="game" aria-label="SPC Legends game">
       <div className="machine-shell">
        <div className="machine-top"><div><div className="section-label">713MIXHOUSE ARCADE / 001</div><h2 className="machine-title">THE LEGENDS MACHINE</h2></div><span className="cabinet-tag">HOUSTON, TX</span></div>
        <div className="cabinet-inset"><div className="reel-headers"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span></div>
          <div className="reel-board" data-lg="board" aria-label="Six reels with three symbols each"><div data-lg="reels" className="reels"></div></div>
          <div className="board-bottom"><span><span className="board-led"></span> SIX REELS ACTIVE</span><span>SPC // 713</span></div></div>
        <div className="hud">
         <div className="hud-block"><span className="hud-label" data-lg="spins-label">WELCOME SPINS</span><strong data-lg="spins">25</strong></div>
         <div className="hud-block"><span className="hud-label">LEGENDS XP</span><strong data-lg="xp">0</strong></div>
         <div className="hud-block"><span className="hud-label">COLLECTED</span><strong data-lg="collected">0 / 6</strong></div>
         <div className="hud-block"><span className="hud-label">BEST SPIN</span><strong data-lg="best">0</strong></div>
        </div>
        <p className="panel-note" data-lg="balance-summary" aria-live="polite" />
        <div className="controls"><button type="button" data-lg="spin" className="spin-button"><span aria-hidden="true">✦</span> <span data-lg="spin-label">SPIN THE MIX</span><span className="spin-chevron" aria-hidden="true">›</span></button><button type="button" data-lg="sound" className="icon-button" aria-pressed="false" title="Enable sound" aria-label="Toggle sound"><span data-lg="sound-icon" aria-hidden="true">♫̸</span></button><button type="button" data-lg="motion" className="icon-button" aria-pressed="false" title="Toggle reduced motion" aria-label="Toggle reduced motion"><span aria-hidden="true">◉</span></button></div>
        <div className="result" data-lg="result" role="status" aria-live="polite"><div className="result-kicker">READY TO ROLL</div><strong data-lg="result-title">THE SOUTH SIDE IS CALLING.</strong><span data-lg="result-desc">Press SPIN THE MIX to reveal your first lineup.</span></div>
        <button type="button" className="shop-open" data-lg="shop-open" aria-expanded="false" aria-controls="lg-shop" hidden>GET 25 SPINS FOR $1</button>
        <Button variant="link" asChild className="w-full mt-2"><Link to="/legends-store">Visit the Spin Store</Link></Button>
        <section className="spin-shop" data-lg="shop" id="lg-shop" aria-label="Buy spins" hidden>
         <div className="lg-label">SPIN PACK</div>
         <strong className="shop-price">25 SPINS FOR $1</strong>
         <p>Buy another pack any time. Paid spins never expire and are used after your free spins.</p>
         <label className="shop-age"><input type="checkbox" data-lg="shop-age" /> I am 18 or older</label>
         <div className="shop-paypal" data-lg="shop-paypal" />
         <p className="shop-msg" data-lg="shop-msg" role="status" aria-live="polite" />
         <Button type="button" variant="secondary" data-lg="shop-retry" hidden>Retry payment confirmation</Button>
         <p className="shop-paid" data-lg="shop-paid" />
         <p className="shop-fine">Legends XP, ranks and badges have no cash value and cannot be exchanged for money or prizes. Wins never pay out spins. All sales are final unless the law requires a refund. Payments are handled by PayPal.</p>
        </section>
        <div className="game-disclaimer">25 FREE SPINS TO START, THEN 3 FREE SPINS A DAY (HOUSTON TIME) • Extra spins are $1 for 25 • No cash, prizes or real-world rewards. Legends XP is for entertainment only.</div>
       </div>
       <aside className="sidebar">
         <section className="panel collection-panel" data-lg="collection-panel"><div className="panel-heading"><div><span className="section-label">YOUR LEGACY</span><h2>LEGENDS COLLECTION</h2></div><span data-lg="collection-count" className="small-chip">0 / 6</span></div><div className="collection-grid" data-lg="collection"></div><div className="progress-track"><div data-lg="collection-progress" className="progress-fill"></div></div><p data-lg="collection-note" className="panel-note">Spin to discover all six artists.</p></section>
         <section className="panel panel-special"><div className="panel-heading"><div><span className="section-label">GAME CHANGERS</span><h2>SPECIAL SYMBOLS</h2></div></div><div className="special-grid"><div className="special"><img src={symbolUrl("wild")} alt="SPC Wild symbol" /><b>SPC WILD</b><small>Substitutes in lines</small></div><div className="special"><img src={symbolUrl("bonus")} alt="713 Bonus symbol" /><b>713 BONUS</b><small>3+ on the board</small></div></div></section>
         <section className="panel history-panel"><div className="panel-heading"><div><span className="section-label">YOUR LAST SETS</span><h2>SPIN HISTORY</h2></div></div><ol data-lg="history" className="history" /></section>
       </aside>
      </section>
      <section className="lg-container below-grid" data-lg="rules">
       <div className="panel rules-panel"><span className="section-label">HOW TO PLAY</span><h2>THE RULES OF THE MIX</h2><div className="rules-grid"><div><b>01 <span>SPIN</span></b><p>Start with 25 free spins. After those, get three free spins each Houston calendar day. Every reel stops in sequence.</p></div><div><b>02 <span>MATCH</span></b><p>Three or more contiguous matches from reel one on one of 20 paylines earn virtual XP.</p></div><div><b>03 <span>COLLECT</span></b><p>Discover K-Rino, Mr. CAP, Klondike Kat, Point Blank, K-Water, and Cl'Che'.</p></div><div><b>04 <span>CELEBRATE</span></b><p>Find three 713 symbols for a bonus, or line up all six unique artists for SPC Unity.</p></div></div></div>
       <div className="panel stat-panel"><span className="section-label">YOUR GAME FILE</span><h2>THE NUMBERS</h2><div className="stat-line"><span>Total Spins</span><strong data-lg="total-spins">0</strong></div><div className="stat-line"><span>Characters Found</span><strong data-lg="found">0/6</strong></div><div className="stat-line"><span>Completion</span><strong data-lg="completion">0%</strong></div><div className="stat-line"><span>Mode</span><strong data-lg="mode">Guest</strong></div><p className="panel-note">Sign in and your spins, XP and collection are saved to your account.</p></div>
      </section>
      <section className="lg-container symbol-library">
        <div className="library-heading"><div><span className="section-label">THE WHOLE MIX</span><h2>SYMBOL SET</h2></div><p>Six artist legends, two special symbols, eight music and Houston symbols</p></div>
        <div className="library-group"><div className="lg-label">CHARACTER SYMBOLS</div><div className="library-grid is-six" data-lg="lib-characters" /></div>
        <div className="library-group"><div className="lg-label">SPECIAL SYMBOLS</div><div className="library-grid is-two" data-lg="lib-special" /></div>
        <div className="library-group"><div className="lg-label">MUSIC &amp; HOUSTON SYMBOLS</div><div className="library-grid is-eight" data-lg="lib-music" /></div>
      </section>
      
      <canvas data-lg="confetti" className="confetti" aria-hidden="true"></canvas>
      <div data-lg="win-overlay" className="win-overlay" aria-hidden="true"><div className="win-overlay-core"><span>SPC LEGENDS</span><strong data-lg="overlay-title">LEGENDARY!</strong><small data-lg="overlay-text">+500 LEGENDS XP</small></div></div>
    </div>
  );
});

const LegendsPage = () => (
  <>
    <SEO entry={routeSeo("/legends")} />
    <main className="legends-page">
      <LegendsGame />
    </main>
    <Footer />
  </>
);

export default LegendsPage;
