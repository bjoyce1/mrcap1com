import { describe, expect, it } from 'vitest';
import { ARTISTS, SYMBOL_WEIGHTS } from '../config';
import { evaluateBoard } from '../engine';
import { BOBBY_J, PAPARAZZI_CONFIG, eligibleMoment, winningSubjects, photosFor, mergePhotos, readGallery, presentationOrder, presentationPreferences, stagePoint } from './model';
import { REVIEW_MOMENT } from './fixture';

describe('Bobby J cosmetic review',()=>{
  it('is a Special Guest, not a roster artist or weighted symbol',()=>{
    expect(BOBBY_J.classification).toBe('Special Guest');expect(BOBBY_J.id).toBe('bobby-j');
    expect(ARTISTS.some(a=>a.id==='bobby-j')).toBe(false);expect(SYMBOL_WEIGHTS).not.toHaveProperty('bobby-j');
    expect(PAPARAZZI_CONFIG.productionEnabled).toBe(false);
  });
  it('requires development, Bobby J and an eligible credited win',()=>{
    expect(eligibleMoment(REVIEW_MOMENT,true)).toBe(true);
    expect(eligibleMoment(REVIEW_MOMENT,false)).toBe(false);
    expect(eligibleMoment(REVIEW_MOMENT,true,false)).toBe(false);
    expect(eligibleMoment({...REVIEW_MOMENT,wins:[]},true)).toBe(false);
    expect(eligibleMoment({...REVIEW_MOMENT,board:REVIEW_MOMENT.board.map(c=>c.map(id=>id==='bobby-j'?'houston':id))},true)).toBe(false);
  });
  it('selects exactly the three real winning Mr. CAP cells, not Bobby or unrelated artists',()=>{
    expect(winningSubjects(REVIEW_MOMENT).map(s=>s.cell)).toEqual(['0:0','1:0','2:0']);
    expect(winningSubjects(REVIEW_MOMENT).map(s=>s.artist)).toEqual(['mr-cap','mr-cap','mr-cap']);
    const wins=[...REVIEW_MOMENT.wins,...REVIEW_MOMENT.wins,{type:'multiplier',xp:500,cells:['5:0']}];
    expect(winningSubjects({...REVIEW_MOMENT,wins})).toHaveLength(3);
  });
  it('preserves the exact existing evaluator result and its input',()=>{
    const board=REVIEW_MOMENT.board.map(c=>c.map(id=>id==='bobby-j'?'houston':id));
    const before=JSON.stringify(board),outcome=evaluateBoard(board),snapshot=JSON.stringify(outcome);
    photosFor({...REVIEW_MOMENT,wins:outcome.wins,xp:outcome.xp},'2026-11-24T19:34:00Z');
    expect(outcome.xp).toBe(REVIEW_MOMENT.xp);expect(JSON.stringify(outcome)).toBe(snapshot);expect(JSON.stringify(board)).toBe(before);
  });
  it('replay never duplicates photos and persistence retains the original capture date',()=>{
    const first=photosFor(REVIEW_MOMENT,'2026-11-24T19:34:00Z');
    const replay=photosFor(REVIEW_MOMENT,'2026-11-25T19:34:00Z');
    const merged=mergePhotos(first,replay);expect(merged).toHaveLength(3);expect(merged[0].capturedAt).toBe('2026-11-24T19:34:00Z');
    expect(readGallery({getItem:()=>JSON.stringify(merged)})).toEqual(first);
    expect(readGallery({getItem:()=>'{broken'})).toEqual([]);
  });
  it('queues the Guardian before Bobby, then standard hits and rewards',()=>{
    expect(presentationOrder(true,true)).toEqual(['legacy_blessing','paparazzi_experience','winning_lines','reward_celebration']);
  });
  it('keeps mobile positions inside the cabinet',()=>{
    expect(stagePoint({left:-50,top:900,width:60,height:60},{left:0,top:0,width:360,height:180},80)).toEqual({x:40,y:140});
  });
  it('reduced motion disables flashes and movement, while mute disables sound',()=>{
    expect(presentationPreferences(true,false)).toEqual({movement:false,flash:false,sound:false});
    expect(presentationPreferences(false,true)).toEqual({movement:true,flash:true,sound:true});
  });
});
