import { gsap } from 'gsap';
import { BOBBY_ART } from './assets';
import { stagePoint, winningSubjects, presentationPreferences, type Moment, type Subject } from './model';
import { PaparazziSoundController } from './sound';
import { layersFor } from '../layers';

/** Cosmetic controller: owns only temporary DOM and animation, not game state or awards. */
export class PaparazziController {
  private timeline: gsap.core.Timeline | null = null;
  private stage: HTMLElement | null = null;
  private wake: (() => void) | null = null;
  private captured = new Set<string>();
  private generation = 0;
  private stopped = false;
  private restore: (() => void) | null = null;
  constructor(private board: HTMLElement, private sound: PaparazziSoundController) {}
  isRunning() { return this.stage !== null; }
  preload() { return Promise.all(Object.values(BOBBY_ART).filter(src => src !== BOBBY_ART.voice).map(async src => { const img=new Image(); img.src=src; await img.decode().catch(()=>{}); })); }
  async play(moment: Moment, options: { reducedMotion: boolean; sound: boolean; source: HTMLElement; onCapture: (subject: Subject) => void; duck?: () => () => void }): Promise<void> {
    this.cancel(); this.stopped=false; this.captured.clear();
    const generation=this.generation;
    await this.preload();
    if(this.stopped||generation!==this.generation)return;
    const subjects=winningSubjects(moment); if(!subjects.length)return;
    this.restore=options.duck?.()??null;
    const preferences=presentationPreferences(options.reducedMotion,options.sound);
    const stage=document.createElement('div');stage.className=`pap-stage${preferences.movement?'':' pap-simple'}`;stage.setAttribute('aria-hidden','true');
    stage.innerHTML='<i class="pap-studio-light left"></i><i class="pap-studio-light right"></i><div class="pap-title"><small>BOBBY J PRESENTS</small><strong>THE PAPARAZZI EXPERIENCE</strong></div><div class="pap-character"><img alt=""><i class="pap-camera-lens"></i></div><div class="pap-viewfinder"><i></i><i></i><i></i><i></i></div><div class="pap-flash"></div><div class="pap-print"><img alt=""><small></small></div><div class="pap-finale"><strong>THE LEGENDS. THE MOMENT. THE HISTORY.</strong><small>CAPTURED BY BOBBY J</small></div>';
    this.board.append(stage);this.stage=stage;
    const character=stage.querySelector<HTMLElement>('.pap-character'), pose=character?.querySelector('img'), finder=stage.querySelector<HTMLElement>('.pap-viewfinder'), flash=stage.querySelector<HTMLElement>('.pap-flash'), print=stage.querySelector<HTMLElement>('.pap-print'), title=stage.querySelector<HTMLElement>('.pap-title');
    if(!character||!pose||!finder||!flash||!print||!title){this.cancel();return;}
    const box=this.board.getBoundingClientRect(),size=Math.min(box.width*.27,160), source=stagePoint(options.source.getBoundingClientRect(),box,size);
    character.style.width=`${size}px`;character.style.height=`${size*1.7}px`;pose.src=BOBBY_ART.run;
    const capture=(subject:Subject)=>{ if(this.captured.has(subject.cell))return;this.captured.add(subject.cell);options.onCapture(subject); };
    const fan=document.createElement('div');fan.className='pap-photo-fan';
    subjects.forEach((subject,i)=>{const img=document.createElement('img');img.src=`/games/spc-legends/symbols/${subject.artist}.webp`;img.alt='';img.style.setProperty('--pap-angle',`${(i-(subjects.length-1)/2)*16}deg`);fan.append(img);});stage.append(fan);
    options.source.classList.add('pap-source');
    if(!preferences.movement){
      subjects.forEach(capture);stage.classList.add('pap-complete');
      await new Promise<void>(resolve=>{this.wake=resolve;this.timeline=gsap.timeline({onComplete:resolve}).to({}, {duration:1.2});});
      this.cancel();return;
    }
    await new Promise<void>(resolve=>{
      this.wake=resolve;
      const tl=gsap.timeline({onComplete:resolve});this.timeline=tl;
      gsap.set(character,{x:source.x-size/2,y:Math.max(0,source.y-size),scale:.15,opacity:0});
      tl.call(()=>{if(options.sound)this.sound.entrance();}).to(character,{scale:1,opacity:1,duration:.65,ease:'back.out(1.6)'})
        .fromTo(title,{opacity:0,y:14},{opacity:1,y:0,duration:.4},.3).to(title,{opacity:0,duration:.3},1.5);
      for(const [i,subject] of subjects.entries()){
        const tile=this.board.querySelector<HTMLElement>(`[data-cell="${subject.cell}"]`); if(!tile)continue;
        const target=stagePoint(tile.getBoundingClientRect(),box,size);
        tl.call(()=>{pose.src=BOBBY_ART.run;})
          .to(character,{x:target.x-size/2,y:Math.max(0,Math.min(box.height-size*1.7,target.y-size)),rotation:i%2?7:-7,duration:.45,ease:'power2.inOut'})
          .to(character,{scaleX:1.08,scaleY:.88,duration:.12}).to(character,{scaleX:1,scaleY:1,rotation:0,duration:.16})
          .call(()=>{
            pose.src=subject.cell.endsWith(':2')?BOBBY_ART.crouch:i%2?BOBBY_ART.lean:BOBBY_ART.shoot;
            const r=tile.getBoundingClientRect();gsap.set(finder,{left:r.left-box.left,top:r.top-box.top,width:r.width,height:r.height,opacity:1});
            const layer=layersFor(subject.artist);if(layer){const pop=document.createElement('img');pop.className='pap-legend-pop';pop.src=layer.char;pop.alt='';tile.append(pop);}
            if(options.sound){this.sound.focus();this.sound.charge();}
          })
          .to(finder,{scale:.88,duration:.2}).call(()=>{
            if(options.sound)this.sound.shutter();
            gsap.set(flash,{left:target.x-size/2,top:target.y-size/2,width:size,height:size});
            const img=print.querySelector('img'),label=print.querySelector('small');if(img)img.src=`/games/spc-legends/symbols/${subject.artist}.webp`;if(label)label.textContent='BOBBY J PHOTOGRAPHY';
            gsap.set(print,{left:target.x-size/2,top:target.y-size/2,width:size*.7,opacity:1,scale:.3,rotation:-7});
            capture(subject);if(options.sound)this.sound.print();
          })
          .fromTo(flash,{opacity:.65,scale:.3},{opacity:0,scale:1.3,duration:.23})
          .to(print,{scale:1,rotation:i%2?8:-8,duration:.35,ease:'back.out(1.4)'},'<')
          .to(print,{x:box.width-target.x-size*.4,y:box.height-target.y-size*.6,scale:.3,opacity:0,duration:.35})
          .call(()=>{finder.style.opacity='0';tile.querySelector('.pap-legend-pop')?.remove();});
      }
      tl.to(character,{x:box.width/2-size/2,y:Math.max(0,box.height/2-size*.85),duration:.45})
        .call(()=>{pose.src=BOBBY_ART.shoot;if(options.sound)this.sound.shutter();stage.classList.add('pap-complete');})
        .to({}, {duration:1.8}).to(character,{x:source.x-size/2,y:source.y-size,scale:.1,opacity:0,duration:.5});
    });
    if(generation===this.generation)this.cancel();
  }
  cancel() {
    this.generation++;
    this.stopped=true;this.timeline?.kill();this.timeline=null;this.wake?.();this.wake=null;
    this.stage?.remove();this.stage=null;this.sound.stop();this.restore?.();this.restore=null;
    this.board.querySelectorAll('.pap-legend-pop').forEach(el=>el.remove());
    this.board.closest('.pap-review')?.querySelectorAll('.pap-source').forEach(el=>el.classList.remove('pap-source'));
  }
  destroy() { this.cancel(); }
}
