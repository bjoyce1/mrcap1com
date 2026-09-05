import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Disc3, Package, Truck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import { trackEvent } from "@/components/GoogleAnalytics";

const BUY_URL = "https://elasticstage.com/mrcap/releases/the-art-of-ism-album";
const PRICE = "31.90";

const sideA = [
  { n: 1, title: "16 Letter", credits: "Mr. CAP", time: "3:23" },
  { n: 2, title: "Focus", credits: "Mr. CAP, Oddy D", time: "3:43" },
  { n: 3, title: "International Club Hopper", credits: "Mr. CAP, Ms. Cookie", time: "3:38" },
  { n: 4, title: "How You Feel About It", credits: "Mr. CAP, Movin Maserati", time: "2:59" },
  { n: 5, title: "Words Of ISM", credits: "Mr. CAP", time: "3:30" },
  { n: 6, title: "Let Me Touch It", credits: "Mr. CAP", time: "3:06" },
];

const sideB = [
  { n: 7, title: "Space Age ISM", credits: "Mr. CAP, Desiree McKinny", time: "3:31" },
  { n: 8, title: "The Realest", credits: "Mr. CAP", time: "2:56" },
  { n: 9, title: "For Money", credits: "Mr. CAP, Point Blank, Lil Kano", time: "4:22" },
  { n: 10, title: "Nothing Without It", credits: "Mr. CAP, S.U.C. Jhiame", time: "4:36" },
  { n: 11, title: "Capism", credits: "Mr. CAP", time: "3:15" },
];

const specs = [
  { icon: Disc3, label: 'Format', value: '12" Vinyl' },
  { icon: Package, label: "Pressing", value: "Made to order" },
  { icon: Truck, label: "Ships", value: "Worldwide" },
  { icon: ShieldCheck, label: "Fulfilment", value: "Elastic Stage" },
];

const Eyebrow = ({ index, label }: { index: string; label: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-primary">
      SECTION: {index} // {label}
    </span>
    <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
  </div>
);

const TrackList = ({ side, tracks }: { side: string; tracks: typeof sideA }) => (
  <div>
    <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-primary mb-4">
      Side {side}
    </p>
    <ul className="space-y-1">
      {tracks.map((t) => (
        <li
          key={t.n}
          className="flex items-baseline gap-4 px-4 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
        >
          <span className="font-mono text-xs text-muted-foreground w-6 shrink-0">
            {String(t.n).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm md:text-base text-foreground truncate">{t.title}</p>
            <p className="font-mono text-[0.65rem] tracking-widest uppercase text-muted-foreground truncate">
              {t.credits}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground shrink-0">{t.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Vinyl = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: 'The Art of ISM — 12" Vinyl',
        image: "https://mrcap1.com/images/covers/album-art-of-ism.webp",
        description:
          'Limited 12" vinyl pressing of Mr. CAP\'s 2019 album The Art of ISM. 11 tracks across two sides, pressed and shipped worldwide.',
        brand: { "@type": "Brand", name: "Mr. CAP" },
        offers: {
          "@type": "Offer",
          price: PRICE,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: BUY_URL,
        },
      },
      {
        "@type": "MusicAlbum",
        name: "The Art of ISM",
        byArtist: { "@type": "MusicGroup", name: "Mr. CAP" },
        datePublished: "2019-09-21",
        numTracks: 11,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
          { "@type": "ListItem", position: 2, name: "Vinyl", item: "https://mrcap1.com/vinyl" },
        ],
      },
    ],
  };

  const onBuy = () =>
    trackEvent("begin_checkout", {
      item_name: "The Art of ISM Vinyl",
      value: Number(PRICE),
      currency: "USD",
    });

  return (
    <>
      <SEO
        title='The Art of ISM Vinyl — 12" Record by Mr. CAP'
        description='Order the official 12" vinyl pressing of Mr. CAP&apos;s The Art of ISM. 11 tracks, two sides, pressed to order and shipped worldwide.'
        canonical="https://mrcap1.com/vinyl"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <img
              src={albumArtOfIsm}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-10 blur-2xl scale-110 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-background/80 to-background" />

            <div className="relative container mx-auto px-4 pt-32 pb-16">
              <Eyebrow index="001" label="VINYL PRESSING" />
              <ScrollReveal>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Vinyl + sleeve */}
                  <div className="relative flex justify-center group">
                    <div className="relative w-full max-w-sm">
                      <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-full aspect-square rounded-full bg-[radial-gradient(circle,#111_28%,#000_30%,#1a1a1a_70%)] shadow-[0_20px_60px_hsl(0_0%_0%/0.6)] transition-transform duration-700 group-hover:translate-x-10">
                        <div className="absolute inset-[42%] rounded-full bg-primary/80" />
                      </div>
                      <img
                        src={albumArtOfIsm}
                        alt="The Art of ISM album cover by Mr. CAP"
                        className="relative w-full rounded-sm shadow-[0_24px_70px_hsl(0_0%_0%/0.7)]"
                      />
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="space-y-6">
                    <h1 className="font-display text-4xl md:text-6xl leading-[0.95]">
                      The Art of ISM
                    </h1>
                    <p className="font-mono text-[0.7rem] tracking-[0.25em] uppercase text-muted-foreground">
                      Mr. CAP // 2019 // 11 Tracks // 39 min 4 sec
                    </p>
                    <p className="text-muted-foreground max-w-lg">
                      The 2019 album pressed to a 12" record — personal growth, artistic
                      expression and street knowledge cut into two sides. Features Ms. Cookie,
                      Point Blank, Lil Kano, S.U.C. Jhiame, Oddy D, Movin Maserati and
                      Desiree McKinny.
                    </p>

                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-3xl text-primary">US${PRICE}</span>
                      <span className="font-mono text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                        + shipping
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button size="lg" asChild onClick={onBuy}>
                        <a href={BUY_URL} target="_blank" rel="noopener noreferrer">
                          Order the Vinyl <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/music">Stream the Album</Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
                      {specs.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
                        >
                          <s.icon className="w-4 h-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="font-mono text-[0.6rem] tracking-widest uppercase text-muted-foreground">
                              {s.label}
                            </p>
                            <p className="text-sm truncate">{s.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Tracklist */}
          <section className="container mx-auto px-4 py-16">
            <Eyebrow index="002" label="TRACK LIST" />
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
                <TrackList side="A" tracks={sideA} />
                <TrackList side="B" tracks={sideB} />
              </div>
            </ScrollReveal>
          </section>

          {/* Closing CTA */}
          <section className="container mx-auto px-4 pb-28">
            <Eyebrow index="003" label="ORDER" />
            <ScrollReveal>
              <div className="rounded-2xl bg-white/[0.03] shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] p-8 md:p-12 text-center space-y-5">
                <h2 className="font-display text-2xl md:text-4xl">Own the record</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Each copy is pressed to order and shipped worldwide by Elastic Stage.
                  Prices and dispatch dates are shown for your country at checkout.
                </p>
                <Button size="lg" asChild onClick={onBuy}>
                  <a href={BUY_URL} target="_blank" rel="noopener noreferrer">
                    Order on Elastic Stage <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <p className="font-mono text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                  © 2019 Cornelius A. Pratt // ℗ 2019 Cornelius A. Pratt
                </p>
              </div>
            </ScrollReveal>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Vinyl;
