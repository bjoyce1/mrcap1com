import './impact-effects.css';

/** Decorative fragments only. Original tiles and all outcomes stay intact. */
export class ImpactEffects {
  private layer: HTMLDivElement;
  private timer: ReturnType<typeof setTimeout> | undefined;
  constructor(private board: HTMLElement) {
    this.layer = document.createElement('div');
    this.layer.className = 'impact-layer';
    this.layer.setAttribute('aria-hidden', 'true');
    board.append(this.layer);
  }
  clear() { clearTimeout(this.timer); this.layer.replaceChildren(); }
  burst(cells: string[], reduced: boolean, vertical = false) {
    this.clear();
    if (reduced) return;
    const box = this.board.getBoundingClientRect();
    const touched = new Set<number>();
    for (const cell of [...new Set(cells)].slice(0, 18)) {
      const tile = this.board.querySelector<HTMLElement>(`.reels [data-cell="${cell}"]`);
      if (!tile) continue;
      const r = tile.getBoundingClientRect(), x = r.left - box.left + r.width / 2, y = r.top - box.top + r.height / 2;
      const ring = document.createElement('i'); ring.className = 'impact-ring';
      ring.style.cssText = `left:${x-r.width*.4}px;top:${y-r.width*.4}px;width:${r.width*.8}px;height:${r.width*.8}px`;
      this.layer.append(ring);
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const shard = document.createElement('i'); shard.className = 'impact-shard';
        shard.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(angle)*r.width*1.4}px;--dy:${Math.sin(angle)*r.height*1.2}px;--turn:${i*83}deg`;
        this.layer.append(shard);
      }
      const reel = Number(cell.split(':')[0]);
      if (vertical && !touched.has(reel)) {
        touched.add(reel);
        const beam = document.createElement('i'); beam.className = 'vertical-beam';
        beam.style.cssText = `left:${x-2}px;top:0;width:4px;height:${box.height}px`;
        this.layer.append(beam);
      }
    }
    this.timer = setTimeout(() => this.clear(), 1200);
  }
  destroy() { this.clear(); this.layer.remove(); }
}