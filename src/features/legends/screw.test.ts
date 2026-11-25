import {describe,it,expect} from 'vitest';
import {screwTriggered,screwDuration,SCREW_PATTERN} from './screw';
describe('DJ Screw Screw Time',()=>{
  it('triggers at 1,000 XP and above only',()=>{expect(screwTriggered(999)).toBe(false);expect(screwTriggered(1000)).toBe(true);});
  it('lasts a few seconds and mixes slow and chop',()=>{
    expect(screwDuration()).toBeGreaterThanOrEqual(4000);expect(screwDuration()).toBeLessThanOrEqual(12000);
    expect(SCREW_PATTERN.some(([r])=>r===0)).toBe(true);expect(SCREW_PATTERN.some(([r])=>r>0&&r<0.5)).toBe(true);
  });
});
