export const musicPageData = {
  hero: {
    kicker: "Featured Release",
    title: "The Ties That Bind Us",
    description:
      "Start with the record that's out now, then move through the catalog that built the legacy — from The Art of ISM to 2 Tha Grave, O.N.E. on O.N.E., and Cold Ass Pimp.",
    ctas: [
      { label: "Play Now", href: "/album/the-ties-that-bind-us", variant: "primary" as const },
      { label: "Open on Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", variant: "secondary" as const },
      { label: "View Full Catalog", href: "#catalog", variant: "ghost" as const },
    ],
  },
  intro:
    "Music without shortcuts. Legacy without compromise. This page is the official listening hub for Mr. CAP — current releases, core projects, and the records that connect Houston history to the next chapter.",
  startHere: [
    {
      title: "The Ties That Bind Us",
      meta: "2024",
      summary: "The current chapter. Start here for the newest statement.",
      slug: "the-ties-that-bind-us",
      image: "/images/covers/album-ties.jpg",
    },
    {
      title: "The Art of ISM",
      meta: "2019",
      summary: "A sharpened studio album built for replay.",
      slug: "the-art-of-ism",
      image: "/images/art-of-ism-cover.jpg",
    },
    {
      title: "2 Tha Grave",
      meta: "2011",
      summary: "The debut full-length that established the solo catalog.",
      slug: "2-tha-grave",
      image: "/images/covers/album-grave.jpg",
    },
  ],
  catalog: [
    { title: "The Ties That Bind Us", year: "2024", tag: "Current release", summary: "The current chapter. Start here for the newest statement." },
    { title: "The Art of ISM", year: "2019", tag: "Studio album", summary: "A sharpened studio album built for replay." },
    { title: "2 Tha Grave", year: "2011", tag: "Debut album", summary: "The debut full-length that established the solo catalog." },
    { title: "O.N.E. on O.N.E.", year: "2005", tag: "Independent era release", summary: "An early chapter in the independent catalog." },
    { title: "Cold Ass Pimp", year: "2003", tag: "Foundation release", summary: "A foundational release in the timeline." },
  ],
  storyNotes:
    "Mr. CAP's catalog is built on independence, longevity, and Houston perspective. Every release reflects a different chapter of that path — not just songs, but milestones.",
  citation: {
    canonicalUrl: "https://mrcap1.com/music",
    description:
      "Mr. CAP is a Houston-based rapper and long-time member of the South Park Coalition. This page is the official music hub for catalog discovery, citations, and streaming context.",
    links: [
      { label: "Press", href: "/press" },
      { label: "Booking", href: "/booking" },
      { label: "NFT & Collector Access", href: "/nft" },
    ],
  },
  finalCTAs: [
    { label: "Explore NFT & Collector Access", href: "/nft", variant: "secondary" as const },
    { label: "Press & EPK", href: "/press", variant: "secondary" as const },
    { label: "Book Mr. CAP", href: "/booking", variant: "primary" as const },
  ],
};
