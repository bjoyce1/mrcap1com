import { CHAPTERS, WORDS, range } from '../core/timeline.js';

export function createNav(root, { goto, fill }) {
  root.innerHTML = CHAPTERS.map((c, i) => `
    <button class="chapters__btn" data-chapter="${c.id}" aria-label="Go to chapter ${i + 1}: ${c.label}">
      <span>${c.label}</span><i><em></em></i>
    </button>`).join('');
  const btns = [...root.querySelectorAll('button')];
  btns.forEach((b, i) => b.addEventListener('click', () => {
    // land just after the chapter word so the fly-through plays
    const w = WORDS.find((x) => x.id === CHAPTERS[i].id);
    goto(w ? w.u[0] + 0.05 : CHAPTERS[i].start);
  }));
  const fills = btns.map((b) => b.querySelector('em'));

  let last = '';

  return {
    update(u, total) {
      root.classList.toggle('is-visible', u > 7.2);
      let active = -1;
      CHAPTERS.forEach((c, i) => {
        const p = range(u, c.start, c.end);
        fills[i].style.transform = `scaleX(${p})`;
        if (u >= c.start && u < c.end) active = i;
      });
      const key = String(active);
      if (key !== last) {
        last = key;
        btns.forEach((b, i) => b.classList.toggle('is-active', i === active));
      }
      fill.style.transform = `scaleX(${Math.min(1, u / total)})`;
    },
  };
}
