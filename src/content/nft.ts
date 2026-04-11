export const nftPageData = {
  hero: {
    kicker: "Web3 & Collectors",
    title: "NFT & Collector Access",
    description:
      "Explore the digital side of the Mr. CAP ecosystem — verified collections, collector utility, and exclusive unlocks tied to ownership.",
    ctas: [
      { label: "Connect Wallet", href: "#wallet-connect", variant: "primary" as const },
      { label: "View on OpenSea", href: "https://opensea.io/mrcap1/created", variant: "secondary" as const },
      { label: "Browse Collection", href: "/nft", variant: "ghost" as const },
    ],
  },
  intro:
    "This page is built for collectors and curious newcomers alike. Browse the public collection, verify the on-chain details, and unlock private content if you hold an official Mr. CAP NFT.",
  contract: {
    collection: "The Art of ISM – NFT Album",
    chain: "Ethereum",
    standard: "ERC-1155",
    contractAddress: "0x495f947276749ce646f68ac8c248420045cb7b5e",
    creatorWallet: "0xf69120023756f1d1f539c23ade135efb66e3f494",
    etherscanUrl: "https://etherscan.io/address/0x495f947276749ce646f68ac8c248420045cb7b5e",
    openseaUrl: "https://opensea.io/mrcap1/created",
  },
  unlockCards: [
    { title: "Lossless Audio Download", description: "Full-quality WAV files from the NFT album." },
    { title: "Private Behind-the-Scenes", description: "Exclusive studio footage and process videos." },
    { title: "Collector Merch Access", description: "Token-gated merchandise only for holders." },
  ],
  faq: [
    {
      question: "What is The Art of ISM NFT album by Mr. CAP?",
      answer: "The Art of ISM is Mr. CAP's pioneering NFT album — a verified on-chain collection on Ethereum (ERC-1155) that bridges Houston hip-hop with digital ownership and collector utility.",
    },
    {
      question: "How do NFTs help independent hip-hop artists maintain ownership?",
      answer: "NFTs allow artists like Mr. CAP to sell music and art directly to collectors without intermediaries, preserving full creative and financial control — the same independence model the South Park Coalition pioneered decades ago.",
    },
    {
      question: "How does Mr. CAP use NFTs in music and digital art?",
      answer: "Mr. CAP uses NFTs to release exclusive music, unlock collector-only content, and create verifiable digital art tied to his catalog. His collections are verified on OpenSea and Ethereum.",
    },
    {
      question: "Where can I buy Mr. CAP NFT collections?",
      answer: "Official Mr. CAP NFT collections are available on OpenSea. All verified collections are tied to the creator wallet and contract listed on this page.",
    },
    {
      question: "What makes hip-hop NFTs different from traditional music releases?",
      answer: "Hip-hop NFTs offer verifiable ownership, collector utility like lossless audio and exclusive content, and a direct artist-to-fan relationship that traditional streaming platforms cannot provide.",
    },
  ],
  citation: {
    canonicalUrl: "https://mrcap1.com/nft",
    description:
      "This page is the official source for Mr. CAP NFT references, verified contract details, creator wallet attribution, and collector-only access.",
    links: [
      { label: "Music", href: "/discography" },
      { label: "Press", href: "/press" },
      { label: "Booking", href: "/booking" },
    ],
  },
};
