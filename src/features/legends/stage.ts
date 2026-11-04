// The cabinet's animation state: one place that records where a spin really is, so lighting and ambience can react
// in CSS (data-lg-stage / data-lg-level on the game root). Presentation only; it follows game events, never drives them.
import { tiersFor } from "./fx";

export type Stage = "idle" | "spin-start" | "spinning" | "stopping" | "evaluating" | "celebrating";
/** 0 no win · 1 a line or Supreme Legendary (most spins) · 2 SPC Unity, a bonus, a multiplier or a Big Win ·
 *  3 a Legend Sweep or a LEGENDARY WIN (10,000+ XP), the rare ones. */
export type Level = 0 | 1 | 2 | 3;

type Outcome = { xp: number; wins: { type: string }[] };

/** How big a celebration a real outcome earns. */
export function celebrationLevel(outcome: Outcome): Level {
  if (outcome.xp <= 0) return 0;
  const types = new Set(outcome.wins.map((w) => w.type)), tiers = tiersFor(outcome.xp).length;
  if (types.has("sweep") || tiers >= 3) return 3;
  if (types.has("unity") || types.has("bonus") || types.has("multiplier") || tiers > 0) return 2;
  return 1;
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
    set(next: Stage, level: Level = 0) {
      if (next !== "spin-start" && !NEXT[stage].includes(next)) return false;
      stage = next;
      el.dataset.lgStage = next;
      el.dataset.lgLevel = String(next === "celebrating" ? level : 0);
      return true;
    },
  };
}
