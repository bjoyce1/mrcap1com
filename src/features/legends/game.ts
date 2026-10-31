// Ported from the SPC Legends source package (src/main.js). Wires the pure engine to the motion layer
// inside one container, so the game can mount and unmount with its React page.
import {ARTISTS,MUSIC,SPECIAL,SYMBOL_MAP,GAME_CONFIG} from './config';
import {createBoard,applySpin,normalizeState,anticipationReels,spinsLeft,onWelcomeSpins} from './engine';
import {loadState,saveState} from './storage';
import {renderBoard,animateReels,animateCounter,Confetti,SynthSound,PaylineOverlay,HitShow,floatText,symbolUrl,type ReelControl} from './motion';

/** Start the game inside `root` (elements are found by data-lg). Returns a cleanup function. */
export function mountLegendsGame(root:HTMLElement){
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported DOM code; each data-lg element has its own type
const $=(id:string):any=>root.querySelector(`[data-lg="${id}"]`);
const respectsReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const audio=new SynthSound(),confetti=new Confetti($('confetti')),paylines=new PaylineOverlay($('board')),hits=new HitShow($('board')),reelControl:ReelControl={};
// Artists collected on the latest spin get a card flip in the collection panel.
let justFound=new Set<string>();
let state=loadState(),activeBoard=state.lastBoard||createBoard(),busy=false,userReducedMotion=respectsReduced.matches;
const motionButton=$('motion');
// One switch for JS motion and CSS animation, seeded from the OS preference.
function applyMotionPreference(){root.classList.toggle('reduce-motion',userReducedMotion);motionButton.setAttribute('aria-pressed',String(userReducedMotion));motionButton.title=userReducedMotion?'Animations minimized':'Full animations enabled';}
// While reels move the spin button becomes a stop button; it only shortens the animation, never the outcome.
function buttonState(){const left=spinsLeft(state);$('spin').disabled=busy?!reelControl.skip:left<=0;$('spin-label').textContent=busy?'TAP TO STOP':left?'SPIN THE MIX':'BACK TOMORROW';}
function renderCollection(){
  const ids=new Set(state.collection);
  $('collection').replaceChildren(...ARTISTS.map(a=>{
    const element=document.createElement('div');element.className=`collection-tile${ids.has(a.id)?'':' locked'}${justFound.has(a.id)?' just-found':''}`;element.dataset.label=a.name;element.title=ids.has(a.id)?`${a.name} discovered`:`${a.name} is undiscovered`;
    const img=document.createElement('img');img.src=symbolUrl(a.id);img.alt='';img.loading='lazy';element.append(img);return element;
  }));
  justFound=new Set();
  $('collection-count').textContent=`${ids.size} / 6`;$('collected').textContent=`${ids.size} / 6`;$('found').textContent=`${ids.size}/6`;
  $('completion').textContent=`${Math.round(ids.size/6*100)}%`;$('collection-progress').style.width=`${ids.size/6*100}%`;
  $('collection-note').textContent=ids.size===6?'Complete! All six Legends collected. The collection badge is yours.':'Collect all six artist portraits as they appear on your reels.';
}
function historyLabel(h){const first=h.wins?.[0];if(!first)return 'Spin complete';if(first.type==='unity')return 'SPC UNITY';if(first.type==='bonus')return '713 HOUSTON BONUS';return `${first.count}× ${SYMBOL_MAP[first.symbol]?.name||'Match'}`;}
function renderHistory(){const list=$('history');list.replaceChildren();if(!state.history.length){const el=document.createElement('li');el.textContent='No spins yet. The stage is yours.';list.append(el);return;}
  for(const h of state.history.slice(0,6)){const el=document.createElement('li');const label=document.createElement('span');label.textContent=historyLabel(h);const xp=document.createElement('strong');xp.textContent=`+${h.xp} XP`;el.append(label,xp);list.append(el);}}
function refresh(animateXP=null){
  state=normalizeState(state);saveState(state);
  $('spins').textContent=spinsLeft(state);
  // The counter shows welcome spins first, then today's free spins.
  $('spins-label').textContent=onWelcomeSpins(state)?'WELCOME SPINS':'SPINS TODAY';
  if(animateXP!==null)animateCounter($('xp'),animateXP,state.xp,{reducedMotion:userReducedMotion});else $('xp').textContent=state.xp.toLocaleString();
  $('best').textContent=state.best.toLocaleString();$('total-spins').textContent=state.totalSpins.toLocaleString();
  renderCollection();renderHistory();buttonState();
}
/** Restart a one-shot CSS animation class. */
function retrigger(el:HTMLElement,cls:string){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
function setResult(title,description,kicker='NOW PLAYING'){
  const result=$('result');$('result-title').textContent=title;$('result-desc').textContent=description;result.querySelector('.result-kicker').textContent=kicker;
  result.classList.remove('swap');void result.offsetWidth;result.classList.add('swap');
}
/** Big-win banner and confetti; smaller wins are celebrated by the hit show alone. */
function showWin(xp,{isMajor=false,unity=false}={}){
  const modal=$('win-overlay');$('overlay-title').textContent=unity?'SPC UNITY!':isMajor?'LEGENDARY!':'NICE MIX!';$('overlay-text').textContent=`+${xp.toLocaleString()} VIRTUAL XP`;
  if(!userReducedMotion){modal.classList.add('visible');confetti.burst({major:isMajor});setTimeout(()=>modal.classList.remove('visible'),isMajor?1400:950);}
}
async function spin(){
  if(busy){reelControl.skip?.();return;}
  state=normalizeState(state);if(spinsLeft(state)<=0){refresh();return;}
  busy=true;buttonState();paylines.clear();hits.clear();$('spin').classList.add('is-spinning');
  setResult('CUTTING THE MIX…','Each reel stops in order. Good luck finding your legends!','SPINNING');
  const target=createBoard(),prior=activeBoard;
  try{
    await animateReels($('reels'),prior,target,{reducedMotion:userReducedMotion,anticipate:anticipationReels(target),control:reelControl,onReady:buttonState,onStop:i=>audio.stop(i),onAnticipate:()=>{audio.tease();setResult('TWO 713s LANDED…','One more 713 anywhere unlocks the Houston bonus.','HOLD UP');}});
    const oldXP=state.xp;
    const {state:next,outcome,newCharacters}=applySpin(state,target);
    state=next;activeBoard=target;saveState(state);
    const unity=outcome.wins.some(w=>w.type==='unity'),isMajor=unity||outcome.highest>=500;
    justFound=new Set(newCharacters);
    renderBoard($('reels'),target,outcome.hitCells);
    // Lines wait dim while the hit show pops each win in turn, then take over and cycle.
    paylines.show(outcome.wins,{reducedMotion:userReducedMotion,autoCycle:false});
    hits.play(outcome.wins,{reducedMotion:userReducedMotion,big:isMajor,onStep:w=>paylines.focus(w),onDone:()=>{paylines.cycle();if(isMajor)showWin(outcome.xp,{isMajor,unity});}});
    if(outcome.xp>0){
      floatText($('board'),`+${outcome.xp.toLocaleString()} XP`,{reducedMotion:userReducedMotion});
      if(!userReducedMotion)retrigger($('xp').closest('.hud-block'),'bump');
      const best=outcome.wins[0],lines=outcome.wins.filter(w=>w.type==='line').length;
      const description=unity?'All six featured SPC artists lined up!':best?.type==='bonus'?'Three or more 713 symbols unlocked the Houston bonus.':best?.type==='line'?`${best.count} ${SYMBOL_MAP[best.symbol]?.name||'symbol'} symbols connected.`:'';
      setResult(`+${outcome.xp.toLocaleString()} LEGENDS XP`,description+(lines>1?` • ${lines} paylines hit`:'')+(newCharacters.length?` • ${newCharacters.length} new character${newCharacters.length>1?'s':''}!`:''),'YOU HIT A MIX');
      audio.win(isMajor);
    }else{
      setResult('KEEP THE MIX GOING',newCharacters.length?`${newCharacters.length} new legend${newCharacters.length>1?'s':''} collected, even without a matching line.`:'No payline match on this spin. Try again tomorrow if you are out of spins.','SPIN COMPLETE');
    }
    refresh(oldXP);
  }catch(error){console.error('Spin failed:',error);setResult('SPIN COULD NOT COMPLETE','Please refresh and try again. No spins were deducted.','TRY AGAIN');renderBoard($('reels'),activeBoard);}
  finally{busy=false;$('spin').classList.remove('is-spinning');buttonState();}
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
$('sound').addEventListener('click',()=>{audio.setEnabled(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound-icon').textContent=audio.enabled?'♫':'♫̸';$('sound').title=audio.enabled?'Mute sound':'Enable sound';if(audio.enabled)audio.tone(523,.14);});
motionButton.addEventListener('click',()=>{userReducedMotion=!userReducedMotion;applyMotionPreference();});
const onReducedChange=e=>{if(e.matches){userReducedMotion=true;applyMotionPreference();}};
const onStorage=event=>{if(event.key===GAME_CONFIG.localStorageKey&&!busy){state=loadState();refresh();}};
// Keep the daily limit aligned to the Houston calendar even if the page stays open overnight.
const onVisible=()=>{if(document.visibilityState==='visible'&&!busy){state=normalizeState(state);refresh();}};
respectsReduced.addEventListener?.('change',onReducedChange);
window.addEventListener('storage',onStorage);
document.addEventListener('visibilitychange',onVisible);
renderBoard($('reels'),activeBoard);populateLibrary();refresh();applyMotionPreference();
return ()=>{
  respectsReduced.removeEventListener?.('change',onReducedChange);
  window.removeEventListener('storage',onStorage);
  document.removeEventListener('visibilitychange',onVisible);
  reelControl.skip?.();paylines.clear();paylines.resize.disconnect();paylines.svg.remove();hits.clear();hits.layer.remove();
};
}
