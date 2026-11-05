// Ported from the SPC Legends source package (src/main.js). Wires the server (account.ts) to the motion layer
// inside one container, so the game can mount and unmount with its React page. Spins, outcomes and balances
// come from the server; this file only animates and displays them.
import {ALL_SYMBOL_MAP,ARTISTS,HOUSTON_HOODS,MUSIC,SPECIAL,SYMBOL_LORE,SYMBOL_MAP,XP_TABLE,GAME_CONFIG} from './config';
import {createBoard,anticipationReels} from './engine';
import {activePool,totalSpins,type Balance} from './balance';
import {loadProfile,loadHistory,loadSweeps,loadBlessed,requestSpin,startCheckout,capturePack,paypalClientId,type HistoryItem,type SpinWin} from './account';
import {renderBoard,animateReels,animateCounter,SynthSound,PaylineOverlay,HitShow,floatText,symbolUrl,type ReelControl,type Tease} from './motion';
import {BigWin} from './bigwin';
import {isArtist} from './hits';
import {preloadLayers,layersReady} from './layers';
import {buildMarquee,attractMode,watchOffscreen} from './cabinet';
import {createStage,celebrationLevel,celebrationHit,hitKindForWin} from './stage';
import {followTempo} from './tempo';
import {sweepTease,tiersFor} from './fx';
import {supabase} from '@/integrations/supabase/client';
import {guestSpin,guardianOnGuestReels} from './guest';
import {ACChillGuardianController,blessingOf,GUARDIAN_ART,type BlessingWin} from './guardian';
import {GUARDIAN} from './config';
import {SPIN_PACKS,packById,DAILY_SPEND_CAP_CENTS} from '../../../supabase/functions/_shared/legends/packs.ts';
import {legendsPayPalSdkUrl,legendsPayPalButtonStyle} from './paypal-options';
import {createPurchaseButton} from './purchase-button';
import {renderSupremePrize} from './supreme-prize';
import {WinSoundtrack,winningArtist} from './soundtrack';
import {ImpactEffects} from './impact-effects';

type PayPalButtons={render:(el:HTMLElement)=>Promise<void>;close?:()=>Promise<void>};
type PayPalNamespace={Buttons:(options:Record<string,unknown>)=>PayPalButtons};
const paypalGlobal=()=>(window as unknown as {legendsPayPal?:PayPalNamespace}).legendsPayPal;

/** Start the game inside `root` (elements are found by data-lg). Returns a cleanup function. */
export function mountLegendsGame(root:HTMLElement){
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported DOM code; each data-lg element has its own type
const $=(id:string):any=>root.querySelector(`[data-lg="${id}"]`);
const respectsReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const audio=new SynthSound(),paylines=new PaylineOverlay($('board')),hits=new HitShow($('board')),reelControl:ReelControl={};
const soundtrack=new WinSoundtrack(),bigWin=new BigWin(root,audio),removeMarquee=buildMarquee(root.querySelector('.machine-shell') as HTMLElement);
const impacts=new ImpactEffects($('board'));
// A.C. Chill's Legacy Blessing show; the blessing itself arrives in the spin outcome.
const guardian=new ACChillGuardianController($('board'),audio);
if(guardianOnGuestReels())guardian.preload();
// The memorial card unlocks once a player has been blessed; the last blessing can be replayed (no XP).
let guardianMet=false,lastBlessing:BlessingWin|null=null,blessingClearTimer=0;
// Artists collected on the latest spin get a card flip in the collection panel.
let justFound=new Set<string>();
let userId:string|null=null,loading=true,busy=false,userReducedMotion=respectsReduced.matches;
let badges:string[]=[];
let supremeLookEnabled=true;
// Artists this player has swept: their collection card turns into a gold Legend card.
let swept=new Set<string>();
let xp=0,best=0,spinsTaken=0,collection:string[]=[],history:HistoryItem[]=[];
let balance:Balance={welcomeLeft:GAME_CONFIG.welcomeSpins,dailyLeft:GAME_CONFIG.dailySpins,paidSpins:0},activeBoard=createBoard();
// A spin whose answer never arrived is retried with the same key, so the server replays it instead of spending another.
let pendingKey:string|null=null;
let unmounted=false;
let confirmingPayment=false,accountRevision=0;
let paypalButtons:PayPalButtons|null=null;
const pendingOrderKey=(id:string)=>`legends-approved-order:${id}`;
function pendingOrder(){try{return userId?localStorage.getItem(pendingOrderKey(userId)):null;}catch{return null;}}
function storeOrder(orderID:string|null){try{if(userId){if(orderID)localStorage.setItem(pendingOrderKey(userId),orderID);else localStorage.removeItem(pendingOrderKey(userId));}}catch{/* Payment can still complete without browser storage. */}}
// The spin store's pill-to-circle control; it only mirrors real checkout states.
const buyButton=createPurchaseButton($('shop-open'),{reducedMotion:()=>userReducedMotion});
const motionButton=$('motion');
const attract=attractMode(root,{isBusy:()=>busy,reduced:()=>userReducedMotion});
// Where the spin really is (idle → spin-start → spinning → stopping → evaluating → celebrating → idle); the cabinet's
// lighting follows it in CSS. Ambient loops pause while their part of the page is off screen or the tab is hidden.
const stage=createStage(root),stopWatching=watchOffscreen(root),stopTempo=followTempo(root);
// Win songs have their own switch, apart from the sound effects; both start on.
let musicOn=true;
// Visitors get a few free tries before signing in; the count lives in this browser only (a soft limit).
const guestKey='spc-legends-guest-tries';
let guestUsed=(()=>{try{return Math.max(0,Number(localStorage.getItem(guestKey))||0);}catch{return 0;}})();
const guestLeft=()=>Math.max(0,GAME_CONFIG.guestTries-guestUsed);
function useGuestTry(){guestUsed++;try{localStorage.setItem(guestKey,String(guestUsed));}catch{/* counted for this visit */}}
// One switch for JS motion and CSS animation, seeded from the OS preference.
function applyMotionPreference(){root.classList.toggle('reduce-motion',userReducedMotion);motionButton.setAttribute('aria-pressed',String(userReducedMotion));motionButton.title=userReducedMotion?'Animations minimized':'Full animations enabled';}
// While reels move the spin button becomes a stop button; it only shortens the animation, never the outcome.
function buttonState(){
  const left=totalSpins(balance);
  $('spin').disabled=confirmingPayment||(busy?!reelControl.skip:loading);
  $('spin-label').textContent=busy?(guardian.isRunning()?'TAP TO SKIP':'TAP TO STOP'):loading?'LOADING…':!userId?(guestLeft()?'SPIN THE MIX':'SIGN IN TO SPIN'):left?'SPIN THE MIX':'GET MORE SPINS';
}
function renderCollection(){
  const ids=new Set(collection);
  $('collection').replaceChildren(...ARTISTS.map(a=>{
    const gold=swept.has(a.id);
    const element=document.createElement('div');element.className=`collection-tile${ids.has(a.id)?'':' locked'}${justFound.has(a.id)?' just-found':''}${gold?' swept':''}`;element.dataset.label=a.name;element.dataset.symbolId=a.id;element.title=gold?`${a.name}: gold Legend card (Legend Sweep) — tap for bio`:ids.has(a.id)?`${a.name} discovered — tap for bio`:`${a.name} — tap to preview`;
    const img=document.createElement('img');img.src=symbolUrl(a.id);img.alt='';img.loading='lazy';element.append(img);return element;
  }));
  // A.C. Chill's memorial card: shown once he is on the reels here or has blessed this player. Not part of the count.
  const shelf=$('guardian-shelf'),slot=$('guardian-slot');shelf.hidden=!(guardianMet||guardianOnGuestReels());slot.replaceChildren();
  if(!shelf.hidden){
    const memorial=document.createElement('div');memorial.className=`collection-tile memorial${guardianMet?'':' locked'}`;memorial.dataset.label='A.C. Chill';memorial.dataset.symbolId=GUARDIAN.id;
    memorial.title=guardianMet?'A.C. Chill, Legendary Guardian: memorial card, tap for the tribute':'A.C. Chill, Legendary Guardian: land him on a winning board to unlock his memorial card';
    const img=document.createElement('img');img.src=GUARDIAN_ART.tile;img.alt='';img.loading='lazy';memorial.append(img);
    slot.append(memorial);
  }
  justFound=new Set();
  const count=ARTISTS.length;
  $('collection-count').textContent=`${ids.size} / ${count}`;$('collected').textContent=`${ids.size} / ${count}`;$('found').textContent=`${ids.size}/${count}`;
  $('completion').textContent=`${Math.round(ids.size/count*100)}%`;$('collection-progress').style.width=`${ids.size/count*100}%`;
  $('collection-note').textContent=ids.size===count?'Complete! Every Legend unlocked.':'Collect every Legend as they hit your reels, or add one from the Vault.';
}
/** Total multiplier from Double and Triple Bonus wins (1 when none landed). */
const multiplierOf=(wins:{type:string;multiplier?:number}[])=>wins.filter(w=>w.type==='multiplier').reduce((m,w)=>m*(w.multiplier??1),1);
function historyLabel(h:HistoryItem){
  const blessed=h.wins?.some(w=>w.type==='legacy_blessing')?' • BLESSED':'';
  const first=h.wins?.find(w=>w.type==='sweep')??h.wins?.find(w=>w.type==='supreme')??h.wins?.[0];if(!first)return 'Spin complete';
  const label=first.type==='sweep'?`LEGEND SWEEP • ${SYMBOL_MAP[first.symbol as string]?.name??''}`:first.type==='supreme'?'SUPREME LEGENDARY':first.type==='unity'?'SPC UNITY':first.type==='bonus'?'713 HOUSTON BONUS':first.type==='vertical'?`VERTICAL STACK • ${SYMBOL_MAP[first.symbol as string]?.name??''}`:`${first.count}× ${SYMBOL_MAP[first.symbol as string]?.name||'Match'}${first.wildMultiplier&&first.wildMultiplier>1?` (×${first.wildMultiplier} WILD)`:''}`;
  const m=multiplierOf(h.wins);return (m>1?`${label} • ×${m}`:label)+blessed;
}
function renderHistory(){const list=$('history');list.replaceChildren();if(!history.length){const el=document.createElement('li');el.textContent='No spins yet. The stage is yours.';list.append(el);return;}
  for(const h of history.slice(0,6)){const el=document.createElement('li');const label=document.createElement('span');label.textContent=historyLabel(h);const gained=document.createElement('strong');gained.textContent=`+${h.xp} XP`;el.append(label,gained);list.append(el);}}
function renderBalance(){
  const pool=activePool(balance);
  $('spins-label').textContent=userId?pool.label:'FREE TRIES';$('spins').textContent=String(userId?pool.count:guestLeft());$('signin').hidden=!!userId;
  $('shop-paid').textContent=balance.paidSpins?`You have ${balance.paidSpins} paid spin${balance.paidSpins===1?'':'s'}.`:'';
  $('mode').textContent=userId?'Account':'Guest';
  $('balance-summary').textContent=userId?`${balance.welcomeLeft} welcome · ${balance.dailyLeft} free today · ${balance.paidSpins} paid · ${totalSpins(balance)} total spins`:`${guestLeft()} free tr${guestLeft()===1?'y':'ies'} left · Sign in for ${GAME_CONFIG.welcomeSpins} free spins, ${GAME_CONFIG.dailySpins} more every day, and saved XP, coins and Legends`;
}
function refresh(animateFrom:number|null=null){
  if(animateFrom!==null)animateCounter($('xp'),animateFrom,xp,{reducedMotion:userReducedMotion});else $('xp').textContent=xp.toLocaleString();
  $('best').textContent=best.toLocaleString();$('total-spins').textContent=spinsTaken.toLocaleString();
  renderBalance();renderCollection();renderHistory();buttonState();
  $('supreme-badge').hidden=!badges.includes('supreme-legends');
  renderSupremePrize(root,badges,!!userId,supremeLookEnabled);
  $('shop-open').hidden=!userId;
}
/** Restart a one-shot CSS animation class. */
// Restarts a CSS animation class. Reading offsetWidth to force the restart re-styled the whole page (a freeze on
// phones); taking the class off for one frame does the same without forcing anything.
const restarts=new WeakMap<HTMLElement,number>();
function retrigger(el:HTMLElement|null,cls:string){
  if(!el)return;const n=(restarts.get(el)??0)+1;restarts.set(el,n);el.classList.remove(cls);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(restarts.get(el)===n)el.classList.add(cls);}));
}
function setResult(title:string,description:string,kicker='NOW PLAYING'){
  const result=$('result');$('result-title').textContent=title;$('result-desc').textContent=description;result.querySelector('.result-kicker').textContent=kicker;
  retrigger(result,'swap');
}
/** Marquee bulbs flash together for a moment after a win. */
let winningTimer=0;
function flashMarquee(ms:number){root.classList.add('lg-winning');clearTimeout(winningTimer);winningTimer=window.setTimeout(()=>root.classList.remove('lg-winning'),ms);}
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

async function spin(){
  if(busy){reelControl.skip?.();return;}
  if(loading)return;
  if(confirmingPayment)return;
  const player=userId;
  if(userId&&totalSpins(balance)<=0){openShop(true);return;}
  if(!userId&&!guestLeft()){askToSignIn();return;}
  root.dispatchEvent(new CustomEvent('lg-lines-result',{detail:null}));
  busy=true;buttonState();paylines.clear();hits.clear();impacts.clear();bigWin.close();guardian.clear();clearTimeout(blessingClearTimer);$('blessing-replay').hidden=true;attract.poke();soundtrack.fadeOut();$('spin').classList.add('is-spinning');root.classList.add('lg-spinning');audio.feel(8);
  stage.set('spin-start');audio.spinStart();
  setResult('CUTTING THE MIX…','Each reel stops in order. Good luck finding your legends!','SPINNING');
  const key=pendingKey??crypto.randomUUID();pendingKey=key;
  try{
    let answer=player?await requestSpin(key):guestSpin(collection);
    if(!player)useGuestTry();
    // The server allows one spin every 1.2 seconds; a quick tap after "tap to stop" waits and retries the same key.
    if('error' in answer&&answer.error==='cooldown'){await wait(1300);answer=await requestSpin(key);}
    if('error' in answer){
      if(answer.error!=='failed')pendingKey=null;
      if(answer.error==='signed_out'){await loadAccount(null);return;}
      if(answer.error==='no_spins'){if(answer.balance)balance=answer.balance;refresh();setResult('OUT OF SPINS',`Grab a spin pack (25 for $1 and up), or come back tomorrow for ${GAME_CONFIG.dailySpins} free spins (Houston time).`,'REFILL');openShop(true);return;}
      setResult('SPIN COULD NOT COMPLETE','Check your connection and press spin again. You will not be charged a second spin.','TRY AGAIN');return;
    }
    if(unmounted||userId!==player)return;
    pendingKey=null;
    const target=answer.board,prior=activeBoard,outcome=answer.outcome;
    // The winning Legends' layers load while the reels spin; any not ready by the hit show use the flat pop.
    if(!userReducedMotion)preloadLayers(outcome.hitCells.map(k=>{const [c,r]=k.split(':').map(Number);return target[c][r];}).filter(isArtist));
    // Teases only lengthen and light reels that have not landed yet; the board above is already decided.
    const bonusTease=anticipationReels(target),sweepHint=sweepTease(target);
    const anticipate:Tease[]=target.map((_,i)=>sweepHint.reels[i]?'sweep':bonusTease[i]?'bonus':false);
    stage.set('spinning');
    await animateReels($('reels'),prior,target,{reducedMotion:userReducedMotion,anticipate,teaseColor:sweepHint.artist?SYMBOL_MAP[sweepHint.artist]?.color:'',control:reelControl,onReady:buttonState,onStop:i=>{audio.stop(i);if(i===0)stage.set('stopping');},onAnticipate:kind=>{
      audio.tease();
      if(kind==='sweep')setResult('LEGEND SWEEP INCOMING…',`${SYMBOL_MAP[sweepHint.artist as string]?.name} has landed on every reel so far.`,'HOLD UP');
      else setResult('TWO 713s LANDED…','One more 713 anywhere unlocks the Houston bonus.','HOLD UP');
    }});
    root.classList.remove('lg-spinning');
    if(unmounted||userId!==player)return;
    stage.set('evaluating');
    const oldXP=xp;
    xp+=outcome.xp;best=Math.max(best,outcome.xp);spinsTaken+=1;activeBoard=target;balance=answer.balance;
    collection=[...new Set([...collection,...answer.newCharacters])];
    history=[{xp:outcome.xp,wins:outcome.wins},...history].slice(0,6);
    const sweeps=outcome.wins.filter(w=>w.type==='sweep').map(w=>w.symbol as string),sweep=sweeps[0]??null;
    // The Legacy Blessing has its own show; the regular win show, its tiers and the Big Win use the spin's other wins.
    const blessing=blessingOf(outcome.wins),baseWins=outcome.wins.filter(w=>w.type!=='legacy_blessing'),spinXp=outcome.xp-(blessing?.xp??0);
    const spinOutcome={...outcome,xp:spinXp,wins:baseWins};
    const supreme=outcome.wins.some(w=>w.type==='supreme'),unity=outcome.wins.some(w=>w.type==='unity'),isMajor=!!sweep||tiersFor(spinXp).length>0;
    sweeps.forEach(id=>swept.add(id));if(sweep&&!badges.includes('legend-sweep'))badges.push('legend-sweep');
    if(supreme&&!badges.includes('supreme-legends'))badges.push('supreme-legends');
    justFound=new Set(answer.newCharacters);
    renderBoard($('reels'),target,outcome.hitCells);
    const vertical=outcome.wins.filter(w=>w.type==='vertical') as (SpinWin&{reel:number})[];
    vertical.forEach(v=>$('reels').children[v.reel]?.classList.add('vertical-preview'));
    // Supreme Legendary is a Legend on every reel, not a line: each of its six Legends wears a crown instead.
    outcome.wins.find(w=>w.type==='supreme')?.cells.forEach(cell=>$('reels').querySelector(`[data-cell="${cell}"]`)?.classList.add('is-supreme'));
    if(blessing){
      // A.C. Chill rises, flies to each Legend the server blessed and turns it gold. The button skips the show.
      lastBlessing=blessing;if(!guardianMet){guardianMet=true;renderCollection();}
      stage.set('celebrating',2,'unity');
      setResult('A.C. CHILL HAS ARRIVED','The Legacy Blessing. Tap the spin button to skip.','LEGENDARY GUARDIAN');
      const show=guardian.play(blessing,{reducedMotion:userReducedMotion});
      reelControl.skip=()=>guardian.skip();buttonState();
      await show;
      reelControl.skip=null;buttonState();
      if(unmounted||userId!==player)return;
    }
    // Lines wait dim while the hit show pops each win in turn, then take over and cycle.
    paylines.show(baseWins,{reducedMotion:userReducedMotion,autoCycle:false});
    // The celebration level comes from the real outcome; the cabinet stays lit until the hit show and any Big Win close.
    const level=celebrationLevel(spinOutcome),hit=celebrationHit(spinOutcome);
    if(level){stage.set('celebrating',level,hit);if(level>1)audio.stinger(level);}else if(blessing)stage.set('idle');
    hits.play(baseWins,{reducedMotion:userReducedMotion,big:isMajor,onStep:w=>{paylines.focus(w);stage.setHit(hitKindForWin(w),SYMBOL_MAP[w.symbol as string]?.color);if(w.type==='bonus'||w.type==='sweep'||w.type==='unity'||w.type==='vertical'||(w.type==='line'&&(w.count??0)>=5)){impacts.burst(w.cells,userReducedMotion,w.type==='vertical');audio.explode(w.type==='vertical');}},onDone:()=>{stage.setHit(hit);
      paylines.cycle();
      // Big Win show for 1,000+ XP; every Legend Sweep reaches it (see fx.ts).
      void bigWin.play({xp:spinXp,kicker:sweep?`LEGEND SWEEP • ${SYMBOL_MAP[sweep]?.name}`:unity?'SPC UNITY':'',art:sweep?symbolUrl(sweep):'',layers:sweep?layersReady(sweep):null,reducedMotion:userReducedMotion})
        .then(()=>{if(stage.get()==='celebrating')stage.set('idle');
          // Blessed Legends stay gold a moment after the win presentation, then return to their own art.
          if(blessing){clearTimeout(blessingClearTimer);blessingClearTimer=window.setTimeout(()=>{if(!busy&&!guardian.isRunning())guardian.clear();},3500);}});
    }});
    if(outcome.xp>0)flashMarquee(isMajor?3200:1400);
    const fresh=answer.newCharacters.length;
    if(fresh)window.setTimeout(()=>audio.unlock(),450);
    if(outcome.xp>0){
      floatText($('board'),`+${outcome.xp.toLocaleString()} XP`,{reducedMotion:userReducedMotion});
      if(!userReducedMotion)retrigger($('xp').closest('.hud-block'),'bump');
      const top=baseWins.filter(w=>w.type!=='multiplier').sort((a,b)=>b.xp-a.xp)[0],lines=outcome.wins.filter(w=>w.type==='line').length;
      const description=sweep?`${sweeps.map(id=>SYMBOL_MAP[id]?.name).join(' and ')} on all six reels! ${XP_TABLE.sweep.toLocaleString()} XP + a gold Legend card.${supreme?' Supreme title + Gold Cabinet unlocked.':''}`:unity?`SPC Unity: six different SPC artists connected across the reels! ${XP_TABLE.unity} base XP${supreme?` + Supreme Legendary ${XP_TABLE.supreme} base XP`:''}.`:supreme?`Six reels of Legends! ${XP_TABLE.supreme} base XP + Supreme Legendary badge, player title and Gold Cabinet unlock.`:top?.type==='bonus'?'Three or more 713 symbols unlocked the Houston bonus.':top?.type==='line'?`${top.count} ${SYMBOL_MAP[top.symbol as string]?.name||'symbol'} symbols connected${top.wildMultiplier&&top.wildMultiplier>1?` (×${top.wildMultiplier} DOUBLE WILD)`:''}.`:'';
      const stacks=vertical.length?`${vertical.length>1?`${vertical.length} vertical stacks`:'Vertical stack'}: ${vertical.map(v=>`${SYMBOL_MAP[v.symbol as string]?.name} down reel ${v.reel+1}`).join(', ')}`:'';
      const m=multiplierOf(outcome.wins),boost=m>1?` • ${m===6?'DOUBLE AND TRIPLE BONUS':m===3?'TRIPLE BONUS':'DOUBLE BONUS'} ×${m}`:'';
      const blessed=blessing?` • Legacy Blessing: ${blessing.count} SPC Legend${blessing.count===1?'':'s'} blessed, +${blessing.xp} XP`:'';
      setResult(`+${outcome.xp.toLocaleString()} LEGENDS XP`,[description,stacks].filter(Boolean).join(' • ')+boost+blessed+(lines>1?` • ${lines} paylines hit`:'')+(fresh?` • ${fresh} new character${fresh>1?'s':''}!`:''),sweep?'LEGEND SWEEP!':unity?'SPC UNITY!':blessing?'LEGACY BLESSING!':vertical.length?'VERTICAL STACK!':supreme?'SUPREME LEGENDARY!':m>1?`×${m} MULTIPLIER`:'YOU HIT A MIX');
      if(blessing)$('blessing-replay').hidden=false;
      audio.win(isMajor);
      const track=soundtrack.play({supreme,unity,sweep:!!sweep,major:isMajor||m>1,bonus:top?.type==='bonus',xp:spinXp,artist:winningArtist(outcome.wins,target)},musicOn);
      if(track&&musicOn){const sub=$('result').querySelector('span');if(sub)sub.textContent+=` • NOW PLAYING: ${track.title}`;}
    }else{
      setResult('KEEP THE MIX GOING',fresh?`${fresh} new legend${fresh>1?'s':''} collected, even without a matching line.`:!userId||totalSpins(balance)?'No payline match on this spin. Spin again!':'No payline match. That was your last spin for now.','SPIN COMPLETE');
    }
    refresh(oldXP);
    root.dispatchEvent(new CustomEvent('lg-lines-result',{detail:{board:target,wins:outcome.wins,xp:outcome.xp}}));
    if(userId&&!totalSpins(balance))openShop(true);
    if(!player&&!guestLeft())setTimeout(()=>{if(!userId&&!busy)askToSignIn(false);},2600);
  }catch(error){console.error('Spin failed:',error);setResult('SPIN COULD NOT COMPLETE','Check your connection and press spin again. You will not be charged a second spin.','TRY AGAIN');renderBoard($('reels'),activeBoard);}
  finally{audio.endSpin();busy=false;$('spin').classList.remove('is-spinning');root.classList.remove('lg-spinning');attract.poke();buttonState();if(stage.get()!=='celebrating')stage.set('idle');}
}

// ----- Spin packs (packs.ts): $1 to $100 through the site's PayPal account, at most $100 a day -----
function askToSignIn(scroll=true){
  setResult(`SIGN IN FOR ${GAME_CONFIG.welcomeSpins} FREE SPINS`,`Your free tries are used. Sign in to get ${GAME_CONFIG.welcomeSpins} free spins, ${GAME_CONFIG.dailySpins} more every day (Houston time), and keep your XP, coins and Legends.`,'FREE TRIES USED');
  $('signin').hidden=false;buttonState();
  if(scroll)$('signin').scrollIntoView({block:'nearest',behavior:userReducedMotion?'auto':'smooth'});
}
let selectedPack=SPIN_PACKS[0].id;
const orderPacks=new Map<string,string>();
function selectPack(id:string){
  if(!packById(id))return;selectedPack=id;
  root.querySelectorAll<HTMLElement>('[data-pack]').forEach(card=>{const on=card.dataset.pack===id;card.classList.toggle('is-selected',on);card.setAttribute('aria-checked',String(on));});
}
root.querySelectorAll<HTMLElement>('[data-pack]').forEach(card=>card.addEventListener('click',()=>selectPack(card.dataset.pack!)));
let paypalReady:Promise<boolean>|null=null;
function shopMessage(text:string){$('shop-msg').textContent=text;}
function loadPayPal():Promise<boolean>{
  paypalReady??=(async()=>{
    if(paypalGlobal())return true;
    const clientId=await paypalClientId();if(!clientId)return false;
    return await new Promise<boolean>(resolve=>{
      const script=document.createElement('script');
      script.src=legendsPayPalSdkUrl(clientId);
      script.setAttribute('data-namespace','legendsPayPal');
      script.async=true;script.onload=()=>resolve(!!paypalGlobal());script.onerror=()=>resolve(false);
      document.body.appendChild(script);
    });
  })();
  return paypalReady;
}
let buttonsShown=false;
async function confirmPayment(orderID:string){
  if(confirmingPayment||busy||!userId)return;
  const buyer=userId;
  confirmingPayment=true;accountRevision++;storeOrder(orderID);buttonState();
  buyButton.setState('processing');
  $('shop-retry').hidden=true;shopMessage('Confirming your payment…');
  try{
    const paid=await capturePack(orderID);
    if(unmounted||userId!==buyer)return;
    if('error' in paid){
      $('shop-retry').hidden=false;buyButton.setState('error');
      shopMessage('Payment is not confirmed yet. Retry confirmation before buying another pack. If you were charged, do not pay again.');
      return;
    }
    const beforeSpins=activePool(balance).count;
    storeOrder(null);balance=paid.balance;refresh();
    buyButton.setState('success');
    // The balance number climbs to the server-confirmed total with a cyan and gold glow.
    animateCounter($('spins'),beforeSpins,activePool(balance).count,{reducedMotion:userReducedMotion});
    const spinsBlock=$('spins').closest('.hud-block');if(spinsBlock)retrigger(spinsBlock,'balance-glow');
    shopMessage('Payment confirmed. Your paid spin balance is updated.');
    const bought=packById(orderPacks.get(orderID));
    setResult(bought?`${bought.spins.toLocaleString()} SPINS ADDED`:'SPINS ADDED','Thanks for supporting the Legends. Spin the mix!','READY');
  }catch{
    if(!unmounted&&userId===buyer){$('shop-retry').hidden=false;buyButton.setState('error');shopMessage('Confirmation could not finish. Retry before buying another pack.');}
  }finally{
    confirmingPayment=false;
    if(!unmounted){loading=false;buttonState();}
  }
}
/** Opens the spin store and renders the PayPal buttons. Resolves true once they are on screen. */
async function openShop(scrollTo=false):Promise<boolean>{
  if(!userId)return false;
  $('shop').hidden=false;$('shop-open').setAttribute('aria-expanded','true');
  if(scrollTo)$('shop').scrollIntoView({block:'nearest',behavior:userReducedMotion?'auto':'smooth'});
  if(buttonsShown)return true;
  shopMessage('Loading PayPal…');
  if(!(await loadPayPal())){paypalReady=null;shopMessage('PayPal could not load. Check your connection and try again.');return false;}
  if(unmounted||buttonsShown)return !unmounted;
  buttonsShown=true;shopMessage('');
  const paypal=paypalGlobal();if(!paypal){buttonsShown=false;return false;}
  paypalButtons=paypal.Buttons({
    style:legendsPayPalButtonStyle,
    onClick:(_data:unknown,actions:{resolve:()=>void;reject:()=>void})=>{
      if(busy||confirmingPayment||pendingOrder()){shopMessage('Finish your spin or retry payment confirmation before buying another pack.');return actions.reject();}
      if($('shop-age').checked){shopMessage('');return actions.resolve();}
      shopMessage('Please confirm you are 18 or older to buy spins.');return actions.reject();
    },
    createOrder:async()=>{
      const pack=selectedPack,order=await startCheckout(pack);
      if('orderID' in order){orderPacks.set(order.orderID,pack);return order.orderID;}
      shopMessage(order.error==='not_on_sale'?'Spin packs go on sale soon. Your free spins come back every day (Houston time).':order.error==='signed_out'?'Please sign in again to buy spins.':order.error==='cap'?`You've reached today's $${DAILY_SPEND_CAP_CENTS/100} spin pack limit. It resets at midnight, Houston time.`:'Checkout could not start. Please try again.');
      throw new Error(order.error);
    },
    onApprove:async(data:{orderID:string})=>confirmPayment(data.orderID),
    onCancel:()=>shopMessage('Checkout cancelled. No spins added.'),
    onError:()=>{if(!$('shop-msg').textContent)shopMessage('PayPal ran into a problem. Check payment confirmation before trying again.');},
  });
  const rendered=await paypalButtons.render($('shop-paypal')).then(()=>true).catch(()=>{buttonsShown=false;shopMessage('PayPal could not load. Please try again.');return false;});
  if(pendingOrder()){$('shop-retry').hidden=false;shopMessage('An approved payment needs confirmation. Retry before buying another pack.');}
  return rendered;
}

// ----- Account -----
async function loadAccount(nextUser:string|null){
  root.dispatchEvent(new CustomEvent('lg-lines-result',{detail:null}));
  const revision=++accountRevision;
  if(nextUser!==userId){
    pendingKey=null;
    badges=[];supremeLookEnabled=true;
    void paypalButtons?.close?.().catch(()=>undefined);
    paypalButtons=null;buttonsShown=false;$('shop-paypal').replaceChildren();
    $('shop-retry').hidden=true;buyButton.setState('idle');
  }
  userId=nextUser;loading=!!nextUser;history=[];
  if(!nextUser){
    xp=0;best=0;spinsTaken=0;collection=[];badges=[];swept=new Set();guardianMet=false;lastBlessing=null;balance={welcomeLeft:0,dailyLeft:0,paidSpins:0};
    $('shop').hidden=true;refresh();
    if(guestLeft())setResult('THE SOUTH SIDE IS CALLING.',`Take ${guestLeft()} free tr${guestLeft()===1?'y':'ies'} on us, then sign in for ${GAME_CONFIG.welcomeSpins} free spins and ${GAME_CONFIG.dailySpins} more every day.`,'FREE TRIES');
    else askToSignIn(false);
    return;
  }
  refresh();
  try{
    // Gold cards are a nice-to-have: if that read fails, the game still loads.
    const [profile,recent,sweptIds,blessedBefore]=await Promise.all([loadProfile(nextUser),loadHistory(),loadSweeps().catch(()=>[] as string[]),loadBlessed().catch(()=>false)]);
    if(unmounted||userId!==nextUser||revision!==accountRevision)return;
    xp=profile.xp;best=profile.best;spinsTaken=profile.totalSpins;collection=profile.collection;badges=profile.badges;balance=profile.balance;history=recent;swept=new Set(sweptIds);guardianMet=blessedBefore;
    if(!busy){activeBoard=profile.lastBoard??createBoard();renderBoard($('reels'),activeBoard);}
    setResult('THE SOUTH SIDE IS CALLING.',totalSpins(balance)?'Press SPIN THE MIX to reveal your next lineup.':`You are out of spins. Grab a spin pack (25 for $1 and up) or come back tomorrow for ${GAME_CONFIG.dailySpins} free spins.`,'READY TO ROLL');
    if(!totalSpins(balance))openShop();
    if(pendingOrder()){await openShop();$('shop-retry').hidden=false;}
  }catch(error){
    if(unmounted||userId!==nextUser||revision!==accountRevision)return;
    console.error('Could not load Legends account',error);
    setResult('COULD NOT LOAD YOUR GAME','Refresh the page to try again.','TRY AGAIN');
  }finally{if(!unmounted&&userId===nextUser&&revision===accountRevision){loading=false;refresh();}}
}

/** The library mirrors the symbol sheet: character, Houston hoods, special, and music and Houston groups. */
function populateLibrary(){
  const groups:[string,readonly {id:string;name:string;color:string}[]][]=[['lib-characters',ARTISTS],['lib-hoods',HOUSTON_HOODS],['lib-special',SPECIAL],['lib-music',MUSIC]];
  for(const [slot,symbols] of groups){
    const host=$(slot);if(!host)continue;
    host.replaceChildren(...symbols.map(s=>{
      const div=document.createElement('div');div.className=`library-item${slot==='lib-characters'||slot==='lib-hoods'?' is-char':''}`;div.style.setProperty('--sym',s.color);
      div.dataset.symbolId=s.id;
      const img=document.createElement('img');img.src=symbolUrl(s.id);img.alt=s.name;img.loading='lazy';
      const title=document.createElement('b');title.textContent=s.name;div.append(img,title);return div;
    }));
  }
}
function openSpotlight(id:string){
  const sym=ALL_SYMBOL_MAP[id];const modal=$('spotlight');if(!sym||!modal)return;
  const lore=SYMBOL_LORE[id]??{role:'SPC LEGENDS SYMBOL',hood:'Houston, TX (713)',bio:'Official high-resolution symbol from the South Park Coalition arcade cabinet.'};
  modal.style.setProperty('--sym',sym.color||'#ffd27a');
  const img=$('spotlight-img') as HTMLImageElement|null;if(img){img.src=symbolUrl(id);img.alt=sym.name;}
  const title=$('spotlight-title');if(title)title.textContent=sym.name;
  const role=$('spotlight-role');if(role)role.textContent=lore.role;
  const hood=$('spotlight-hood');if(hood)hood.textContent=lore.hood;
  const bio=$('spotlight-bio');if(bio)bio.textContent=lore.bio;
  modal.hidden=false;
}
function closeSpotlight(){
  const modal=$('spotlight');if(modal)modal.hidden=true;
}
const onRootClick=(e:MouseEvent)=>{
  const target=e.target as HTMLElement|null;if(!target)return;
  if(target.closest('[data-lg="spotlight-close"]')){closeSpotlight();return;}
  const symTrigger=target.closest<HTMLElement>('[data-symbol-id]');
  if(symTrigger?.dataset.symbolId){openSpotlight(symTrigger.dataset.symbolId);return;}
  if(!busy){
    const reelTile=target.closest<HTMLElement>('.reel-window .symbol-tile[data-symbol]');
    if(reelTile?.dataset.symbol)openSpotlight(reelTile.dataset.symbol);
  }
};
const onKeyDown=(e:KeyboardEvent)=>{if(e.key==='Escape')closeSpotlight();};
const onInspectLine=(event:Event)=>{
  if(busy)return;
  const win=(event as CustomEvent<SpinWin>).detail;
  hits.clear();impacts.clear();bigWin.close();
  const selected=new Set(win.cells);
  $('reels').classList.add('has-wins');
  root.querySelectorAll<HTMLElement>('.reel-window [data-cell]').forEach(tile=>tile.classList.toggle('match',selected.has(tile.dataset.cell??'')));
  paylines.show([win],{reducedMotion:userReducedMotion,autoCycle:false});paylines.focus(win);
  if(win.type==='vertical'){impacts.burst(win.cells,userReducedMotion,true);audio.explode(true);}
  const artist=winningArtist([win],activeBoard);
  if(artist&&musicOn){
    const track=soundtrack.play({supreme:win.type==='supreme',unity:win.type==='unity',sweep:win.type==='sweep',major:false,bonus:false,xp:history[0]?.xp??win.xp,artist},true);
    if(track){const sub=$('result').querySelector('span');if(sub)sub.textContent=sub.textContent.replace(/ • NOW PLAYING:.*$/,'')+` • NOW PLAYING: ${track.title}`;}
  }
};
root.addEventListener('lg-inspect-line',onInspectLine);
root.addEventListener('click',onRootClick);
document.addEventListener('keydown',onKeyDown);
$('spin').addEventListener('click',spin);
$('blessing-replay').addEventListener('click',()=>{
  if(busy||!lastBlessing||guardian.isRunning())return;
  clearTimeout(blessingClearTimer);guardian.clear();
  void guardian.play(lastBlessing,{reducedMotion:userReducedMotion});
});
$('prize-equip').addEventListener('click',()=>{if(!badges.includes('supreme-legends'))return;supremeLookEnabled=!supremeLookEnabled;renderSupremePrize(root,badges,!!userId,supremeLookEnabled);});
$('shop-retry').addEventListener('click',()=>{const orderID=pendingOrder();if(orderID)void confirmPayment(orderID);});
$('shop-open').addEventListener('click',()=>{
  if(buyButton.state()==='processing')return;
  if(!$('shop').hidden){$('shop').hidden=true;$('shop-open').setAttribute('aria-expanded','false');return;}
  buyButton.setState('processing');
  void openShop(true).then(ok=>buyButton.setState(ok?'idle':'error'));
});
// Sound effects are on by default (owner, 2026-11-04); a player who mutes stays muted on this device. Browsers only let
// audio start from a tap or key press, so the sound engine starts (or wakes) on the first one.
const soundKey='spc-legends-sound';
let soundWanted=(()=>{try{return localStorage.getItem(soundKey)!=='off';}catch{return true;}})();
function showSound(){$('sound').setAttribute('aria-pressed',String(soundWanted));$('sound-icon').textContent=soundWanted?'🔊':'🔇';$('sound').title=soundWanted?'Mute sound effects':'Turn on sound effects';}
const startSound=()=>{if(soundWanted&&(!audio.enabled||audio.ctx?.state!=='running'))audio.setEnabled(true);};
const gestures=['pointerdown','touchend','click','keydown'] as const;
function showMusic(){$('music').setAttribute('aria-pressed',String(musicOn));$('music-icon').textContent=musicOn?'♫':'♫̸';$('music').title=musicOn?'Mute win music':'Turn on win music';}
gestures.forEach(type=>document.addEventListener(type,startSound,{capture:true}));
showSound();showMusic();
$('sound').addEventListener('click',()=>{soundWanted=!soundWanted;try{localStorage.setItem(soundKey,soundWanted?'on':'off');}catch{/* the choice lasts this visit */}audio.setEnabled(soundWanted);showSound();if(soundWanted)audio.tone(523,.14);});
$('music').addEventListener('click',()=>{musicOn=!musicOn;if(!musicOn)soundtrack.stopNow();showMusic();});
motionButton.addEventListener('click',()=>{userReducedMotion=!userReducedMotion;applyMotionPreference();});
const onReducedChange=(e:MediaQueryListEvent)=>{if(e.matches){userReducedMotion=true;applyMotionPreference();}};
// The daily allowance rolls over at Houston midnight; re-read the balance when the tab comes back.
const onVisible=()=>{if(document.visibilityState==='visible'&&!busy&&!confirmingPayment&&userId)loadAccount(userId);};
respectsReduced.addEventListener?.('change',onReducedChange);
document.addEventListener('visibilitychange',onVisible);
renderBoard($('reels'),activeBoard);populateLibrary();applyMotionPreference();refresh();
// Supabase sends each new listener the current session first (INITIAL_SESSION), then sign-ins and sign-outs.
const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
  const next=session?.user?.id??null;
  if(event==='INITIAL_SESSION'||next!==userId)setTimeout(()=>{if(!unmounted)void loadAccount(next);},0);
});
return ()=>{
  unmounted=true;clearTimeout(blessingClearTimer);guardian.destroy();soundtrack.stopNow();gestures.forEach(type=>document.removeEventListener(type,startSound,{capture:true}));audio.destroy();impacts.destroy();subscription.unsubscribe();buyButton.destroy();bigWin.destroy();removeMarquee();attract.stop();stopWatching();stopTempo();clearTimeout(winningTimer);
  root.removeEventListener('lg-inspect-line',onInspectLine);
  void paypalButtons?.close?.().catch(()=>undefined);
  root.removeEventListener('click',onRootClick);
  document.removeEventListener('keydown',onKeyDown);
  respectsReduced.removeEventListener?.('change',onReducedChange);
  document.removeEventListener('visibilitychange',onVisible);
  reelControl.skip?.();paylines.clear();paylines.resize.disconnect();paylines.svg.remove();hits.clear();hits.layer.remove();
};
}
