// Ported from the SPC Legends source package (tests/engine.test.mjs). Same cases, run by Vitest.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import {GAME_CONFIG,PAYLINES,ARTISTS,SYMBOL_WEIGHTS,MULTIPLIERS} from './config';
import {lineMatch, evaluateBoard, applySpin, initialState, normalizeState, localDay, validateBoard, createBoard, anticipationReels, spinsLeft, onWelcomeSpins} from './engine';
const d=new Date('2026-10-31T19:00:00Z');
const grid=()=>Array.from({length:6},()=>['mic','mixer','headphones']);
test('six-by-three board and twenty-six unique paylines',()=>{assert.equal(GAME_CONFIG.reels,6);assert.equal(GAME_CONFIG.rows,3);assert.equal(PAYLINES.length,26);assert.equal(new Set(PAYLINES.map(x=>x.join(''))).size,26);assert(PAYLINES.every(p=>p.length===6&&p.every(y=>y>=0&&y<=2)));});
test('matching first three on central row gives character XP',()=>{const b=grid();for(let i=0;i<3;i++)b[i][1]='k-rino';const r=evaluateBoard(b);assert(r.xp>=50);assert(r.wins.some(x=>x.type==='line'&&x.count===3&&x.symbol==='k-rino'));});
test('wild substitutes first reel when matching, not scatter',()=>{assert.deepEqual(lineMatch(['wild','k-rino','k-rino','mic','mic','mic']),{symbol:'k-rino',count:3});assert.equal(lineMatch(['bonus','k-rino','k-rino','k-rino','k-rino','k-rino']),null);});
test('all wild does not create a fictional character win',()=>{assert.equal(lineMatch(Array(6).fill('wild')),null);});
test('wild + two matches before break produces exactly three',()=>{assert.deepEqual(lineMatch(['wild','wild','mr-cap','mixer','mr-cap','mr-cap']),{symbol:'mr-cap',count:3});});
test('three 713 scatter symbols trigger Houston bonus independent of location',()=>{const b=grid();b[0][0]='bonus';b[3][2]='bonus';b[5][1]='bonus';const r=evaluateBoard(b);assert(r.wins.some(w=>w.type==='bonus'&&w.count===3));assert(r.hitCells.includes('3:2'));});
test('six distinct artists across middle activate SPC Unity',()=>{const b=grid();ARTISTS.slice(2,8).forEach((x,i)=>b[i][1]=x.id);const r=evaluateBoard(b);assert(r.wins.some(w=>w.type==='unity'&&w.row===1));assert.equal(r.found.length,6);});
test('artist order in reels does not weight their value',()=>{for(const a of ARTISTS){const b=grid();b[0][1]=a.id;b[1][1]=a.id;b[2][1]=a.id;const win=evaluateBoard(b).wins.find(w=>w.type==='line'&&w.payline===1);assert.equal(win.xp,50,a.name);}});
test('daily counter resets on Chicago date change incl DST',()=>{const s={...initialState(d),spinsToday:3,xp:100,totalSpins:5};const tomorrow=new Date('2026-11-01T19:00:00Z');const t=normalizeState(s,tomorrow);assert.equal(t.spinsToday,0);assert.equal(t.totalSpins,5);assert.equal(t.xp,100);assert.equal(localDay(new Date('2026-11-01T04:30:00Z')),'2026-10-31');});
test('apply spin records virtual XP, preserves collection and limits three spins',()=>{const b=grid();for(let i=0;i<3;i++)b[i][1]='k-rino';let s={...initialState(d),welcomeLeft:0};for(let i=0;i<3;i++){const out=applySpin(s,b,d);s=out.state;}assert.equal(s.spinsToday,3);assert(s.collection.includes('k-rino'));assert.equal(s.totalSpins,3);assert.throws(()=>applySpin(s,b,d),/Daily spin limit/);});
test('invalid symbols and shapes rejected',()=>{assert.equal(validateBoard([['mic']]),false);const b=grid();b[4][1]='unknown';assert.throws(()=>evaluateBoard(b),/Expected six reels/);});
test('random injected deterministic source builds valid board',()=>{const b=createBoard(()=>0);assert(validateBoard(b));assert(b.flat().every(s=>s==='k-rino'));});
test('line wins expose the exact payline cells used for highlighting',()=>{const b=grid();b[0][0]='k-water';b[1][1]='k-water';b[2][2]='k-water';b[3][2]='k-water';const r=evaluateBoard(b);const win=r.wins.find(w=>w.type==='line'&&w.symbol==='k-water');assert(win);assert.deepEqual(win.cells,PAYLINES[win.payline-1].slice(0,win.count).map((row,col)=>`${col}:${row}`));});
test('anticipation starts after exactly two 713 symbols land and stops after a third',()=>{const b=grid();assert.deepEqual(anticipationReels(b),[false,false,false,false,false,false]);b[0][0]='bonus';assert.deepEqual(anticipationReels(b),[false,false,false,false,false,false]);b[2][1]='bonus';assert.deepEqual(anticipationReels(b),[false,false,false,true,true,true]);b[4][2]='bonus';assert.deepEqual(anticipationReels(b),[false,false,false,true,true,false]);});
test('anticipation is presentation only and never changes the outcome',()=>{const b=grid();b[0][0]='bonus';b[1][0]='bonus';const before=JSON.stringify(evaluateBoard(b));anticipationReels(b);assert.equal(JSON.stringify(evaluateBoard(b)),before);assert.throws(()=>anticipationReels([['bonus']]),/Expected six reels/);});
test('new players start with 25 welcome spins, then get 3 free spins a day',()=>{
  const b=grid();let s=initialState(d);
  assert.equal(GAME_CONFIG.welcomeSpins,25);assert.equal(spinsLeft(s,d),25);assert.equal(onWelcomeSpins(s,d),true);
  for(let i=0;i<25;i++)s=applySpin(s,b,d).state;
  assert.equal(s.welcomeLeft,0);assert.equal(s.spinsToday,0,'welcome spins do not use the daily allowance');
  assert.equal(spinsLeft(s,d),3);assert.equal(onWelcomeSpins(s,d),false);
  for(let i=0;i<3;i++)s=applySpin(s,b,d).state;
  assert.equal(spinsLeft(s,d),0);assert.equal(s.totalSpins,28);
  assert.throws(()=>applySpin(s,b,d),/Daily spin limit/);
  const tomorrow=new Date('2026-11-01T19:00:00Z');assert.equal(spinsLeft(s,tomorrow),3);
});
test('welcome spins never reset and carry across days',()=>{
  const s=applySpin(initialState(d),grid(),d).state;assert.equal(s.welcomeLeft,24);
  const next=normalizeState(s,new Date('2026-11-05T19:00:00Z'));assert.equal(next.welcomeLeft,24);assert.equal(spinsLeft(next,new Date('2026-11-05T19:00:00Z')),24);
});
test('players saved before welcome spins get the full 25; bad values are clamped',()=>{
  const legacy={schema:3,day:'2026-10-31',spinsToday:3,xp:500,totalSpins:9,collection:['k-rino'],history:[],badges:[]};
  const s=normalizeState(legacy,d);assert.equal(s.welcomeLeft,25);assert.equal(spinsLeft(s,d),25);assert.equal(s.xp,500);
  assert.equal(normalizeState({...legacy,welcomeLeft:999},d).welcomeLeft,25);
  assert.equal(normalizeState({...legacy,welcomeLeft:-4},d).welcomeLeft,0);
  assert.equal(normalizeState({...legacy,welcomeLeft:'25'},d).welcomeLeft,25);
});
// A board with no wins at all: no symbol appears in more than one reel.
const quiet=()=>[['mic','mixer','vinyl'],['tape','headphones','legend'],['speakers','houston','mic'],['mixer','vinyl','tape'],['legend','speakers','houston'],['headphones','mic','mixer']];
test('713 Double Bonus doubles a winning spin, SPC Triple Bonus triples it, both make x6',()=>{
  const win=()=>{const b=quiet();for(let i=0;i<3;i++)b[i][1]='k-rino';return b;};
  const plain=evaluateBoard(win());assert.equal(plain.xp,50);assert.equal(plain.multiplier,1);
  const dbl=win();dbl[5][0]='double';const d2=evaluateBoard(dbl);
  assert.equal(d2.xp,100);assert.equal(d2.baseXp,50);assert.equal(d2.multiplier,2);assert(d2.hitCells.includes('5:0'));
  assert.deepEqual(d2.wins.find(w=>w.type==='multiplier'),{type:'multiplier',symbol:'double',multiplier:2,count:1,xp:50,cells:['5:0']});
  const tri=win();tri[4][2]='triple';assert.equal(evaluateBoard(tri).xp,150);
  const both=win();both[5][0]='double';both[4][2]='triple';both[3][0]='double';const b6=evaluateBoard(both);
  assert.equal(b6.xp,300);assert.equal(b6.multiplier,6,'two Doubles still count once');
  assert.equal(b6.wins.filter(w=>w.type==='multiplier').reduce((t,w)=>t+w.xp,0),250,'multiplier wins add up to the extra XP');
  assert.equal(b6.highest,300);
});
test('multipliers do nothing on a losing spin and never form or extend a payline',()=>{
  assert.equal(evaluateBoard(quiet()).xp,0);
  const b=quiet();b[0][1]='double';b[1][1]='double';b[2][1]='double';b[3][1]='triple';
  const r=evaluateBoard(b);assert.equal(r.xp,0);assert.equal(r.multiplier,1);assert.equal(r.wins.length,0);
  assert.equal(lineMatch(['k-rino','k-rino','double','k-rino','k-rino','k-rino']),null);
  assert.deepEqual(lineMatch(['k-rino','k-rino','k-rino','double','k-rino','k-rino']),{symbol:'k-rino',count:3});
});
test('special symbols are rarer than every artist and music symbol; artists stay equal',()=>{
  assert.deepEqual(MULTIPLIERS,{double:2,triple:3});
  assert.equal(SYMBOL_WEIGHTS.double,2);assert.equal(SYMBOL_WEIGHTS.triple,1);
  assert.equal(new Set(ARTISTS.map(a=>SYMBOL_WEIGHTS[a.id])).size,1);
  assert.equal(Object.values(SYMBOL_WEIGHTS).reduce((t,w)=>t+w,0),160);
});
