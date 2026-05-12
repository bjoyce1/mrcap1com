import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from "@/components/v2/SectionHeader";
import Rail from "@/components/v2/Rail";
import CoverCard from "@/components/v2/CoverCard";
import MagneticButton from "@/components/v2/MagneticButton";

interface Album {
  slug: string;
  title: string;
  release_year: number | null;
  cover_art_url: string | null;
}

// Static fallback so the rail always renders something (no flash of empty).
const FALLBACK: Album[] = [
  { slug: "the-art-of-ism", title: "The Art of ISM", release_year: 2026, cover_art_url: "/images/art-of-ism-cover.jpg" },
  { slug: "the-ties-that-bind-us", title: "The Ties That Bind Us", release_year: 2024, cover_art_url: "/images/covers/album-ties.jpg" },
  { slug: "2-tha-grave", title: "2 Tha Grave", release_year: 2011, cover_art_url: "/images/covers/album-grave.jpg" },
  { slug: "tha-cold-ass-pimp", title: "Tha Cold Ass Pimp", release_year: 2006, cover_art_url: "/images/covers/album-cold-ass-pimp.jpg" },
  { slug: "one-on-one", title: "O.N.E. on O.N.E.", release_year: 2005, cover_art_url: "/images/covers/album-one-on-one.jpg" },
];

export default function ReleasesRail() {
  const [albums, setAlbums] = useState<Album[]>(FALLBACK);

  useEffect(() => {
    let alive = true;
    supabase
      .from("albums")
      .select("slug,title,release_year,cover_art_url")
      .eq("is_public", true)
      .order("release_year", { ascending: false, nullsFirst: false })
      .limit(10)
      .then(({ data }) => {
        if (alive && data && data.length) setAlbums(data as Album[]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="v2-surface-1 py-24 md:py-32 v2-hairline-t v2-hairline-b">
      <div className="px-6 md:px-12 lg:px-20">
        <SectionHeader
          eyebrow="The Catalog"
          title={
            <>
              Releases that built a <em className="v2-display-italic">legacy</em>.
            </>
          }
          action={<MagneticButton variant="ghost" href="/discography">View all →</MagneticButton>}
        />
      </div>
      <Rail>
        {albums.map((a, i) => (
          <CoverCard
            key={a.slug}
            href={`/albums/${a.slug}`}
            image={a.cover_art_url || "/images/mr-cap-coin.png"}
            title={a.title}
            meta={a.release_year ? `${a.release_year} · Album` : "Album"}
            badge={i === 0 ? "Latest" : undefined}
            size="md"
          />
        ))}
      </Rail>
    </section>
  );
}
