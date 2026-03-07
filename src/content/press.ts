export interface PressEntry {
  outlet: string;
  title: string;
  author?: string;
  date: string;
  summary: string;
  url?: string;
  slug?: string;
  body?: string;
  relatedRelease?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const pressPageData = {
  hero: {
    kicker: "Press Archive",
    title: "Press & Notable Mentions",
    description:
      "Third-party coverage, archival references, and media documentation tied to Mr. CAP, Houston hip-hop, and the South Park Coalition legacy.",
  },
  intro:
    "This page is the official press archive for Mr. CAP — designed for journalists, promoters, curators, and anyone researching the catalog, the legacy, and the Houston connection.",
  timeline: [
    {
      outlet: "CAP Legacy",
      title: "Mr. CAP Releases \"Bet'n On Me\" as a Statement of Confidence and Legacy",
      slug: "mrcap-releases-betn-on-me",
      author: "ISM",
      date: "2024-09-20",
      summary:
        "Mr. CAP unveils \"Bet'n On Me,\" a bold new release centered on confidence, ambition, and legacy. The single marks a pivotal moment in the CAP Legacy catalog — a declaration of purpose from an artist who has spent decades building independently.",
      url: "/press/mrcap-releases-betn-on-me",
      relatedRelease: "betn-on-me",
      seoTitle: "Mr. CAP Releases \"Bet'n On Me\" | Press",
      seoDescription: "Read the official CAP Legacy press announcement for \"Bet'n On Me\" by Mr. CAP.",
      body: `Houston, TX — Mr. CAP, the Houston-born rapper and original member of the South Park Coalition, has released "Bet'n On Me," a powerful new single that serves as both a personal anthem and a statement of artistic conviction.

The track arrives as part of the CAP Legacy platform's ongoing mission to establish mrcap1.com as the definitive destination for Mr. CAP's music, press, and creative output. "Bet'n On Me" is not just a song — it is a declaration. It captures the spirit of an artist who has spent over three decades betting on himself, building independently, and refusing to compromise his vision.

## A Record Built on Self-Belief

"Bet'n On Me" draws from the well of experience that only comes with longevity. Mr. CAP has navigated every era of hip-hop — from the underground tape circuit to digital streaming to blockchain-powered distribution — and this track reflects that journey. The production is cinematic and deliberate, with lyrics that speak directly to anyone who has ever had to prove their worth on their own terms.

"This song is about what happens when you stop waiting for permission," Mr. CAP explains. "You bet on yourself. That's the whole philosophy."

## The CAP Legacy Platform

The release of "Bet'n On Me" marks a key moment for the CAP Legacy platform. Rather than relying solely on third-party streaming services, Mr. CAP is positioning mrcap1.com as the official release headquarters — complete with dedicated release pages, structured metadata, press coverage, and fan engagement tools.

Each release on the platform includes a full content ecosystem: credits, lyrics, story context, streaming links, and fan capture modules designed to build a direct relationship between artist and audience.

## What's Next

"Bet'n On Me" is the lead single from a broader creative push that includes the South Park Coalition group album "The Ties That Bind Us," new visual content, and continued expansion of the CAP Legacy catalog.

For press inquiries, booking, and media resources, visit mrcap1.com/press or contact wrecklessent@gmail.com.`,
    },
    {
      outlet: "CAP Legacy",
      title: "Inside \"The Ties That Bind Us\": Mr. CAP Expands the CAP Legacy Catalog",
      slug: "inside-the-ties-that-bind-us",
      author: "ISM",
      date: "2024-09-18",
      summary:
        "Mr. CAP continues building his legacy with \"The Ties That Bind Us,\" a 19-track South Park Coalition group album designed to stand as a major chapter in his evolving catalog.",
      url: "/press/inside-the-ties-that-bind-us",
      relatedRelease: "the-ties-that-bind-us",
      seoTitle: "Inside \"The Ties That Bind Us\" | Press | Mr. CAP",
      seoDescription: "Explore the story behind \"The Ties That Bind Us\" and its place in the CAP Legacy catalog.",
      body: `Houston, TX — Mr. CAP and the South Park Coalition have released "The Ties That Bind Us," a 19-track album that stands as one of the most ambitious projects in the collective's storied history. Executive produced by South Park Coalition LLC, the album features contributions from K-Rino, Point Blank, Klondike Kat, and a roster of Houston's most respected underground voices.

## A Major Body of Work

"The Ties That Bind Us" is not a loosie collection or a streaming-era playlist. It is a structured, intentional album — recorded by K-Water, mixed by K-Water, and mastered by Mr. CAP himself. Every track is designed to stand on its own while contributing to a larger narrative about loyalty, Houston identity, and the bonds that hold a coalition together across decades.

The album's lead single, "Bet'n On Me," has already established itself as a standout — a confident, self-assured record that sets the tone for the project's themes of independence and perseverance.

## The Role of CAP Legacy

With the release of this album, Mr. CAP is leveraging the CAP Legacy platform to give "The Ties That Bind Us" the presentation it deserves. The album's dedicated page on mrcap1.com features a complete tracklist, full credits, streaming links, and supporting press content — all structured with metadata and schema markup designed for discoverability.

"Most independent albums get uploaded and forgotten," Mr. CAP notes. "We built a platform so that every release lives in context — connected to press, visuals, and the artist's story. That's what CAP Legacy is for."

## South Park Coalition's Enduring Legacy

The South Park Coalition has been a cornerstone of Houston hip-hop since the early 1990s. Founded in the South Park neighborhood, the collective has produced hundreds of albums and shaped the sound of Texas underground rap. "The Ties That Bind Us" is both a celebration of that history and a statement that the coalition's creative output is far from finished.

## Credits

- Executive Produced by South Park Coalition LLC
- Recorded by K-Water
- Mixed by K-Water
- Mastered by Mr. CAP
- Featuring: K-Rino, Point Blank, Klondike Kat, and more

For press inquiries, booking, and media resources, visit mrcap1.com/press or contact wrecklessent@gmail.com.`,
    },
    {
      outlet: "Houston Chronicle",
      title: "Mr. CAP Returns to His Musical Roots",
      author: "Andrew Dansby",
      date: "2014-04-07",
      summary:
        "A Houston Chronicle profile on Mr. CAP's return to Houston, his musical lineage, and his independent push as a South Park Coalition artist.",
    },
    {
      outlet: "Houston Press",
      title: "Point Blank at Numbers, 11/22/2014",
      author: "Nathan Smith",
      date: "2014-11-24",
      summary:
        "Concert coverage documenting SPC's live ecosystem and Mr. CAP's onstage presence within that movement.",
      url: "https://www.houstonpress.com/music/point-blank-at-numbers-11-22-2014-6760363/",
    },
    {
      outlet: "Houston Press",
      title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
      author: "Nathan Smith",
      date: "2015-04-20",
      summary:
        "A Houston Press piece clarifying identity confusion online while highlighting Mr. CAP's longevity, Houston roots, and name recognition in local hip-hop culture.",
      url: "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/",
    },
    {
      outlet: "Houston Press",
      title: "K-Rino, Point Blank & the SPC Might Still Be Rapping at Warehouse Live Right Now",
      author: "Nathan Smith",
      date: "2015-09-11",
      summary:
        "A Houston Press snapshot of SPC's staying power on Houston stages, with Mr. CAP identified as the evening's master of ceremonies.",
      url: "https://www.houstonpress.com/music/k-rino-point-blank-and-the-spc-might-still-be-rapping-at-warehouse-live-right-now-7756589/",
    },
  ] as PressEntry[],
  infoStrip: {
    label: "Use this page for",
    body: "Bio verification. Press references. Cultural context. Houston legacy. Booking support.",
  },
  mediaKit: {
    body: "Need a short bio, long bio, press-ready photos, or official links? Use the resources below.",
    ctas: [
      { label: "Download EPK", href: "/opk" },
      { label: "Official Links", href: "#official-links" },
      { label: "Book / Inquire", href: "/booking" },
    ],
  },
  citation: {
    canonicalUrl: "https://mrcap1.com/press",
    description:
      "This page is the official press archive and preferred citation source for third-party coverage, media references, and Houston legacy documentation tied to Mr. CAP.",
    links: [
      { label: "Music", href: "/music" },
      { label: "Booking", href: "/booking" },
      { label: "Home", href: "/" },
    ],
  },
};
