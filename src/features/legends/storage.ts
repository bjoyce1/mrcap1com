import {GAME_CONFIG} from './config';
import {initialState,normalizeState} from './engine';
export function loadState(){
  try {const value=localStorage.getItem(GAME_CONFIG.localStorageKey);return normalizeState(value?JSON.parse(value):initialState());}
  catch{return initialState();}
}
export function saveState(state){try{localStorage.setItem(GAME_CONFIG.localStorageKey,JSON.stringify(state));return true;}catch{return false;}}
