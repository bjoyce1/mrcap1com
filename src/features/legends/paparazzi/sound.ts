import { BOBBY_ART } from './assets';
import type { GuardianSound } from '../guardian';
/** Reuses SynthSound's singleton context and mute-aware master. No voice impersonation. */
export class PaparazziSoundController {
  private voice: HTMLAudioElement | null = null;
  constructor(private synth: GuardianSound, private enabled: () => boolean) {}
  entrance() {
    if (!this.enabled()) return;
    [196,294,392].forEach((f,i) => this.synth.tone(f,.35,{wave:'triangle',gain:.015,delay:i*.04}));
    this.voice = new Audio(BOBBY_ART.voice); this.voice.volume=.6; void this.voice.play().catch(() => {});
  }
  focus() { if(this.enabled()) this.synth.tone(1568,.09,{wave:'sine',gain:.014}); }
  shutter() { if(!this.enabled())return; this.synth.tone(150,.045,{wave:'square',gain:.028}); this.synth.tone(680,.04,{wave:'sawtooth',gain:.014,delay:.05}); }
  print() { if(this.enabled()) this.synth.tone(180,.23,{wave:'sawtooth',gain:.007}); }
  charge() { if(this.enabled()) this.synth.riser(.2); }
  stop() { this.voice?.pause(); this.voice=null; }
}
