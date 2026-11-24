import { evaluateBoard } from '../engine';
import type { Moment } from './model';
/** Isolated authored review board, not a player spin. Bobby occupies a non-winning cell after evaluation. */
const board = [
  ['mr-cap','k-water','houston'], ['mr-cap','speakers','mic'],
  ['mr-cap','vinyl','k-water'], ['speakers','k-water','mic'],
  ['k-water','mic','houston'], ['houston','speakers','mic'],
];
const outcome = evaluateBoard(board);
export const REVIEW_MOMENT: Moment = {spinId:'bobby-j-authored-review-v1', board:board.map((col,c)=>col.map((id,r)=>c===5&&r===0?'bobby-j':id)), wins:outcome.wins, xp:outcome.xp};
