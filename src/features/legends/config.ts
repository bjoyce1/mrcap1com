// Ported from the SPC Legends source package (src/game/config.mjs). Keep the two in step.
/** Canonical game definitions. Changes to symbol weights affect random outcome frequency.
 * This is a prototype without prizes or redeemable value. No monetary rewards exist.
 */
export const ARTISTS = Object.freeze([
  {id:'k-rino',name:'K-Rino',color:'#1bafff',short:'KR'},
  {id:'mr-cap',name:'Mr. CAP',color:'#be64ff',short:'MC'},
  {id:'klondike-kat',name:'Klondike Kat',color:'#ffc354',short:'KK'},
  {id:'point-blank',name:'Point Blank',color:'#ff5b6a',short:'PB'},
  {id:'k-water',name:'K-Water',color:'#35ecaa',short:'KW'},
  {id:'cl-che',name:"Cl'Che'",color:'#ff5bbe',short:'CC'}
]);
export const MUSIC = Object.freeze([
  {id:'mic',name:'Gold Microphone',color:'#ffce65'},
  {id:'mixer',name:'Mixing Console',color:'#7c9cff'},
  {id:'headphones',name:'Headphones',color:'#be79ff'},
  {id:'vinyl',name:'Texas Vinyl',color:'#ffc66b'},
  {id:'tape',name:'Houston Mixtape',color:'#f5a547'},
  {id:'houston',name:'Houston Skyline',color:'#b774ff'},
  {id:'legend',name:'Legend Crown',color:'#ffd078'},
  {id:'speakers',name:'Speakers',color:'#a764ff'}
]);
export const SPECIAL = Object.freeze([{id:'wild',name:'SPC Wild',color:'#ffc766'},{id:'bonus',name:'713 Bonus',color:'#fcd965'}]);
export const SYMBOLS=[...ARTISTS,...MUSIC,...SPECIAL];
export const SYMBOL_MAP = Object.freeze(Object.fromEntries(SYMBOLS.map(x=>[x.id,x])));
export const SYMBOL_WEIGHTS = Object.freeze(Object.fromEntries(SYMBOLS.map(s=>[s.id,ARTISTS.some(a=>a.id===s.id)?10:MUSIC.some(m=>m.id===s.id)?9:s.id==='wild'?2:3])));
// welcomeSpins: one-time starter spins every player gets, used before the daily allowance.
export const GAME_CONFIG=Object.freeze({reels:6,rows:3,dailySpins:3,welcomeSpins:25,timezone:'America/Chicago',localStorageKey:'spc-legends-v3',demoOnly:true});
// 20 unique six-column paths. Each row index is 0,1,2. Visible-line evaluation does not wrap.
export const PAYLINES=Object.freeze([
  [1,1,1,1,1,1], [0,0,0,0,0,0], [2,2,2,2,2,2],
  [0,1,2,2,1,0], [2,1,0,0,1,2],
  [0,0,1,1,2,2], [2,2,1,1,0,0],
  [1,0,1,0,1,0], [1,2,1,2,1,2],
  [0,1,0,1,0,1], [2,1,2,1,2,1],
  [0,2,0,2,0,2], [2,0,2,0,2,0],
  [1,1,0,1,1,0], [1,1,2,1,1,2],
  [0,1,1,1,1,2], [2,1,1,1,1,0],
  [1,0,0,1,2,2], [1,2,2,1,0,0],
  [0,2,1,1,2,0]
].map(line=>Object.freeze(line)));
export const XP_TABLE=Object.freeze({character:{3:50,4:150,5:500,6:1500},music:{3:25,4:75,5:250,6:750},unity:2000,bonus:300});
