import { layersFor } from '@/features/legends/layers';

/** Directory portrait. On hover or keyboard focus, the artist and name plate lift off the background like a game hit. Presentation only. */
export default function ArtistPop({ id, name, src }: { id: string; name: string; src: string }) {
  const l = layersFor(id);
  const alt = `${name} SPC Legends character artwork`;
  if (!l) return <img src={src} alt={alt} width={450} height={450} loading="lazy" className="artist-art" />;
  return (
    <div className="artist-pop" data-slam={l.slam ? '1' : '0'} style={{ ['--split' as string]: l.split }}>
      <div className="ap-clip">
        <img src={l.bg} alt="" aria-hidden="true" loading="lazy" className="ap-bg" />
        <img src={src} alt={alt} width={450} height={450} loading="lazy" className="ap-rest" />
      </div>
      <img src={l.char} alt="" aria-hidden="true" loading="lazy" className="ap-char" />
      <img src={l.plate} alt="" aria-hidden="true" loading="lazy" className="ap-plate" />
    </div>
  );
}
