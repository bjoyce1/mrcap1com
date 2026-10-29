import { useLayoutEffect, useRef } from "react";
import "./electric-indicator.css";

/**
 * The menu's active underline, drawn on one canvas. When the page changes it shoots from
 * the item you left to the item you landed on, then rests as a short bar.
 *
 * Motion, after the reference: the head moves LINEARLY and never overshoots. Halfway
 * through, the tail freezes for P seconds while the head runs on (the streak stretches),
 * then the tail runs at exactly twice the speed for P seconds to catch up. One number, tau,
 * makes the whole shape: how far behind the head the tail is running, in seconds.
 *
 * Colours and sizes live in electric-indicator.css; this reads them back.
 * The persistent header keeps the current position through route changes.
 */

type Spot = { x: number; y: number };

const T_MOVE = 0.625; // seconds, the same for every distance
const REF_W = 44; // the reference bar width; distances are scaled to it so the stretch keeps its proportions
// capped below half the run so the tail is always moving at the start and the end of a long run
const freeze = (d: number, w: number) => Math.min(T_MOVE * 0.4, 0.00089 * d * (REF_W / w));

function measure(nav: HTMLElement, el: HTMLElement | null | undefined, gap: number): Spot | null {
  if (!el || !nav.offsetParent) return null;
  return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight + gap };
}

export default function ElectricIndicator({
  activeEl,
  activeKey,
}: {
  activeEl: () => HTMLElement | null;
  activeKey: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSpotRef = useRef<Spot | null | undefined>(undefined);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    // the parent ref is not attached yet when a child layout effect runs, so read the DOM parent
    const nav = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !nav || !ctx) return;

    // sizes and colours come from the stylesheet; it can be read before styles apply, so each has a default
    let W = 28, H = 3, GAP = 10, BLEED = 18, core = "255,255,255", glow = "226,72,160";
    const readStyle = () => {
      const css = getComputedStyle(canvas);
      const num = (name: string, fallback: number) => parseFloat(css.getPropertyValue(name)) || fallback;
      const rgb = (name: string, fallback: string) => {
        const v = css.getPropertyValue(name).trim().split(/\s+/);
        return v.length === 3 && v.every((n) => /^\d+$/.test(n)) ? v.join(",") : fallback;
      };
      W = num("--arc-w", W); H = num("--arc-h", H); GAP = num("--arc-gap", GAP); BLEED = num("--arc-bleed", BLEED);
      core = rgb("--arc-core-rgb", core); glow = rgb("--arc-glow-rgb", glow);
    };
    readStyle();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, dpr = 1, settled = false, disposed = false;
    let resting: Spot | null = null;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = nav.offsetWidth + BLEED * 2, h = nav.offsetHeight + GAP + H + BLEED * 2;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    /** One frame: a bar from tail to head. k (0 to 1) is how stretched it is; alpha fades a run-off. */
    const draw = (tail: number, head: number, y: number, k: number, alpha = 1) => {
      ctx.setTransform(dpr, 0, 0, dpr, BLEED * dpr, BLEED * dpr);
      ctx.clearRect(-BLEED, -BLEED, canvas.width / dpr, canvas.height / dpr);
      if (alpha <= 0) return;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineWidth = H;
      const grad = ctx.createLinearGradient(tail, 0, head, 0);
      grad.addColorStop(0, `rgba(${core}, ${1 - 0.85 * k})`);
      grad.addColorStop(0.6, `rgba(${core}, ${1 - 0.35 * k})`);
      grad.addColorStop(1, `rgba(${core}, 1)`);
      const line = () => { ctx.beginPath(); ctx.moveTo(tail, y); ctx.lineTo(head, y); ctx.stroke(); };
      // a wide soft halo, a tight bright one, then the white-hot core on top
      ctx.strokeStyle = grad;
      ctx.shadowColor = `rgba(${glow}, ${0.8 + 0.2 * k})`;
      ctx.shadowBlur = (14 + 12 * k) * dpr;
      line();
      ctx.shadowBlur = (5 + 4 * k) * dpr;
      line();
      ctx.shadowBlur = 0;
      line();
      if (k > 0.02) {
        // the head burns hottest while it runs
        ctx.fillStyle = `rgba(${core}, 1)`;
        ctx.shadowColor = `rgba(${glow}, 1)`;
        ctx.shadowBlur = 12 * dpr;
        ctx.beginPath(); ctx.arc(head, y, H * (0.75 + 0.5 * k), 0, Math.PI * 2); ctx.fill();
        // the crackle: a jagged arc over the stretched stretch of the streak, new every frame
        const len = head - tail, n = 9, amp = 2 + 6 * k;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5 * dpr;
        ctx.strokeStyle = `rgba(${core}, ${0.55 + 0.4 * k})`;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const f = 0.2 + (0.72 * i) / n;
          const lift = i === 0 || i === n ? 0.6 : i % 2 ? 0.55 + Math.random() * 0.45 : Math.random() * 0.35;
          ctx[i ? "lineTo" : "moveTo"](tail + len * f, y - H / 2 - 1 - lift * amp);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const rest = (s: Spot | null) => {
      resting = s;
      lastSpotRef.current = s;
      if (s) draw(s.x - W / 2, s.x + W / 2, s.y, 0); else draw(0, 0, 0, 0, 0);
    };

    const fly = (from: Spot, to: Spot | null) => {
      // no destination (the home page): the bar runs off toward the logo and fades
      const end = to ?? { x: -W, y: from.y };
      const d = Math.abs(end.x - from.x), dir = Math.sign(end.x - from.x) || 1;
      const v = d / T_MOVE, half = T_MOVE / 2, P = freeze(d, W);
      const x0 = from.x + (dir * W) / 2; // the head starts at the leading end of the resting bar
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(T_MOVE, (now - t0) / 1000);
        const tau = t <= half - P ? 0 : t <= half ? t - (half - P) : t <= half + P ? half + P - t : 0;
        const head = x0 + dir * v * t;
        const tail = head - dir * (W + v * tau);
        lastSpotRef.current = { x: (head + tail) / 2, y: from.y + (end.y - from.y) * (t / T_MOVE) };
        draw(tail, head, from.y + (end.y - from.y) * (t / T_MOVE), P ? tau / P : 0, to ? 1 : 1 - t / T_MOVE);
        if (t < T_MOVE) { raf = requestAnimationFrame(step); return; }
        rest(to);
        settled = true;
      };
      raf = requestAnimationFrame(step);
    };

    size();
    const target = measure(nav, activeEl(), GAP);
    const lastSpot = lastSpotRef.current;
    if (reduced || lastSpot === undefined || (!lastSpot && !target) || (lastSpot && target && lastSpot.x === target.x)) {
      // first view of the visit, or nothing to travel: just rest
      rest(target);
      settled = true;
    } else {
      // from the page you left, or in from the left edge when you came from home
      const from = lastSpot ?? { x: -W, y: target?.y ?? 0 };
      fly(from, target);
    }

    // fonts and window size move the items; keep the bar under its item
    const remeasure = () => {
      if (disposed) return;
      readStyle();
      size();
      const s = measure(nav, activeEl(), GAP);
      if (settled) rest(s);
      else if (resting) rest(resting);
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(nav);
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // activeEl reads refs; the effect only needs to rerun when the active item changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return <canvas ref={canvasRef} className="nav-arc" aria-hidden="true" />;
}
