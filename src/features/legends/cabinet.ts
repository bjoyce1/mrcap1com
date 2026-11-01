// The cabinet's ambience: marquee bulbs around the machine and the idle "attract mode". Presentation only.

/** Bulb rows along the top and bottom of the machine. Their speed follows the root's state classes
 * (lg-spinning: racing; lg-winning: flashing together); see legends.css. */
export function buildMarquee(shell: HTMLElement, count = 28): () => void {
  const rows = ["is-top", "is-bottom"].map((side) => {
    const row = document.createElement("div");
    row.className = `marquee ${side}`;
    row.setAttribute("aria-hidden", "true");
    for (let i = 0; i < count; i++) {
      const bulb = document.createElement("i");
      bulb.style.setProperty("--i", String(i));
      row.append(bulb);
    }
    return row;
  });
  shell.prepend(rows[0]);
  shell.append(rows[1]);
  return () => rows.forEach((row) => row.remove());
}

/** After `idleMs` without a spin, a random tile catches a glint every few seconds and the spin button breathes.
 * `poke()` marks activity; `stop()` cleans up. Does nothing while motion is reduced. */
export function attractMode(root: HTMLElement, { isBusy, reduced, idleMs = 6000 }: { isBusy: () => boolean; reduced: () => boolean; idleMs?: number }) {
  let last = performance.now();
  const spin = root.querySelector<HTMLElement>('[data-lg="spin"]');
  const timer = window.setInterval(() => {
    const idle = !isBusy() && !reduced() && performance.now() - last > idleMs;
    spin?.classList.toggle("attract", idle);
    if (!idle) return;
    const tiles = root.querySelectorAll<HTMLElement>(".reels .symbol-tile:not(.match)");
    const tile = tiles[Math.floor(Math.random() * tiles.length)];
    if (!tile) return;
    tile.classList.add("glint");
    window.setTimeout(() => tile.classList.remove("glint"), 1100);
  }, 2400);
  return {
    poke() { last = performance.now(); spin?.classList.remove("attract"); },
    stop() { window.clearInterval(timer); spin?.classList.remove("attract"); },
  };
}
