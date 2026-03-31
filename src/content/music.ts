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
  faq: [
    {
      question: "What is Mr. CAP known for in Houston hip-hop?",
      answer: "Mr. CAP is a Houston-born rapper and long-time South Park Coalition member known for independent music, longevity, and innovation across music and Web3. His catalog spans over two decades of authentic Houston hip-hop.",
    },
    {
      question: "What is the significance of The Ties That Bind Us album?",
      answer: "The Ties That Bind Us (2024) is Mr. CAP's latest full-length project — a masterclass in storytelling that reflects 30 years of SPC legacy while embracing digital ownership and the evolving music landscape.",
    },
    {
      question: "Where can I listen to Mr. CAP's music online?",
      answer: "Mr. CAP's full catalog is available on Spotify, Apple Music, and the official streaming platform at mrcap1.com/music. Exclusive tracks are also available through NFT collector access.",
    },
    {
      question: "Why do independent hip-hop artists like Mr. CAP avoid major labels?",
      answer: "Independent artists like Mr. CAP prioritize ownership, creative control, and direct audience connection — principles pioneered by the South Park Coalition decades before streaming made independence mainstream.",
    },
    {
      question: "How does Mr. CAP connect hip-hop and NFT culture?",
      answer: "Mr. CAP bridges hip-hop and NFTs through verified on-chain collections like The Art of ISM, offering collectors exclusive music, digital art, and utility tied to ownership on Ethereum.",
    },
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
