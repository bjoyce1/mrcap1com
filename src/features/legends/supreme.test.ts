import { expect, test } from 'vitest';
import { ARTISTS, PAYLINES, XP_TABLE } from './config';
import { applySpin, evaluateBoard, initialState } from './engine';
import { guestSpin } from './guest';
import { hitSchedule } from './hits';
import { evaluateBoard as serverEvaluate } from '../../../supabase/functions/_shared/legends/engine';
import { PAYLINES as serverLines, XP_TABLE as serverXp } from '../../../supabase/functions/_shared/legends/config';

const quiet = () => [['mic','mixer','vinyl'],['tape','headphones','legend'],['speakers','houston','mic'],['mixer','vinyl','tape'],['legend','speakers','houston'],['headphones','mic','mixer']];

test('vinyl steps from the middle to the top and wins through reel five for 250 XP', () => {
  const board=quiet();
  board[0][1]='vinyl';
  for(let col=1;col<5;col++)board[col][0]='vinyl';
  const outcome=evaluateBoard(board);
  expect(outcome.wins).toContainEqual({type:'line',payline:21,symbol:'vinyl',count:5,xp:250,cells:['0:1','1:0','2:0','3:0','4:0']});
  expect(serverEvaluate(board)).toEqual(outcome);
});

test('each connecting path follows all six matching reels', () => {
  for(const [index,path] of PAYLINES.entries()){
    if(index<20)continue;
    const board=quiet();path.forEach((row,col)=>board[col][row]='vinyl');
    expect(evaluateBoard(board).wins).toContainEqual({type:'line',payline:index+1,symbol:'vinyl',count:6,xp:750,cells:path.map((row,col)=>`${col}:${row}`)});
  }
});

test('every one of the 729 six-reel artist paths wins Supreme once for 5000 base XP', () => {
  for(let code=0;code<729;code++){
    let n=code;const board=quiet();const cells:string[]=[];
    for(let col=0;col<6;col++){const row=n%3;n=Math.floor(n/3);board[col][row]=ARTISTS[col].id;cells.push(`${col}:${row}`);}
    const outcome=evaluateBoard(board);
    expect(outcome.wins.filter(w=>w.type==='supreme')).toEqual([{type:'supreme',count:6,xp:5000,cells}]);
    expect(outcome.hitCells).toEqual(expect.arrayContaining(cells));
    expect(serverEvaluate(board)).toEqual(outcome);
  }
});

test('repeated artists qualify, but wilds and music do not replace a missing reel Legend', () => {
  const board=quiet();board.forEach((col,i)=>col[i%3]='mr-cap');
  expect(evaluateBoard(board).wins.find(w=>w.type==='supreme')?.xp).toBe(5000);
  board[5][2]='wild';expect(evaluateBoard(board).wins.some(w=>w.type==='supreme')).toBe(false);
  board[5][2]='legend';expect(evaluateBoard(board).wins.some(w=>w.type==='supreme')).toBe(false);
});

test('several artist choices on each reel still award Supreme only once', () => {
  const board=Array.from({length:6},()=>['mr-cap','k-rino','rapper-k']);
  expect(evaluateBoard(board).wins.filter(w=>w.type==='supreme')).toHaveLength(1);
});

test('Supreme awards a badge once and never adds spins', () => {
  const board=quiet();board.forEach((col,i)=>col[i%3]=ARTISTS[i].id);
  const first=applySpin(initialState(),board);
  expect(first.state.badges).toContain('supreme-legends');
  expect(first.state.welcomeLeft).toBe(24);expect(first.state.spinsToday).toBe(0);
  const second=applySpin(first.state,board);
  expect(second.state.badges.filter(b=>b==='supreme-legends')).toHaveLength(1);
  expect(second.state.welcomeLeft).toBe(23);
  expect(guestSpin([],board).outcome).toEqual(serverEvaluate(board));
});

test('existing Unity remains and multipliers include Supreme XP', () => {
  const board=quiet();board.forEach((col,i)=>col[1]=ARTISTS[i].id);
  board[4][2]='double';board[5][2]='triple';
  const outcome=evaluateBoard(board);
  expect(outcome.wins.find(w=>w.type==='unity')?.xp).toBe(2000);
  expect(outcome.baseXp).toBe(7000);expect(outcome.xp).toBe(42000);
  expect(outcome.wins.reduce((sum,w)=>sum+w.xp,0)).toBe(outcome.xp);
  expect(hitSchedule(outcome.wins)[0].win.type).toBe('supreme');
});

test('client and server award definitions remain identical', () => {
  expect(serverLines).toEqual(PAYLINES);expect(serverXp).toEqual(XP_TABLE);
});