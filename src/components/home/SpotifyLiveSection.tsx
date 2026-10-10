import { ExternalLink, Music2 } from "lucide-react";

const ARTIST_ID = "69pjfQNXA1xjusnI2wfgug";
const ARTIST_URL = `https://open.spotify.com/artist/${ARTIST_ID}`;

/**
 * Mr. CAP's most played tracks, straight from Spotify's own artist player.
 *
 * This used to call Spotify's Web API through the spotify-artist function, but
 * Spotify now refuses artist data unless the developer account pays for Premium,
 * so the section rendered its heading over nothing. The embed needs no keys,
 * always shows Spotify's current popular tracks, and plays right on the page.
 */
const SpotifyLiveSection = () => (
  <section aria-labelledby="spotify-live-title" className="section-spacing relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Music2 className="w-5 h-5 text-primary" aria-hidden />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live from Spotify</span>
        </div>
        <h2 id="spotify-live-title" className="text-3xl md:text-4xl font-bold text-foreground">
          Most Played Tracks
        </h2>
      </div>

      {/* the card color shows while Spotify's player loads, so the space never reads as empty */}
      <div className="overflow-hidden rounded-xl bg-card">
        <iframe
          title="Mr. CAP's most played tracks on Spotify"
          src={`https://open.spotify.com/embed/artist/${ARTIST_ID}?utm_source=generator&theme=0`}
          width="100%"
          height="452"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block border-0"
        />
      </div>

      <div className="mt-8 text-center">
        <a
          href={ARTIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <Music2 className="w-4 h-4" aria-hidden />
          Follow on Spotify
          <ExternalLink className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </div>
  </section>
);

export default SpotifyLiveSection;
