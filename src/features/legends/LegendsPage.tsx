import { memo, useEffect, useRef, type CSSProperties } from "react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { routeSeo } from "@/seo/routes";
import { mountLegendsGame } from "./game";
import { applyVaultLook } from "./vault";
import { symbolUrl } from "./motion";
import { ARTISTS, HOUSTON_HOODS, PAYLINES } from "./config";
import { Button } from "@/components/ui/button";
import { WinningLines } from './WinningLines';
import { Marquee } from "./Marquee";
import { Backdrop, Fireworks, HeaderCity } from "./Backdrop";
import "@fontsource/russo-one/400.css";
import "@fontsource/alfa-slab-one/400.css";
import "./legends.css";
import "./environment.css";

/**
 * SPC Legends: Spin the Mix, the six reel South Park Coalition arcade game with account spins and PayPal packs.
 * The markup is static; mountLegendsGame drives it imperatively (reels, HUD, history, overlays),
 * so this component never re-renders its own content. See docs in the SPC Legends source package.
 */
const LegendsGame = memo(function LegendsGame() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(
    () => {
      if (!root.current) return undefined;
      const stop = mountLegendsGame(root.current);
      void applyVaultLook(root.current);
      return stop;
    },
    [],
  );
  return (
    <div ref={root} className="legends-world">
      <Backdrop />
      <div className="lg-smoke" aria-hidden="true"><span /><span /><span /></div>
      <section className="hero lg-container">
       <div className="hero-kicker lg-label">SOUTH PARK COALITION PRESENTS</div>
       <Marquee />
       <p className="hero-copy">{ARTISTS.length} legends. {HOUSTON_HOODS.length} H-Town hoods. Six reels. One Houston legacy. Collect your favorites and light up the board in a Houston arcade experience.</p>
       <div className="hero-tags"><span>6 REELS × 3 ROWS</span><span><i className="tiny-star">✦</i> {PAYLINES.length} PAYLINES</span><span>25 FREE SPINS TO START</span><span>VIRTUAL XP ONLY</span></div>
      </section>
      <section className="lg-container game-layout" data-lg="game" aria-label="SPC Legends game">
       <div className="cab-underglow" aria-hidden="true" />
       <div className="machine-shell">
        <div className="cab-decor" aria-hidden="true"><span className="cab-sheen" /><span className="cab-neon is-left" /><span className="cab-neon is-right" /><span className="cab-chainside is-left" /><span className="cab-chainside is-right" /><span className="cab-smoke"><i /><i /><i /></span><span className="cab-corner is-tl" /><span className="cab-corner is-tr" /><span className="cab-corner is-bl" /><span className="cab-corner is-br" /></div>
        <header className="cab-header">
         <HeaderCity side="left" /><HeaderCity side="right" />
         <Fireworks bursts={[[14, 30, "#ffd76a", 2], [86, 26, "#ff63d2", 2], [30, 14, "#7ce7ff", 3], [70, 12, "#ffd76a", 3]]} />
         <img className="ch-ribbon is-left" src="/games/spc-legends/marquee/ribbon-left.webp" alt="713 MIXHOUSE" />
         <img className="ch-ribbon is-right" src="/games/spc-legends/marquee/ribbon-right.webp" alt="South Park Coalition" />
         <div className="ch-center">
          <img className="ch-crown" src="/games/spc-legends/marquee/crown.webp" alt="" />
          <h2 className="ch-title"><img src="/games/spc-legends/marquee/title-letters.webp" alt="SPC Legends" width={1536} height={290} /></h2>
          <div className="ch-plaque"><span className="ch-gem" aria-hidden="true" /><span className="ch-default">SPIN THE MIX</span><div className="supreme-player-title" data-lg="player-title" hidden><span aria-hidden="true">♛</span> SUPREME LEGENDARY <small>PLAYER TITLE</small></div><div className="vault-player-title" data-lg="vault-title" hidden /><span className="ch-gem" aria-hidden="true" /></div>
         </div>
        </header>
        <div className="cabinet-inset"><div className="reel-headers"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span></div>
          <div className="reel-board" data-lg="board" aria-label="Six reels with three symbols each"><div data-lg="reels" className="reels"></div><div className="cab-burst" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--a": `${(i / 14) * 360}deg`, "--r": `${38 + (i % 3) * 9}%` } as CSSProperties} />)}</div></div>
          <div className="board-bottom"><span><span className="board-led"></span> SIX REELS ACTIVE<span className="board-hint"> · TAP ANY CARD FOR BIO</span></span><span className="board-tools"><button type="button" data-lg="sound" className="icon-button" aria-pressed="true" title="Mute sound effects" aria-label="Toggle sound effects"><span data-lg="sound-icon" aria-hidden="true">🔊</span></button><button type="button" data-lg="music" className="icon-button" aria-pressed="false" title="Turn on win music" aria-label="Toggle win music"><span data-lg="music-icon" aria-hidden="true">♫̸</span></button><button type="button" data-lg="motion" className="icon-button" aria-pressed="false" title="Toggle reduced motion" aria-label="Toggle reduced motion"><span aria-hidden="true">◉</span></button><span className="board-tag">SPC // 713</span></span></div></div>
        <div className="hud">
         <div className="hud-block"><span className="hud-label" data-lg="spins-label">WELCOME SPINS</span><strong data-lg="spins">25</strong></div>
         <div className="hud-block"><span className="hud-label">LEGENDS XP</span><strong data-lg="xp">0</strong></div>
         <div className="hud-main"><img className="hud-crown" src="/games/spc-legends/marquee/crown.webp" alt="" aria-hidden="true" /><button type="button" data-lg="spin" className="spin-button"><span className="spin-star" aria-hidden="true">◆</span><span data-lg="spin-label">SPIN THE MIX</span><span className="spin-chevron" aria-hidden="true">◆</span></button></div>
         <div className="hud-block"><span className="hud-label">COLLECTED</span><strong data-lg="collected">0 / {ARTISTS.length}</strong></div>
         <div className="hud-block"><span className="hud-label">BEST SPIN</span><strong data-lg="best">0</strong></div>
        </div>
        <p className="panel-note" data-lg="balance-summary" aria-live="polite" />
        <div className="result" data-lg="result" role="status" aria-live="polite"><div className="result-kicker">READY TO ROLL</div><strong data-lg="result-title">THE SOUTH SIDE IS CALLING.</strong><span data-lg="result-desc">Press SPIN THE MIX to reveal your first lineup.</span></div>
        <WinningLines />
        <button type="button" className="buy-button" data-lg="shop-open" data-state="idle" aria-expanded="false" aria-controls="lg-shop" hidden>
         <span className="buy-sweep" aria-hidden="true" />
         <span className="buy-label">GET MORE SPINS</span>
         <span className="buy-orb" aria-hidden="true">
          <svg className="buy-ring" viewBox="0 0 48 48"><circle className="buy-ring-track" cx="24" cy="24" r="20" /><circle className="buy-ring-run" cx="24" cy="24" r="20" /></svg>
          <span className="buy-dot" />
          <svg className="buy-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
         </span>
        </button>
        <section className="spin-shop" data-lg="shop" id="lg-shop" aria-label="Buy spins" hidden>
         <div className="lg-label">SPIN PACK</div>
         <div className="pack-card is-selected" aria-label="Selected package: 25 spins for 1 dollar">
          <span className="pack-icon" aria-hidden="true">✦</span>
          <span className="pack-spins">25 SPINS</span>
          <span className="pack-price">$1.00</span>
          <span className="pack-note">PAID SPINS NEVER EXPIRE</span>
         </div>
         <p>Buy another pack any time. Paid spins are used after your free spins.</p>
         <label className="shop-age"><input type="checkbox" data-lg="shop-age" /> I am 18 or older</label>
         <div className="shop-checkout">
          <div className="lg-label">SECURE CHECKOUT</div>
          <div className="shop-paypal" data-lg="shop-paypal" />
         </div>
         <p className="shop-msg" data-lg="shop-msg" role="status" aria-live="polite" />
         <Button type="button" variant="secondary" data-lg="shop-retry" hidden>Retry payment confirmation</Button>
         <p className="shop-paid" data-lg="shop-paid" />
         <p className="shop-fine">Legends XP, ranks and badges have no cash value and cannot be exchanged for money or prizes. Wins never pay out spins. All sales are final unless the law requires a refund. Payments are handled by PayPal.</p>
        </section>
        <div className="game-disclaimer">25 FREE SPINS TO START, THEN 3 FREE SPINS A DAY (HOUSTON TIME) • Extra spins are $1 for 25 • No cash, prizes or real-world rewards. Legends XP is for entertainment only.</div>
       </div>
       <aside className="sidebar">
         <section className="panel collection-panel" data-lg="collection-panel"><div className="panel-heading"><div><span className="section-label">YOUR LEGACY</span><h2>LEGENDS COLLECTION</h2></div><span data-lg="collection-count" className="small-chip">0 / {ARTISTS.length}</span></div><div className="collection-grid" data-lg="collection"></div><div className="progress-track"><div data-lg="collection-progress" className="progress-fill"></div></div><p data-lg="collection-note" className="panel-note">Spin to discover every artist. Tap any portrait to inspect.</p></section>
         <section className="panel panel-special"><div className="panel-heading"><div><span className="section-label">GAME CHANGERS</span><h2>SPECIAL SYMBOLS</h2></div></div><div className="special-grid"><div className="special" data-symbol-id="wild"><img src={symbolUrl("wild")} alt="SPC Wild symbol" /><b>SPC WILD</b><small>Substitutes in lines</small></div><div className="special" data-symbol-id="double-wild"><img src={symbolUrl("double-wild")} alt="713 Double Wild symbol" /><b>713 DOUBLE WILD</b><small>Wild + ×2 line XP</small></div><div className="special" data-symbol-id="bonus"><img src={symbolUrl("bonus")} alt="713 Bonus symbol" /><b>713 BONUS</b><small>3+ on the board</small></div><div className="special" data-symbol-id="double"><img src={symbolUrl("double")} alt="713 Double Bonus symbol" /><b>713 DOUBLE BONUS</b><small>×2 XP on a winning spin</small></div><div className="special" data-symbol-id="triple"><img src={symbolUrl("triple")} alt="SPC Triple Bonus symbol" /><b>SPC TRIPLE BONUS</b><small>×3 XP on a winning spin</small></div></div></section>
         <section className="panel history-panel"><div className="panel-heading"><div><span className="section-label">YOUR LAST SETS</span><h2>SPIN HISTORY</h2></div></div><ol data-lg="history" className="history" /></section>
       </aside>
      </section>
      <section className="lg-container below-grid" data-lg="rules">
       <div className="panel rules-panel"><span className="section-label">HOW TO PLAY</span><h2>THE RULES OF THE MIX</h2><div className="rules-grid"><div><b>01 <span>SPIN</span></b><p>Start with 25 free spins. After those, get three free spins each Houston calendar day. Every reel stops in sequence.</p></div><div><b>02 <span>MATCH</span></b><p>Three or more contiguous matches from reel one on one of {PAYLINES.length} paylines earn virtual XP. Artist, music and Houston hood symbols all pay on paylines. Fill one reel top to bottom with the same artist for 250 base XP, or the same music or hood symbol for 125, a vertical stack. SPC Wilds substitute on paylines and stacks, and 713 Double Wilds both substitute and double that payline's XP.</p></div><div><b>03 <span>COLLECT</span></b><p>Discover {ARTISTS.map(artist => artist.name).join(', ')}.</p></div><div><b>04 <span>CELEBRATE</span></b><p>Find three 713 symbols for a bonus. Connect six different artists across the six reels, one per reel and moving at most one row from reel to reel, for SPC Unity: 500 base XP once per spin. A Legend anywhere on every reel earns Supreme Legendary: 250 base XP and a badge, and each of those Legends wears a crown. Land the SAME Legend on all six reels for a Legend Sweep: 25,000 XP and that artist's gold Legend card. A 713 Double Bonus doubles a winning spin's XP, an SPC Triple Bonus triples it, and both together multiply it by six.</p></div></div></div>
       <div className="panel stat-panel"><span className="section-label">YOUR GAME FILE</span><h2>THE NUMBERS</h2><p data-lg="supreme-badge" className="supreme-badge" hidden>✦ SUPREME LEGENDARY</p><div className="supreme-prize"><span className="section-label">SUPREME REWARD</span><h3>THE GOLD CABINET</h3><p>Exclusive gold reel trim and a crowned Supreme Legendary player title.</p><p className="prize-status" data-lg="prize-status" aria-live="polite">LOCKED · WIN SUPREME LEGENDARY</p><Button type="button" variant="secondary" className="prize-equip" data-lg="prize-equip" aria-pressed="false" disabled>LOCKED</Button><small>Cosmetic reward only. No cash value or extra spins.</small></div><div className="stat-line"><span>Total Spins</span><strong data-lg="total-spins">0</strong></div><div className="stat-line"><span>Characters Found</span><strong data-lg="found">0/{ARTISTS.length}</strong></div><div className="stat-line"><span>Completion</span><strong data-lg="completion">0%</strong></div><div className="stat-line"><span>Mode</span><strong data-lg="mode">Guest</strong></div><p className="panel-note">Sign in and your spins, XP and collection are saved to your account.</p></div>
      </section>
      <section className="lg-container symbol-library">
        <div className="library-heading"><div><span className="section-label">THE WHOLE MIX</span><h2>SYMBOL SET</h2></div><p>{ARTISTS.length} artist legends, {HOUSTON_HOODS.length} historic Houston neighborhoods, five special symbols, eight studio &amp; Houston symbols — tap any card to inspect. <a href="/legends/rewards" style={{color:'#ffd76a',textDecoration:'underline'}}>See every XP reward</a> · <a href="/legends/vault" style={{color:'#ffd76a',textDecoration:'underline'}}>Spend coins in the Vault</a></p></div>
        <div className="library-group"><div className="lg-label">CHARACTER SYMBOLS</div><div className="library-grid is-eight" data-lg="lib-characters" /></div>
        <div className="library-group"><div className="lg-label">HOUSTON HOOD SYMBOLS</div><div className="library-grid is-five" data-lg="lib-hoods" /></div>
        <div className="library-group"><div className="lg-label">SPECIAL SYMBOLS</div><div className="library-grid is-five" data-lg="lib-special" /></div>
        <div className="library-group"><div className="lg-label">MUSIC &amp; HOUSTON SYMBOLS</div><div className="library-grid is-eight" data-lg="lib-music" /></div>
      </section>
      <div className="lg-spotlight" data-lg="spotlight" hidden role="dialog" aria-modal="true" aria-labelledby="lg-spotlight-title">
        <div className="lg-spotlight-backdrop" data-lg="spotlight-close" />
        <div className="lg-spotlight-card">
          <button type="button" className="lg-spotlight-close" data-lg="spotlight-close" aria-label="Close spotlight">✕</button>
          <div className="lg-spotlight-art"><img data-lg="spotlight-img" src={symbolUrl("k-rino")} alt="" /></div>
          <div className="lg-spotlight-body">
            <span className="section-label" data-lg="spotlight-role">SPC LEGEND</span>
            <h3 id="lg-spotlight-title" data-lg="spotlight-title">K-Rino</h3>
            <div className="lg-spotlight-hood" data-lg="spotlight-hood">South Park (MLK Blvd)</div>
            <p className="lg-spotlight-bio" data-lg="spotlight-bio" />
          </div>
        </div>
      </div>
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
