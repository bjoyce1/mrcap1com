// The Big Win show: XP counts up while the tier escalates (BIG, MEGA, LEGENDARY), over light rays and a gold
// coin shower. Presentation only; the outcome is already decided and shown in the result panel for screen readers.
import { countUpMs, tiersFor } from "./fx";
import type { SynthSound } from "./motion";
import type { Layers } from "./layers";

type Coin = { x: number; y: number; vx: number; vy: number; r: number; spin: number; spinV: number; age: number; life: number };

/** Gold coins on a canvas: a steady rain while the show runs, plus fountain bursts on each tier. */
class CoinShower {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D | null; coins: Coin[] = []; raf = 0; raining = 0; dpr = 1; w = 0; h = 0; last = 0;
  constructor(canvas: HTMLCanvasElement) { this.canvas = canvas; this.ctx = canvas.getContext("2d"); }
  private size() {
    const rect = this.canvas.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1);
    this.w = rect.width; this.h = rect.height;
    this.canvas.width = Math.round(this.w * this.dpr); this.canvas.height = Math.round(this.h * this.dpr);
  }
  /** Phones get fewer coins so the show stays smooth. */
  private scale() { return this.w < 620 ? 0.5 : 1; }
  start(level: number) { this.size(); this.raining = level; this.last = performance.now(); if (!this.raf) this.raf = requestAnimationFrame(this.loop); }
  stopRain() { this.raining = 0; }
  burst(level: number) {
    const n = Math.round([0, 26, 46, 80][level] * this.scale());
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, speed = 7 + Math.random() * 9;
      this.coins.push(this.coin(this.w / 2 + (Math.random() - 0.5) * 60, this.h * 0.55, Math.cos(a) * speed, Math.sin(a) * speed));
    }
  }
  private coin(x: number, y: number, vx: number, vy: number): Coin {
    return { x, y, vx, vy, r: 9 + Math.random() * 9, spin: Math.random() * Math.PI, spinV: 0.12 + Math.random() * 0.2, age: 0, life: 240 };
  }
  private loop = (now: number) => {
    const ctx = this.ctx; if (!ctx) return;
    // Step by elapsed frames so 60Hz and 120Hz screens run at the same pace.
    const k = Math.min(3, (now - this.last) / 16.67); this.last = now;
    if (this.raining && Math.random() < 0.35 * this.raining * this.scale() * k) this.coins.push(this.coin(Math.random() * this.w, -20, (Math.random() - 0.5) * 2, 2 + Math.random() * 3));
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const c of this.coins) {
      c.age += k; c.x += c.vx * k; c.y += c.vy * k; c.vy += 0.28 * k; c.vx *= Math.pow(0.99, k); c.spin += c.spinV * k;
      // A coin seen edge-on: its width follows the spin, so it reads as flipping in 3D.
      const face = Math.cos(c.spin), wide = Math.max(0.12, Math.abs(face));
      ctx.setTransform(this.dpr, 0, 0, this.dpr, c.x * this.dpr, c.y * this.dpr);
      ctx.beginPath(); ctx.ellipse(0, 0, c.r * wide, c.r, 0, 0, Math.PI * 2);
      ctx.fillStyle = face > 0 ? "#f6c243" : "#d9971f"; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#8a5a10"; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-c.r * wide * 0.25, -c.r * 0.3, c.r * wide * 0.35, c.r * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,248,214,.75)"; ctx.fill();
    }
    this.coins = this.coins.filter((c) => c.y < this.h + 40 && c.age < c.life);
    if (this.coins.length || this.raining) this.raf = requestAnimationFrame(this.loop);
    else { this.raf = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  };
  clear() { cancelAnimationFrame(this.raf); this.raf = 0; this.coins = []; this.raining = 0; this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height); }
}

export class BigWin {
  el: HTMLDivElement; private coins: CoinShower; private resolve: (() => void) | null = null;
  private counting = false; private finishNow: (() => void) | null = null; private timer = 0; private raf = 0;
  constructor(host: HTMLElement, private sound: SynthSound) {
    this.el = document.createElement("div"); this.el.className = "bigwin"; this.el.hidden = true; this.el.setAttribute("aria-hidden", "true");
    this.el.innerHTML = '<div class="bigwin-rays"></div><canvas class="bigwin-coins"></canvas><div class="bigwin-core"><div class="bigwin-hero" hidden><img class="bh-bg" alt="" decoding="sync" /><img class="bh-char" alt="" decoding="sync" /><img class="bh-plate" alt="" decoding="sync" /></div><img class="bigwin-art" alt="" hidden /><span class="bigwin-kicker"></span><strong class="bigwin-tier"></strong><b class="bigwin-amount">0</b><small class="bigwin-sub">VIRTUAL XP • TAP TO CONTINUE</small></div>';
    host.append(this.el);
    this.coins = new CoinShower(this.el.querySelector("canvas")!);
    this.el.addEventListener("click", this.skip);
  }
  private q<T extends HTMLElement>(sel: string) { return this.el.querySelector<T>(sel)!; }
  /** Tap or key: the first finishes the count, the second (or the timer) closes the show. */
  private skip = () => { if (this.counting) this.finishNow?.(); else this.close(); };
  private onKey = (e: KeyboardEvent) => { if (["Enter", " ", "Escape"].includes(e.key)) { e.preventDefault(); this.skip(); } };
  /** Run the show; resolves when it closes. Skipped entirely (resolves at once) under reduced motion or below BIG WIN.
   *  With `layers` (a Legend Sweep whose layers are loaded) the Legend rises in person instead of showing the flat `art`. */
  play({ xp, kicker = "", art = "", layers = null, reducedMotion = false }: { xp: number; kicker?: string; art?: string; layers?: Layers | null; reducedMotion?: boolean }): Promise<void> {
    const tiers = tiersFor(xp);
    if (reducedMotion || !tiers.length) return Promise.resolve();
    this.close();
    const tierEl = this.q<HTMLElement>(".bigwin-tier"), amount = this.q<HTMLElement>(".bigwin-amount"), artEl = this.q<HTMLImageElement>(".bigwin-art");
    this.q<HTMLElement>(".bigwin-kicker").textContent = kicker;
    const hero = this.q<HTMLElement>(".bigwin-hero");
    hero.hidden = !layers; hero.classList.remove("run");
    if (layers) {
      this.q<HTMLImageElement>(".bh-bg").src = layers.bg; this.q<HTMLImageElement>(".bh-char").src = layers.char; this.q<HTMLImageElement>(".bh-plate").src = layers.plate;
      hero.style.setProperty("--split", String(layers.split)); hero.dataset.slam = layers.slam ? "1" : "0";
      void hero.offsetWidth; hero.classList.add("run");
    }
    artEl.hidden = !art || !!layers; if (art && !layers) artEl.src = art;
    tierEl.textContent = ""; amount.textContent = "0";
    this.el.hidden = false; this.el.dataset.level = "0";
    void this.el.offsetWidth; this.el.classList.add("is-open");
    document.addEventListener("keydown", this.onKey);
    this.coins.start(1);
    const duration = countUpMs(xp), start = performance.now();
    let reached = 0, lastTick = 0;
    const reach = (level: number) => {
      while (reached < level) {
        reached++;
        const t = tiers[reached - 1];
        tierEl.textContent = t.label; this.el.dataset.level = String(reached);
        tierEl.classList.remove("slam"); void tierEl.offsetWidth; tierEl.classList.add("slam");
        this.coins.start(reached); this.coins.burst(reached);
        this.sound.tier(reached); this.sound.feel(reached === 3 ? [60, 40, 120] : [40]);
      }
    };
    this.counting = true;
    return new Promise((resolve) => {
      this.resolve = resolve;
      const finish = () => {
        cancelAnimationFrame(this.raf); this.counting = false; this.finishNow = null;
        amount.textContent = xp.toLocaleString(); reach(tiers.length);
        this.timer = window.setTimeout(() => this.close(), 1600 + reached * 300);
      };
      this.finishNow = finish;
      const step = (now: number) => {
        // Ease out, so the number races early and lands with weight.
        const t = Math.min(1, (now - start) / duration), value = Math.round(xp * (1 - Math.pow(1 - t, 2.2)));
        amount.textContent = value.toLocaleString();
        reach(tiers.filter((x) => value >= x.min).length);
        if (now - lastTick > 70) { lastTick = now; this.sound.tick(); }
        if (t < 1) this.raf = requestAnimationFrame(step); else finish();
      };
      this.raf = requestAnimationFrame(step);
    });
  }
  close() {
    clearTimeout(this.timer); cancelAnimationFrame(this.raf); this.counting = false; this.finishNow = null;
    document.removeEventListener("keydown", this.onKey);
    if (this.el.hidden) return;
    this.coins.stopRain(); this.el.classList.remove("is-open");
    window.setTimeout(() => { if (!this.el.classList.contains("is-open")) { this.el.hidden = true; this.coins.clear(); } }, 320);
    const done = this.resolve; this.resolve = null; done?.();
  }
  destroy() { this.close(); this.el.removeEventListener("click", this.skip); this.el.remove(); }
}
