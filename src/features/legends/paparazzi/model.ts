import { ARTISTS } from '../config';
import type { SpinWin } from '../account';

export const BOBBY_J = Object.freeze({ id: 'bobby-j', name: 'Bobby J', subtitle: 'Houston Photographer', classification: 'Special Guest', feature: 'paparazzi_experience' });
export const PAPARAZZI_CONFIG = Object.freeze({ productionEnabled: false, developmentEnabled: true });
const artists = new Set(ARTISTS.map(a => a.id));
export type Moment = { spinId: string; board: string[][]; wins: SpinWin[]; xp: number };
export type Subject = { cell: string; artist: string; category: string; combination: string };
export type Photo = Subject & { id: string; spinId: string; capturedAt: string };
export const GALLERY_KEY = 'spc-legends-paparazzi-review-v1';
export function photoStyle(win: SpinWin, xp: number): string {
  if (win.type === 'sweep') return 'Legend Sweep';
  if (win.type === 'vertical') return 'Vertical Stack';
  if (win.type === 'unity') return 'SPC Unity';
  if (xp >= 10000) return 'Legendary Win';
  if (xp >= 2000) return 'Mega Win';
  if (xp >= 1000) return 'Big Win';
  return win.type === 'supreme' ? 'Supreme Legendary' : 'Standard Match';
}
/** Only artist positions in credited wins, never Wilds, multipliers or proposed inspection paths. */
export function winningSubjects(moment: Moment): Subject[] {
  const seen = new Set<string>();
  const ranked = [...moment.wins].filter(w => w.xp > 0 && ['line','vertical','unity','supreme','sweep'].includes(w.type))
    .sort((a,b) => b.xp-a.xp);
  return ranked.flatMap(win => win.cells.flatMap(cell => {
    if (!/^[0-5]:[0-2]$/.test(cell) || seen.has(cell)) return [];
    const [c,r] = cell.split(':').map(Number), artist = moment.board[c]?.[r];
    if (!artist || !artists.has(artist)) return [];
    seen.add(cell);
    return [{ cell, artist, category: photoStyle(win,moment.xp), combination: `${win.type}${win.payline ? ` #${win.payline}` : ''}: ${win.cells.join(', ')}` }];
  }));
}
export function eligibleMoment(moment: Moment, development: boolean, enabled: boolean = PAPARAZZI_CONFIG.developmentEnabled): boolean {
  return development && enabled && moment.board.some(col => col.includes(BOBBY_J.id)) && winningSubjects(moment).length > 0;
}
export function photosFor(moment: Moment, capturedAt: string): Photo[] {
  return winningSubjects(moment).map(subject => ({...subject, spinId: moment.spinId, id: `${moment.spinId}:${subject.cell}:${subject.artist}`, capturedAt}));
}
export function mergePhotos(old: Photo[], incoming: Photo[]): Photo[] {
  const unique = new Map(old.map(p => [p.id,p]));
  incoming.forEach(p => { if (!unique.has(p.id)) unique.set(p.id,p); });
  return [...unique.values()];
}
export function readGallery(storage: Pick<Storage,'getItem'>): Photo[] {
  try {
    const raw: unknown = JSON.parse(storage.getItem(GALLERY_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((p): p is Photo => !!p && typeof p === 'object' && typeof p.id === 'string' && typeof p.spinId === 'string' && typeof p.capturedAt === 'string' && /^\d:\d$/.test(p.cell) && artists.has(p.artist) && typeof p.category === 'string' && typeof p.combination === 'string') : [];
  } catch { return []; }
}
export function presentationOrder(blessing: boolean, paparazzi: boolean): string[] {
  return [...(blessing ? ['legacy_blessing'] : []), ...(paparazzi ? ['paparazzi_experience'] : []), 'winning_lines', 'reward_celebration'];
}
export function stagePoint(tile: {left:number;top:number;width:number;height:number}, box: {left:number;top:number;width:number;height:number}, size:number) {
  return { x: Math.min(Math.max(size/2,tile.left-box.left+tile.width/2), Math.max(size/2,box.width-size/2)), y: Math.min(Math.max(size/2,tile.top-box.top+tile.height/2), Math.max(size/2,box.height-size/2)) };
}
export function presentationPreferences(reduced: boolean, sound: boolean) { return { movement: !reduced, flash: !reduced, sound }; }
