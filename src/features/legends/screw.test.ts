import {describe,it,expect} from 'vitest';
import {screwTriggered,screwDuration,screwReelRate,SCREW_PATTERN,SCREW_PLAYBACK_RATE} from './screw';
describe('DJ Screw Screw Time',()=>{
  it('pops reels on an independent clock with holds and faster chop beats, never reversing',()=>{
    expect(screwReelRate(0.3)).toBe(1);
    expect(screwReelRate(0)).toBe(0);
    expect(screwReelRate(0.75)).toBe(2.4);
    expect(SCREW_PATTERN.map(([rate])=>screwReelRate(rate))).toContain(2.4);
    expect(SCREW_PATTERN.every(([rate])=>screwReelRate(rate)>=0)).toBe(true);
  });
  it('triggers at 1,000 XP and above only',()=>{expect(screwTriggered(999)).toBe(false);expect(screwTriggered(1000)).toBe(true);});
  it('plays the supplied slowed and chopped recording at normal speed',()=>{expect(SCREW_PLAYBACK_RATE).toBe(1);});
  it('lasts about ten seconds and mixes slow and chop',()=>{
    expect(screwDuration()).toBeGreaterThanOrEqual(9000);expect(screwDuration()).toBeLessThanOrEqual(11000);
    expect(SCREW_PATTERN.some(([r])=>r===0)).toBe(true);expect(SCREW_PATTERN.some(([r])=>r>0&&r<0.5)).toBe(true);
  });
  it('keeps each visual chop brief so the motion stays smooth',()=>{
    const chops=SCREW_PATTERN.filter(([rate])=>rate===0);
    expect(chops.length).toBeGreaterThan(0);
    for(const [,ms] of chops)expect(ms).toBeLessThanOrEqual(100);
  });
});
