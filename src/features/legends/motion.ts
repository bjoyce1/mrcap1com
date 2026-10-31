// Ported from the SPC Legends source package (src/ui/motion.js). Animation, sound and canvas only; never decides outcomes.
import {SYMBOL_MAP,PAYLINES} from './config';
import {createBoard} from './engine';
import {hitSchedule,isArtist,type HitStep,type HitWin} from './hits';
/** Symbol art lives in public/games/spc-legends/symbols. */
/** Set by animateReels while reels move; calling skip() lands every reel at its final stop. */
export type ReelControl={skip?:(()=>void)|null};
/** The parts of an engine win the overlay draws. */
export type Win={type:string;payline?:number;count?:number;symbol?:string;cells:string[]};
type ReelOptions={reducedMotion?:boolean;anticipate?:boolean[];control?:ReelControl;onReady?:()=>void;onStop?:(reel:number)=>void;onAnticipate?:()=>void};
type Particle={x:number;y:number;vx:number;vy:number;age:number;life:number;size:number;rot:number;color:string};
export const symbolUrl=(id:string)=>`/games/spc-legends/symbols/${id}.webp`;
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
export async function animateReels(container:HTMLElement,previous:string[][],target:string[][],{reducedMotion=false,anticipate=[],control={},onReady=()=>{},onStop=()=>{},onAnticipate=()=>{}}:ReelOptions={}){
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
    reel.append(track);container.append(reel);
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
    reel.classList.remove('spinning','anticipate');
    reel.classList.add('settle');
    onStop(col);
    const teasing=reels.filter(r=>!r.stopped&&anticipate[r.col]);
    if(teasing.length&&!teasing.some(r=>r.reel.classList.contains('anticipate'))){teasing.forEach(r=>r.reel.classList.add('anticipate'));onAnticipate();}
    setTimeout(()=>reel.classList.remove('settle'),450);
  });
  try{await Promise.all(tasks);}
  finally{removeEventListener('resize',onResize);control.skip=null;}
  container.removeAttribute('aria-busy');
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
    this.wins=wins.filter(w=>w.type==='line'||w.type==='unity');this.reducedMotion=reducedMotion;this.autoCycle=autoCycle;this.draw();
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
      const keys=win.type==='unity'?win.cells:PAYLINES[win.payline-1].map((row,col)=>`${col}:${row}`);
      const points=keys.map(centre);if(points.some(p=>!p))return null;
      const lit=win.type==='unity'?6:win.count;
      const g=document.createElementNS(SVG,'g');g.setAttribute('class','payline');
      g.style.setProperty('--line',win.type==='unity'?'#fff1c2':SYMBOL_MAP[win.symbol]?.color||'#ffd27a');
      // Faint guide across the full payline, bright stroke over the matched run, a node on each matched cell.
      const guide=document.createElementNS(SVG,'polyline');guide.setAttribute('class','payline-guide');guide.setAttribute('points',points.map(p=>p.join(',')).join(' '));
      const run=document.createElementNS(SVG,'polyline');run.setAttribute('class','payline-run');run.setAttribute('points',points.slice(0,lit).map(p=>p.join(',')).join(' '));
      // A thin white core keeps the line readable over tiles that share its colour.
      const core=run.cloneNode() as SVGPolylineElement;core.setAttribute('class','payline-core');
      g.append(guide,run,core);
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
      pop.className=`hit-pop${isArtist(id)?' is-char':''}${id==='wild'?' is-wild':''}${id==='bonus'?' is-bonus':''}${mult?' is-mult':''}`;
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
export class Confetti {
  canvas:HTMLCanvasElement;ctx:CanvasRenderingContext2D|null;raf:number|null;particles:Particle[];
  constructor(canvas:HTMLCanvasElement){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.raf=null;this.particles=[];}
  burst({reducedMotion=false,major=false}={}){
    if(reducedMotion||!this.ctx)return;
    cancelAnimationFrame(this.raf);
    const rect=this.canvas.getBoundingClientRect();const dpr=Math.min(2,devicePixelRatio||1);
    this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);
    const width=rect.width,height=rect.height,ctx=this.ctx;
    const colors=['#fbc66d','#ff57b7','#12caff','#9f5bff','#fff','#4ffab3'];
    // Fewer particles on small screens keeps the burst smooth on phones.
    const count=Math.round((major?135:55)*(width<620?.6:1));
    this.particles=Array.from({length:count},()=>({x:width/2+(Math.random()-.5)*100,y:height*.38,vx:(Math.random()-.5)*9,vy:-Math.random()*8-1,age:0,life:70+Math.random()*60,size:2+Math.random()*6,rot:Math.random()*6.28,color:colors[Math.floor(Math.random()*colors.length)]}));
    let last=performance.now();
    const loop=now=>{
      // Advance by elapsed frames so the burst runs at the same pace on 60Hz and 120Hz displays.
      const k=Math.min(3,(now-last)/16.67);last=now;
      ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      for(const p of this.particles){
        p.age+=k;p.x+=p.vx*k;p.y+=p.vy*k;p.vy+=.16*k;p.vx*=Math.pow(.995,k);p.rot+=.08*k;
        const c=Math.cos(p.rot)*dpr,s=Math.sin(p.rot)*dpr;
        ctx.setTransform(c,s,-s,c,p.x*dpr,p.y*dpr);ctx.globalAlpha=Math.max(0,1-p.age/p.life);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.6);
      }
      ctx.globalAlpha=1;
      this.particles=this.particles.filter(p=>p.age<p.life&&p.y<height+50);
      if(this.particles.length)this.raf=requestAnimationFrame(loop);else{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
    };this.raf=requestAnimationFrame(loop);
  }
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
  stop(n){this.tone(260+n*73,.09,{wave:'triangle',gain:.025});}
  tease(){[440,554,659].forEach((note,i)=>this.tone(note,.16,{wave:'sine',gain:.02,delay:i*.07}));}
  win(major=false){const notes=major?[392,523,659,784,988]:[392,494,587];notes.forEach((note,i)=>this.tone(note,.25,{wave:'triangle',gain:.033,delay:i*.08}));}
}
