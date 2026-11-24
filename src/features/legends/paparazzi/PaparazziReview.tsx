import { useEffect, useRef, useState } from 'react';
import { Camera, Play, Square, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARTISTS } from '../config';
import { SynthSound } from '../motion';
import { BOBBY_ART } from './assets';
import { PaparazziController } from './controller';
import { PaparazziSoundController } from './sound';
import { REVIEW_MOMENT } from './fixture';
import { GALLERY_KEY, eligibleMoment, photosFor, mergePhotos, readGallery, type Moment, type Photo } from './model';
import './paparazzi.css';

export function PaparazziReview() {
  const host=useRef<HTMLDivElement>(null), board=useRef<HTMLDivElement>(null), controller=useRef<PaparazziController|null>(null);
  const soundEngine=useRef<SynthSound|null>(null);
  const [running,setRunning]=useState(false),[gallery,setGallery]=useState<Photo[]>(()=>{try{return readGallery(localStorage);}catch{return [];}});
  const [showGallery,setShowGallery]=useState(false),[status,setStatus]=useState('REVIEW ONLY');
  const mounted=useRef(true);
  useEffect(()=>{
    mounted.current=true;const root=host.current?.closest('.legends-world'),el=board.current;if(!root||!el)return;
    const enabled=()=>root.querySelector('[data-lg="sound"]')?.getAttribute('aria-pressed')==='true';
    const synth=new SynthSound(),sound=new PaparazziSoundController(synth,enabled);soundEngine.current=synth;
    const c=new PaparazziController(el,sound);controller.current=c;void c.preload();
    const cancel=()=>{c.cancel();live?.cancel();setRunning(false);setStatus('REVIEW PAUSED');};
    const onSound=()=>{synth.setEnabled(enabled());if(!enabled())sound.stop();};
    const onState=(event:Event)=>{const moment=(event as CustomEvent<Moment|null>).detail;if(!moment)cancel();};
    const liveBoard=root.querySelector<HTMLElement>('[data-lg="board"]');
    const live=liveBoard?new PaparazziController(liveBoard,sound):null;
    const onPaparazzi=(event:Event)=>{
      const {moment,reducedMotion,done}=(event as CustomEvent<{moment:Moment;reducedMotion:boolean;done:()=>void}>).detail;
      const source=liveBoard?.querySelector<HTMLElement>(`[data-cell="${moment.board.flatMap((col,c)=>col.flatMap((id,r)=>id==='bobby-j'?[`${c}:${r}`]:[]))[0]}"]`);
      if(!live||!source||!eligibleMoment(moment,import.meta.env.DEV)){done();return;}
      synth.setEnabled(enabled());
      const incoming=photosFor(moment,new Date().toISOString());
      void live.play(moment,{source,reducedMotion,sound:enabled(),onCapture:subject=>{
        const photo=incoming.find(p=>p.cell===subject.cell);if(!photo)return;
        setGallery(old=>{const next=mergePhotos(old,[photo]);try{localStorage.setItem(GALLERY_KEY,JSON.stringify(next));}catch{/* cosmetic review only */}return next;});
      }}).finally(done);
    };
    root.addEventListener('lg-paparazzi-request',onPaparazzi);
    root.addEventListener('lg-paparazzi-skip',cancel);
    root.addEventListener('lg-lines-result',onState);root.querySelector('[data-lg="sound"]')?.addEventListener('click',onSound);
    window.addEventListener('resize',cancel);const key=(event:KeyboardEvent)=>{if(event.key==='Escape')cancel();};document.addEventListener('keydown',key);
    return ()=>{mounted.current=false;c.destroy();live?.destroy();synth.destroy();root.removeEventListener('lg-paparazzi-skip',cancel);root.removeEventListener('lg-paparazzi-request',onPaparazzi);root.removeEventListener('lg-lines-result',onState);root.querySelector('[data-lg="sound"]')?.removeEventListener('click',onSound);window.removeEventListener('resize',cancel);document.removeEventListener('keydown',key);};
  },[]);
  const play=async()=>{
    const root=host.current?.closest('.legends-world'),source=board.current?.querySelector<HTMLElement>('[data-cell="5:0"]'),c=controller.current;
    if(!root||!source||!c||running||root.classList.contains('lg-spinning'))return;
    if(!eligibleMoment(REVIEW_MOMENT,import.meta.env.DEV))return;
    const sound=root.querySelector('[data-lg="sound"]')?.getAttribute('aria-pressed')==='true';
    // Gesture starts the same singleton sound engine used by the main cabinet.
    soundEngine.current?.setEnabled(sound);
    setRunning(true);setStatus('BOBBY J IN THE BUILDING');
    const reduced=root.classList.contains('reduce-motion')||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const incoming=photosFor(REVIEW_MOMENT,new Date().toISOString());
    await c.play(REVIEW_MOMENT,{reducedMotion:reduced,sound,source,onCapture:subject=>{
      const photo=incoming.find(p=>p.cell===subject.cell);if(!photo)return;
      setGallery(old=>{const next=mergePhotos(old,[photo]);try{localStorage.setItem(GALLERY_KEY,JSON.stringify(next));}catch{/* Review gallery stays in memory when storage is unavailable. */}return next;});
    },duck:()=>{
      const audio=Array.from(document.querySelectorAll('audio')).filter(a=>!a.paused),volumes=audio.map(a=>a.volume);audio.forEach(a=>{a.volume*=.3;});
      return ()=>audio.forEach((a,i)=>{a.volume=volumes[i];});
    }});
    if(mounted.current){setRunning(false);setStatus('CAPTURED BY BOBBY J');}
  };
  return <section className="pap-review" ref={host} aria-label="Bobby J development review">
    <div className="pap-review-heading"><div><span className="section-label">SPECIAL GUEST / DEVELOPMENT REVIEW</span><h2>BOBBY J</h2><p>HOUSTON PHOTOGRAPHER</p></div><Camera aria-hidden="true" size={32}/></div>
    <p className="pap-review-note">Staged demonstration, not a player spin. Live activation is off. Photos are saved on this device only.</p>
    <div className="pap-review-board" ref={board} aria-label="Staged six-reel photography scene"><div className="pap-review-reels">{REVIEW_MOMENT.board.map((col,c)=><div className="pap-review-reel" key={c}>{col.map((id,r)=><div key={r} data-cell={`${c}:${r}`} className="pap-review-tile"><img src={id==='bobby-j'?BOBBY_ART.tile:`/games/spc-legends/symbols/${id}.webp`} alt={id==='bobby-j'?'Bobby J':ARTISTS.find(a=>a.id===id)?.name??id}/></div>)}</div>)}</div></div>
    <div className="pap-review-controls"><Button variant="gold" onClick={()=>void play()} disabled={running}><Play size={16}/> Preview photo shoot</Button><Button variant="secondary" disabled={!running} onClick={()=>{controller.current?.cancel();setRunning(false);setStatus('REVIEW SKIPPED');}}><Square size={16}/> Skip</Button><Button variant="ghost" onClick={()=>setShowGallery(!showGallery)} aria-expanded={showGallery}><Images size={16}/> Gallery ({gallery.length})</Button></div>
    <p className="pap-status" role="status">{status}</p>
    {showGallery&&<div className="pap-gallery"><h3>BOBBY J'S LEGENDS PHOTO GALLERY</h3><p>Digital cosmetics only. No cash or redemption value.</p>{gallery.length?<div className="pap-gallery-grid">{gallery.map(photo=><figure key={photo.id} className={`pap-photo pap-style-${photo.category.toLowerCase().replace(/ /g,'-')}`}><img src={`/games/spc-legends/symbols/${photo.artist}.webp`} alt={ARTISTS.find(a=>a.id===photo.artist)?.name??photo.artist}/><figcaption><strong>{ARTISTS.find(a=>a.id===photo.artist)?.name}</strong><span>{photo.category}</span><small>BOBBY J PHOTOGRAPHY</small><time dateTime={photo.capturedAt}>{new Date(photo.capturedAt).toLocaleDateString()}</time><details><summary>Moment details</summary><span>{photo.combination}</span><small>{photo.id}</small></details></figcaption></figure>)}</div>:<p>No photographs captured yet.</p>}</div>}
  </section>;
}
export function BobbyJSpecialGuest() {return <div className="library-group pap-guest"><div className="lg-label">SPECIAL GUEST</div><figure><img src={BOBBY_ART.tile} alt="Bobby J, Houston Photographer"/><figcaption><strong>BOBBY J</strong><span>Houston Photographer</span><small>THE PAPARAZZI EXPERIENCE</small></figcaption></figure></div>;}
