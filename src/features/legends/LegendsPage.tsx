import { memo, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { routeSeo } from "@/seo/routes";
import { mountLegendsGame } from "./game";
import { symbolUrl } from "./motion";
import "./legends.css";

/**
 * SPC Legends: Spin the Mix, the six reel South Park Coalition arcade game (phase 1: free play only).
 * The markup is static; mountLegendsGame drives it imperatively (reels, HUD, history, overlays),
 * so this component never re-renders its own content. See docs in the SPC Legends source package.
 */
const LegendsGame = memo(function LegendsGame() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => (root.current ? mountLegendsGame(root.current) : undefined), []);
  return (
    <div ref={root} className="legends-world">
      <section className="hero lg-container">
       <div className="hero-kicker"><span className="ruleline"></span> SOUTH PARK COALITION PRESENTS <span className="ruleline"></span></div>
       <h1 className="hero-title">SPC <span>LEGENDS</span></h1>
       <div className="hero-subtitle">SPIN <em>THE</em> MIX</div>
       <p className="hero-copy">Six legends. Six reels. One Houston legacy. Collect your favorites and light up the board in a free-play arcade experience.</p>
       <div className="hero-tags"><span>6 REELS × 3 ROWS</span><span><i className="tiny-star">✦</i> 20 PAYLINES</span><span>3 DAILY SPINS</span><span>VIRTUAL XP ONLY</span></div>
      </section>
      <section className="lg-container game-layout" data-lg="game" aria-label="SPC Legends game">
       <div className="machine-shell">
        <div className="machine-top"><div><div className="section-label">713MIXHOUSE ARCADE / 001</div><h2 className="machine-title">THE LEGENDS MACHINE</h2></div><span className="cabinet-tag">HOUSTON, TX</span></div>
        <div className="cabinet-inset"><div className="reel-headers"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span></div>
          <div className="reel-board" data-lg="board" aria-label="Six reels with three symbols each"><div data-lg="reels" className="reels"></div></div>
          <div className="board-bottom"><span><span className="board-led"></span> SIX REELS ACTIVE</span><span>SPC // 713</span></div></div>
        <div className="hud">
         <div className="hud-block"><span className="hud-label">SPINS LEFT</span><strong data-lg="spins">3</strong></div>
         <div className="hud-block"><span className="hud-label">LEGENDS XP</span><strong data-lg="xp">0</strong></div>
         <div className="hud-block"><span className="hud-label">COLLECTED</span><strong data-lg="collected">0 / 6</strong></div>
         <div className="hud-block"><span className="hud-label">BEST SPIN</span><strong data-lg="best">0</strong></div>
        </div>
        <div className="controls"><button type="button" data-lg="spin" className="spin-button"><span aria-hidden="true">✦</span> <span data-lg="spin-label">SPIN THE MIX</span><span className="spin-chevron" aria-hidden="true">›</span></button><button type="button" data-lg="sound" className="icon-button" aria-pressed="false" title="Enable sound" aria-label="Toggle sound"><span data-lg="sound-icon" aria-hidden="true">♫̸</span></button><button type="button" data-lg="motion" className="icon-button" aria-pressed="false" title="Toggle reduced motion" aria-label="Toggle reduced motion"><span aria-hidden="true">◉</span></button></div>
        <div className="result" data-lg="result" role="status" aria-live="polite"><div className="result-kicker">READY TO ROLL</div><strong data-lg="result-title">THE SOUTH SIDE IS CALLING.</strong><span data-lg="result-desc">Press SPIN THE MIX to reveal your first lineup.</span></div>
        <div className="game-disclaimer">FREE PLAY • No purchases, cash, prize redemption, or real-world rewards. Legends XP is for entertainment only. Daily limits use Houston time.</div>
       </div>
       <aside className="sidebar">
         <section className="panel collection-panel" data-lg="collection-panel"><div className="panel-heading"><div><span className="section-label">YOUR LEGACY</span><h2>LEGENDS COLLECTION</h2></div><span data-lg="collection-count" className="small-chip">0 / 6</span></div><div className="collection-grid" data-lg="collection"></div><div className="progress-track"><div data-lg="collection-progress" className="progress-fill"></div></div><p data-lg="collection-note" className="panel-note">Spin to discover all six artists.</p></section>
         <section className="panel panel-special"><div className="panel-heading"><div><span className="section-label">GAME CHANGERS</span><h2>SPECIAL SYMBOLS</h2></div></div><div className="special-grid"><div className="special"><img src={symbolUrl("wild")} alt="SPC Wild symbol" /><b>SPC WILD</b><small>Substitutes in lines</small></div><div className="special"><img src={symbolUrl("bonus")} alt="713 Bonus symbol" /><b>713 BONUS</b><small>3+ on the board</small></div></div></section>
         <section className="panel history-panel"><div className="panel-heading"><div><span className="section-label">YOUR LAST SETS</span><h2>SPIN HISTORY</h2></div></div><ol data-lg="history" className="history" /></section>
       </aside>
      </section>
      <section className="lg-container below-grid" data-lg="rules">
       <div className="panel rules-panel"><span className="section-label">HOW TO PLAY</span><h2>THE RULES OF THE MIX</h2><div className="rules-grid"><div><b>01 <span>SPIN</span></b><p>Get three free spins each Houston calendar day. Every reel stops in sequence.</p></div><div><b>02 <span>MATCH</span></b><p>Three or more contiguous matches from reel one on one of 20 paylines earn virtual XP.</p></div><div><b>03 <span>COLLECT</span></b><p>Discover K-Rino, Mr. CAP, Klondike Kat, Point Blank, K-Water, and Cl'Che'.</p></div><div><b>04 <span>CELEBRATE</span></b><p>Find three 713 symbols for a bonus, or line up all six unique artists for SPC Unity.</p></div></div></div>
       <div className="panel stat-panel"><span className="section-label">YOUR GAME FILE</span><h2>THE NUMBERS</h2><div className="stat-line"><span>Total Spins</span><strong data-lg="total-spins">0</strong></div><div className="stat-line"><span>Characters Found</span><strong data-lg="found">0/6</strong></div><div className="stat-line"><span>Completion</span><strong data-lg="completion">0%</strong></div><div className="stat-line"><span>Mode</span><strong>Guest / Local</strong></div><p className="panel-note">Progress is saved in this browser only.</p></div>
      </section>
      <section className="lg-container symbol-library"><div className="library-heading"><div><span className="section-label">THE WHOLE MIX</span><h2>SYMBOL LIBRARY</h2></div><p>Uniform premium art tiles • six artist legends, eight music symbols, two special symbols</p></div><div className="library-grid" data-lg="symbol-library"></div></section>
      
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
