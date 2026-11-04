// The cabinet's animation state: one place that records where a spin really is, so lighting and ambience can react
// in CSS (data-lg-stage / data-lg-level / data-lg-hit on the game root). Presentation only; it follows game events, never drives them.
import { tiersFor } from "./fx";

export type Stage = "idle" | "spin-start" | "spinning" | "stopping" | "evaluating" | "celebrating";
/** 0 no win · 1 a line or Supreme Legendary (most spins) · 2 SPC Unity, a bonus, a multiplier or a Big Win ·
 *  3 a Legend Sweep or a LEGENDARY WIN (10,000+ XP), the rare ones. */
export type Level = 0 | 1 | 2 | 3;
export type HitKind = "none" | "line" | "double-wild" | "supreme" | "unity" | "bonus" | "multiplier" | "sweep";

type OutcomeWin = { type: string; wildMultiplier?: number; symbol?: string };
type Outcome = { xp: number; wins: OutcomeWin[] };

/** How big a celebration a real outcome earns. */
export function celebrationLevel(outcome: Outcome): Level {
  if (outcome.xp <= 0) return 0;
  const types = new Set(outcome.wins.map((w) => w.type)), tiers = tiersFor(outcome.xp).length;
  const hasDoubleWild = outcome.wins.some((w) => (w.wildMultiplier ?? 1) > 1);
  if (types.has("sweep") || tiers >= 3) return 3;
  if (types.has("unity") || types.has("bonus") || types.has("multiplier") || hasDoubleWild || tiers > 0) return 2;
  return 1;
}

/** Which signature background spectacle to trigger for the spin as a whole. */
export function celebrationHit(outcome: Outcome): HitKind {
  if (outcome.xp <= 0 || !outcome.wins.length) return "none";
  const types = new Set(outcome.wins.map((w) => w.type));
  if (types.has("sweep")) return "sweep";
  if (types.has("unity")) return "unity";
  if (types.has("bonus")) return "bonus";
  if (types.has("multiplier")) return "multiplier";
  if (outcome.wins.some((w) => (w.wildMultiplier ?? 1) > 1)) return "double-wild";
  if (types.has("supreme")) return "supreme";
  return "line";
}

/** Which signature background spectacle to pulse when an individual win step pops on the board. */
export function hitKindForWin(win: OutcomeWin): HitKind {
  if (win.type === "sweep") return "sweep";
  if (win.type === "unity") return "unity";
  if (win.type === "bonus") return "bonus";
  if (win.type === "multiplier") return "multiplier";
  if (win.type === "supreme") return "supreme";
  if (win.type === "line" && (win.wildMultiplier ?? 1) > 1) return "double-wild";
  return "line";
}

// Each stage may only follow these, so a late callback from an old spin cannot drag the cabinet backwards.
const NEXT: Record<Stage, Stage[]> = {
  idle: ["spin-start"],
  "spin-start": ["spinning", "idle"],
  spinning: ["stopping", "evaluating", "idle"],
  stopping: ["evaluating", "idle"],
  evaluating: ["celebrating", "idle"],
  celebrating: ["idle"],
};

export function createStage(el: { dataset: DOMStringMap }) {
  let stage: Stage = "idle";
  el.dataset.lgStage = stage;
  el.dataset.lgLevel = "0";
  return {
    get: () => stage,
    /** Moves to `next` if the move is allowed; a new spin may always start. Returns whether it moved. */
    set(next: Stage, level: Level = 0, hit: HitKind = "none") {
      if (next !== "spin-start" && !NEXT[stage].includes(next)) return false;
      stage = next;
      el.dataset.lgStage = next;
      el.dataset.lgLevel = String(next === "celebrating" ? level : 0);
      if (next === "celebrating" && hit !== "none") el.dataset.lgHit = hit;
      else delete el.dataset.lgHit;
      return true;
    },
    /** Updates the active hit spectacle during step-by-step win pop-outs. */
    setHit(hit: HitKind, color?: string) {
      if (stage !== "celebrating") return;
      if (hit && hit !== "none") el.dataset.lgHit = hit;
      if (color && "style" in el) (el as unknown as HTMLElement).style.setProperty("--hit-color", color);
    },
  };
}
