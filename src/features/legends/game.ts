// Ported from the SPC Legends source package (src/main.js). Wires the server (account.ts) to the motion layer
// inside one container, so the game can mount and unmount with its React page. Spins, outcomes and balances
// come from the server; this file only animates and displays them.
import {ARTISTS,MUSIC,SPECIAL,SYMBOL_MAP} from './config';
import {createBoard,anticipationReels} from './engine';
import {activePool,totalSpins,type Balance} from './balance';
import {loadProfile,loadHistory,requestSpin,startCheckout,capturePack,paypalClientId,type HistoryItem} from './account';
import {renderBoard,animateReels,animateCounter,Confetti,SynthSound,PaylineOverlay,HitShow,floatText,symbolUrl,type ReelControl} from './motion';
import {supabase} from '@/integrations/supabase/client';
import {guestSpin} from './guest';

type PayPalButtons={render:(el:HTMLElement)=>Promise<void>;close?:()=>Promise<void>};
type PayPalNamespace={Buttons:(options:Record<string,unknown>)=>PayPalButtons};
const paypalGlobal=()=>(window as unknown as {legendsPayPal?:PayPalNamespace}).legendsPayPal;

/** Start the game inside `root` (elements are found by data-lg). Returns a cleanup function. */
export function mountLegendsGame(root:HTMLElement){
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported DOM code; each data-lg element has its own type
const $=(id:string):any=>root.querySelector(`[data-lg="${id}"]`);
const respectsReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const audio=new SynthSound(),confetti=new Confetti($('confetti')),paylines=new PaylineOverlay($('board')),hits=new HitShow($('board')),reelControl:ReelControl={};
// Artists collected on the latest spin get a card flip in the collection panel.
let justFound=new Set<string>();
let userId:string|null=null,loading=true,busy=false,userReducedMotion=respectsReduced.matches;
let badges:string[]=[];
let xp=0,best=0,spinsTaken=0,collection:string[]=[],history:HistoryItem[]=[];
let balance:Balance={welcomeLeft:25,dailyLeft:3,paidSpins:0},activeBoard=createBoard();
// A spin whose answer never arrived is retried with the same key, so the server replays it instead of spending another.
let pendingKey:string|null=null;
let unmounted=false;
let confirmingPayment=false,accountRevision=0;
let paypalButtons:PayPalButtons|null=null;
const pendingOrderKey=(id:string)=>`legends-approved-order:${id}`;
function pendingOrder(){try{return userId?localStorage.getItem(pendingOrderKey(userId)):null;}catch{return null;}}
function storeOrder(orderID:string|null){try{if(userId){if(orderID)localStorage.setItem(pendingOrderKey(userId),orderID);else localStorage.removeItem(pendingOrderKey(userId));}}catch{/* Payment can still complete without browser storage. */}}
const motionButton=$('motion');
// One switch for JS motion and CSS animation, seeded from the OS preference.
function applyMotionPreference(){root.classList.toggle('reduce-motion',userReducedMotion);motionButton.setAttribute('aria-pressed',String(userReducedMotion));motionButton.title=userReducedMotion?'Animations minimized':'Full animations enabled';}
// While reels move the spin button becomes a stop button; it only shortens the animation, never the outcome.
function buttonState(){
  const left=totalSpins(balance);
  $('spin').disabled=confirmingPayment||(busy?!reelControl.skip:loading);
  $('spin-label').textContent=busy?'TAP TO STOP':loading?'LOADING…':!userId?'SPIN THE MIX':left?'SPIN THE MIX':'GET MORE SPINS';
}
function renderCollection(){
  const ids=new Set(collection);
  $('collection').replaceChildren(...ARTISTS.map(a=>{
    const element=document.createElement('div');element.className=`collection-tile${ids.has(a.id)?'':' locked'}${justFound.has(a.id)?' just-found':''}`;element.dataset.label=a.name;element.title=ids.has(a.id)?`${a.name} discovered`:`${a.name} is undiscovered`;
    const img=document.createElement('img');img.src=symbolUrl(a.id);img.alt='';img.loading='lazy';element.append(img);return element;
  }));
  justFound=new Set();
  const count=ARTISTS.length;
  $('collection-count').textContent=`${ids.size} / ${count}`;$('collected').textContent=`${ids.size} / ${count}`;$('found').textContent=`${ids.size}/${count}`;
  $('completion').textContent=`${Math.round(ids.size/count*100)}%`;$('collection-progress').style.width=`${ids.size/count*100}%`;
  $('collection-note').textContent=ids.size===count?'Complete! Every Legend collected.':'Collect every artist portrait as they appear on your reels.';
}
/** Total multiplier from Double and Triple Bonus wins (1 when none landed). */
const multiplierOf=(wins:{type:string;multiplier?:number}[])=>wins.filter(w=>w.type==='multiplier').reduce((m,w)=>m*(w.multiplier??1),1);
function historyLabel(h:HistoryItem){
  const first=h.wins?.find(w=>w.type==='supreme')??h.wins?.[0];if(!first)return 'Spin complete';
  const label=first.type==='supreme'?'SUPREME LEGENDARY':first.type==='unity'?'SPC UNITY':first.type==='bonus'?'713 HOUSTON BONUS':`${first.count}× ${SYMBOL_MAP[first.symbol as string]?.name||'Match'}`;
  const m=multiplierOf(h.wins);return m>1?`${label} • ×${m}`:label;
}
function renderHistory(){const list=$('history');list.replaceChildren();if(!history.length){const el=document.createElement('li');el.textContent='No spins yet. The stage is yours.';list.append(el);return;}
  for(const h of history.slice(0,6)){const el=document.createElement('li');const label=document.createElement('span');label.textContent=historyLabel(h);const gained=document.createElement('strong');gained.textContent=`+${h.xp} XP`;el.append(label,gained);list.append(el);}}
function renderBalance(){
  const pool=activePool(balance);
  $('spins-label').textContent=userId?pool.label:'DEMO SPINS';$('spins').textContent=userId?pool.count:'∞';
  $('shop-paid').textContent=balance.paidSpins?`You have ${balance.paidSpins} paid spin${balance.paidSpins===1?'':'s'}.`:'';
  $('mode').textContent=userId?'Account':'Guest demo';
  $('balance-summary').textContent=userId?`${balance.welcomeLeft} welcome · ${balance.dailyLeft} free today · ${balance.paidSpins} paid · ${totalSpins(balance)} total spins`:'Guest demo · Progress resets when you leave · No account spins spent';
}
function refresh(animateFrom:number|null=null){
  if(animateFrom!==null)animateCounter($('xp'),animateFrom,xp,{reducedMotion:userReducedMotion});else $('xp').textContent=xp.toLocaleString();
  $('best').textContent=best.toLocaleString();$('total-spins').textContent=spinsTaken.toLocaleString();
  renderBalance();renderCollection();renderHistory();buttonState();
  $('supreme-badge').hidden=!badges.includes('supreme-legends');
  $('shop-open').hidden=!userId;
}
/** Restart a one-shot CSS animation class. */
function retrigger(el:HTMLElement,cls:string){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
function setResult(title:string,description:string,kicker='NOW PLAYING'){
  const result=$('result');$('result-title').textContent=title;$('result-desc').textContent=description;result.querySelector('.result-kicker').textContent=kicker;
  result.classList.remove('swap');void result.offsetWidth;result.classList.add('swap');
}
/** Big-win banner and confetti; smaller wins are celebrated by the hit show alone. */
function showWin(gained:number,{isMajor=false,unity=false,supreme=false}={}){
  const modal=$('win-overlay');$('overlay-title').textContent=supreme?'SUPREME LEGENDARY!':unity?'SPC UNITY!':isMajor?'LEGENDARY!':'NICE MIX!';$('overlay-text').textContent=`+${gained.toLocaleString()} VIRTUAL XP`;
  modal.classList.toggle('is-supreme',supreme);
  if(!userReducedMotion){modal.classList.add('visible');confetti.burst({major:isMajor});setTimeout(()=>modal.classList.remove('visible'),isMajor?1400:950);}
}
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

async function spin(){
  if(busy){reelControl.skip?.();return;}
  if(loading)return;
  if(confirmingPayment)return;
  const player=userId;
  if(userId&&totalSpins(balance)<=0){openShop(true);return;}
  busy=true;buttonState();paylines.clear();hits.clear();$('spin').classList.add('is-spinning');
  setResult('CUTTING THE MIX…','Each reel stops in order. Good luck finding your legends!','SPINNING');
  const key=pendingKey??crypto.randomUUID();pendingKey=key;
  try{
    let answer=player?await requestSpin(key):guestSpin(collection);
    // The server allows one spin every 1.2 seconds; a quick tap after "tap to stop" waits and retries the same key.
    if('error' in answer&&answer.error==='cooldown'){await wait(1300);answer=await requestSpin(key);}
    if('error' in answer){
      if(answer.error!=='failed')pendingKey=null;
      if(answer.error==='signed_out'){await loadAccount(null);return;}
      if(answer.error==='no_spins'){if(answer.balance)balance=answer.balance;refresh();setResult('OUT OF SPINS','Grab 25 more spins for $1, or come back tomorrow for 3 free spins (Houston time).','REFILL');openShop(true);return;}
      setResult('SPIN COULD NOT COMPLETE','Check your connection and press spin again. You will not be charged a second spin.','TRY AGAIN');return;
    }
    if(unmounted||userId!==player)return;
    pendingKey=null;
    const target=answer.board,prior=activeBoard,outcome=answer.outcome;
    await animateReels($('reels'),prior,target,{reducedMotion:userReducedMotion,anticipate:anticipationReels(target),control:reelControl,onReady:buttonState,onStop:i=>audio.stop(i),onAnticipate:()=>{audio.tease();setResult('TWO 713s LANDED…','One more 713 anywhere unlocks the Houston bonus.','HOLD UP');}});
    if(unmounted||userId!==player)return;
    const oldXP=xp;
    xp+=outcome.xp;best=Math.max(best,outcome.xp);spinsTaken+=1;activeBoard=target;balance=answer.balance;
    collection=[...new Set([...collection,...answer.newCharacters])];
    history=[{xp:outcome.xp,wins:outcome.wins},...history].slice(0,6);
    const supreme=outcome.wins.some(w=>w.type==='supreme'),unity=outcome.wins.some(w=>w.type==='unity'),isMajor=supreme||unity||outcome.highest>=500;
    if(supreme&&!badges.includes('supreme-legends'))badges.push('supreme-legends');
    justFound=new Set(answer.newCharacters);
    renderBoard($('reels'),target,outcome.hitCells);
    // Lines wait dim while the hit show pops each win in turn, then take over and cycle.
    paylines.show(outcome.wins,{reducedMotion:userReducedMotion,autoCycle:false});
    hits.play(outcome.wins,{reducedMotion:userReducedMotion,big:isMajor,onStep:w=>paylines.focus(w),onDone:()=>{paylines.cycle();if(isMajor)showWin(outcome.xp,{isMajor,unity,supreme});}});
    const fresh=answer.newCharacters.length;
    if(outcome.xp>0){
      floatText($('board'),`+${outcome.xp.toLocaleString()} XP`,{reducedMotion:userReducedMotion});
      if(!userReducedMotion)retrigger($('xp').closest('.hud-block'),'bump');
      const top=outcome.wins.filter(w=>w.type!=='multiplier').sort((a,b)=>b.xp-a.xp)[0],lines=outcome.wins.filter(w=>w.type==='line').length;
      const description=supreme?'Six reels of Legends! 5,000 base XP + Supreme Legendary badge.':unity?'Six distinct SPC artists lined up!':top?.type==='bonus'?'Three or more 713 symbols unlocked the Houston bonus.':top?.type==='line'?`${top.count} ${SYMBOL_MAP[top.symbol as string]?.name||'symbol'} symbols connected.`:'';
      const m=multiplierOf(outcome.wins),boost=m>1?` • ${m===6?'DOUBLE AND TRIPLE BONUS':m===3?'TRIPLE BONUS':'DOUBLE BONUS'} ×${m}`:'';
      setResult(`+${outcome.xp.toLocaleString()} LEGENDS XP`,description+boost+(lines>1?` • ${lines} paylines hit`:'')+(fresh?` • ${fresh} new character${fresh>1?'s':''}!`:''),supreme?'SUPREME LEGENDARY!':m>1?`×${m} MULTIPLIER`:'YOU HIT A MIX');
      audio.win(isMajor);
    }else{
      setResult('KEEP THE MIX GOING',fresh?`${fresh} new legend${fresh>1?'s':''} collected, even without a matching line.`:!userId||totalSpins(balance)?'No payline match on this spin. Spin again!':'No payline match. That was your last spin for now.','SPIN COMPLETE');
    }
    refresh(oldXP);
    if(userId&&!totalSpins(balance))openShop(true);
  }catch(error){console.error('Spin failed:',error);setResult('SPIN COULD NOT COMPLETE','Check your connection and press spin again. You will not be charged a second spin.','TRY AGAIN');renderBoard($('reels'),activeBoard);}
  finally{busy=false;$('spin').classList.remove('is-spinning');buttonState();}
}

// ----- Spin packs: $1 for 25 spins through the site's PayPal account -----
let paypalReady:Promise<boolean>|null=null;
function shopMessage(text:string){$('shop-msg').textContent=text;}
function loadPayPal():Promise<boolean>{
  paypalReady??=(async()=>{
    if(paypalGlobal())return true;
    const clientId=await paypalClientId();if(!clientId)return false;
    return await new Promise<boolean>(resolve=>{
      const script=document.createElement('script');
      script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons`;
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
  $('shop-retry').hidden=true;shopMessage('Confirming your payment…');
  try{
    const paid=await capturePack(orderID);
    if(unmounted||userId!==buyer)return;
    if('error' in paid){
      $('shop-retry').hidden=false;
      shopMessage('Payment is not confirmed yet. Retry confirmation before buying another pack. If you were charged, do not pay again.');
      return;
    }
    storeOrder(null);balance=paid.balance;refresh();
    shopMessage('Payment confirmed. Your paid spin balance is updated.');
    setResult('25 SPINS ADDED','Thanks for supporting the Legends. Spin the mix!','READY');
  }catch{
    if(!unmounted&&userId===buyer){$('shop-retry').hidden=false;shopMessage('Confirmation could not finish. Retry before buying another pack.');}
  }finally{
    confirmingPayment=false;
    if(!unmounted){loading=false;buttonState();}
  }
}
async function openShop(scrollTo=false){
  if(!userId)return;
  $('shop').hidden=false;$('shop-open').setAttribute('aria-expanded','true');
  if(scrollTo)$('shop').scrollIntoView({block:'nearest',behavior:userReducedMotion?'auto':'smooth'});
  if(buttonsShown)return;
  shopMessage('Loading PayPal…');
  if(!(await loadPayPal())){paypalReady=null;shopMessage('PayPal could not load. Check your connection and try again.');return;}
  if(unmounted||buttonsShown)return;
  buttonsShown=true;shopMessage('');
  const paypal=paypalGlobal();if(!paypal){buttonsShown=false;return;}
  paypalButtons=paypal.Buttons({
    style:{layout:'horizontal',color:'gold',shape:'pill',label:'pay',tagline:false,height:42},
    onClick:(_data:unknown,actions:{resolve:()=>void;reject:()=>void})=>{
      if(busy||confirmingPayment||pendingOrder()){shopMessage('Finish your spin or retry payment confirmation before buying another pack.');return actions.reject();}
      if($('shop-age').checked){shopMessage('');return actions.resolve();}
      shopMessage('Please confirm you are 18 or older to buy spins.');return actions.reject();
    },
    createOrder:async()=>{
      const order=await startCheckout();
      if('orderID' in order)return order.orderID;
      shopMessage(order.error==='not_on_sale'?'Spin packs go on sale soon. Your free spins come back every day (Houston time).':order.error==='signed_out'?'Please sign in again to buy spins.':'Checkout could not start. Please try again.');
      throw new Error(order.error);
    },
    onApprove:async(data:{orderID:string})=>confirmPayment(data.orderID),
    onCancel:()=>shopMessage('Checkout cancelled. No spins added.'),
    onError:()=>{if(!$('shop-msg').textContent)shopMessage('PayPal ran into a problem. Check payment confirmation before trying again.');},
  });
  await paypalButtons.render($('shop-paypal')).catch(()=>{buttonsShown=false;shopMessage('PayPal could not load. Please try again.');});
  if(pendingOrder()){$('shop-retry').hidden=false;shopMessage('An approved payment needs confirmation. Retry before buying another pack.');}
}

// ----- Account -----
async function loadAccount(nextUser:string|null){
  const revision=++accountRevision;
  if(nextUser!==userId){
    pendingKey=null;
    void paypalButtons?.close?.().catch(()=>undefined);
    paypalButtons=null;buttonsShown=false;$('shop-paypal').replaceChildren();
    $('shop-retry').hidden=true;
  }
  userId=nextUser;loading=!!nextUser;history=[];
  if(!nextUser){
    xp=0;best=0;spinsTaken=0;collection=[];badges=[];balance={welcomeLeft:0,dailyLeft:0,paidSpins:0};
    $('shop').hidden=true;refresh();
    setResult('THE SOUTH SIDE IS CALLING.','Press SPIN THE MIX to reveal your next lineup.','GUEST DEMO');
    return;
  }
  refresh();
  try{
    const [profile,recent]=await Promise.all([loadProfile(nextUser),loadHistory()]);
    if(unmounted||userId!==nextUser||revision!==accountRevision)return;
    xp=profile.xp;best=profile.best;spinsTaken=profile.totalSpins;collection=profile.collection;badges=profile.badges;balance=profile.balance;history=recent;
    if(profile.lastBoard&&!busy){activeBoard=profile.lastBoard;renderBoard($('reels'),activeBoard);}
    setResult('THE SOUTH SIDE IS CALLING.',totalSpins(balance)?'Press SPIN THE MIX to reveal your next lineup.':'You are out of spins. Grab 25 more for $1 or come back tomorrow.','READY TO ROLL');
    if(!totalSpins(balance))openShop();
    if(pendingOrder()){await openShop();$('shop-retry').hidden=false;}
  }catch(error){
    if(unmounted||userId!==nextUser||revision!==accountRevision)return;
    console.error('Could not load Legends account',error);
    setResult('COULD NOT LOAD YOUR GAME','Refresh the page to try again.','TRY AGAIN');
  }finally{if(!unmounted&&userId===nextUser&&revision===accountRevision){loading=false;refresh();}}
}

/** The library mirrors the symbol sheet: character, special, and music and Houston groups. */
function populateLibrary(){
  const groups:[string,readonly {id:string;name:string;color:string}[]][]=[['lib-characters',ARTISTS],['lib-special',SPECIAL],['lib-music',MUSIC]];
  for(const [slot,symbols] of groups){
    $(slot).replaceChildren(...symbols.map(s=>{
      const div=document.createElement('div');div.className=`library-item${slot==='lib-characters'?' is-char':''}`;div.style.setProperty('--sym',s.color);
      const img=document.createElement('img');img.src=symbolUrl(s.id);img.alt=s.name;img.loading='lazy';
      const title=document.createElement('b');title.textContent=s.name;div.append(img,title);return div;
    }));
  }
}
$('spin').addEventListener('click',spin);
$('shop-retry').addEventListener('click',()=>{const orderID=pendingOrder();if(orderID)void confirmPayment(orderID);});
$('shop-open').addEventListener('click',()=>{if($('shop').hidden)openShop(true);else{$('shop').hidden=true;$('shop-open').setAttribute('aria-expanded','false');}});
$('sound').addEventListener('click',()=>{audio.setEnabled(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound-icon').textContent=audio.enabled?'♫':'♫̸';$('sound').title=audio.enabled?'Mute sound':'Enable sound';if(audio.enabled)audio.tone(523,.14);});
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
  unmounted=true;subscription.unsubscribe();
  void paypalButtons?.close?.().catch(()=>undefined);
  respectsReduced.removeEventListener?.('change',onReducedChange);
  document.removeEventListener('visibilitychange',onVisible);
  reelControl.skip?.();paylines.clear();paylines.resize.disconnect();paylines.svg.remove();hits.clear();hits.layer.remove();
};
}
