// Each Legend's portrait cut into background, character and name plate (scripts/legends-layers.py), so a win can move
// them on their own. Presentation only; outcomes never depend on these.
import manifest from './layers.json';

type Entry={asset:string;dir:string;slam:boolean;split:number};
/** split: where the name plate starts, as a share of the portrait height. slam: false when the plate must stay put. */
export type Layers={bg:string;char:string;plate:string;slam:boolean;split:number};

// Asset ids of the portraits the game shows now. Layers cut from older art would not line up, so they are skipped.
const pointers=import.meta.glob<{asset_id:string}>('../../assets/legends/*-portrait.webp.asset.json',{eager:true,import:'default'});
const current=new Map(Object.entries(pointers).map(([path,p])=>[path.split('/').pop()!.replace('-portrait.webp.asset.json',''),p.asset_id]));

export function layersFor(id:string,entries:Record<string,Entry>=manifest,assets:Map<string,string>=current):Layers|null{
  const e=entries[id];
  if(!e||assets.get(id)!==e.asset)return null;
  const base=`/games/spc-legends/layers/${e.dir}/`;
  return {bg:base+'bg.webp',char:base+'char.webp',plate:base+'plate.webp',slam:e.slam,split:e.split};
}

const ready=new Set<string>(),loading=new Set<string>();
/** Downloads and decodes these Legends' layers in the background. Until all three are ready, wins use the flat pop. */
export function preloadLayers(ids:Iterable<string>){
  for(const id of ids){
    const l=layersFor(id);
    if(!l||ready.has(id)||loading.has(id))continue;
    loading.add(id);
    Promise.all([l.bg,l.char,l.plate].map(src=>{const img=new Image();img.src=src;return img.decode();}))
      .then(()=>{ready.add(id);},()=>{})
      .finally(()=>loading.delete(id));
  }
}
/** The layers when they are loaded and match today's portrait, otherwise null. */
export const layersReady=(id:string)=>ready.has(id)?layersFor(id):null;
