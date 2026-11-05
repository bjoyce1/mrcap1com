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
  {id:'cl-che',name:"Cl'Che'",color:'#ff5bbe',short:'CC'},
  {id:'murder-one',name:'Murder One',color:'#ff5b6a',short:'MO'},
  {id:'rapper-k',name:'Rapper K',color:'#be64ff',short:'RK'},
  {id:'komodo-dbx',name:'Komodo DBX',color:'#1bafff',short:'KD'},
  {id:'ganxsta-nip',name:'Ganxsta Nip',color:'#ff5b6a',short:'GN'},
  {id:'dope-e',name:'Dope-E',color:'#3dff77',short:'DE'}
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
export const SPECIAL = Object.freeze([{id:'wild',name:'SPC Wild',color:'#ffc766'},{id:'double-wild',name:'713 Double Wild',color:'#c084fc'},{id:'bonus',name:'713 Bonus',color:'#fcd965'},{id:'double',name:'713 Double Bonus',color:'#ff4fd8'},{id:'triple',name:'SPC Triple Bonus',color:'#ff3a2e'}]);
export const HOUSTON_HOODS = Object.freeze([
  {id:'south-park',name:'South Park',color:'#f59e0b',subtitle:'Home of the SPC',desc:'MLK Blvd & Cullen — Birthplace of the South Park Coalition.'},
  {id:'3rd-ward',name:'3rd Ward',color:'#ef4444',subtitle:'Southside Stronghold',desc:'Emancipation Ave & Scott St — Historic H-Town cultural bedrock.'},
  {id:'5th-ward',name:'5th Ward',color:'#a855f7',subtitle:'The Bloody Nickel',desc:'Lyons Ave — Legendary proving ground of Houston street lyricism.'},
  {id:'acres-homes',name:'Acres Homes',color:'#22c55e',subtitle:'The 44 Northside',desc:'W. Montgomery Rd — Slab parades, trunks knocking, Northside pride.'},
  {id:'mcgregor-park',name:'McGregor Park',color:'#38bdf8',subtitle:'MacGregor Way',desc:'Brays Bayou & MLK — Sunday park car shows and classic H-Town shine.'}
]);
export const SYMBOL_LORE: Record<string, {role: string; hood: string; bio: string}> = Object.freeze({
  'k-rino': {role:'The Sorcerer · SPC Co-Founder',hood:'South Park (MLK Blvd)',bio:'Co-founded the South Park Coalition in 1986. Universally respected as one of the most prolific, intricate lyricists in hip-hop history.'},
  'mr-cap': {role:'713 Executive · Slab King',hood:'South Park / 713',bio:'Keeper of the 713 flame, executive visionary, and champion of authentic Houston underground culture.'},
  'klondike-kat': {role:'The Lyrical Gorilla',hood:'South Park',bio:'First-wave SPC powerhouse whose thunderous delivery and battle-tested bars defined early Houston street rap.'},
  'point-blank': {role:'The Bull · Prone to Bad Dreams',hood:'South Park',bio:'Author of underground Houston street classics with unmistakable cadence and raw realism.'},
  'k-water': {role:'713 Mixhouse General',hood:'Southside Houston',bio:'Sharp-edged SPC lyricist carrying the Southside flag with studio precision and relentless flow.'},
  'cl-che': {role:'SPC First Lady · Vocalist & MC',hood:'South Park',bio:'Dynamic SPC veteran blending soulful hooks with razor-sharp Houston street commentary.'},
  'murder-one': {role:'South Park Enforcer',hood:'South Park',bio:'Hard-hitting SPC original known for uncompromising street anthems and loyalty to the Coalition.'},
  'rapper-k': {role:'SPC Founding Era Pioneer',hood:'Houston, TX',bio:'Pioneering voice in the South Park movement whose early recordings helped establish Houston’s independent blueprint.'},
  'komodo-dbx': {role:'DBX Production & Bars',hood:'Houston, TX',bio:'Architect of heavy trunk-rattling Texas production and rapid-fire SPC verses.'},
  'ganxsta-nip': {role:'Creator of Horrorcore',hood:'South Park',bio:'The South Park Psycho whose 1992 classic put South Park on the global map and birthed an entire subgenre.'},
  'dope-e': {role:'Terrorists Producer & MC',hood:'South Park',bio:'Mastermind behind classic SPC drum programming, soul-chopped Texas bounce, and rapid-fire verses.'},
  'south-park': {role:'Houston Hood Symbol · 25–750 XP',hood:'Southside (713)',bio:'MLK Blvd, Cullen & Bellfort — The historic neighborhood where K-Rino and the founding fathers forged the South Park Coalition.'},
  '3rd-ward': {role:'Houston Hood Symbol · 25–750 XP',hood:'Treyland / Southside',bio:'Neighboring cultural powerhouse steeped in Houston music history, independence, and community pride.'},
  '5th-ward': {role:'Houston Hood Symbol · 25–750 XP',hood:'Northeast Houston',bio:'The Bloody Nickel — Lyons Avenue stronghold known worldwide for gritty storytelling and Texas rap royalty.'},
  'acres-homes': {role:'Houston Hood Symbol · 25–750 XP',hood:'Northwest (The 44)',bio:'Iconic pine-lined streets famous for candy-painted slabs, swangas, and deep Houston trunk music.'},
  'mcgregor-park': {role:'Houston Hood Symbol · 25–750 XP',hood:'MacGregor Way & MLK',bio:'The legendary Sunday gathering spot where custom slabs, gold spokes, and new SPC mixtapes debuted every weekend.'},
  'wild': {role:'Special Payline Wildcard',hood:'South Park Coalition',bio:'Substitutes for an Artist or Music symbol on any of the 26 matching paylines. A paid run needs at least three consecutive matching positions starting on reel 1. Wilds do not win alone and cannot replace a real artist for SPC Unity or Supreme Legendary.'},
  'double-wild': {role:'Wildcard + 2× Line Multiplier',hood:'713 Mixhouse',bio:'Substitutes for any Artist or Music symbol on a payline AND doubles (2×) the XP of every payline win it helps form (4× when two Double Wilds join the same line).'},
  'bonus': {role:'Scatter Bonus Trigger',hood:'713 Area Code',bio:'Land 3 or more 713 Bonus emblems anywhere on the 6×3 board to trigger +300 Bonus XP and celebratory scatter hits.'},
  'double': {role:'2× Board Multiplier',hood:'713 Mixhouse',bio:'Multiplies the entire winning spin’s XP by 2×. Combine with SPC Triple Bonus on the same spin for a 6× total multiplier.'},
  'triple': {role:'3× Board Multiplier',hood:'South Park Coalition',bio:'Multiplies the entire winning spin’s XP by 3×. Combine with 713 Double Bonus on the same spin for a 6× total multiplier.'},
  'mic': {role:'Studio Artifact · 25–750 XP',hood:'713 Vocal Booth',bio:'24K gold condenser microphone forged for late-night Southside vocal sessions.'},
  'mixer': {role:'Studio Artifact · 25–750 XP',hood:'713 Mixhouse Console',bio:'Analog mixing console with glowing VU meters dialed in for heavy Houston trunk knock.'},
  'headphones': {role:'Studio Artifact · 25–750 XP',hood:'Booth Monitors',bio:'Custom gold-crowned studio monitor headphones built for precision beat crafting.'},
  'vinyl': {role:'Studio Artifact · 25–750 XP',hood:'Texas 12-Inch Press',bio:'Heavyweight gold-and-obsidian vinyl record with a lone-star center label.'},
  'tape': {role:'Studio Artifact · 25–750 XP',hood:'H-Town Trunk Tape',bio:'Transparent purple-and-gold street cassette mixtape straight out the trunk.'},
  'houston': {role:'Studio Artifact · 25–750 XP',hood:'Downtown 713',bio:'Downtown Houston skyline bathed in purple sunset neon and golden highway lights.'},
  'legend': {role:'Studio Artifact · 25–750 XP',hood:'Coalition Royalty',bio:'Diamond-encrusted 24K gold championship crown honoring Houston’s lyrical pioneers.'},
  'ac-chill': {role:'Legendary Guardian · Forever SPC',hood:'South Park Coalition',bio:'Original member of the South Park Coalition, honored as the guardian of the SPC legacy. When he lands on a winning board he takes flight and blesses up to three SPC Legends with gold for bonus XP.'},
  'speakers': {role:'Studio Artifact · 25–750 XP',hood:'Custom Trunk Setup',bio:'Dual 15-inch gold-cone subwoofers built to rattle trunk lids down MLK Blvd.'}
});
// Double and Triple Bonus multiply a winning spin's XP; both on one board multiply by 6. They never pay on their own.
export const MULTIPLIERS = Object.freeze({double:2,triple:3});
// Houston hood symbols land on the reels, sharing the space music had (owner decision 2026-11-04: music 9 -> 6,
// hoods 4), so Legends, Supreme and Unity land as often as before. Appended last so the
// weighted pick keeps every earlier symbol's range.
// A.C. Chill, Legendary Guardian (owner request 2026-11-05), in memory of an original South Park Coalition member.
// He is not an artist and not a Wild: he never joins a line, a vertical stack, SPC Unity, Supreme or a Sweep. He only
// lands on reels where the Legacy Blessing is switched on (off in production until the owner approves these numbers).
// When he lands on a board that already won with Legends, he blesses up to three of them for XP of his own.
export const GUARDIAN=Object.freeze({id:'ac-chill',name:'A.C. Chill',color:'#ffd27a',short:'AC',category:'legendary_guardian'});
// Provisional, owner to approve: weight is his share of reel tickets (the other symbols total 187). Blessing XP is paid
// once by the server on top of the spin, after Double and Triple Bonus, which never multiply it.
export const LEGACY_BLESSING=Object.freeze({weight:1,activationXp:150,perBlessedXp:75,maxBlessed:3,maxXp:375,qualifying:Object.freeze(['line','vertical','unity','sweep'])});
export const SYMBOLS=[...ARTISTS,...MUSIC,...SPECIAL,...HOUSTON_HOODS];
export const ALL_SHOWCASE_SYMBOLS=[...SYMBOLS];
export const SYMBOL_MAP = Object.freeze(Object.fromEntries([...SYMBOLS,GUARDIAN].map(x=>[x.id,x])));
export const ALL_SYMBOL_MAP = Object.freeze(Object.fromEntries([...ALL_SHOWCASE_SYMBOLS,GUARDIAN].map(x=>[x.id,x])));
const SPECIAL_WEIGHTS={wild:2,'double-wild':1,bonus:3,double:2,triple:1};
export const SYMBOL_WEIGHTS = Object.freeze(Object.fromEntries(SYMBOLS.map(s=>[s.id,ARTISTS.some(a=>a.id===s.id)?10:MUSIC.some(m=>m.id===s.id)?6:HOUSTON_HOODS.some(h=>h.id===s.id)?4:SPECIAL_WEIGHTS[s.id]])));
// Launch numbers (owner, 2026-11-04). welcomeSpins: one-time starter spins every account gets, used before the daily
// allowance. guestTries: spins a visitor gets before signing in (kept in this browser only).
export const GAME_CONFIG=Object.freeze({reels:6,rows:3,dailySpins:20,welcomeSpins:50,guestTries:5,timezone:'America/Chicago',localStorageKey:'spc-legends-v3',demoOnly:false});
// 26 unique six-column paths. Each row index is 0,1,2. Visible-line evaluation does not wrap.
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
  [0,2,1,1,2,0],
  [1,0,0,0,0,0], [2,0,0,0,0,0],
  [0,1,1,1,1,1], [2,1,1,1,1,1],
  [0,2,2,2,2,2], [1,2,2,2,2,2]
].map(line=>Object.freeze(line)));
// supreme: an artist on every reel (about 45% of spins, so it pays little). sweep: the SAME artist on every reel
// (about 1 in 4,200 spins), the game's jackpot. Owner decisions, 2026-11-01.
export const XP_TABLE=Object.freeze({character:{3:50,4:150,5:500,6:1500},music:{3:25,4:75,5:250,6:750},hood:{3:25,4:75,5:250,6:750},vertical:{character:250,music:125,hood:125},unity:500,supreme:250,sweep:25000,bonus:300});
