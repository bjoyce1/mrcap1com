/**
 * The single source of truth for page SEO on mrcap1.com.
 *
 * Each route's title, description, canonical, Open Graph data, H1, a short summary
 * written from the page's own copy, internal links, and JSON-LD live here. The React
 * <SEO> component reads these entries, and the build (vite.config.ts) writes them into
 * a static HTML file per route so crawlers and link previews that don't run JavaScript
 * see the right page. Change copy here, not in the page.
 *
 * Rules (enforced by src/seo/seo.test.ts): titles under 60 characters with " | " between
 * parts, descriptions 140 to 160 characters, no em or en dashes anywhere, and the South
 * Park Coalition role is always "Original Member of the South Park Coalition".
 */
import { liveHistory } from "../content/liveHistory";
import { bookingPageData } from "../content/booking";
import { nftPageData } from "../content/nft";
import { allCities } from "../data/cities";
import { DEFAULT_OG_IMAGE, SAME_AS, SITE_URL, SPC_ROLE, abs } from "./site";
import { HOME_FAQ, HOUSTON_HISTORY_FAQ, SPC_FAQ, TEXAS_UNDERGROUND_FAQ, WHO_IS_FAQ, faqPage } from "./faqs";
import { PERSON_ID, artistNode, breadcrumb, citiesListLd, pastEventsLd, personRef } from "./builders";
import { cleanJson } from "./text";
import type { JsonLdNode, SeoEntry, SeoLink } from "./types";

/* ------------------------------------------------------------------ shared JSON-LD */

const PERSON_FULL: JsonLdNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Mr. CAP",
  alternateName: ["Cornelius A. Pratt", "Mr CAP", "MrCAP"],
  jobTitle: "Rapper, Writer, Technologist",
  description: `Houston-born rapper, ${SPC_ROLE}, and creative technologist bridging hip-hop, business, and blockchain.`,
  url: SITE_URL,
  image: "https://storage.googleapis.com/gpt-engineer-file-uploads/3vqXVX683sa5x368ogLGKowlzHt1/social-images/social-1764555871791-20190110_181251.jpg",
  sameAs: SAME_AS,
  knowsAbout: ["Hip-Hop Music", "Blockchain Technology", "NFTs", "South Park Coalition", "Music Production", "Digital Distribution"],
  memberOf: { "@type": "MusicGroup", name: "South Park Coalition", foundingLocation: { "@type": "Place", name: "Houston, Texas" } },
  address: { "@type": "PostalAddress", addressLocality: "Houston", addressRegion: "TX", addressCountry: "US" },
};

const webPage = (path: string, name: string, description: string): JsonLdNode => ({
  "@type": "WebPage",
  "@id": abs(path),
  url: abs(path),
  name,
  description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: personRef,
});

/** Album and single names on the discography page. Update when src/content/discography.ts changes. */
const DISCOGRAPHY_ALBUMS: [string, string][] = [
  ["The Ties That Bind Us", "2024"],
  ["The Art Of ISM", "2019"],
  ["2 Tha Grave", "2011"],
  ["Tha Cold Ass Pimp", "2006"],
  ["O.N.E. on O.N.E.", "2005"],
];
const DISCOGRAPHY_SINGLES = [
  "Social Media is a Ho Stroll", "Bet'n On Me", "Dippin Thru the Metaverse", "Southern Sounds (Ultra ISM)", "H-Town Represent",
  "Where the Bag At (Extended)", "Limitless", "Today Was A Great Day", "No More Bloodshed", "Capism", "I Ain't F*n With You Devils",
  "Big Navi L.A. Remix", "Unsolved Mysteries, The Single Pt. 1", "I'm Bout To Blow", "2 Minute Flow",
  "Live My Life (We Hustle All Day, We Hustle All Night)", "Cap International", "Pyrex (Egg Beater In Hand)", "Put The Dope Down",
];

/* ------------------------------------------------------------------ links */

const L = {
  music: { href: "/music", label: "Stream the music" },
  newReleases: { href: "/new-releases", label: "New releases" },
  discography: { href: "/mr-cap-discography", label: "Discography" },
  who: { href: "/who-is-mr-cap", label: "Who is Mr. CAP" },
  bio: { href: "/biography", label: "Professional biography" },
  spc: { href: "/south-park-coalition", label: "The South Park Coalition" },
  history: { href: "/houston-hip-hop-history", label: "Houston hip-hop history" },
  texas: { href: "/texas-underground-hip-hop", label: "Texas underground hip-hop" },
  booking: { href: "/booking", label: "Book Mr. CAP" },
  live: { href: "/live", label: "Live shows" },
  press: { href: "/press", label: "Press archive" },
  opk: { href: "/opk", label: "Press kit (OPK)" },
  blog: { href: "/blog", label: "Blog" },
  nft: { href: "/nft", label: "NFT and collector access" },
  merch: { href: "/merch", label: "Official store" },
  artOfIsm: { href: "/art-of-ism", label: "The Art of ISM book" },
  vinyl: { href: "/vinyl", label: "The Art of ISM on vinyl" },
  selfLove: { href: "/self-love", label: "Self Love installation" },
  art: { href: "/art", label: "Art by Mr. CAP" },
  videos: { href: "/videos", label: "Videos" },
  cities: { href: "/cities", label: "Tour cities" },
} satisfies Record<string, SeoLink>;

/* ------------------------------------------------------------------ routes */

type RouteInput = Omit<SeoEntry, "jsonLd"> & { jsonLd?: JsonLdNode[] };
const route = (r: RouteInput): SeoEntry => ({ ...r, jsonLd: r.jsonLd ? cleanJson(r.jsonLd) : undefined });

const ADMIN_SUMMARY = [
  "This area of mrcap1.com is for the Mr. CAP team: sign in to manage the catalog, press, and site settings.",
  "Looking for the music? Head to the music page, the discography, or the live shows instead.",
];
const admin = (path: string, title: string): SeoEntry =>
  route({
    path,
    title,
    description: "Sign in to manage the mrcap1.com catalog, press, and site settings. This area is for the Mr. CAP team; fans can head back to the music and the shows.",
    h1: "Admin Login",
    summary: ADMIN_SUMMARY,
    links: [L.music, L.discography, L.live],
    noIndex: true,
  });

export const ROUTES: SeoEntry[] = [
  route({
    path: "/",
    ogImage: abs("/images/mrcap-hero-bg.webp"),
    ogImageAlt: "Mr. CAP, Houston hip-hop artist",
    title: "Mr. CAP | Houston Rapper | South Park Coalition",
    description: `Official site of Mr. CAP, Houston rapper and ${SPC_ROLE}. New music, the full catalog, live booking, press, and digital art.`,
    h1: "Mr. CAP",
    summary: [
      `Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, writer, and creative entrepreneur from South Park, and an ${SPC_ROLE}, where the ISM was born.`,
      "Three decades deep: the grind years of O.N.E. on O.N.E. and 2 Tha Grave, The Art of ISM distributed by Sony Music / The Orchard, and The Ties That Bind Us, a 19-track album with the whole South Park Coalition.",
      "In 2021 he became the first Houston rapper to sell a hip-hop NFT. Three decades in, still moving first.",
    ],
    links: [L.music, L.newReleases, L.who, L.spc, L.booking, L.opk],
    jsonLd: [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Mr. CAP",
        description: "Official website of Houston hip-hop artist Mr. CAP",
        publisher: { "@id": PERSON_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/blog?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      PERSON_FULL,
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "CAP Distributions",
        alternateName: "Wreckless Entertainment",
        description: "Independent music label and distribution company founded by Mr. CAP.",
        url: SITE_URL,
        founder: { "@id": PERSON_ID },
        foundingLocation: { "@type": "Place", name: "Houston, Texas" },
        areaServed: "US",
        sameAs: SAME_AS,
        contactPoint: { "@type": "ContactPoint", url: abs("/booking"), contactType: "booking" },
      },
      {
        ...artistNode,
        genre: ["Hip-Hop", "Rap", "Underground Hip-Hop", "Houston Rap", "Southern Rap"],
        foundingLocation: { "@type": "Place", name: "Houston, Texas" },
        album: [
          { "@type": "MusicAlbum", name: "The Ties That Bind Us", datePublished: "2024-10-18", byArtist: { "@type": "MusicGroup", name: "South Park Coalition" }, numTracks: 19 },
          { "@type": "MusicAlbum", name: "The Art of ISM", datePublished: "2019", recordLabel: "Sony Music / The Orchard", numTracks: 11 },
          { "@type": "MusicAlbum", name: "2 Tha Grave", datePublished: "2011" },
          { "@type": "MusicAlbum", name: "O.N.E. on O.N.E.", datePublished: "2005" },
        ],
      },
      faqPage(HOME_FAQ),
      breadcrumb(),
    ],
  }),

  route({
    path: "/music",
    title: "Stream Mr. CAP Music | Listen Free | Houston Hip Hop",
    description: "Stream Mr. CAP's full catalog free, direct from the artist: new releases, albums, and singles. Houston hip hop, Southern rap, and underground classics.",
    h1: "Stream Direct. No Middleman.",
    summary: [
      "Three decades of Houston hip hop, straight from the source. Press play and the room comes alive.",
      "Out now: the newest singles from Mr. CAP, plus a house chart of the tracks listeners stream most right here on the site.",
      "The albums are here too, The Art of ISM, The Ties That Bind Us with the South Park Coalition, 2 Tha Grave, Tha Cold Ass Pimp, and O.N.E. on O.N.E., along with every single and feature, year by year.",
    ],
    links: [L.newReleases, L.discography, L.vinyl, L.videos, L.who],
    // the playlist of every track is added from live data (the page at runtime, the build from the catalog)
    jsonLd: [breadcrumb(["Music", "/music"])],
  }),

  route({
    path: "/live",
    title: "Live Shows & Appearances | Mr. CAP",
    description: "Mr. CAP live: three decades of Houston hip-hop shows with the South Park Coalition, the flyers and dates, plus booking for concerts, festivals, and talks.",
    h1: "Live Shows & Booking",
    summary: [
      "Whether it's a packed Houston club or a festival stage in another city, Mr. CAP brings a raw, honest performance, built on decades of experience and a lifetime of stories.",
      "The live history archive collects the flyers that credit Mr. CAP: South Park Coalition anniversaries, Point Blank celebrations, the SPC concert series, and shows with K-Rino, Klondike Kat, and more.",
      "Promoters can book a headline set, a featured appearance, an interview, or a speaking engagement through the official booking form.",
    ],
    links: [L.booking, L.cities, L.spc, L.music],
    jsonLd: [...pastEventsLd(liveHistory), breadcrumb(["Live", "/live"])],
  }),

  route({
    path: "/press",
    title: "Press Archive | Mr. CAP Bios, Photos & Coverage",
    description: "The official Mr. CAP press archive: approved bios, press photos, logos, press releases, and the headlines that documented three decades of Houston hip-hop.",
    h1: "The Record",
    summary: [
      "Approved bios, press photos, logos, and every headline that documented the journey, for journalists, bloggers, and researchers.",
      "This is the official press archive for Mr. CAP, built for journalists, promoters, curators, and anyone researching the catalog, the legacy, and the Houston connection.",
      "Recent releases include Big Boy Drip with Ciddy Boi P, the South Park Coalition single Bet'n On Me, and The Ties That Bind Us, a 19-track SPC group album.",
    ],
    links: [L.opk, { href: "/opk/press", label: "Press kit downloads" }, L.bio, L.newReleases],
    jsonLd: [
      {
        "@type": "ProfilePage",
        name: "Mr. CAP Press Archive",
        url: abs("/press"),
        mainEntity: { ...personRef, alternateName: "Cornelius A. Pratt", sameAs: SAME_AS },
      },
      breadcrumb(["Press", "/press"]),
    ],
  }),

  route({
    path: "/blog",
    title: "Blog | Mr. CAP on Houston Hip-Hop and Ownership",
    description: "Stories, release notes, and essays from Mr. CAP on Houston hip-hop history, the South Park Coalition, independent music, NFTs, and owning your work.",
    h1: "Blog",
    summary: [
      "Insights on Houston hip-hop, music industry success, and blockchain innovation, written from three decades inside the culture.",
      "Recent posts cover the South Park Coalition's independent blueprint, why music NFTs matter to Houston collectors, the making of The Art of ISM, and the story behind Bet'n On Me.",
    ],
    links: [L.history, L.spc, L.press, L.who],
    jsonLd: [breadcrumb(["Blog", "/blog"])],
  }),

  route({
    path: "/cities",
    title: "Tour Cities | Book Mr. CAP in Texas and Louisiana",
    description: "Book Mr. CAP for live hip-hop across Texas and Louisiana, from Houston and Dallas to San Antonio, Austin, and El Paso, with the South Park Coalition legacy.",
    h1: "Tour Cities",
    summary: [
      "Bringing authentic Houston hip-hop and the South Park Coalition legacy to Texas and Louisiana.",
      "Major markets include Houston, Dallas, Fort Worth, San Antonio, Austin, El Paso, Arlington, Corpus Christi, Plano, and Lubbock. Mr. CAP performs nationwide; contact the team for booking in any location.",
    ],
    links: [L.booking, L.live, { href: "/city/houston", label: "Mr. CAP in Houston" }, { href: "/city/dallas", label: "Mr. CAP in Dallas" }],
    jsonLd: [citiesListLd(allCities), breadcrumb(["Cities", "/cities"])],
  }),

  route({
    path: "/nft",
    title: "NFT & Collector Access | Mr. CAP Digital Art",
    description: "Explore Mr. CAP's digital art and music NFTs: verified collections, contract details, and collector-only unlocks from the first Houston rapper to sell one.",
    h1: "NFT & Collector Access",
    summary: [
      "Explore the digital side of the Mr. CAP ecosystem: verified collections, collector utility, and exclusive unlocks tied to ownership.",
      "This page is built for collectors and curious newcomers alike. Browse the public collection, verify the on-chain details, and unlock private content if you hold an official Mr. CAP NFT.",
      "In 2021 Mr. CAP became the first Houston rapper to sell a hip-hop NFT.",
    ],
    links: [L.art, L.artOfIsm, { href: "/panties-on-my-piano", label: "Panties on My Piano, the Web3 release" }, L.music],
    jsonLd: [
      { ...webPage("/nft", "Mr. CAP NFT & Collector Access", nftPageData.intro), mainEntity: { ...personRef, sameAs: ["https://opensea.io/mrcap1/created"] } },
      faqPage(nftPageData.faq),
      breadcrumb(["NFT", "/nft"]),
    ],
  }),

  route({
    path: "/art",
    title: "Self Love | Art Installation by Mr. CAP, 2024-2026",
    description: "Self Love is a living three-year art installation by Houston artist Mr. CAP: character-driven works and symbolic portraits about identity and self-ownership.",
    h1: "Self Love",
    summary: [
      "Self Love is a living, three-year art installation built from original character-driven works, symbolic portraiture, and narrative fragments. It is not a collection in the traditional sense; it is a timeline you step into.",
      "Each year is a new room in the installation, a shift in voice, mood, color, and emotional weight. Together, 2024, 2025, and 2026 form one continuous story about identity, healing, confidence, and self-ownership.",
      "The rooms move from The Awakening, to The Becoming, to The Ownership: self-love as a power source, a standard, and a legacy.",
    ],
    links: [L.selfLove, { href: "/self-love/2024", label: "Room I, 2024: The Awakening" }, L.nft],
    jsonLd: [
      webPage("/art", "Self Love: Art Installation by Mr. CAP", "A living, three-year art installation (2024-2026) built from original character-driven works, symbolic portraiture, and narrative fragments by Houston artist Mr. CAP."),
      {
        "@type": "VisualArtwork",
        name: "Self Love",
        creator: personRef,
        artform: "Installation Art",
        description: "A living, three-year art installation built from original character-driven works, symbolic portraiture, and narrative fragments exploring identity, healing, confidence, and self-ownership.",
        temporalCoverage: "2024/2026",
      },
      breadcrumb(["Art", "/art"]),
    ],
  }),

  route({
    path: "/south-park-coalition",
    title: "South Park Coalition | Houston's Independent Blueprint",
    description: "How the South Park Coalition built Houston's independent hip-hop blueprint: ownership, longevity, and direct-to-fan hustle, told through Mr. CAP's legacy.",
    h1: "South Park Coalition: The Independent Blueprint.",
    summary: [
      "Long before streaming platforms and independent distribution became the norm, the South Park Coalition created a blueprint for artist ownership, longevity, and cultural impact in Houston hip hop.",
      "The coalition emerged from Houston's South Park neighborhood as a collective of artists determined to build their own path. Instead of waiting for record deals, they produced, distributed, and promoted their music independently, keeping full creative control.",
      `Mr. CAP is an ${SPC_ROLE}, and his catalog carries that blueprint forward: own the work, build the audience directly, and outlast the hype.`,
    ],
    links: [L.history, L.texas, L.who, L.discography, L.press],
    jsonLd: [
      {
        "@type": "MusicGroup",
        name: "South Park Coalition",
        foundingLocation: { "@type": "Place", name: "Houston, Texas" },
        genre: ["Hip-Hop", "Southern Hip-Hop"],
        member: { "@type": "OrganizationRole", roleName: "Original Member", member: personRef },
        url: abs("/south-park-coalition"),
        description: "The South Park Coalition is one of the most influential independent hip hop collectives to come out of Houston, Texas.",
      },
      faqPage(SPC_FAQ),
      breadcrumb(["South Park Coalition", "/south-park-coalition"]),
    ],
  }),

  route({
    path: "/texas-underground-hip-hop",
    title: "Texas Underground Hip-Hop | Mr. CAP, Houston Pioneer",
    description: `Texas underground hip-hop explained through Mr. CAP, a Houston pioneer and ${SPC_ROLE}: independent, lyrical, and built to last.`,
    h1: "Texas Underground Hip-Hop",
    summary: [
      `Discover Texas underground hip-hop through Mr. CAP, a Houston pioneer and ${SPC_ROLE}. Real music, independent spirit, 30+ years of authenticity.`,
      "Texas underground hip-hop is the independent rap scene in Texas, particularly Houston, Dallas, and San Antonio: artists who release music on their own labels, without major label support.",
      "It values authenticity, storytelling, and longevity. Artists like Mr. CAP and the South Park Coalition built careers spanning decades by owning their masters, controlling distribution, and staying connected to their communities.",
    ],
    links: [L.spc, L.history, L.discography, L.booking],
    jsonLd: [
      {
        "@type": "Article",
        headline: "Texas Underground Hip-Hop and the Legacy of Mr. CAP",
        author: personRef,
        publisher: { "@type": "Organization", name: "CAP Distributions" },
        mainEntityOfPage: abs("/texas-underground-hip-hop"),
        description: "An inside look at Texas underground hip-hop culture and the role Mr. CAP plays in its legacy.",
      },
      faqPage(TEXAS_UNDERGROUND_FAQ),
      breadcrumb(["Texas Underground Hip-Hop", "/texas-underground-hip-hop"]),
    ],
  }),

  route({
    path: "/houston-hip-hop-history",
    title: "Houston Hip Hop History | South Park Coalition Legacy",
    description: "An inside look at Houston's independent hip-hop history: the South Park Coalition blueprint, the underground hustle, and Mr. CAP's role in the culture.",
    h1: "Houston Hip Hop History: South Park Coalition, Independence & the Legacy of Mr. CAP",
    summary: [
      "Before streaming, before social media, and before major label dominance, Houston built its own hip hop ecosystem: independent, resilient, and rooted in the streets. This is the story from the inside.",
      "While other cities chased major label deals, Houston artists built their own lanes, pressing their own CDs, selling music directly, and creating a culture that didn't depend on outside validation. At the center of that movement was the South Park Coalition.",
      "\"We didn't wait for permission. We pressed our own CDs, drove our own routes, and built our own audience.\"",
    ],
    links: [L.spc, L.texas, L.who, L.music, L.press],
    jsonLd: [
      {
        "@type": "Article",
        headline: "Houston Hip Hop History: South Park Coalition, Independence & the Legacy of Mr. CAP",
        author: personRef,
        publisher: { "@type": "Organization", name: "Mr. CAP", url: SITE_URL },
        datePublished: "2026-03-31",
        dateModified: "2026-03-31",
        description: "An inside look at Houston's independent hip-hop history, the South Park Coalition blueprint, and Mr. CAP's role in shaping the culture.",
        url: abs("/houston-hip-hop-history"),
        mainEntityOfPage: abs("/houston-hip-hop-history"),
        about: [
          { "@type": "Thing", name: "Houston Hip Hop" },
          { "@type": "Thing", name: "South Park Coalition" },
          { "@type": "Thing", name: "Independent Hip Hop" },
        ],
      },
      faqPage(HOUSTON_HISTORY_FAQ),
      breadcrumb(["Houston Hip Hop History", "/houston-hip-hop-history"]),
    ],
  }),

  route({
    path: "/who-is-mr-cap",
    ogImage: abs("/images/spc-mr-cap-studio.jpg"),
    ogImageAlt: "Mr. CAP in the studio, Houston",
    title: "Who Is Mr. CAP? | Houston Rapper and Cultural Architect",
    description: `Who is Mr. CAP? Cornelius A. Pratt: Houston-born rapper, entrepreneur, and ${SPC_ROLE}, with three decades of independent music.`,
    h1: "Who Is Mr. CAP",
    summary: [
      "Three decades of music, ownership, and independent evolution, pressed into vinyl, distributed on-chain, and still built in South Park.",
      "Cornelius A. Pratt is the son of two musicians, raised in Houston's Third Ward and South Park, and shaped by a city that has always demanded proof. Mr. CAP is what happens when that proof gets pressed to record, sold direct, and refuses to expire.",
      `An ${SPC_ROLE}, founder of CAP Distributions, and the first Houston rapper to sell a hip-hop NFT, his principle never changed: own the work.`,
    ],
    links: [L.bio, L.spc, L.discography, L.press, L.booking],
    jsonLd: [
      {
        ...PERSON_FULL,
        url: abs("/who-is-mr-cap"),
        birthPlace: { "@type": "Place", name: "Houston, Texas, USA" },
        jobTitle: ["Rapper", "Entrepreneur", "Founder"],
        owns: { "@type": "Organization", name: "CAP Distributions" },
      },
      faqPage(WHO_IS_FAQ),
      breadcrumb(["Who Is Mr. CAP", "/who-is-mr-cap"]),
    ],
  }),

  route({
    path: "/mr-cap-discography",
    ogImage: abs("/images/covers/album-ties.webp"),
    ogImageAlt: "The Ties That Bind Us album cover",
    title: "Mr. CAP Discography | Albums, Singles & Releases",
    description: "The complete Mr. CAP discography: The Ties That Bind Us, The Art of ISM, 2 Tha Grave, Tha Cold Ass Pimp, and O.N.E. on O.N.E., plus singles and NFT drops.",
    h1: "Mr. CAP Discography",
    summary: [
      "Twenty plus years of Houston hip-hop: albums, singles, mixtapes, and on-chain releases from Mr. CAP and the South Park Coalition.",
      "Mr. CAP's catalog is built on independence, longevity, and Houston perspective. Every release reflects a different chapter of that path, not just songs but milestones.",
      "The latest group album, The Ties That Bind Us, features K-Rino, Point Blank, Klondike Kat, and more, with a slowed-and-chopped version released in January 2025.",
    ],
    links: [L.music, L.newReleases, L.vinyl, L.spc],
    jsonLd: [
      {
        "@type": "MusicPlaylist",
        name: "Mr. CAP Complete Discography",
        url: abs("/mr-cap-discography"),
        numTracks: DISCOGRAPHY_ALBUMS.length + DISCOGRAPHY_SINGLES.length,
        track: [
          ...DISCOGRAPHY_ALBUMS.map(([name, year]) => ({ "@type": "MusicAlbum", name, datePublished: year, byArtist: personRef })),
          ...DISCOGRAPHY_SINGLES.map((name) => ({ "@type": "MusicRecording", name, byArtist: personRef })),
        ],
      },
      breadcrumb(["Discography", "/mr-cap-discography"]),
    ],
  }),

  route({
    path: "/booking",
    title: "Book Mr. CAP | Shows, Features & Speaking",
    description: "Book Mr. CAP for concerts, festivals, guest verses, interviews, and speaking engagements. Three decades of Houston hip-hop, booked straight with his team.",
    h1: "Bring the ISM to Your Stage.",
    summary: [
      "Three decades of Houston hip-hop, live and direct. Concerts, festivals, features, and speaking engagements, booked straight with the artist's team.",
      `Mr. CAP is a Houston-born rapper, ${SPC_ROLE}, author, and entrepreneur with more than 30 years on stage and on record. Promoters, programmers, and media get a professional who shows up prepared, delivers, and makes the event easy.`,
      "Options include a full headline set or featured appearance, custom verses and features, press and podcast interviews, and talks on ownership, independence, and Houston culture.",
    ],
    links: [L.live, L.cities, { href: "/opk/music", label: "Booking press kit" }, L.music],
    jsonLd: [
      {
        "@type": "ProfilePage",
        name: "Book Mr. CAP",
        url: abs("/booking"),
        mainEntity: {
          ...personRef,
          alternateName: "Cornelius A. Pratt",
          description: `Houston hip-hop artist, ${SPC_ROLE}, and entrepreneur`,
          sameAs: SAME_AS,
        },
      },
      faqPage(bookingPageData.faq),
      breadcrumb(["Booking", "/booking"]),
    ],
  }),

  route({
    path: "/links",
    title: "Links | Mr. CAP Music, Merch, Shows & More",
    description: "Every official Mr. CAP link in one place: the latest music, show booking, Trap University merch, the NFT gallery, the press kit, discography, and TikTok.",
    h1: "Mr. CAP",
    summary: [
      `Quick links to Mr. CAP's music, merch, shows, and more, from the Houston hip-hop artist and ${SPC_ROLE}.`,
      "Start with the latest music, book a show, shop Trap University merch, browse the NFT art gallery, open the press kit, or explore the discography.",
    ],
    links: [L.newReleases, L.booking, L.merch, L.nft, L.opk, L.discography, { href: "/tiktok", label: "TikTok feed" }],
    jsonLd: [{ ...personRef, url: abs("/links"), image: PERSON_FULL.image, sameAs: SAME_AS }],
  }),

  route({
    path: "/biography",
    title: "Biography | Cornelius A. Pratt, Mr. CAP",
    description: "The professional biography of Cornelius 'Mr. CAP' Pratt, a Houston artist, entrepreneur, and technologist working across music, media, and digital innovation.",
    h1: "Cornelius 'Mr. CAP' Pratt",
    summary: [
      "Houston-based artist, entrepreneur, technologist, and creative strategist whose work bridges music, media, technology, and digital innovation.",
      "Born in Houston and raised in the city's historic Third Ward, Cornelius A. Pratt is the son of two musicians. He began performing at eight, graduated from Jack Yates Senior High School, and performed early on with his rap group The Raise Up Posse.",
      `An ${SPC_ROLE}, he released his debut album 2 Tha Grave on April 5, 2011, founded CAP Distributions to help independent artists distribute globally, and later built Mortuary Media LLC and the Capicoin (CCHX) blockchain project.`,
    ],
    links: [L.who, L.discography, L.opk, L.spc],
    jsonLd: [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Cornelius A. Pratt",
        alternateName: "Mr. CAP",
        description: "Houston-based artist, entrepreneur, technologist, and creative strategist whose work bridges music, media, technology, and digital innovation.",
        url: abs("/biography"),
        sameAs: SAME_AS,
        birthPlace: { "@type": "Place", name: "Houston, Texas" },
        alumniOf: { "@type": "EducationalOrganization", name: "Jack Yates Senior High School" },
        memberOf: { "@type": "MusicGroup", name: "South Park Coalition" },
        knowsAbout: ["Hip-Hop Music", "Blockchain Technology", "Digital Distribution", "Creative Entrepreneurship", "NFT Art"],
        brand: [
          { "@type": "Organization", name: "CAP Distributions" },
          { "@type": "Organization", name: "Mortuary Media LLC" },
        ],
      },
      breadcrumb(["Biography", "/biography"]),
    ],
  }),

  route({
    path: "/new-releases",
    title: "New Releases | Latest Music from Mr. CAP",
    description: "The official release hub for the newest music, stories, and visuals from Mr. CAP. Stream the latest singles and albums, where every drop lands first.",
    h1: "New Releases",
    summary: [
      "The official release hub for the newest music, stories, and visuals from Mr. CAP. Every drop lives here first.",
      "Stream the newest official release, explore the story behind the music, and catch up on recent singles like Bet On Her, Big Boy Drip, Put The Dope Down, and Panties on My Piano.",
    ],
    links: [L.music, L.discography, L.press, L.videos],
    jsonLd: [
      { "@type": "CollectionPage", name: "New Releases | Mr. CAP", url: abs("/new-releases"), description: "The official release hub for the newest music, stories, and visuals from Mr. CAP.", isPartOf: { "@id": `${SITE_URL}/#website` } },
      breadcrumb(["New Releases", "/new-releases"]),
    ],
  }),

  route({
    path: "/videos",
    title: "Videos | Mr. CAP Music Videos, Promos & Interviews",
    description: "Watch official Mr. CAP music videos, lyric videos, promos, interviews, and behind-the-scenes clips: the visual side of the ISM, straight from Houston.",
    h1: "The Screening Room",
    summary: [
      "Official music videos, promos, interviews, and behind-the-scenes clips: the visual side of the ISM.",
      "The archive includes Limitless with K-Rino, Enough Is Enough featuring Jhiame Sinatra, Nothing Without It, and features like B Where U R with Da Homie and King Prez.",
    ],
    links: [L.music, { href: "/tiktok", label: "TikTok feed" }, L.newReleases],
    jsonLd: [
      { "@type": "CollectionPage", name: "Mr. CAP Videos", url: abs("/videos"), about: personRef },
      breadcrumb(["Videos", "/videos"]),
    ],
  }),

  route({
    path: "/panties-on-my-piano",
    ogImage: abs("/images/covers/pomp-standard.webp"),
    ogImageAlt: "Panties on My Piano cover art",
    title: "Panties on My Piano | Mr. CAP ft. Ciddi Boy P",
    description: "Panties on My Piano by Mr. CAP featuring Ciddi Boy P: a Web3 release with limited NFT editions, an interactive AI studio, and the story behind the song.",
    h1: "Panties on My Piano",
    summary: [
      "A Web3 music release experience: limited NFT editions and an interactive AI studio. Mint any edition to unlock high-res downloads, stems, exclusive AI conversations, and whitelist access to future drops.",
      "The song was born in a late-night studio session where luxury met raw Houston energy. Mr. CAP paired a grand piano melody with Ciddi Boy P's signature vocal style to blur the line between elegance and trap.",
      "Under the playful surface it's a statement about controlling the narrative, setting the mood, and owning the room.",
    ],
    links: [L.nft, L.music, L.newReleases],
    jsonLd: [
      {
        "@type": "MusicRecording",
        name: "Panties on My Piano",
        byArtist: { "@type": "MusicGroup", name: "Mr. CAP" },
        duration: "PT3M30S",
        url: abs("/panties-on-my-piano"),
        image: abs("/images/covers/pomp-standard.webp"),
      },
      {
        "@type": "Offer",
        name: "Standard Edition NFT",
        priceCurrency: "ETH",
        availability: "https://schema.org/PreOrder",
        itemOffered: { "@type": "CreativeWork", name: "Panties on My Piano: Standard Edition NFT" },
      },
    ],
  }),

  route({
    path: "/bet-on-her",
    title: "Bet On Her | Mr. CAP ft. Billy Cook",
    description: "Bet On Her by Mr. CAP featuring Billy Cook: a high-stakes Houston hip-hop anthem with Las Vegas energy, plus an exclusive NFT drop with artist Ali Sabet.",
    h1: "Bet On Her",
    ogImage: "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/bet-on-her/Bet%20On%20Her%20(cover%20art).png",
    summary: [
      "Bet On Her is a high-stakes anthem about recognizing real value in a world full of illusions. Inspired by the energy of Las Vegas, Mr. CAP flips the concept of gambling into a metaphor for relationships, loyalty, and choosing right, with silky vocals from Houston legend Billy Cook.",
      "With polished production by Ciddy Boi Music, the track stands as both a musical statement and a mindset: invest in what truly matters.",
      "The release comes with an exclusive NFT collaboration with digital artist Ali Sabet, another step in Mr. CAP's work at the intersection of music and blockchain.",
    ],
    links: [L.music, L.newReleases, L.nft],
    jsonLd: [
      {
        "@type": "MusicRecording",
        name: "Bet On Her",
        byArtist: { "@type": "MusicGroup", name: "Mr. CAP" },
        featuredArtist: { "@type": "MusicGroup", name: "Billy Cook" },
        datePublished: "2026-03-17",
        genre: ["Hip-Hop", "Rap"],
        description: "Bet On Her is a high-stakes hip-hop anthem by Mr. CAP featuring Billy Cook, blending luxury Vegas vibes with themes of loyalty and value.",
        image: "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/bet-on-her/Bet%20On%20Her%20(cover%20art).png",
        url: abs("/bet-on-her"),
        publisher: { "@type": "Organization", name: "Ciddy Boi Music" },
        offers: { "@type": "Offer", url: abs("/bet-on-her"), availability: "https://schema.org/InStock" },
      },
    ],
  }),

  route({
    path: "/art-of-ism",
    title: "The Art of ISM | Interactive Book by Mr. CAP",
    description: "The Art of ISM by Mr. CAP: a code of thought, movement, and mastery. An interactive online book with 11 immersive chapters and exclusive ISM access codes.",
    h1: "The Art of ISM",
    summary: [
      "A philosophy built from experience. Refined through movement. Tested under pressure. This isn't just something you read; it's something you live. It's all ISM.",
      "The Art of ISM is an interactive book experience by Mr. CAP, written as a code of thought, movement, and mastery across 11 immersive chapters, with exclusive ISM codes for readers.",
    ],
    links: [L.vinyl, L.who, L.music],
    jsonLd: [
      {
        "@type": "Book",
        name: "The Art of ISM",
        author: personRef,
        url: "https://theartofism.com",
        description: "A code of thought, movement, and mastery: an interactive online book experience by Mr. CAP.",
        genre: "Philosophy / Self-Development",
        publisher: personRef,
      },
      breadcrumb(["The Art of ISM", "/art-of-ism"]),
    ],
  }),

  route({
    path: "/vinyl",
    title: "The Art of ISM on Vinyl | 12-Inch Record by Mr. CAP",
    description: "Order the official 12-inch vinyl of Mr. CAP's 2019 album The Art of ISM: 11 tracks on two sides, pressed to order and shipped worldwide by Elastic Stage.",
    h1: "The Art of ISM",
    ogType: "product",
    ogImage: abs("/images/art-of-ism-cover.webp"),
    summary: [
      "The 2019 album pressed to a 12-inch record: personal growth, artistic expression, and street knowledge cut into two sides. Features Ms. Cookie, Point Blank, Lil Kano, S.U.C. Jhiame, Oddy D, Movin Maserati, and Desiree McKinny.",
      "Each copy is pressed to order and shipped worldwide by Elastic Stage. Prices and dispatch dates are shown for your country at checkout.",
    ],
    links: [L.artOfIsm, L.music, L.merch],
    jsonLd: [
      {
        "@type": "Product",
        name: "The Art of ISM, 12-inch Vinyl",
        image: abs("/images/art-of-ism-cover.webp"),
        description: "Limited 12-inch vinyl pressing of Mr. CAP's 2019 album The Art of ISM. 11 tracks across two sides, pressed and shipped worldwide.",
        brand: { "@type": "Brand", name: "Mr. CAP" },
        offers: { "@type": "Offer", price: "31.90", priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://elasticstage.com/mrcap/releases/the-art-of-ism-album" },
      },
      { "@type": "MusicAlbum", name: "The Art of ISM", byArtist: { "@type": "MusicGroup", name: "Mr. CAP" }, datePublished: "2019-09-21", numTracks: 11 },
      breadcrumb(["Vinyl", "/vinyl"]),
    ],
  }),

  route({
    path: "/opk",
    ogImage: abs("/images/opk-og-image.jpg"),
    title: "Official Press Kit (OPK) | Mr. CAP",
    description: `The official Online Press Kit for Mr. CAP, Houston hip-hop artist and ${SPC_ROLE}. Choose the music, press, brand, or film kit.`,
    h1: "Mr. CAP: Official OPK",
    summary: [
      `The official Online Press Kit for Mr. CAP, Houston hip-hop artist and proud ${SPC_ROLE}. Select the kit that fits your purpose.`,
      "Music and booking for full sets, features, and festivals. Press and media. Brand partnerships, endorsements, and licensing. Film and speaking: documentaries, music supervision, and keynotes.",
    ],
    links: [
      { href: "/opk/music", label: "Music & booking OPK" },
      { href: "/opk/press", label: "Press & media OPK" },
      { href: "/opk/brands", label: "Brand & partnership OPK" },
      { href: "/opk/media", label: "Film & speaking OPK" },
    ],
    jsonLd: [
      { ...webPage("/opk", "Mr. CAP Official Online Press Kit", `Official Online Press Kit for Mr. CAP, Houston hip-hop artist and ${SPC_ROLE}.`), mainEntity: PERSON_FULL },
      breadcrumb(["OPK", "/opk"]),
    ],
  }),

  route({
    path: "/opk/music",
    ogImage: abs("/images/opk-download.webp"),
    title: "Booking OPK | Mr. CAP Live Hip-Hop Performer",
    description: "Book Mr. CAP for a full set, feature, or festival slot. The music and booking press kit for a Houston hip-hop performer with three decades of stage time.",
    h1: "Mr. CAP",
    summary: [
      `Mr. CAP is a Houston hip-hop artist and proud ${SPC_ROLE}. With deep roots in the Screwed Up Click era, his career represents longevity, independence, and authenticity.`,
      "This kit covers the artist snapshot, booking bio, music highlights, live performance details, and downloadable materials for promoters.",
    ],
    links: [L.booking, L.live, L.opk],
    jsonLd: [webPage("/opk/music", "Mr. CAP Booking OPK", "Booking press kit for Mr. CAP, Houston hip-hop performer."), breadcrumb(["OPK", "/opk"], ["Music", "/opk/music"])],
  }),

  route({
    path: "/opk/press",
    ogImage: abs("/images/opk-download.webp"),
    title: "Press Kit | Mr. CAP Bio, Photos & Interviews",
    description: "The official Mr. CAP press kit: press bio, highlights, photos, and logos. Download media assets or request an interview with the Houston hip-hop artist.",
    h1: "Houston Hip-Hop Legacy, Built to Last",
    summary: [
      `Mr. CAP is a Houston-based hip-hop artist whose career reflects the evolution of Southern rap culture. As an ${SPC_ROLE}, he emerged from the same creative ecosystem that helped define Houston's influence on hip-hop worldwide.`,
      "Beyond music, Mr. CAP has expanded into media, film, and digital innovation. He contributed music and perspective to the documentary The Life: Sex Trafficking and Modern-Day Slavery.",
      "In 2021, Mr. CAP became the first Houston rapper to sell a hip-hop NFT, a milestone at the intersection of music and blockchain culture.",
    ],
    links: [L.press, L.bio, L.opk],
    jsonLd: [
      {
        ...webPage("/opk/press", "Mr. CAP Press Kit", "Official press kit for Mr. CAP with bio, photos, and media assets."),
        mainEntity: { ...personRef, description: `Houston-based hip-hop artist and ${SPC_ROLE}.`, award: "First Houston rapper to sell a hip-hop NFT", memberOf: { "@type": "MusicGroup", name: "South Park Coalition" } },
      },
      breadcrumb(["OPK", "/opk"], ["Press", "/opk/press"]),
    ],
  }),

  route({
    path: "/opk/brands",
    ogImage: abs("/images/opk-og-image.jpg"),
    title: "Brand Partnerships | Mr. CAP OPK",
    description: "Partner with Mr. CAP on endorsements, campaigns, music placement, and digital collaborations: authentic Houston hip-hop credibility for brands with substance.",
    h1: "Culture. Credibility. Forward Motion.",
    summary: [
      "Mr. CAP represents authenticity, independence, and longevity. His career bridges legacy hip-hop culture with modern digital entrepreneurship, a strong fit for brands seeking real cultural alignment, not manufactured influence.",
      "Partnership options include sponsored content, brand storytelling, event partnerships, music placement, and digital and NFT-based collaborations.",
    ],
    links: [L.opk, L.booking, L.nft],
    jsonLd: [webPage("/opk/brands", "Mr. CAP Brand Partnership OPK", "Brand partnership press kit for Mr. CAP."), breadcrumb(["OPK", "/opk"], ["Brands", "/opk/brands"])],
  }),

  route({
    path: "/opk/media",
    ogImage: abs("/images/opk-og-image.jpg"),
    title: "Film & Speaking OPK | Mr. CAP",
    description: "Book Mr. CAP for film projects, music supervision, documentaries, keynotes, and panels: an independent voice in music, media, and culture from Houston.",
    h1: "Independent Voice in Music, Media & Culture",
    summary: [
      "Mr. CAP's career extends beyond music into film, media, and cultural commentary. As a contributor to The Life: Sex Trafficking and Modern-Day Slavery, he brings perspective shaped by lived experience and artistic discipline.",
      "As hip-hop continues to intersect with technology and entrepreneurship, Mr. CAP stands as an example of evolution without erasure: keeping cultural roots while embracing future platforms.",
    ],
    links: [L.opk, L.booking, L.bio],
    jsonLd: [webPage("/opk/media", "Mr. CAP Film & Speaking OPK", "Film, media, and speaking press kit for Mr. CAP."), breadcrumb(["OPK", "/opk"], ["Film & Speaking", "/opk/media"])],
  }),

  route({
    path: "/self-love",
    title: "Self Love | An Art Installation by Mr. CAP",
    description: "Self Love, an art installation by Mr. CAP running from 2024 to 2026: three rooms and one continuous story about self-discovery, healing, and self-acceptance.",
    h1: "Self Love: An Art Installation by Mr. CAP (2024-2026)",
    summary: [
      "Three rooms. One continuous story. Character-driven works, symbolic portraiture, and narrative fragments exploring the journey of self-discovery and self-acceptance.",
      "Curator's note: \"Self Love is a visual language built from symbols, names, and lived emotional codes. Every piece is a chapter. Every chapter is a mirror.\"",
      "Room I, 2024: The Awakening is open now. Room II, The Becoming, and Room III, The Ownership, follow in 2025 and 2026.",
    ],
    links: [{ href: "/self-love/2024", label: "Room I, 2024: The Awakening" }, L.art, L.nft],
    jsonLd: [
      webPage("/self-love", "Self Love: An Art Installation by Mr. CAP", "A three-room art installation by Mr. CAP, 2024 to 2026."),
      { "@type": "VisualArtwork", name: "Self Love", creator: personRef, artform: "Installation Art", temporalCoverage: "2024/2026" },
      breadcrumb(["Self Love", "/self-love"]),
    ],
  }),

  route({
    path: "/self-love/2024",
    title: "2024: The Awakening | Self Love by Mr. CAP",
    description: "Room I of the Self Love art installation by Mr. CAP. Step into 2024, The Awakening, and choose a story: The Heart Within or The Mirror of Truth.",
    h1: "2024: The Awakening",
    summary: [
      "Enter the first room of the installation. Select a story to step into the work.",
      "The Heart Within: a creative soul turns pain into a mural, and discovers love starts from within. The Mirror of Truth: an old cracked mirror becomes the spark, and a mural becomes the truth.",
    ],
    links: [{ href: "/self-love/2024/amara", label: "The Heart Within" }, L.selfLove, L.art],
    jsonLd: [webPage("/self-love/2024", "2024: The Awakening", "Room I of the Self Love art installation by Mr. CAP."), breadcrumb(["Self Love", "/self-love"], ["2024: The Awakening", "/self-love/2024"])],
  }),

  route({
    path: "/self-love/2025",
    title: "2025: The Becoming | Self Love by Mr. CAP",
    description: "Room II of the Self Love art installation by Mr. CAP, 2025: The Becoming, about growth, boundaries, and voice. This room is coming soon; Room I is open now.",
    h1: "2025: The Becoming",
    summary: [
      "Room II of the Self Love installation: growth, boundaries, and voice. Here, Self Love becomes active, not a feeling but a decision.",
      "This room is coming soon. Room I, 2024: The Awakening, is open now.",
    ],
    links: [{ href: "/self-love/2024", label: "Room I, 2024: The Awakening" }, L.selfLove],
    noIndex: true,
  }),

  route({
    path: "/self-love/2026",
    title: "2026: The Ownership | Self Love by Mr. CAP",
    description: "Room III of the Self Love art installation by Mr. CAP, 2026: The Ownership, about mastery, permanence, and legacy. Coming soon; Room I is open now.",
    h1: "2026: The Ownership",
    summary: [
      "Room III of the Self Love installation represents arrival. Not perfection, ownership: self-love as a power source, a standard, and a legacy.",
      "This room is coming soon. Room I, 2024: The Awakening, is open now.",
    ],
    links: [{ href: "/self-love/2024", label: "Room I, 2024: The Awakening" }, L.selfLove],
    noIndex: true,
  }),

  route({
    path: "/merch",
    title: "Official Store | Mr. CAP and Trap University",
    description: "Shop the official Mr. CAP store, home of Trap University streetwear: jerseys, hoodies, caps, slides, and tees in limited drops designed for the culture.",
    h1: "Official Store",
    summary: [
      "Exclusive streetwear designed for the culture. Limited drops, unlimited drip.",
      "The store is home to Trap University: the SPC basketball jersey, the TrapU football jersey, dad caps, slides, crop hoodies, backpacks, and premium heavyweight tees.",
    ],
    links: [L.vinyl, L.music, L.nft],
    jsonLd: [
      { "@type": "Store", name: "Mr. CAP Official Store", url: abs("/merch"), brand: [{ "@type": "Brand", name: "Trap University" }], parentOrganization: personRef },
      breadcrumb(["Store", "/merch"]),
    ],
  }),

  route({
    path: "/tiktok",
    title: "Mr. CAP on TikTok | Latest Videos and Live Feed",
    description: "Watch Mr. CAP's latest TikTok videos in a live feed from @mrcapism, plus a caption generator for stitches and duets. Rapper, songwriter, 30+ in the game.",
    h1: "Mr. CAP",
    summary: [
      "The latest TikTok videos from @mrcapism, pulled into one live feed: new music, studio moments, and everyday Houston.",
      "Rapper, songwriter, and recording artist with 30+ years in the game. Use the caption generator to stitch, duet, and tag.",
    ],
    links: [L.videos, L.music, L.newReleases],
    jsonLd: [{ ...webPage("/tiktok", "Mr. CAP on TikTok", "The latest TikTok videos from @mrcapism."), sameAs: ["https://www.tiktok.com/@mrcapism"] }, breadcrumb(["TikTok", "/tiktok"])],
  }),

  route({
    path: "/privacy",
    title: "Privacy Policy | Mr. CAP",
    description: "How mrcap1.com collects, uses, and protects your information: Google Analytics, essential cookies, booking and newsletter form data, and your privacy rights.",
    h1: "Privacy Policy",
    summary: [
      "This privacy policy explains how mrcap1.com collects, uses, and protects information when you visit the site.",
      "The site uses Google Analytics for anonymized visit data and essential cookies, stores booking and newsletter submissions only to answer your request, and never sells your information.",
    ],
    links: [L.booking],
    noIndex: true,
    jsonLd: [{ "@type": "WebPage", name: "Privacy Policy", url: abs("/privacy"), isPartOf: { "@id": `${SITE_URL}/#website` } }],
  }),

  route({
    path: "/unsubscribe",
    title: "Unsubscribe | Mr. CAP",
    description: "Stop emails from Mr. CAP and mrcap1.com. Use the link in any email to leave the early access list, and rejoin anytime from the music page on the site.",
    h1: "Unsubscribe",
    summary: [
      "Use the unsubscribe link in any email from Mr. CAP to stop receiving them. The address is removed from the early access list right away.",
      "Changed your mind? Rejoin the early access list anytime from the music page and new songs will reach you before they hit Spotify and Apple Music.",
    ],
    links: [L.music],
    noIndex: true,
    jsonLd: [{ "@type": "WebPage", name: "Unsubscribe", url: abs("/unsubscribe"), isPartOf: { "@id": `${SITE_URL}/#website` } }],
  }),

  route({
    path: "/api/docs",
    title: "API Docs | Mr. CAP Catalog API",
    description: "Developer documentation for the Mr. CAP API v1: one JSON API for the whole catalog, including music, press, blog, merch, NFTs, and events, with rate limits.",
    h1: "Mr. CAP API v1",
    summary: [
      "One JSON API for the entire Mr. CAP catalog: music, press, blog, merch, NFTs, and events.",
      "Keys come from the admin panel. The default limit is 60 requests a minute per key, and higher limits are available on request.",
    ],
    links: [L.music],
    noIndex: true,
  }),

  admin("/auth", "Admin Login | Mr. CAP"),
  admin("/admin", "Admin | Mr. CAP"),
  admin("/admin/library", "Admin Library | Mr. CAP"),
  admin("/admin/roadmap", "Admin Roadmap | Mr. CAP"),
  admin("/admin/api", "Admin API Keys | Mr. CAP"),
  admin("/library", "Library | Mr. CAP"),
];

/**
 * Old or alternate addresses that the app redirects. The build writes the target's page at
 * each of these (with the target's canonical) so crawlers that don't run JavaScript still
 * land on the right content.
 */
export const ALIASES: Record<string, string> = {
  "/intro": "/",
  "/about": "/who-is-mr-cap",
  "/houston-rapper-mr-cap": "/who-is-mr-cap",
  "/innovation": "/who-is-mr-cap",
  "/legacy": "/who-is-mr-cap",
  "/press-kit": "/opk",
  "/for-media": "/opk",
  "/discography": "/mr-cap-discography",
  "/listen": "/music",
  "/south-park-coalition-houston": "/south-park-coalition",
  "/epk": "/press",
  "/digital-art": "/nft",
  "/tour": "/live",
  "/art-of-ism-vinyl": "/vinyl",
  "/epk/music": "/opk/music",
  "/epk/press": "/opk/press",
  "/epk/brands": "/opk/brands",
  "/epk/media": "/opk/media",
};

const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

/** The entry for a static route (following aliases). */
export function routeSeo(path: string): SeoEntry {
  const clean = path.replace(/\/+$/, "") || "/";
  const entry = BY_PATH.get(ALIASES[clean] ?? clean);
  if (!entry) throw new Error(`No SEO entry for ${path}; add it to src/seo/routes.ts`);
  return entry;
}

export { DEFAULT_OG_IMAGE };
