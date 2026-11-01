// Ported from the SPC Legends source package (src/ui/motion.js). Animation, sound and canvas only; never decides outcomes.
import {SYMBOL_MAP,PAYLINES} from './config';
import {createBoard} from './engine';
import {hitSchedule,isArtist,type HitStep,type HitWin} from './hits';
import murderOneAsset from '@/assets/legends/murder-one-portrait.webp.asset.json';
import rapperKAsset from '@/assets/legends/rapper-k-portrait.webp.asset.json';
import komodoAsset from '@/assets/legends/komodo-dbx-portrait.webp.asset.json';
import nipAsset from '@/assets/legends/ganxsta-nip-portrait.webp.asset.json';
import krinoAsset from '@/assets/legends/k-rino-portrait.webp.asset.json';
import capAsset from '@/assets/legends/mr-cap-portrait.webp.asset.json';
import katAsset from '@/assets/legends/klondike-kat-portrait.webp.asset.json';
import blankAsset from '@/assets/legends/point-blank-portrait.webp.asset.json';
import waterAsset from '@/assets/legends/k-water-portrait.webp.asset.json';
import clcheAsset from '@/assets/legends/cl-che-portrait.webp.asset.json';
/** Uploaded character art uses asset pointers; other symbols use public game assets. */
/** Set by animateReels while reels move; calling skip() lands every reel at its final stop. */
export type ReelControl={skip?:(()=>void)|null};
/** The parts of an engine win the overlay draws. */
export type Win={type:string;payline?:number;count?:number;symbol?:string;cells:string[]};
/** Per reel: false, or which tease lengthens and lights it ('bonus': two 713s landed; 'sweep': one artist on every reel so far). */
export type Tease=false|'bonus'|'sweep';
type ReelOptions={reducedMotion?:boolean;anticipate?:(Tease|boolean)[];teaseColor?:string;control?:ReelControl;onReady?:()=>void;onStop?:(reel:number)=>void;onAnticipate?:(kind:Tease)=>void};
const uploadedSymbols:Record<string,string>={
  'murder-one':murderOneAsset.url,'rapper-k':rapperKAsset.url,
  'komodo-dbx':komodoAsset.url,'ganxsta-nip':nipAsset.url,
  'k-rino':krinoAsset.url,'mr-cap':capAsset.url,
  'klondike-kat':katAsset.url,'point-blank':blankAsset.url,
  'k-water':waterAsset.url,'cl-che':clcheAsset.url,
};
export const symbolUrl=(id:string)=>uploadedSymbols[id]??`/games/spc-legends/symbols/${id}.webp`;
/** Reel motor: GPU-accelerated symbol strips. Resolves only after the six staggered reels settle. */
export function makeTile(id,{mini=false,filler=false}={}){
  const root=document.createElement('div');root.className=`symbol-tile${filler?' filler':''}`;root.dataset.symbol=id;
  if(filler)root.setAttribute('aria-hidden','true');else{root.setAttribute('role','img');root.setAttribute('aria-label',SYMBOL_MAP[id]?.name||id);}
  const image=document.createElement('img');image.src=symbolUrl(id);image.alt='';image.loading=mini?'lazy':'eager';image.decoding='async';image.draggable=false;
  root.style.setProperty('--sym',SYMBOL_MAP[id]?.color||'#ffd27a');
  root.appendChild(image);return root;
}
export function renderBoard(container,board,hits=[]){
  container.replaceChildren();const matched=new Set(hits);
  container.classList.toggle('has-wins',matched.size>0);
  for(let col=0;col<6;col++){
    const reel=document.createElement('div');reel.className='reel-window';reel.setAttribute('role','group');reel.setAttribute('aria-label',`Reel ${col+1}`);
    const track=document.createElement('div');track.className='reel-track';
    for(let row=0;row<3;row++){
      const tile=makeTile(board[col][row]);tile.classList.toggle('match',matched.has(`${col}:${row}`));
      tile.dataset.cell=`${col}:${row}`;track.appendChild(tile);
    }
    reel.append(track);container.append(reel);
  }
}
// Timing: reel 1 stops at BASE ms, each later reel STAGGER ms after; anticipation adds TEASE ms.
const BASE=820,STAGGER=170,TEASE=700,MS_PER_TILE=62;
/** Spin all six reels to `target`. `control.skip()` (set while running) slams every reel to its final stop.
 * `anticipate[i]` only lengthens reel i's spin and lights it; it never changes which symbols land.
 */
export async function animateReels(container:HTMLElement,previous:string[][],target:string[][],{reducedMotion=false,anticipate=[],teaseColor='',control={},onReady=()=>{},onStop=()=>{},onAnticipate=()=>{}}:ReelOptions={}){
  if(reducedMotion){renderBoard(container,target);for(let i=0;i<6;i++)onStop(i);return;}
  container.setAttribute('aria-busy','true');
  container.classList.remove('has-wins');
  container.replaceChildren();
  // Stop requests are honoured from the first tap, even before the reels have started moving.
  const running:Animation[]=[];let skipped=false;
  const finishAll=()=>{skipped=true;running.forEach(a=>{try{a.finish();}catch{/* already finished or cancelled */}});};
  control.skip=finishAll;onReady();
  const reels=[];let extra=0;
  for(let col=0;col<6;col++){
    if(anticipate[col])extra+=TEASE;
    const duration=BASE+col*STAGGER+extra;
    const reel=document.createElement('div');reel.className='reel-window spinning';reel.setAttribute('role','group');reel.setAttribute('aria-label',`Reel ${col+1}`);
    const track=document.createElement('div');track.className='reel-track';
    // Visible sequence: before (3) → blurred fillers (enough for a steady speed) → final (3).
    const fillers=Math.max(6,Math.round(duration/MS_PER_TILE));
    const filler=[];while(filler.length<fillers)filler.push(...createBoard()[0]);
    track.append(...(previous[col]||createBoard()[col]).map(id=>makeTile(id)),...filler.slice(0,fillers).map(id=>makeTile(id,{filler:true})),...target[col].map(id=>makeTile(id)));
    // A light streak runs down the reel while it spins (transform only, so it costs nothing per frame).
    const streak=document.createElement('span');streak.className='reel-streak';streak.setAttribute('aria-hidden','true');
    reel.append(track,streak);container.append(reel);
    reels.push({reel,track,col,duration,fillers,stopped:false});
  }
  // Wait for layout; calculate step from actual tile geometry for any responsive viewport.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  // A width change mid-spin invalidates pixel distances, so settle immediately rather than land misaligned.
  // Height-only resizes (mobile URL bar collapsing while scrolling) leave tile sizes alone and are ignored.
  const startWidth=innerWidth,onResize=()=>{if(innerWidth!==startWidth)finishAll();};
  addEventListener('resize',onResize);
  const tasks=reels.map(async item=>{
    const {reel,track,col,duration,fillers}=item;
    const first=track.firstElementChild,second=first.nextElementSibling;
    const pitch=second.getBoundingClientRect().top-first.getBoundingClientRect().top;
    const move=(3+fillers)*pitch;
    // Small wind-up, fast travel, slight overshoot past the stop, then spring back.
    const animation=track.animate([
      {transform:'translate3d(0,0,0)',offset:0,easing:'cubic-bezier(.3,0,.6,1)'},
      {transform:`translate3d(0,${pitch*.16}px,0)`,offset:.07,easing:'cubic-bezier(.42,0,.2,1)'},
      {transform:`translate3d(0,${-(move+pitch*.12)}px,0)`,offset:.9,easing:'cubic-bezier(.3,0,.3,1)'},
      {transform:`translate3d(0,${-move}px,0)`,offset:1}
    ],{duration,fill:'forwards'});
    running.push(animation);if(skipped)animation.finish();
    await animation.finished.catch(()=>{});
    animation.cancel();
    // Swap the long strip for exactly three final tiles so the settled reel is cheap to composite.
    track.replaceChildren(...target[col].map(id=>makeTile(id)));
    item.stopped=true;
    reel.classList.remove('spinning','anticipate','sweep-tease');reel.querySelector('.reel-streak')?.remove();
    reel.classList.add('settle');
    // Impact: the reel squashes and rebounds as it lands and throws sparks from its base.
    reel.animate([{transform:'translate3d(0,6px,0) scaleY(.97)'},{transform:'translate3d(0,-2px,0)'},{transform:'none'}],{duration:280,easing:'cubic-bezier(.2,1.4,.4,1)'});
    stopSparks(reel);
    onStop(col);
    const teasing=reels.filter(r=>!r.stopped&&anticipate[r.col]);
    if(teasing.length&&!teasing.some(r=>r.reel.classList.contains('anticipate'))){
      teasing.forEach(r=>{r.reel.classList.add('anticipate');if(anticipate[r.col]==='sweep'){r.reel.classList.add('sweep-tease');r.reel.style.setProperty('--tease',teaseColor||'#ffd27a');}});
      const kind=anticipate[teasing[0].col];onAnticipate(kind==='sweep'?'sweep':'bonus');
    }
    setTimeout(()=>reel.classList.remove('settle'),450);
  });
  try{await Promise.all(tasks);}
  finally{removeEventListener('resize',onResize);control.skip=null;}
  container.removeAttribute('aria-busy');
}
/** Six gold sparks kicked up from the base of a reel as it lands. */
function stopSparks(reel:HTMLElement){
  for(let i=0;i<6;i++){
    const spark=document.createElement('i');spark.className='stop-spark';spark.setAttribute('aria-hidden','true');
    spark.style.setProperty('--dx',`${(Math.random()-.5)*70}px`);spark.style.setProperty('--dy',`${-18-Math.random()*40}px`);
    reel.append(spark);spark.addEventListener('animationend',()=>spark.remove(),{once:true});
  }
}
const SVG='http://www.w3.org/2000/svg';
/** Draw winning paylines over the board. Lines take turns being emphasised unless motion is reduced. */
export class PaylineOverlay {
  board:HTMLElement;wins:Win[];timer:ReturnType<typeof setInterval>|null;reducedMotion:boolean;svg:SVGSVGElement;resize:ResizeObserver;
  autoCycle=true;paths:{win:Win;g:SVGGElement}[]=[];
  constructor(board:HTMLElement){
    this.board=board;this.wins=[];this.timer=null;this.reducedMotion=false;
    this.svg=document.createElementNS(SVG,'svg');this.svg.setAttribute('class','payline-overlay');this.svg.setAttribute('aria-hidden','true');
    board.append(this.svg);
    this.resize=new ResizeObserver(()=>this.wins.length&&this.draw());this.resize.observe(board);
  }
  /** autoCycle=false draws the lines dim and waits for focus()/cycle(), so the hit show can lead. */
  show(wins:Win[],{reducedMotion=false,autoCycle=true}={}){
    this.wins=wins.filter(w=>w.type==='line'||w.type==='unity'||w.type==='supreme'||w.type==='sweep');this.reducedMotion=reducedMotion;this.autoCycle=autoCycle;this.draw();
  }
  focus(win:Win){this.paths.forEach(p=>p.g.classList.toggle('focus',p.win===win));}
  cycle(){this.autoCycle=true;this.draw();}
  clear(){this.wins=[];this.paths=[];clearInterval(this.timer);this.timer=null;this.svg.replaceChildren();}
  draw(){
    clearInterval(this.timer);this.svg.replaceChildren();
    const box=this.board.getBoundingClientRect();
    this.svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
    const centre=key=>{const el=this.board.querySelector(`[data-cell="${key}"]`);if(!el)return null;const r=el.getBoundingClientRect();return [r.left-box.left+r.width/2,r.top-box.top+r.height/2];};
    this.paths=[];
    const paths=this.wins.map(win=>{
      const keys=win.type!=='line'?win.cells:(PAYLINES[(win.payline??0)-1]??[]).map((row,col)=>`${col}:${row}`);
      const points=keys.map(centre);if(points.some(p=>!p))return null;
      const lit=win.type!=='line'?6:win.count;
      const g=document.createElementNS(SVG,'g');g.setAttribute('class',win.type==='sweep'?'payline supreme-path sweep-path':win.type==='supreme'?'payline supreme-path':'payline');
      g.style.setProperty('--line',win.type==='sweep'?SYMBOL_MAP[win.symbol]?.color||'#ffd27a':win.type==='supreme'?'var(--gold)':win.type==='unity'?'#fff1c2':SYMBOL_MAP[win.symbol]?.color||'#ffd27a');
      // Faint guide across the full payline, bright stroke over the matched run, a node on each matched cell.
      const guide=document.createElementNS(SVG,'polyline');guide.setAttribute('class','payline-guide');guide.setAttribute('points',points.map(p=>p.join(',')).join(' '));
      const run=document.createElementNS(SVG,'polyline');run.setAttribute('class','payline-run');run.setAttribute('points',points.slice(0,lit).map(p=>p.join(',')).join(' '));
      // A thin white core keeps the line readable over tiles that share its colour.
      const core=run.cloneNode() as SVGPolylineElement;core.setAttribute('class','payline-core');
      g.append(guide,run,core);
      // A comet races along the matched run while this line is in focus.
      if(!this.reducedMotion&&lit>=2){
        const d='M'+points.slice(0,lit).map(p=>p.join(' ')).join(' L');
        for(const [cls,r] of [['payline-comet-halo',11],['payline-comet',5]] as const){
          const c=document.createElementNS(SVG,'circle');c.setAttribute('class',cls);c.setAttribute('r',String(r));
          const motion=document.createElementNS(SVG,'animateMotion');motion.setAttribute('path',d);motion.setAttribute('dur','1.1s');motion.setAttribute('repeatCount','indefinite');
          c.append(motion);g.append(c);
        }
      }
      for(const [x,y] of points.slice(0,lit)){const dot=document.createElementNS(SVG,'circle');dot.setAttribute('cx',String(x));dot.setAttribute('cy',String(y));dot.setAttribute('r',String(Math.max(3,box.width/180)));dot.setAttribute('class','payline-node');g.append(dot);}
      this.svg.append(g);this.paths.push({win,g});return g;
    }).filter(Boolean);
    if(this.reducedMotion||(this.autoCycle&&paths.length<2)){paths.forEach(g=>g.classList.add('focus'));return;}
    if(!this.autoCycle)return;
    let i=0;const step=()=>{paths.forEach((g,n)=>g.classList.toggle('focus',n===i));i=(i+1)%paths.length;};
    step();this.timer=setInterval(step,1100);
  }
}
/** The win celebration: winning tiles pop out over the reels, step by step (see hitSchedule).
 * Artists bob and tilt in their frame (their painted name banner rides along) with sparks; the Wild flashes gold; the 713 Bonus
 * spins up light rays. Clones sit in their own layer, so the reels underneath are never moved. */
export class HitShow {
  board:HTMLElement;layer:HTMLDivElement;timers:ReturnType<typeof setTimeout>[]=[];
  constructor(board:HTMLElement){
    this.board=board;this.layer=document.createElement('div');this.layer.className='hit-layer';this.layer.setAttribute('aria-hidden','true');board.append(this.layer);
  }
  clear(){
    this.timers.forEach(clearTimeout);this.timers=[];this.layer.replaceChildren();
    this.board.querySelectorAll('.popping').forEach(el=>el.classList.remove('popping'));this.board.classList.remove('lg-shake');
  }
  play(wins:HitWin[],{reducedMotion=false,big=false,onStep=(_win:HitWin)=>{},onDone=()=>{}}={}){
    this.clear();
    const steps=reducedMotion?[]:hitSchedule(wins);
    if(!steps.length){onDone();return;}
    if(big){this.board.classList.add('lg-shake');this.later(520,()=>this.board.classList.remove('lg-shake'));}
    steps.forEach(step=>this.later(step.start,()=>{onStep(step.win);this.pop(step);}));
    this.later(steps[steps.length-1].start+1250,()=>{this.clear();onDone();});
  }
  private later(ms:number,fn:()=>void){this.timers.push(setTimeout(fn,ms));}
  private pop(step:HitStep){
    this.layer.replaceChildren();this.board.querySelectorAll('.popping').forEach(el=>el.classList.remove('popping'));
    const box=this.board.getBoundingClientRect();
    for(const cell of step.cells){
      const tile=this.board.querySelector<HTMLElement>(`.reels [data-cell="${cell.key}"]`);if(!tile)continue;
      const r=tile.getBoundingClientRect(),id=tile.dataset.symbol||'';
      const pop=document.createElement('div');
      const mult=step.win.type==='multiplier';
      pop.className=`hit-pop${isArtist(id)?' is-char':''}${id==='wild'?' is-wild':''}${id==='bonus'?' is-bonus':''}${mult?' is-mult':''}${step.win.type==='sweep'?' is-sweep':''}`;
      pop.style.cssText=`left:${r.left-box.left}px;top:${r.top-box.top}px;width:${r.width}px;height:${r.height}px;--d:${cell.delay}ms;--sym:${SYMBOL_MAP[id]?.color||'#ffd27a'}`;
      pop.append(makeTile(id));
      // Multiplier finale: the tile flares and stamps its factor over the board.
      if(mult){const badge=document.createElement('span');badge.className='mult-badge';badge.textContent=`×${(step.win as HitWin&{multiplier?:number}).multiplier??''}`;pop.append(badge);}
      for(let k=0;k<8;k++){
        const spark=document.createElement('i'),a=(k/8)*Math.PI*2+Math.random()*.6,dist=.62+Math.random()*.38;
        spark.className='hit-spark';spark.style.setProperty('--dx',`${Math.cos(a)*dist*r.width}px`);spark.style.setProperty('--dy',`${Math.sin(a)*dist*r.height}px`);
        pop.append(spark);
      }
      this.layer.append(pop);tile.classList.add('popping');
    }
  }
}
/** "+150 XP" rising out of an element; skipped when motion is reduced. */
export function floatText(host:HTMLElement,text:string,{reducedMotion=false}={}){
  if(reducedMotion)return;
  const el=document.createElement('span');el.className='xp-float';el.textContent=text;el.setAttribute('aria-hidden','true');
  host.append(el);el.addEventListener('animationend',()=>el.remove(),{once:true});
}
export function animateCounter(el,from,to,{duration=650,reducedMotion=false}={}){
  if(reducedMotion||to===from){el.textContent=to.toLocaleString();return;}
  const start=performance.now();
  const run=(now)=>{
    const t=Math.min(1,(now-start)/duration),e=1-Math.pow(1-t,3);
    el.textContent=Math.round(from+(to-from)*e).toLocaleString();
    if(t<1)requestAnimationFrame(run);
  };requestAnimationFrame(run);
}
export class SynthSound {
  enabled:boolean;ctx:AudioContext|null;
  constructor(){this.enabled=false;this.ctx=null;}
  setEnabled(value){this.enabled=!!value;if(this.enabled){this.ctx??=new (window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext)();this.ctx.resume().catch(()=>{});}}
  tone(freq:number,duration=.09,{wave='sine' as OscillatorType,gain=.026,delay=0}={}){
    if(!this.enabled||!this.ctx)return;
    const t=this.ctx.currentTime+delay,osc=this.ctx.createOscillator(),vol=this.ctx.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(freq,t);
    vol.gain.setValueAtTime(0,t);vol.gain.linearRampToValueAtTime(gain,t+.01);
    vol.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(vol);vol.connect(this.ctx.destination);osc.start(t);osc.stop(t+duration+.015);
  }
  /** A short pitch-dropping bass hit, the "thump" of a reel landing. */
  thump(){
    if(!this.enabled||!this.ctx)return;
    const t=this.ctx.currentTime,osc=this.ctx.createOscillator(),vol=this.ctx.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(130,t);osc.frequency.exponentialRampToValueAtTime(48,t+.14);
    vol.gain.setValueAtTime(.09,t);vol.gain.exponentialRampToValueAtTime(.0001,t+.18);
    osc.connect(vol);vol.connect(this.ctx.destination);osc.start(t);osc.stop(t+.2);
  }
  stop(n){this.thump();this.tone(260+n*73,.09,{wave:'triangle',gain:.022});this.feel(12);}
  /** A filtered rising sweep under an anticipation tease. */
  riser(seconds=.9){
    if(!this.enabled||!this.ctx)return;
    const t=this.ctx.currentTime,osc=this.ctx.createOscillator(),filter=this.ctx.createBiquadFilter(),vol=this.ctx.createGain();
    osc.type='sawtooth';osc.frequency.setValueAtTime(180,t);osc.frequency.exponentialRampToValueAtTime(880,t+seconds);
    filter.type='lowpass';filter.frequency.setValueAtTime(600,t);filter.frequency.exponentialRampToValueAtTime(3200,t+seconds);
    vol.gain.setValueAtTime(0,t);vol.gain.linearRampToValueAtTime(.022,t+seconds*.8);vol.gain.exponentialRampToValueAtTime(.0001,t+seconds+.1);
    osc.connect(filter);filter.connect(vol);vol.connect(this.ctx.destination);osc.start(t);osc.stop(t+seconds+.15);
  }
  /** The Big Win count-up tick. */
  tick(){this.tone(1100+Math.random()*300,.025,{wave:'square',gain:.006});}
  /** Tier stinger: a bigger chord for each tier (1 BIG, 2 MEGA, 3 LEGENDARY). */
  tier(level:number){
    const chords=[[523,659,784],[587,740,880,1175],[523,659,784,1047,1319,1568]];
    this.thump();(chords[level-1]??chords[0]).forEach((note,i)=>this.tone(note,.45,{wave:'triangle',gain:.03,delay:i*.06}));
  }
  /** Phone vibration, only while sound is on (the same switch means "sound and feel"). */
  feel(pattern:number|number[]){if(this.enabled)try{navigator.vibrate?.(pattern);}catch{/* not supported */}}
  tease(){[440,554,659].forEach((note,i)=>this.tone(note,.16,{wave:'sine',gain:.02,delay:i*.07}));this.riser();}
  win(major=false){const notes=major?[392,523,659,784,988]:[392,494,587];notes.forEach((note,i)=>this.tone(note,.25,{wave:'triangle',gain:.033,delay:i*.08}));}
}
