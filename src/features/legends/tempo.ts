// Speeds the cabinet and city loops up and down with the game (data-lg-stage / data-lg-level on .legends-world).
// Changing animation-duration in CSS makes a running loop jump to a new position mid-swing (a searchlight snaps to a
// new angle), so the loops keep their CSS duration and only their playback rate changes, which carries on smoothly.

type Tempo = { selector: string; /** Target loop length in ms for the current stage, or null for the CSS default. */ ms: (stage: string, level: number) => number | null };

const spinning = (stage: string) => stage === "spin-start" || stage === "spinning" || stage === "stopping";

export const TEMPOS: Tempo[] = [
  { selector: ".cab-neon", ms: (s, l) => (s === "celebrating" && l === 3 ? 500 : spinning(s) ? 900 : null) },
  { selector: ".mq-frame-sheen b", ms: (s, l) => (s === "celebrating" && l >= 2 ? 2200 : null) },
  { selector: ".mq-sparks i", ms: (s, l) => (s === "celebrating" && l === 3 ? 1600 : null) },
  { selector: ".lw-beam", ms: (s, l) => (s === "celebrating" && l === 3 ? 1050 : s === "celebrating" && l === 2 ? 1500 : spinning(s) ? 3400 : null) },
  { selector: ".lw-equalizer i", ms: (s) => (s === "celebrating" ? 320 : spinning(s) ? 550 : null) },
];

/** The playback rate that makes a loop of `base` ms last `target` ms. */
export const rateFor = (base: number, target: number | null) => (target && base > 0 ? base / target : 1);

export function followTempo(world: HTMLElement): () => void {
  const apply = () => {
    const stage = world.dataset.lgStage ?? "idle", level = Number(world.dataset.lgLevel || 0);
    for (const t of TEMPOS) {
      const target = t.ms(stage, level);
      world.querySelectorAll<HTMLElement>(t.selector).forEach((el) => {
        for (const a of el.getAnimations()) {
          if (!(a instanceof CSSAnimation)) continue;
          const base = Number(a.effect?.getTiming().duration) || 0;
          const rate = rateFor(base, target);
          if (a.playbackRate !== rate) a.updatePlaybackRate(rate);
        }
      });
    }
  };
  // getAnimations() makes the browser bring styles up to date, so it waits for the next frame, which does that anyway.
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; apply(); }); };
  const mo = new MutationObserver(schedule);
  mo.observe(world, { attributes: true, attributeFilter: ["data-lg-stage", "data-lg-level"] });
  return () => { mo.disconnect(); cancelAnimationFrame(queued); };
}
