import './impact-effects.css';

/** Decorative fragments only. Original tiles and all outcomes stay intact. */
export class ImpactEffects {
  private layer: HTMLDivElement;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private generation = 0;
  constructor(private board: HTMLElement) {
    this.layer = document.createElement('div');
    this.layer.className = 'impact-layer';
    this.layer.setAttribute('aria-hidden', 'true');
    board.append(this.layer);
  }
  clear() { this.generation++; clearTimeout(this.timer); this.layer.replaceChildren(); }
  burst(cells: string[], reduced: boolean, vertical = false) {
    this.clear();
    if (reduced) return;
    // Measured and built on the next frame, which brings styles up to date anyway, and added in one go. Measuring
    // straight after the hit step changed the page made the browser re-style everything first, a freeze on phones.
    const generation = this.generation;
    requestAnimationFrame(() => { if (generation === this.generation) this.build(cells, vertical); });
    this.timer = setTimeout(() => this.clear(), vertical ? 1500 : 1200);
  }
  private build(cells: string[], vertical: boolean) {
    const box = this.board.getBoundingClientRect();
    const spots = [...new Set(cells)].slice(0, 18).flatMap((cell) => {
      const tile = this.board.querySelector<HTMLElement>(`.reels [data-cell="${cell}"]`);
      return tile ? [{ cell, r: tile.getBoundingClientRect() }] : [];
    });
    const shards = window.matchMedia('(max-width: 620px)').matches ? 4 : 8;
    const frag = document.createDocumentFragment(), touched = new Set<number>();
    for (const { cell, r } of spots) {
      const x = r.left - box.left + r.width / 2, y = r.top - box.top + r.height / 2;
      const ring = document.createElement('i'); ring.className = 'impact-ring';
      ring.style.cssText = `left:${x-r.width*.4}px;top:${y-r.width*.4}px;width:${r.width*.8}px;height:${r.width*.8}px`;
      frag.append(ring);
      for (let i = 0; i < shards; i++) {
        const angle = i * Math.PI * 2 / shards;
        const shard = document.createElement('i'); shard.className = i % 2 ? 'impact-shard gem' : 'impact-shard';
        shard.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(angle)*r.width*1.4}px;--dy:${Math.sin(angle)*r.height*1.2}px;--turn:${i*83}deg`;
        frag.append(shard);
      }
      const reel = Number(cell.split(':')[0]);
      if (vertical && !touched.has(reel)) {
        touched.add(reel);
        const w = r.width;
        const column = document.createElement('i'); column.className = 'vertical-column';
        column.style.cssText = `left:${x-w*.55}px;top:0;width:${w*1.1}px;height:${box.height}px`;
        const bolt = document.createElement('i'); bolt.className = 'vertical-bolt';
        const crown = document.createElement('i'); crown.className = 'vertical-crown'; crown.textContent = '\u265B';
        crown.style.cssText = `font-size:${Math.max(18, w*.32)}px`;
        column.append(bolt, crown);
        frag.append(column);
      }
    }
    this.layer.append(frag);
  }
  destroy() { this.clear(); this.layer.remove(); }
}
