// A.C. Chill, Legendary Guardian: the Legacy Blessing show (owner request 2026-11-05). He rises out of his reel tile,
// flies to each Legend the server blessed, touches it gold, and leaves toward the marquee.
// Presentation only: the blessing, its cells and its XP come from the spin outcome (engine.ts legacyBlessing); this file
// never decides or changes them, and replaying it awards nothing.
import rig from './guardian.json';

export type BlessingWin={type:'legacy_blessing';symbol?:string;guardian:string;cells:string[];count:number;xp:number};
/** Presentation events, sent as 'lg-guardian' on the board. They never score or award anything. */
export type GuardianEvent='AC_CHILL_TRIGGERED'|'GUARDIAN_APPEARED'|'GUARDIAN_FLYING'|'LEGEND_BLESSED'|'LEGACY_BLESSING_COMPLETED'|'GUARDIAN_EXITED';
/** The sound calls the show uses (SynthSound). They are silent while sound effects are off. */
export type GuardianSound={tone:(freq:number,duration?:number,opts?:{wave?:OscillatorType;gain?:number;delay?:number})=>void;riser:(seconds?:number)=>void};

export const GUARDIAN_ART={
  tile:'/games/spc-legends/symbols/ac-chill.webp',
  body:'/games/spc-legends/guardian/body.webp',
  wingLeft:'/games/spc-legends/guardian/wing-left.webp',
  wingRight:'/games/spc-legends/guardian/wing-right.webp',
};
const [RIG_W,RIG_H]=rig.size;
const pct=(n:number,of:number)=>`${(n/of*100).toFixed(2)}%`;

/** The blessing in an outcome's wins, if there is one. */
export function blessingOf(wins:readonly {type:string}[]):BlessingWin|null{
  return (wins.find(w=>w.type==='legacy_blessing') as BlessingWin|undefined)??null;
}
/** Result panel copy, from the authoritative numbers only. */
export function blessingCopy(win:Pick<BlessingWin,'count'|'xp'>){
  return {kicker:'LEGACY BLESSING ACTIVATED',count:`${win.count} SPC LEGEND${win.count===1?'':'S'} BLESSED`,xp:`+${win.xp.toLocaleString('en-US')} LEGENDS XP`};
}

type Point={x:number;y:number};
/** A point on a cubic Bézier curve. */
export function bezier(p0:Point,p1:Point,p2:Point,p3:Point,t:number):Point{
  const u=1-t;
  return {x:u*u*u*p0.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*p3.x,y:u*u*u*p0.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*p3.y};
}
/** A curved flight from a to b that arcs upward, sampled into points kept inside the box (so he stays on screen). */
export function flightPath(a:Point,b:Point,box:{w:number;h:number;padX:number;padTop:number;padBottom:number},steps=26):Point[]{
  const dx=b.x-a.x,lift=Math.max(box.h*0.16,Math.abs(dx)*0.32);
  const p1={x:a.x+dx*0.28,y:Math.min(a.y,b.y)-lift},p2={x:b.x-dx*0.22,y:Math.min(a.y,b.y)-lift*0.7};
  return Array.from({length:steps+1},(_,i)=>{
    const p=bezier(a,p1,p2,b,i/steps);
    return {x:Math.min(box.w-box.padX,Math.max(box.padX,p.x)),y:Math.min(box.h-box.padBottom,Math.max(box.padTop,p.y))};
  });
}

const CROWN_SVG='<svg viewBox="0 0 32 22" aria-hidden="true"><path d="M2 20h28l2-15-8 6-8-10-8 10-8-6z" fill="url(#lg-crown)" stroke="#7a4a10" stroke-width="1.2" stroke-linejoin="round"/><defs><linearGradient id="lg-crown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#f4c14f"/><stop offset="1" stop-color="#b9781d"/></linearGradient></defs></svg>';

/** Runs the Legacy Blessing show on the board. One show at a time; skip() or destroy() end it cleanly. */
export class ACChillGuardianController{
  private stage:HTMLDivElement|null=null;
  private marks:HTMLDivElement;
  private animations:Animation[]=[];
  private timers=new Set<ReturnType<typeof setTimeout>>();
  private wakers=new Set<()=>void>();
  private skipped=false;
  private running:Promise<void>|null=null;
  private current:BlessingWin|null=null;
  constructor(private board:HTMLElement,private sound:GuardianSound){
    // Crowns and halos over blessed tiles live here; they stay through the win presentation, then clear().
    this.marks=document.createElement('div');this.marks.className='guardian-marks';this.marks.setAttribute('aria-hidden','true');board.append(this.marks);
  }
  /** Fetch the flyer layers ahead of time, so the show never waits on the network. */
  preload(){for(const src of Object.values(GUARDIAN_ART)){const img=new Image();img.decoding='async';img.src=src;}}
  isRunning(){return !!this.running;}
  play(win:BlessingWin,{reducedMotion=false}={}):Promise<void>{
    this.clear();
    this.skipped=false;this.current=win;
    this.preload();
    const run=(reducedMotion?this.simple(win):this.full(win)).catch(error=>{console.error('Legacy Blessing show failed',error);})
      .finally(()=>{this.finish(win);if(this.running===run)this.running=null;});
    this.running=run;return run;
  }
  /** Jump to the end: blessed tiles stay gold, the flyer and overlays go away. Outcomes are untouched. */
  skip(){if(!this.running)return;this.skipped=true;this.stopMotion();this.wakers.forEach(wake=>wake());this.wakers.clear();}
  /** Remove the blessed gold from the board (next spin, or when the win presentation is over). */
  clear(){
    this.current=null;this.skip();
    this.marks.replaceChildren();
    this.board.querySelectorAll('.legacy-blessed').forEach(tile=>{tile.classList.remove('legacy-blessed');tile.querySelector('.blessed-gild')?.remove();});
    this.board.querySelectorAll('.guardian-source').forEach(tile=>tile.classList.remove('guardian-source'));
    this.board.querySelector('.reels')?.classList.remove('guardian-dim');
  }
  destroy(){this.clear();this.stage?.remove();this.stage=null;this.marks.remove();}

  // ----- the two shows -----
  private async simple(win:BlessingWin){
    this.emit('AC_CHILL_TRIGGERED',win.guardian);
    const stage=this.buildStage(win,true);
    stage.classList.add('is-simple');
    this.emit('GUARDIAN_APPEARED',win.guardian);
    win.cells.forEach(cell=>{this.bless(cell,true);this.emit('LEGEND_BLESSED',cell);});
    this.chord();
    stage.classList.add('show-result');
    this.emit('LEGACY_BLESSING_COMPLETED');
    await this.sleep(1900);
    this.emit('GUARDIAN_EXITED');
  }
  private async full(win:BlessingWin){
    const stage=this.buildStage(win,false);
    const reels=this.board.querySelector('.reels');
    const source=this.tile(win.guardian);
    // 1. The cabinet dims and his tile glows gold.
    this.emit('AC_CHILL_TRIGGERED',win.guardian);
    reels?.classList.add('guardian-dim');source?.classList.add('guardian-source');
    this.sound.riser(1.1);
    await this.frame();
    const start=this.center(win.guardian);
    if(!start||this.skipped)return;
    const flyer=stage.querySelector<HTMLElement>('.guardian-flyer')!,rigEl=stage.querySelector<HTMLElement>('.guardian-rig')!;
    const size=this.flyerSize();
    flyer.style.setProperty('--fw',`${size.w}px`);
    this.place(flyer,start,size,0);
    this.feathers(start,size.cell,8);
    await this.sleep(550);if(this.skipped)return;
    // 2. He grows out of the symbol, rises, and his wings unfold. Halo lights.
    stage.classList.add('is-arrived');
    const rise={x:start.x,y:Math.max(size.h*0.55,start.y-size.cell*0.9)};
    this.track(rigEl.animate([{transform:'scale(.22)',opacity:0,filter:'brightness(2.4)'},{transform:'scale(1.06)',opacity:1,filter:'brightness(1.3)',offset:.7},{transform:'scale(1)',opacity:1,filter:'brightness(1)'}],{duration:900,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}));
    this.fly(flyer,[start,rise],size,900);
    stage.querySelectorAll<HTMLElement>('.guardian-wing').forEach((wing,i)=>this.track(wing.animate([{transform:`rotate(${i?62:-62}deg)`},{transform:'rotate(0deg)'}],{duration:850,delay:180,easing:'cubic-bezier(.3,1.4,.4,1)',fill:'both'})));
    this.sound.tone(784,.5,{wave:'sine',gain:.02,delay:.05});this.sound.tone(1175,.6,{wave:'sine',gain:.016,delay:.22});
    this.emit('GUARDIAN_APPEARED',win.guardian);
    stage.classList.add('show-arrival');
    await this.sleep(1150);if(this.skipped)return;
    stage.classList.add('show-title');
    await this.sleep(1100);if(this.skipped)return;
    stage.classList.remove('show-arrival','show-title');
    stage.classList.add('is-flying');
    // 3. He flies to each blessed Legend in turn and touches it gold.
    let from=rise;
    for(const [i,cell] of win.cells.entries()){
      const target=this.center(cell);if(!target)continue;
      const hover={x:target.x,y:target.y-size.cell*0.55};
      this.emit('GUARDIAN_FLYING',cell);
      this.wingSwoosh();
      await this.fly(flyer,this.path(from,hover,size),size,820);if(this.skipped)return;
      await this.sleep(180);if(this.skipped)return;
      this.track(rigEl.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(9%) scale(.95)',offset:.45},{transform:'translateY(0) scale(1)'}],{duration:320,easing:'ease-in-out'}));
      await this.sleep(140);if(this.skipped)return;
      this.touch(cell,target,size.cell,i);
      this.emit('LEGEND_BLESSED',cell);
      await this.sleep(520);if(this.skipped)return;
      from=hover;
    }
    // 4. The blessing lands: the result, from the outcome's own numbers.
    this.chord();
    stage.classList.add('show-result');
    this.emit('LEGACY_BLESSING_COMPLETED');
    await this.sleep(1700);if(this.skipped)return;
    stage.classList.remove('show-result');
    // 5. He rises toward the marquee, glows, and fades into gold light while feathers drift down.
    const box=this.box(),exit={x:box.w/2,y:size.h*0.5};
    this.fly(flyer,this.path(from,exit,size),size,900);
    await this.sleep(700);if(this.skipped)return;
    stage.classList.add('is-leaving','show-tribute');
    this.sound.tone(523,.9,{wave:'triangle',gain:.016});this.sound.tone(784,1,{wave:'sine',gain:.014,delay:.08});this.sound.tone(1047,1.1,{wave:'sine',gain:.012,delay:.16});
    this.feathers({x:box.w/2,y:size.h*0.6},size.cell,10,true);
    this.track(rigEl.animate([{opacity:1,filter:'brightness(1)',transform:'scale(1)'},{opacity:1,filter:'brightness(1.9)',transform:'scale(1.12)',offset:.45},{opacity:0,filter:'brightness(3)',transform:'scale(1.2) translateY(-18%)'}],{duration:1100,easing:'ease-in',fill:'forwards'}));
    await this.sleep(1700);if(this.skipped)return;
    this.emit('GUARDIAN_EXITED');
  }

  // ----- pieces -----
  private buildStage(win:BlessingWin,simple:boolean){
    this.stage?.remove();
    const stage=document.createElement('div');stage.className='guardian-stage';
    const copy=blessingCopy(win);
    // Read once by screen readers: the result is also in the result panel.
    stage.setAttribute('role','status');stage.setAttribute('aria-live','polite');
    stage.innerHTML=`
      <div class="guardian-flyer" aria-hidden="true"><div class="guardian-bob"><div class="guardian-rig">
        <div class="guardian-wing left" style="transform-origin:${pct(rig.pivots.left[0],RIG_W)} ${pct(rig.pivots.left[1],RIG_H)}"><img alt="" src="${GUARDIAN_ART.wingLeft}" style="transform-origin:${pct(rig.pivots.left[0],RIG_W)} ${pct(rig.pivots.left[1],RIG_H)}"></div>
        <div class="guardian-wing right" style="transform-origin:${pct(rig.pivots.right[0],RIG_W)} ${pct(rig.pivots.right[1],RIG_H)}"><img alt="" src="${GUARDIAN_ART.wingRight}" style="transform-origin:${pct(rig.pivots.right[0],RIG_W)} ${pct(rig.pivots.right[1],RIG_H)}"></div>
        <img class="guardian-body" alt="" src="${GUARDIAN_ART.body}">
        <i class="guardian-halo"></i>
      </div></div></div>
      ${simple?`<img class="guardian-portrait" alt="" src="${GUARDIAN_ART.tile}">`:''}
      <div class="guardian-banner arrival"><small>A.C. CHILL</small><b>HAS ARRIVED</b></div>
      <div class="guardian-banner title"><small>THE</small><b>LEGACY BLESSING</b></div>
      <div class="guardian-result"><small></small><b></b><strong></strong></div>
      <div class="guardian-banner tribute"><small>A.C. CHILL</small><b>FOREVER SPC</b></div>`;
    const result=stage.querySelector('.guardian-result')!;
    result.querySelector('small')!.textContent=copy.kicker;result.querySelector('b')!.textContent=copy.count;result.querySelector('strong')!.textContent=copy.xp;
    stage.querySelector<HTMLElement>('.guardian-flyer')!.style.aspectRatio=`${RIG_W} / ${RIG_H}`;
    this.board.append(stage);this.stage=stage;
    return stage;
  }
  /** Gild one Legend's tile: gold frame and sheen over its own art, plus a crown and halo above it. */
  private bless(cell:string,quiet=false){
    const tile=this.tile(cell);if(!tile||tile.classList.contains('legacy-blessed'))return;
    tile.classList.add('legacy-blessed');
    const gild=document.createElement('i');gild.className='blessed-gild';gild.setAttribute('aria-hidden','true');tile.append(gild);
    const c=this.center(cell),size=this.cellSize();if(!c)return;
    const mark=document.createElement('div');mark.className=`guardian-mark${quiet?' quiet':''}`;
    mark.style.cssText=`left:${c.x}px;top:${c.y}px;--cell:${size.w}px;--cell-h:${size.h}px`;
    mark.innerHTML=`<i class="mark-halo"></i><span class="mark-crown">${CROWN_SVG}</span>`;
    this.marks.append(mark);
  }
  private touch(cell:string,at:Point,cellSize:number,index:number){
    const stage=this.stage;if(!stage)return;
    const fx=document.createElement('div');fx.className='guardian-touch';fx.style.cssText=`left:${at.x}px;top:${at.y}px;--cell:${cellSize}px`;
    fx.innerHTML='<i class="touch-flash"></i><i class="touch-wave"></i><i class="touch-wave late"></i>';
    stage.append(fx);
    const t=setTimeout(()=>{fx.remove();this.timers.delete(t);},1100);this.timers.add(t);
    this.bless(cell);
    this.sparks(at,cellSize,this.phone()?6:12);
    // A rising note per Legend: each touch is one step higher.
    const base=[659,784,988][index]??1047;
    this.sound.tone(base,.35,{wave:'sine',gain:.024});this.sound.tone(base*1.5,.5,{wave:'sine',gain:.014,delay:.06});this.sound.tone(base*2,.25,{wave:'triangle',gain:.008,delay:.1});
  }
  private chord(){[523,659,784,1047].forEach((n,i)=>this.sound.tone(n,1.1,{wave:i%2?'sine':'triangle',gain:.016,delay:i*.04}));}
  private wingSwoosh(){this.sound.tone(220,.18,{wave:'triangle',gain:.008});this.sound.tone(330,.14,{wave:'sine',gain:.006,delay:.12});}
  private sparks(at:Point,cell:number,n:number){
    const stage=this.stage;if(!stage)return;
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2+Math.random()*.4,d=cell*(0.55+Math.random()*0.5);
      const s=document.createElement('i');s.className='guardian-spark';s.style.cssText=`left:${at.x}px;top:${at.y}px`;stage.append(s);
      const anim=s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(.3)`,opacity:0}],{duration:650+Math.random()*250,easing:'cubic-bezier(.1,.7,.3,1)'});
      this.track(anim);anim.onfinish=()=>s.remove();
    }
  }
  /** White feathers: a puff from his tile on arrival, or a slow drift down when he leaves. */
  private feathers(at:Point,cell:number,n:number,drift=false){
    const stage=this.stage;if(!stage)return;
    const count=this.phone()?Math.ceil(n/2):n;
    for(let i=0;i<count;i++){
      const f=document.createElement('i');f.className='guardian-feather';f.style.cssText=`left:${at.x}px;top:${at.y}px`;stage.append(f);
      const dx=(Math.random()-.5)*cell*(drift?4:2.4),dy=drift?cell*(1.6+Math.random()*1.4):-(cell*(0.5+Math.random()*0.9)),r=(Math.random()-.5)*360;
      const anim=f.animate([{transform:'translate(-50%,-50%) rotate(0deg)',opacity:0},{opacity:1,offset:.15},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${r}deg)`,opacity:0}],{duration:drift?2200+Math.random()*900:1100+Math.random()*500,delay:Math.random()*(drift?500:150),easing:drift?'cubic-bezier(.3,.1,.5,1)':'cubic-bezier(.1,.6,.3,1)',fill:'backwards'});
      this.track(anim);anim.onfinish=()=>f.remove();
    }
  }
  /** Gold dust trailing behind him along the path. */
  private trail(path:Point[],size:{w:number;h:number},duration:number){
    const stage=this.stage;if(!stage)return;
    const every=this.phone()?4:2;
    path.forEach((p,i)=>{
      if(i%every||i===0)return;
      const dot=document.createElement('i');dot.className=i%(every*3)===0?'guardian-feather small':'guardian-dust';
      dot.style.cssText=`left:${p.x}px;top:${p.y+size.h*0.08}px`;stage.append(dot);
      const anim=dot.animate([{opacity:0,transform:'translate(-50%,-50%) scale(1)'},{opacity:.95,offset:.1},{opacity:0,transform:`translate(-50%,calc(-50% + ${size.h*0.25}px)) scale(.4)`}],{duration:900,delay:duration*i/path.length,fill:'backwards',easing:'ease-out'});
      this.track(anim);anim.onfinish=()=>dot.remove();
    });
  }
  /** Move the flyer through the points (positions are his body's center), banking into each turn. */
  private fly(flyer:HTMLElement,points:Point[],size:{w:number;h:number},duration:number){
    const frames=points.map((p,i)=>{
      const prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)];
      const bank=Math.max(-14,Math.min(14,(next.x-prev.x)/Math.max(1,size.w)*40));
      return {transform:`translate3d(${(p.x-size.w/2).toFixed(1)}px,${(p.y-size.h*0.55).toFixed(1)}px,0) rotate(${bank.toFixed(1)}deg)`};
    });
    if(frames.length===1)frames.push(frames[0]);
    this.trail(points,size,duration);
    const anim=flyer.animate(frames,{duration,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'});
    this.track(anim);
    return anim.finished.then(()=>undefined,()=>undefined);
  }
  private place(flyer:HTMLElement,p:Point,size:{w:number;h:number},bank:number){
    flyer.style.transform=`translate3d(${p.x-size.w/2}px,${p.y-size.h*0.55}px,0) rotate(${bank}deg)`;
  }
  private path(a:Point,b:Point,size:{w:number;h:number}){
    const box=this.box();
    return flightPath(a,b,{w:box.w,h:box.h,padX:size.w*0.42,padTop:size.h*0.5,padBottom:size.h*0.15});
  }

  // ----- measuring (only at the start of each leg, so the show follows layout changes) -----
  private tile(cell:string){return this.board.querySelector<HTMLElement>(`.reels [data-cell="${cell}"]`);}
  private box(){return {w:this.board.clientWidth,h:this.board.clientHeight};}
  private center(cell:string):Point|null{
    const tile=this.tile(cell);if(!tile)return null;
    const b=this.board.getBoundingClientRect(),r=tile.getBoundingClientRect();
    return {x:r.left-b.left-this.board.clientLeft+r.width/2,y:r.top-b.top-this.board.clientTop+r.height/2};
  }
  private cellSize(){const tile=this.board.querySelector<HTMLElement>('.reels [data-cell]');const r=tile?.getBoundingClientRect();return {w:r?.width??60,h:r?.height??62};}
  /** He is about two reels wide, so his wings stay readable on a phone without covering the board. */
  private flyerSize(){const cell=this.cellSize().w,w=Math.min(this.box().w*0.46,cell*2.3);return {w,h:w*RIG_H/RIG_W,cell};}
  private phone(){return this.board.clientWidth<520;}

  // ----- lifecycle -----
  private emit(type:GuardianEvent,cell?:string){this.board.dispatchEvent(new CustomEvent('lg-guardian',{bubbles:true,detail:{type,cell}}));}
  private track(anim:Animation){this.animations.push(anim);return anim;}
  private frame(){return new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));}
  private sleep(ms:number){
    if(this.skipped)return Promise.resolve();
    return new Promise<void>(resolve=>{
      const done=()=>{clearTimeout(t);this.timers.delete(t);this.wakers.delete(done);resolve();};
      const t=setTimeout(done,ms);this.timers.add(t);this.wakers.add(done);
    });
  }
  private stopMotion(){this.animations.forEach(a=>{try{a.cancel();}catch{/* already gone */}});this.animations=[];this.timers.forEach(clearTimeout);this.timers.clear();}
  /** Whatever happened (finished, skipped or failed), every blessed tile ends gold and the show's layer is gone. */
  private finish(win:BlessingWin){
    this.stopMotion();
    if(this.current===win)win.cells.forEach(cell=>this.bless(cell,true));
    this.board.querySelector('.reels')?.classList.remove('guardian-dim');
    this.board.querySelectorAll('.guardian-source').forEach(tile=>tile.classList.remove('guardian-source'));
    this.stage?.remove();this.stage=null;
  }
}
