// The cabinet's animation state: one place that records where a spin really is, so lighting and ambience can react
// in CSS (data-lg-stage / data-lg-level on the game root). Presentation only; it follows game events, never drives them.
import { tiersFor } from "./fx";

export type Stage = "idle" | "spin-start" | "spinning" | "stopping" | "evaluating" | "celebrating";
/** 0 no win · 1 standard match · 2 major match or bonus · 3 SPC Unity, Supreme Legendary or a Legend Sweep. */
export type Level = 0 | 1 | 2 | 3;

type Outcome = { xp: number; wins: { type: string }[] };

/** How big a celebration a real outcome earns. */
export function celebrationLevel(outcome: Outcome): Level {
  if (outcome.xp <= 0) return 0;
  const types = new Set(outcome.wins.map((w) => w.type));
  if (types.has("unity") || types.has("supreme") || types.has("sweep")) return 3;
  if (types.has("bonus") || types.has("multiplier") || tiersFor(outcome.xp).length > 0) return 2;
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
