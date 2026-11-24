// DJ Screw, Legendary Guardian (owner request 2026-11-24): "Screw Time". On a qualifying win the whole page slows
// down and chops (slow, chop chop, slow, slow, chop chop) for a few seconds while "After I Die" plays screwed.
// Presentation only: it reads the finished outcome and never changes XP, spins, collections or server state.
import song from '@/assets/legends/after-i-die.mp3.asset.json';

export const SCREW_ART='/games/spc-legends/symbols/dj-screw.webp';
export const SCREW_SONG={title:'After I Die (Point Blank x DJ Screw)',url:song.url};
/** Provisional trigger, owner to confirm: any spin worth this much XP (the Big Win level). */
export const SCREW_TRIGGER_XP=1000;
export const SCREW_CUE_SECONDS=15;

export function screwTriggered(xp:number):boolean{return xp>=SCREW_TRIGGER_XP;}

/** The slow and chop rhythm: [page speed, milliseconds]. Speed 0 is a freeze (the chop). About 6 seconds total. */
export const SCREW_PATTERN:readonly (readonly [number,number])[]=Object.freeze([
  [0.25,1100],[0,140],[1,90],[0,140],[1,90],
  [0.2,1300],[0.25,900],[0,140],[1,90],[0,140],[1,90],
  [0.2,1500],
]);
export const screwDuration=()=>SCREW_PATTERN.reduce((t,[,ms])=>t+ms,0);

export class ScrewTime{
  private el:HTMLAudioElement|null=null;
  private overlay:HTMLDivElement|null=null;
  private timers:number[]=[];
  private ticker=0;
  private rate=1;
  constructor(private root:HTMLElement){}
  preload(){const i=new Image();i.src=SCREW_ART;}
  /** Starts Screw Time. Music follows the player's music switch; motion follows their motion setting. */
  play({music,reducedMotion}:{music:boolean;reducedMotion:boolean}){
    this.stop();
    this.showOverlay(reducedMotion);
    if(music)this.startSong();
    if(reducedMotion){this.timers.push(window.setTimeout(()=>this.hideOverlay(),2600));return;}
    this.root.classList.add('screw-time');
    // Re-apply the speed often, so animations that start mid-show slow down too.
    this.ticker=window.setInterval(()=>this.apply(),60);
    let t=0;
    for(const [rate,ms] of SCREW_PATTERN){
      this.timers.push(window.setTimeout(()=>{this.rate=rate;this.apply();this.chopSong(rate===0);},t));t+=ms;
    }
    this.timers.push(window.setTimeout(()=>this.endMotion(),t));
  }
  private apply(){
    for(const a of document.getAnimations()){try{a.playbackRate=this.rate;}catch{/* finished */}}
    document.documentElement.style.setProperty('--screw-rate',String(this.rate||0.01));
  }
  private startSong(){
    const el=new Audio(SCREW_SONG.url);el.preload='auto';
    // Screwed: slower and lower, without pitch correction.
    (el as HTMLAudioElement&{preservesPitch:boolean}).preservesPitch=false;
    el.playbackRate=0.8;
    el.addEventListener('loadedmetadata',()=>{if(this.el===el&&Number.isFinite(el.duration))el.currentTime=Math.min(SCREW_CUE_SECONDS,Math.max(0,el.duration-1));},{once:true});
    this.el=el;void el.play().catch(()=>{});
  }
  /** A chop: the record skips back a beat. */
  private chopSong(chop:boolean){if(chop&&this.el&&this.el.currentTime>0.4)this.el.currentTime-=0.35;}
  private showOverlay(reduced:boolean){
    const o=document.createElement('div');o.className=`screw-overlay${reduced?' is-simple':''}`;o.setAttribute('role','status');
    o.innerHTML=`<img src="${SCREW_ART}" alt="DJ Screw"><div class="screw-copy"><span>LEGENDARY GUARDIAN</span><strong>DJ SCREW</strong><em>SLOWED &amp; CHOPPED</em></div>`;
    document.body.append(o);this.overlay=o;
  }
  private hideOverlay(){const o=this.overlay;this.overlay=null;if(!o)return;o.classList.add('is-leaving');window.setTimeout(()=>o.remove(),600);}
  private endMotion(){
    clearInterval(this.ticker);this.ticker=0;this.rate=1;this.apply();
    this.root.classList.remove('screw-time');document.documentElement.style.removeProperty('--screw-rate');
    this.hideOverlay();
  }
  isPlaying(){return !!this.el&&!this.el.paused;}
  /** Next spin or leaving the page: motion back to normal, song fades out. */
  stop(){
    this.timers.forEach(clearTimeout);this.timers=[];
    if(this.ticker||this.root.classList.contains('screw-time'))this.endMotion();
    this.overlay?.remove();this.overlay=null;
    const el=this.el;this.el=null;
    if(el){let v=el.volume;const f=window.setInterval(()=>{v-=0.1;if(v<=0){clearInterval(f);el.pause();}else el.volume=v;},40);}
  }
  destroy(){this.stop();}
}
