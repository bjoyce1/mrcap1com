import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inspectWinningLines, type InspectedLine } from './unity-paths';
import type { SpinWin } from './account';

export type LinesResult = { board: string[][]; wins: SpinWin[]; xp: number };
type Inspection = ReturnType<typeof inspectWinningLines>;
export function WinningLines() {
  const host = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<Inspection | null>(null);
  const [group, setGroup] = useState<'qualifying' | 'standard' | 'rejected'>('qualifying');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    const root = host.current?.closest('.legends-world');
    if (!root) return;
    const update = (event: Event) => {
      const detail = (event as CustomEvent<LinesResult | null>).detail;
      setResult(detail ? inspectWinningLines(detail.board, detail.wins, detail.xp) : null);
      setIndex(0); setSelected(false); setGroup('qualifying');
    };
    root.addEventListener('lg-lines-result', update);
    return () => root.removeEventListener('lg-lines-result', update);
  }, []);
  const lines = result?.[group] ?? [];
  const line = lines[index];
  const choose = (next: number, entries: InspectedLine[] = lines) => {
    const entry = entries[next];
    if (!entry) return;
    setIndex(next); setSelected(true);
    host.current?.dispatchEvent(new CustomEvent('lg-inspect-line', { bubbles: true, detail: entry.win }));
  };
  return <div ref={host} className="winning-lines" hidden={!result}>
    <h3><ListChecks size={18} aria-hidden="true" /> WINNING LINES</h3>
    {result && <>
      <p className="lines-summary">{result.qualifying.length} qualifying Unity routes · {result.standard.filter(l => l.accepted).length} matching paylines awarded</p>
      <p>Credited: <strong>{result.creditedXp.toLocaleString()} XP</strong> · multiplier ×{result.multiplier}. SPC Unity pays once per spin, however many routes qualify.</p>
      <details><summary>Award breakdown</summary><ul>{result.awards.length ? result.awards.map((award, i) => <li key={i}>{award}</li>) : <li>No XP award on this spin.</li>}</ul></details>
      <div className="lines-tabs" role="group" aria-label="Line categories">
        {(['qualifying', 'standard', 'rejected'] as const).map(value => <Button key={value} size="sm" variant={group === value ? 'secondary' : 'ghost'} aria-pressed={group === value} onClick={() => { setGroup(value); setIndex(0); setSelected(false); choose(0, result[value]); }}>{value === 'qualifying' ? `Unity (${result.qualifying.length})` : value === 'standard' ? 'Matching paylines' : `Rejected (${result.rejected.length})`}</Button>)}
      </div>
      {line ? <>
        <div className="lines-controls">
          <Button size="icon" variant="secondary" aria-label="Previous winning line" title="Previous line" disabled={index === 0} onClick={() => choose(index - 1)}><ChevronLeft size={18} /></Button>
          <label>Line <select aria-label="Select winning line" value={index} onChange={event => choose(Number(event.target.value))}>{lines.map((entry, i) => <option key={entry.id} value={i}>{entry.label}</option>)}</select></label>
          <Button size="icon" variant="secondary" aria-label="Next winning line" title="Next line" disabled={index >= lines.length - 1} onClick={() => choose(index + 1)}><ChevronRight size={18} /></Button>
        </div>
        <div className="line-explanation" aria-live="polite"><strong>{line.label} · {index + 1} / {lines.length}</strong><p>{line.explanation}</p></div>
        {!selected && <Button variant="secondary" size="sm" onClick={() => choose(index)}>Highlight this line</Button>}
      </> : <p>No qualifying Unity route. Each route must use six different artists with row steps of at most one.</p>}
    </>}
  </div>;
}