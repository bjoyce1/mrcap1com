// @ts-nocheck
// Ported from the SPC Legends source package (src/game/engine.mjs). Pure: no DOM, no storage.
import {ARTISTS, MUSIC, SYMBOL_MAP, SYMBOL_WEIGHTS, GAME_CONFIG, PAYLINES, XP_TABLE, MULTIPLIERS} from './config.ts';
const artistIds=new Set(ARTISTS.map(a=>a.id));
const musicIds=new Set(MUSIC.map(a=>a.id));
export function localDay(date=new Date(),timeZone=GAME_CONFIG.timezone){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const x=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${x.year}-${x.month}-${x.day}`;
}
export function initialState(date=new Date()){
  return {schema:3,day:localDay(date),spinsToday:0,welcomeLeft:GAME_CONFIG.welcomeSpins,totalSpins:0,xp:0,best:0,collection:[],history:[],badges:[],lastBoard:null};
}
export function normalizeState(state,date=new Date()){
  const empty=initialState(date);
  const safe={...empty,...(state&&typeof state==='object'?state:{})};
  safe.spinsToday=Number.isSafeInteger(safe.spinsToday)?Math.max(0,Math.min(GAME_CONFIG.dailySpins,safe.spinsToday)):0;
  // Players saved before welcome spins existed have no field and get the full welcome; bad values are clamped.
  safe.welcomeLeft=Number.isSafeInteger(safe.welcomeLeft)?Math.max(0,Math.min(GAME_CONFIG.welcomeSpins,safe.welcomeLeft)):GAME_CONFIG.welcomeSpins;
  safe.xp=Number.isSafeInteger(safe.xp)?Math.max(0,safe.xp):0;
  safe.totalSpins=Number.isSafeInteger(safe.totalSpins)?Math.max(0,safe.totalSpins):0;
  safe.best=Number.isSafeInteger(safe.best)?Math.max(0,safe.best):0;
  safe.collection=[...new Set((Array.isArray(safe.collection)?safe.collection:[]).filter(x=>artistIds.has(x)))];
  safe.history=(Array.isArray(safe.history)?safe.history:[]).slice(0,20);
  safe.badges=(Array.isArray(safe.badges)?safe.badges:[]).filter(x=>typeof x==='string');
  if(safe.day!==empty.day){safe.day=empty.day;safe.spinsToday=0;}
  return safe;
}
/** A uniform integer [0,n) using rejection sampling; do not use Math.random for game results. */
export function secureRandomInt(n){
  if(!Number.isSafeInteger(n)||n<1||n>2**32)throw new RangeError('Invalid bound');
  if(!globalThis.crypto?.getRandomValues)throw new Error('Secure random source unavailable');
  const arr=new Uint32Array(1),range=2**32,limit=range-(range%n);
  do{globalThis.crypto.getRandomValues(arr);}while(arr[0]>=limit);
  return arr[0]%n;
}
export function weightedSymbol(randomInt=secureRandomInt){
  const entries=Object.entries(SYMBOL_WEIGHTS),total=entries.reduce((acc,[,w])=>acc+w,0);
  let choice=randomInt(total);
  for(const [id,weight] of entries){choice-=weight;if(choice<0)return id;}
  throw new Error('Invalid random symbol');
}
export function createBoard(randomInt=secureRandomInt){
  return Array.from({length:GAME_CONFIG.reels},()=>Array.from({length:GAME_CONFIG.rows},()=>weightedSymbol(randomInt)));
}
export function validateBoard(board){
  return Array.isArray(board)&&board.length===6&&board.every(col=>Array.isArray(col)&&col.length===3&&col.every(id=>!!SYMBOL_MAP[id]));
}
/** Determine exactly one left-to-right run for a payline; wilds substitute, but do not trigger a payout on their own.
 * A run must begin on reel one, and cannot include scatter/bonus.
 */
export function lineMatch(line){
  if(!Array.isArray(line)||line.length!==6||line[0]==='bonus')return null;
  const real=line.find(s=>s!=='wild');
  if(!real||real==='bonus')return null;
  let count=0;
  for(const id of line){
    if(id==='wild'||id===real){count++;continue;}
    break;
  }
  if(count<3)return null;
  return {symbol:real,count};
}
function cellKey(col,row){return `${col}:${row}`;}
export function evaluateBoard(board){
  if(!validateBoard(board))throw new TypeError('Expected six reels with three valid symbols each');
  const wins=[],hits=new Set();let xp=0;
  PAYLINES.forEach((line,index)=>{
    const symbols=line.map((row,col)=>board[col][row]);
    const matched=lineMatch(symbols);
    if(!matched)return;
    const category=artistIds.has(matched.symbol)?'character':musicIds.has(matched.symbol)?'music':null;
    if(!category)return;
    const earned=XP_TABLE[category][matched.count];
    if(!earned)return;
    const win={type:'line',payline:index+1,symbol:matched.symbol,count:matched.count,xp:earned,cells:line.slice(0,matched.count).map((row,col)=>cellKey(col,row))};
    wins.push(win);xp+=earned;win.cells.forEach(k=>hits.add(k));
  });
  const scatter=[];
  board.forEach((col,x)=>col.forEach((s,y)=>{if(s==='bonus')scatter.push(cellKey(x,y))}));
  if(scatter.length>=3){wins.push({type:'bonus',count:scatter.length,xp:XP_TABLE.bonus,cells:scatter});xp+=XP_TABLE.bonus;scatter.forEach(k=>hits.add(k));}
  for(let y=0;y<3;y++){
    const ids=board.map(col=>col[y]);
    if(ids.every(id=>artistIds.has(id))&&new Set(ids).size===6){
      const cells=Array.from({length:6},(_,x)=>cellKey(x,y));
      wins.push({type:'unity',row:y,xp:XP_TABLE.unity,cells});xp+=XP_TABLE.unity;cells.forEach(k=>hits.add(k));
    }
  }
  // One Supreme path per board: a real artist on every reel, any row, repeats allowed.
  const supremeRows=board.map(col=>col.findIndex(id=>artistIds.has(id)));
  if(supremeRows.every(row=>row>=0)){
    const cells=supremeRows.map((row,col)=>cellKey(col,row));
    wins.unshift({type:'supreme',count:6,xp:XP_TABLE.supreme,cells});
    xp+=XP_TABLE.supreme;cells.forEach(k=>hits.add(k));
  }
  // Legend Sweep: the SAME artist on all six reels, any rows; wilds do not count. The jackpot, celebrated first.
  // Its path takes that artist's top-most cell on each reel. Two artists can sweep one board; each pays.
  for(const artist of ARTISTS){
    const rows=board.map(col=>col.indexOf(artist.id));
    if(rows.some(row=>row<0))continue;
    const cells=rows.map((row,col)=>cellKey(col,row));
    wins.unshift({type:'sweep',symbol:artist.id,count:6,xp:XP_TABLE.sweep,cells});
    xp+=XP_TABLE.sweep;cells.forEach(k=>hits.add(k));
  }
  // Double and Triple Bonus anywhere on a winning board multiply its XP (x2, x3, both x6). On a losing board they do nothing.
  const baseXp=xp;let multiplier=1;
  if(baseXp>0){
    for(const [id,factor] of Object.entries(MULTIPLIERS)){
      const cells=[];board.forEach((col,x)=>col.forEach((s,y)=>{if(s===id)cells.push(cellKey(x,y))}));
      if(!cells.length)continue;
      multiplier*=factor;wins.push({type:'multiplier',symbol:id,multiplier:factor,count:cells.length,xp:0,cells});cells.forEach(k=>hits.add(k));
    }
    xp=baseXp*multiplier;
    // Each multiplier win reports the extra XP it added, so history and stored wins add up.
    let running=baseXp;for(const w of wins)if(w.type==='multiplier'){w.xp=running*(w.multiplier-1);running*=w.multiplier;}
  }
  const found=[...new Set(board.flat().filter(id=>artistIds.has(id)))];
  return {xp,baseXp,multiplier,wins,hitCells:[...hits],found,highest:Math.max(0,...wins.filter(w=>w.type!=='multiplier').map(w=>w.xp))*multiplier};
}
/** Presentation hint only: reels that spin longer because exactly two 713 Bonus symbols already landed on earlier reels.
 * It reads a finished board and never changes the outcome or XP.
 */
export function anticipationReels(board){
  if(!validateBoard(board))throw new TypeError('Expected six reels with three valid symbols each');
  let landed=0;
  return board.map(col=>{const tease=landed===2;landed+=col.filter(id=>id==='bonus').length;return tease;});
}
/** Spins the player can take right now: welcome spins while any remain, then what is left of today's free spins. */
export function spinsLeft(state,date=new Date()){
  const s=normalizeState(state,date);
  return s.welcomeLeft>0?s.welcomeLeft:GAME_CONFIG.dailySpins-s.spinsToday;
}
/** True while the player is still on welcome spins (the HUD labels the counter accordingly). */
export function onWelcomeSpins(state,date=new Date()){return normalizeState(state,date).welcomeLeft>0;}
export function applySpin(state,board,date=new Date()){
  const normalized=normalizeState(state,date);
  const welcome=normalized.welcomeLeft>0;
  if(!welcome&&normalized.spinsToday>=GAME_CONFIG.dailySpins)throw new Error('Daily spin limit reached');
  const outcome=evaluateBoard(board);
  const collection=[...new Set([...normalized.collection,...outcome.found])];
  const badges=[...normalized.badges];
  if(collection.length>=6&&!badges.includes('six-legends'))badges.push('six-legends');
  if(outcome.wins.some(w=>w.type==='unity')&&!badges.includes('spc-unity'))badges.push('spc-unity');
  if(outcome.wins.some(w=>w.type==='supreme')&&!badges.includes('supreme-legends'))badges.push('supreme-legends');
  if(outcome.wins.some(w=>w.type==='sweep')&&!badges.includes('legend-sweep'))badges.push('legend-sweep');
  // Welcome spins are spent first and do not touch the daily count.
  const next={...normalized,spinsToday:normalized.spinsToday+(welcome?0:1),welcomeLeft:normalized.welcomeLeft-(welcome?1:0),totalSpins:normalized.totalSpins+1,xp:normalized.xp+outcome.xp,best:Math.max(normalized.best,outcome.xp),collection,badges,lastBoard:board,history:[{at:date.toISOString(),xp:outcome.xp,wins:outcome.wins.map(w=>({type:w.type,count:w.count||0,symbol:w.symbol||null}))},...normalized.history].slice(0,12)};
  return {state:next,outcome,newCharacters:collection.filter(x=>!normalized.collection.includes(x))};
}
