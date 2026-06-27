import { Vinyl } from "./Vinyl";
import type { ArchiveAlbum } from "@/content/discography";

interface Props {
  album: ArchiveAlbum;
  onClick?: () => void;
}

export default function ArchiveAlbumCard({ album, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="disco-card group block w-[260px] md:w-[320px] shrink-0 snap-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -top-6 left-1/2 -translate-x-1/2 z-0 font-display text-outline pointer-events-none select-none text-[6rem] md:text-[8rem] leading-none"
        >
          {album.year}
        </div>
        <div className="art-wrap relative aspect-square">
          <Vinyl cover={album.image} />
          <div className="art block w-full h-full">
            <img src={album.image} alt={`${album.title} cover art`} loading="lazy" />
          </div>
        </div>
      </div>

      <h3 className="font-display mt-5 text-lg md:text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
        {album.title}
      </h3>
      <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
        {album.year} · {album.artist}
      </p>
      <p className="mt-1 font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground/70 uppercase line-clamp-1">
        {album.role}
      </p>
    </button>
  );
}
