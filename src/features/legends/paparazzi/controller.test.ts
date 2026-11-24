import { describe, expect, it, vi } from 'vitest';
vi.mock('./assets',()=>({BOBBY_ART:{tile:'tile',run:'run',shoot:'shoot',crouch:'crouch',lean:'lean',voice:'voice'}}));
vi.mock('../layers',()=>({layersFor:()=>null}));
import { PaparazziController } from './controller';
import { PaparazziSoundController } from './sound';
import { REVIEW_MOMENT } from './fixture';

describe('Paparazzi lifecycle and sound preferences',()=>{
 it('cancellation during artwork preparation prevents stage creation and captures',async()=>{
  const board={querySelectorAll:vi.fn(()=>[]),closest:vi.fn(()=>null),append:vi.fn()} as unknown as HTMLElement;
  const sound=new PaparazziSoundController({tone:vi.fn(),riser:vi.fn()},()=>false);
  const c=new PaparazziController(board,sound);
  let ready:()=>void=()=>{};
  vi.spyOn(c,'preload').mockImplementation(()=>new Promise(resolve=>{ready=()=>resolve([]);}));
  const capture=vi.fn();
  const run=c.play(REVIEW_MOMENT,{reducedMotion:false,sound:false,source:board,onCapture:capture});
  c.cancel();ready();await run;
  expect(c.isRunning()).toBe(false);expect(board.append).not.toHaveBeenCalled();expect(capture).not.toHaveBeenCalled();
 });
 it('muted photography emits no tones, charging sound or voice',()=>{
  const tone=vi.fn(),riser=vi.fn(),sound=new PaparazziSoundController({tone,riser},()=>false);
  sound.entrance();sound.focus();sound.shutter();sound.print();sound.charge();sound.stop();
  expect(tone).not.toHaveBeenCalled();expect(riser).not.toHaveBeenCalled();
 });
 it('enabled photography reuses the supplied sound engine',()=>{
  const tone=vi.fn(),riser=vi.fn(),sound=new PaparazziSoundController({tone,riser},()=>true);
  sound.focus();sound.shutter();sound.print();sound.charge();
  expect(tone).toHaveBeenCalledTimes(4);expect(riser).toHaveBeenCalledWith(.2);
 });
});
