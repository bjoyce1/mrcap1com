// DJ Screw, Legendary Guardian: "Screw Time". On a qualifying win the game slows
// down and chops for about ten seconds while the supplied slowed and chopped mix plays at normal speed.
// Presentation only: it reads the finished outcome and never changes XP, spins, collections or server state.
import song from '@/assets/legends/after-i-die.mp3.asset.json';

export const SCREW_ART='/games/spc-legends/symbols/dj-screw.webp';
export const SCREW_SONG={title:'After I Die (Point Blank x DJ Screw)',url:song.url};
export const SCREW_TRIGGER_XP=1000;
export const SCREW_CUE_SECONDS=15;
// The supplied recording is already slowed and chopped, so do not slow it a second time.
export const SCREW_PLAYBACK_RATE=1;

export function screwTriggered(xp:number):boolean{return xp>=SCREW_TRIGGER_XP;}

/** The visual slow and chop rhythm: [game animation speed, milliseconds]. About 10 seconds total. */
export const SCREW_PATTERN:readonly (readonly [number,number])[]=Object.freeze([
  [0.3,1400],[0,100],[0.75,130],[0,100],[0.75,130],
  [0.22,1500],[0,100],[0.7,130],[0,100],[0.7,130],[0,100],[0.7,130],
  [0.28,1300],[0.18,1200],[0,100],[0.75,130],[0,100],[0.75,130],
  [0.24,1400],[0,100],[0.75,130],[0,100],[0.75,130],[0.18,1100],
]);
export const screwDuration=()=>SCREW_PATTERN.reduce((t,[,ms])=>t+ms,0);

/** Slow horizontal drift, brief holds, then reverse scratches on each chop beat. */
export function screwReelRate(rate:number):number{return rate===0?0:rate>0.5?-1.8:1;}

export class ScrewTime{
  private el:HTMLAudioElement|null=null;
  private overlay:HTMLDivElement|null=null;
  private timers:number[]=[];
  private ticker=0;
  private rate=1;
  private originalRates=new Map<Animation,number>();
  constructor(private root:HTMLElement){}
  preload(){const i=new Image();i.src=SCREW_ART;}
  /** Starts Screw Time. Music follows the player's music switch; motion follows their motion setting. */
  play({music,reducedMotion}:{music:boolean;reducedMotion:boolean}){
    this.stop();
    this.showOverlay(reducedMotion);
    if(music)this.startSong();
    if(reducedMotion){this.timers.push(window.setTimeout(()=>this.hideOverlay(),2600));return;}
    this.root.classList.add('screw-time');
    // Catch animations that begin during the show without changing audio speed or position.
    this.ticker=window.setInterval(()=>this.apply(),60);
    let t=0;
    for(const [rate,ms] of SCREW_PATTERN){
      this.timers.push(window.setTimeout(()=>{this.rate=rate;this.apply();this.overlay?.classList.toggle('is-chopping',rate===0);},t));t+=ms;
    }
    this.timers.push(window.setTimeout(()=>this.endMotion(),t));
  }
  private apply(){
    // Keep the guardian card on its own smooth clock. Only game animations follow the chop pattern.
    for(const a of this.root.getAnimations({subtree:true})){
      if(!this.originalRates.has(a))this.originalRates.set(a,a.playbackRate);
      const rate='animationName' in a&&a.animationName==='screw-roll'?screwReelRate(this.rate):this.rate;
      try{
        if(typeof a.updatePlaybackRate==='function')a.updatePlaybackRate(rate);
        else a.playbackRate=rate;
      }catch{/* The animation finished between frames. */}
    }
    document.documentElement.style.setProperty('--screw-rate',String(this.rate||0.01));
  }
  private startSong(){
    const el=new Audio(SCREW_SONG.url);el.preload='auto';
    el.playbackRate=SCREW_PLAYBACK_RATE;
    el.addEventListener('loadedmetadata',()=>{if(this.el===el&&Number.isFinite(el.duration))el.currentTime=Math.min(SCREW_CUE_SECONDS,Math.max(0,el.duration-1));},{once:true});
    this.el=el;void el.play().catch(()=>{});
  }
  private showOverlay(reduced:boolean){
    const o=document.createElement('div');o.className=`screw-overlay${reduced?' is-simple':''}`;o.setAttribute('role','status');
    o.innerHTML=`<div class="screw-halo" aria-hidden="true"></div><div class="screw-portrait"><img src="${SCREW_ART}" alt="DJ Screw"></div><div class="screw-copy"><span>LEGENDARY GUARDIAN</span><strong>DJ SCREW</strong><em>SLOWED &amp; CHOPPED</em></div>`;
    document.body.append(o);this.overlay=o;
    if(!reduced)this.root.querySelectorAll<HTMLElement>('[data-lg="reels"] > *').forEach((r,i)=>{r.classList.add('screw-reel');r.style.setProperty('--screw-i',String(i));});
  }
  private hideOverlay(){const o=this.overlay;this.overlay=null;if(!o)return;o.classList.add('is-leaving');window.setTimeout(()=>o.remove(),600);}
  private endMotion(){
    clearInterval(this.ticker);this.ticker=0;this.rate=1;
    // Restore each loop's previous tempo instead of overriding the cabinet's normal speed.
    for(const [a,rate] of this.originalRates){try{if(typeof a.updatePlaybackRate==='function')a.updatePlaybackRate(rate);else a.playbackRate=rate;}catch{/* finished */}}
    this.originalRates.clear();
    this.root.classList.remove('screw-time');this.root.querySelectorAll('.screw-reel').forEach(r=>r.classList.remove('screw-reel'));document.documentElement.style.removeProperty('--screw-rate');
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
