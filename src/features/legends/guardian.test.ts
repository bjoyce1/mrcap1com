import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTISTS, GUARDIAN, LEGACY_BLESSING, SYMBOL_WEIGHTS, XP_TABLE } from "./config";
import { createBoard, evaluateBoard, legacyBlessing, weightedSymbol } from "./engine";
import * as server from "../../../supabase/functions/_shared/legends/engine";
import { GUARDIAN as SERVER_GUARDIAN, LEGACY_BLESSING as SERVER_BLESSING } from "../../../supabase/functions/_shared/legends/config";
import { BLESSING_PREVIEW_BOARD, guardianOnGuestReels, guestBoard, guestSpin } from "./guest";
import { GUARDIAN_ART, blessingCopy, blessingOf, flightPath } from "./guardian";
import rig from "./guardian.json";

type Win = { type: string; xp: number; cells: string[]; symbol?: string; count?: number; guardian?: string; multiplier?: number };
const board = (cols: string[][]) => cols.map((c) => [...c]);
const blessingIn = (b: string[][]) => (evaluateBoard(b).wins as Win[]).find((w) => w.type === "legacy_blessing");
const artistIds = new Set(ARTISTS.map((a) => a.id));
/** A board with no artist anywhere except where placed, and nothing that wins on its own. */
const quiet = () => board([["mic", "tape", "vinyl"], ["mixer", "speakers", "headphones"], ["tape", "mic", "vinyl"], ["headphones", "mixer", "speakers"], ["vinyl", "tape", "mic"], ["speakers", "headphones", "mixer"]]);
/** A seeded integer source, so random boards repeat between client and server. */
function seeded(seed: number) { let s = seed >>> 0; return (n: number) => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s % n; }; }

describe("Legacy Blessing trigger", () => {
  it("fires on the preview board: A.C. Chill plus a K-Rino line", () => {
    const win = blessingIn(BLESSING_PREVIEW_BOARD.map((c) => [...c]))!;
    expect(win).toMatchObject({ type: "legacy_blessing", symbol: "ac-chill", guardian: "3:0", count: 3, xp: 375, cells: ["0:1", "1:1", "2:1"] });
  });
  it("needs A.C. Chill on the board", () => {
    const b = BLESSING_PREVIEW_BOARD.map((c) => [...c]);b[3][0] = "mixer";
    expect(blessingIn(b)).toBeUndefined();
  });
  it("needs a win with Legends: music lines, bonus scatters and Supreme alone do not count", () => {
    const music = quiet();music[0][1] = "mic";music[1][1] = "mic";music[2][1] = "mic";music[5][0] = "ac-chill";
    expect((evaluateBoard(music).wins as Win[]).some((w) => w.type === "line")).toBe(true);
    expect(blessingIn(music)).toBeUndefined();
    const supremeOnly = quiet();
    // One different Legend per reel on alternating rows: Supreme pays, no line of three, no connected Unity route.
    ["k-rino", "mr-cap", "k-water", "cl-che", "dope-e", "rapper-k"].forEach((id, col) => { supremeOnly[col][col % 2 ? 0 : 2] = id; });
    supremeOnly[2][1] = "ac-chill";
    const types = (evaluateBoard(supremeOnly).wins as Win[]).map((w) => w.type);
    expect(types).toContain("supreme");expect(types).not.toContain("unity");expect(types).not.toContain("line");
    expect(blessingIn(supremeOnly)).toBeUndefined();
  });
  it("fires on SPC Unity and blesses Unity's Legends", () => {
    const b = quiet();
    ["k-rino", "mr-cap", "k-water", "cl-che", "dope-e", "rapper-k"].forEach((id, col) => { b[col][1] = id; });
    b[0][0] = "ac-chill";
    const win = blessingIn(b)!;
    expect(win.cells).toEqual(["0:1", "1:1", "2:1"]);
  });
  it("activates at most once per spin, from the first A.C. Chill reel by reel", () => {
    const b = BLESSING_PREVIEW_BOARD.map((c) => [...c]);b[4][2] = "ac-chill";b[5][0] = "ac-chill";
    const wins = (evaluateBoard(b).wins as Win[]).filter((w) => w.type === "legacy_blessing");
    expect(wins).toHaveLength(1);expect(wins[0].guardian).toBe("3:0");
  });
  it("is not a Wild: A.C. Chill breaks a line instead of joining it", () => {
    const b = quiet();b[0][1] = "k-rino";b[1][1] = "k-rino";b[2][1] = "ac-chill";b[3][1] = "k-rino";
    expect((evaluateBoard(b).wins as Win[]).filter((w) => w.type === "line")).toHaveLength(0);
  });
});

describe("Legacy Blessing targets", () => {
  it("takes the strongest artist win first, then Unity, then other Legends, with no repeats", () => {
    const b = quiet();
    // A five-long Mr. CAP top line (500 XP) is blessed before a three-long K-Rino bottom line (50 XP).
    for (let c = 0; c < 5; c++) b[c][0] = "mr-cap";
    for (let c = 0; c < 3; c++) b[c][2] = "k-rino";
    b[5][1] = "ac-chill";
    const win = blessingIn(b)!;
    expect(win.cells).toEqual(["0:0", "1:0", "2:0"]);
    expect(new Set(win.cells).size).toBe(win.cells.length);
  });
  it("never blesses Wilds, bonus symbols, music, hoods or A.C. Chill", () => {
    for (let seed = 1; seed < 4000; seed++) {
      const b = createBoard(seeded(seed), { guardian: true }) as string[][];
      const win = blessingIn(b);if (!win) continue;
      for (const cell of win.cells) { const [x, y] = cell.split(":").map(Number); expect(artistIds.has(b[x][y])).toBe(true); }
      expect(new Set(win.cells).size).toBe(win.cells.length);
      expect(win.cells.length).toBeLessThanOrEqual(LEGACY_BLESSING.maxBlessed);
    }
  });
  it("blesses only the Legends there are when fewer than three", () => {
    const b = quiet();b[0][1] = "k-rino";b[1][1] = "wild";b[2][1] = "wild";b[5][2] = "ac-chill";
    const win = blessingIn(b)!;
    expect(win.cells).toEqual(["0:1"]);expect(win.count).toBe(1);
    expect(win.xp).toBe(LEGACY_BLESSING.activationXp + LEGACY_BLESSING.perBlessedXp);
  });
});

describe("Legacy Blessing XP", () => {
  it("pays 150 plus 75 per Legend, at most 375", () => {
    expect(LEGACY_BLESSING).toMatchObject({ activationXp: 150, perBlessedXp: 75, maxBlessed: 3, maxXp: 375 });
    expect(blessingIn(BLESSING_PREVIEW_BOARD.map((c) => [...c]))!.xp).toBe(375);
  });
  it("adds to the spin total once, and Double or Triple Bonus never multiply it", () => {
    const b = BLESSING_PREVIEW_BOARD.map((c) => [...c]);b[5][1] = "double";
    const o = evaluateBoard(b), wins = o.wins as Win[], blessing = wins.find((w) => w.type === "legacy_blessing")!;
    expect(o.multiplier).toBe(2);
    expect(o.xp).toBe(o.baseXp * 2 + blessing.xp);
    expect(blessing.xp).toBe(375);
    expect(o.highest).toBeLessThanOrEqual(o.xp - blessing.xp);
  });
  it("leaves every other win exactly as it was", () => {
    for (let seed = 1; seed < 3000; seed++) {
      const b = createBoard(seeded(seed), { guardian: true }) as string[][];
      const o = evaluateBoard(b), wins = o.wins as Win[];
      const blessing = wins.find((w) => w.type === "legacy_blessing");
      const rest = wins.filter((w) => w.type !== "legacy_blessing");
      expect(rest.filter((w) => w.type !== "multiplier").reduce((t, w) => t + w.xp, 0) * o.multiplier + (blessing?.xp ?? 0)).toBe(o.xp);
      expect(o.baseXp).toBe(rest.filter((w) => w.type !== "multiplier").reduce((t, w) => t + w.xp, 0));
    }
  });
  it("is a plain XP record: no spins, balance, coins or prize fields", () => {
    const win = blessingIn(BLESSING_PREVIEW_BOARD.map((c) => [...c]))!;
    expect(Object.keys(win).sort()).toEqual(["cells", "count", "guardian", "symbol", "type", "xp"]);
    const spin = guestSpin([], BLESSING_PREVIEW_BOARD.map((c) => [...c]));
    expect(spin.balance).toEqual({ welcomeLeft: 0, dailyLeft: 0, paidSpins: 0 });
  });
});

describe("Reels and flags", () => {
  it("keeps A.C. Chill off the reels unless switched on, and keeps every other symbol's tickets", () => {
    const total = Object.values(SYMBOL_WEIGHTS).reduce((t, w) => t + w, 0);
    expect(total).toBe(187);
    for (let t = 0; t < total; t++) expect(weightedSymbol(() => t, { guardian: true })).toBe(weightedSymbol(() => t));
    expect(weightedSymbol(() => total, { guardian: true })).toBe(GUARDIAN.id);
    for (let seed = 1; seed < 2000; seed++) expect((createBoard(seeded(seed)) as string[][]).flat()).not.toContain(GUARDIAN.id);
  });
  it("client and server engines agree on boards and blessings", () => {
    expect(SERVER_GUARDIAN).toEqual(GUARDIAN);expect(SERVER_BLESSING).toEqual(LEGACY_BLESSING);
    for (let seed = 1; seed < 1500; seed++) {
      const b = createBoard(seeded(seed), { guardian: true });
      expect(server.createBoard(seeded(seed), { guardian: true })).toEqual(b);
      expect(server.evaluateBoard(b)).toEqual(evaluateBoard(b));
      expect(server.legacyBlessing(b, server.evaluateBoard(b).wins.filter((w: Win) => w.type !== "legacy_blessing"))).toEqual(legacyBlessing(b, (evaluateBoard(b).wins as Win[]).filter((w) => w.type !== "legacy_blessing")));
    }
  });
  it("puts A.C. Chill on guest reels only in development or with the build flag", () => {
    expect(guardianOnGuestReels({ DEV: false })).toBe(false);
    expect(guardianOnGuestReels({ DEV: false, VITE_LEGENDS_AC_CHILL: "true" })).toBe(true);
    expect(guardianOnGuestReels({ DEV: true })).toBe(true);
  });
  it("serves the preview board only where he is switched on and ?blessing is asked for", () => {
    expect(guestBoard("?blessing", { DEV: true })).toEqual(BLESSING_PREVIEW_BOARD.map((c) => [...c]));
    expect(guestBoard("?blessing", { DEV: false }).flat()).not.toContain(GUARDIAN.id);
  });
  it("leaves Unity and Supreme rates nearly unchanged with him on (simulation)", () => {
    const n = 20000, rate = (guardian: boolean) => {
      const rnd = seeded(guardian ? 7 : 7);let unity = 0, supreme = 0, blessed = 0;
      for (let i = 0; i < n; i++) { const types = new Set((evaluateBoard(createBoard(rnd, { guardian })).wins as Win[]).map((w) => w.type)); if (types.has("unity")) unity++; if (types.has("supreme")) supreme++; if (types.has("legacy_blessing")) blessed++; }
      return { unity: unity / n, supreme: supreme / n, blessed: blessed / n };
    };
    const off = rate(false), on = rate(true);
    expect(off.blessed).toBe(0);
    expect(on.blessed).toBeGreaterThan(0.015);expect(on.blessed).toBeLessThan(0.05);
    expect(Math.abs(on.unity - off.unity)).toBeLessThan(0.025);
    expect(Math.abs(on.supreme - off.supreme)).toBeLessThan(0.025);
  });
});

describe("Legacy Blessing presentation helpers", () => {
  it("finds the blessing in a spin's wins and words the result from its numbers", () => {
    expect(blessingOf([{ type: "line" }])).toBeNull();
    const win = { type: "legacy_blessing", guardian: "3:0", cells: ["0:1"], count: 1, xp: 225 };
    expect(blessingOf([{ type: "supreme" }, win])).toBe(win);
    expect(blessingCopy(win)).toEqual({ kicker: "LEGACY BLESSING ACTIVATED", count: "1 SPC LEGEND BLESSED", xp: "+225 LEGENDS XP" });
    expect(blessingCopy({ count: 3, xp: 375 }).count).toBe("3 SPC LEGENDS BLESSED");
  });
  it("keeps every flight point inside the board so he stays on screen", () => {
    const box = { w: 330, h: 190, padX: 50, padTop: 40, padBottom: 10 };
    for (const [a, b] of [[{ x: 20, y: 20 }, { x: 320, y: 180 }], [{ x: 300, y: 150 }, { x: 10, y: 5 }], [{ x: 165, y: 95 }, { x: 165, y: 95 }]]) {
      const path = flightPath(a, b, box);
      expect(path.length).toBeGreaterThan(10);
      for (const p of path) { expect(p.x).toBeGreaterThanOrEqual(box.padX);expect(p.x).toBeLessThanOrEqual(box.w - box.padX);expect(p.y).toBeGreaterThanOrEqual(box.padTop);expect(p.y).toBeLessThanOrEqual(box.h - box.padBottom); }
    }
  });
  it("has every art file and a rig that matches the cut layers", () => {
    for (const url of Object.values(GUARDIAN_ART)) expect(existsSync(resolve("public", url.slice(1)))).toBe(true);
    const [w, h] = rig.size;
    expect(w).toBe(560);
    for (const [x, y] of [rig.pivots.left, rig.pivots.right]) { expect(x).toBeGreaterThan(0);expect(x).toBeLessThan(w);expect(y).toBeGreaterThan(0);expect(y).toBeLessThan(h); }
    expect(rig.pivots.left[0]).toBeLessThan(rig.pivots.right[0]);
  });
  it("keeps the blessing out of the regular pay table (it is its own award)", () => {
    expect(Object.keys(XP_TABLE)).not.toContain("legacy_blessing");
  });
});
