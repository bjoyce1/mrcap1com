// Site copy + editorial data, adapted from the live mrcap1.com pages
// (/, /who-is-mr-cap, /south-park-coalition, /live, /booking, /press, /videos, /nft, /art-of-ism, /merch, /blog).

export const SOCIALS = [
  { id: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug' },
  { id: 'apple', label: 'Apple Music', href: 'https://music.apple.com/us/artist/mr-cap/1506719540' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@mrcap1' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mrcapism/' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@mrcapism' },
  { id: 'x', label: 'X', href: 'https://x.com/mrcap1' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/mrcap11' },
];

export const CONTACT = {
  email: 'wrecklessent@gmail.com',
  cashapp: '$CorneliusAPratt',
  zelle: '713-423-5333 (Cap Distributions)',
  bookSpc: 'https://bookspc.com/artists/mr-cap',
};

export const ROLES = [
  ['01', 'Artist', 'Three decades of narrative-driven Southern hip-hop, from cassette-era South Park to global streaming.'],
  ['02', 'South Park Coalition', 'Long-time member of the DIY collective that wrote the independent playbook for Houston.'],
  ['03', 'Entrepreneur', 'Founder of CAP Distributions, Mortuary Media LLC and a creative agency: infrastructure other artists rent.'],
  ['04', 'Cultural Architect', 'Documentary contributor, blockchain pioneer, Capicoin builder, engineering the systems the next era will use.'],
];

export const BLUEPRINT = [
  ['I', 'Own the work', 'Masters, publishing, direct catalog. No landlord.'],
  ['II', 'Build the audience', 'Show by show, tape by tape, city by city. Compound.'],
  ['III', 'Outlast the hype', 'Longevity is the flex. Careers over cycles.'],
];

// Timeline nodes — also drive the golden path in the 3D "Origin" zone
export const TIMELINE = [
  { year: '1987', tag: 'Foundation', title: 'The Foundation', text: 'South Park, Houston. Son of two musicians, on stage at eight years old. Where the ISM was born.' },
  { year: '1990s', tag: 'Coalition', title: 'South Park Coalition', text: 'Joins the collective that codified independence for Houston hip-hop, alongside K-Rino, Klondike Kat and Point Blank.' },
  { year: '2005', tag: 'Catalog', title: 'O.N.E. on O.N.E.', text: 'The grind years. Independent releases that built a catalog and a reputation, one record at a time.' },
  { year: '2006', tag: 'Catalog', title: 'Tha Cold Ass Pimp', text: 'An early solo statement: street realism as literature.' },
  { year: '2011', tag: 'Debut LP', title: '2 Tha Grave', text: 'Loyalty to the streets and the sound. Collaborations across SPC and the Screwed Up Click movement.' },
  { year: '2019', tag: 'Opus', title: 'The Art of ISM', text: 'The statement album, distributed by Sony Music / The Orchard. A philosophy pressed to wax.' },
  { year: '2021', tag: 'First', title: 'First of a Kind', text: 'February 2021: the first Houston rapper to sell a hip-hop NFT. Ownership, on-chain.' },
  { year: '2024', tag: 'Collective', title: 'The Ties That Bind Us', text: 'A grown-man statement with the whole SPC: 19 tracks of honest, unflinching Houston hip-hop.' },
  { year: 'NOW', tag: 'Era', title: 'Legacy in Motion', text: 'The Art of ISM book, new music, Capicoin (CCHX). The story is still being written.' },
];

export const STATS = [
  { n: 30, suffix: '+', label: 'Years in hip-hop' },
  { n: 5, suffix: '', label: 'Albums on record' },
  { n: 63, suffix: '', label: 'Tracks streaming here' },
  { n: 1, suffix: 'st', label: 'Houston hip-hop NFT' },
];

export const GALLERY = [
  { src: '/intro/img/story/childhood.webp', caption: 'Origin · Houston', w: 1, h: 1 },
  { src: '/intro/img/story/spc-origins.webp', caption: 'SPC · Origins', w: 1.5, h: 1 },
  { src: '/intro/img/story/studio.jpg', caption: 'Studio · Houston', w: 1.5, h: 1 },
  { src: '/intro/img/story/vinyl-legacy.webp', caption: 'Vinyl · Legacy', w: 1, h: 1 },
  { src: '/intro/img/story/spc-austin-2025.webp', caption: 'SPC · Austin 2025', w: 0.78, h: 1 },
  { src: '/intro/img/story/houston-skyline.webp', caption: 'H-Town', w: 1.5, h: 1 },
];

export const NFT = {
  collection: 'The Art of ISM (NFT album)',
  chain: 'Ethereum',
  standard: 'ERC-1155',
  contract: '0x495f947276749ce646f68ac8c248420045cb7b5e',
  creator: '0xf69120023756f1d1f539c23ade135efb66e3f494',
  opensea: 'https://opensea.io/mrcap1/created',
  etherscan: 'https://etherscan.io/address/0x495f947276749ce646f68ac8c248420045cb7b5e',
};

export const BOOK = {
  title: 'The Art of ISM',
  kicker: 'A Code of Thought, Movement, and Mastery',
  text: "A philosophy built from experience. Refined through movement. Tested under pressure. This isn't just something you read. It's something you live.",
  features: ['11 immersive chapters', 'Exclusive ISM codes', 'The quote vault', 'Interactive experience'],
  href: 'https://theartofism.com/',
  vinyl: '/vinyl',
};

export const DOCUMENTARY = {
  title: 'The Life: Sex Trafficking and Modern-Day Slavery',
  note: 'PBS documentary · Featured contributor · 2024 Lone Star Emmy nominee',
  text: 'Mr. CAP contributes firsthand perspective, using the platform for community engagement and cultural commentary that reaches well outside the record.',
  href: 'https://www.pbs.org/show/the-life/',
  img: '/intro/img/story/the-life-documentary.webp',
};

export const PRESS = [
  { outlet: 'Houston Press', date: 'Apr 2015', title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP", href: 'https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/' },
  { outlet: 'Houston Press', date: 'Sep 2015', title: 'K-Rino, Point Blank & the SPC Might Still Be Rapping at Warehouse Live Right Now', href: 'https://www.houstonpress.com/music/k-rino-point-blank-and-the-spc-might-still-be-rapping-at-warehouse-live-right-now-7756589/' },
  { outlet: 'Houston Press', date: 'Nov 2014', title: 'Point Blank at Numbers, 11/22/2014', href: 'https://www.houstonpress.com/music/point-blank-at-numbers-11-22-2014-6760363/' },
  { outlet: 'Houston Chronicle', date: 'Apr 2014', title: 'Mr. CAP Returns to His Musical Roots', href: '/press' },
];

export const VIDEOS = [
  { id: 'nojd0u9jBr0', title: 'Limitless ft. K-Rino', kind: 'Official Music Video', len: '3:38', year: 2021 },
  { id: 'VxHenx3r9F4', title: 'Space Aged ISM ft. Desiree McKinney', kind: 'Music Video', len: '3:37', year: 2020 },
  { id: 'eId0L7j4B6c', title: 'Nothing Without It ft. Andre Killian, Jhiame Sinatra & Da Homie', kind: 'Music Video', len: '5:12', year: 2020 },
  { id: 'aLpEsr5KF8I', title: 'Enough Is Enough ft. Jhiame Sinatra', kind: 'Music Video · RIP George Floyd', len: '3:53', year: 2020 },
  { id: 'Zd1uuyF3-u8', title: 'Top Living: Da Homie ft. King Prez & Mr. CAP', kind: 'Feature', len: '3:17', year: 2020 },
  { id: 'p1TMvshzCkc', title: 'B Where U R: Original G-Man of Hip Hop', kind: 'Feature', len: '3:59', year: 2020 },
  { id: 'JFsq-WE5tIo', title: 'Money Mission & Go', kind: 'Promo', len: '2:17', year: 2020 },
  { id: '1s9lTNn2l5Q', title: 'PWA (Power Weed & Alcohol)', kind: 'Drop', len: '1:01', year: 2023 },
  { id: '2s-6lwNxwEA', title: 'Point Blank B-Day Bash', kind: 'Live · K-Rino & Klondike Kat', len: '1:31', year: 2019 },
];

export const SHOWS = [
  { date: 'Dec 13, 2025', venue: 'Flamingo Cantina', city: 'Austin, TX', note: "SPC Live: The Bet'n On Me Tour" },
  { date: 'Oct 2024', venue: 'House of Blues', city: 'Houston, TX' },
  { date: 'Aug 2024', venue: 'Warehouse Live', city: 'Houston, TX' },
  { date: 'Jun 2024', venue: 'Trees', city: 'Dallas, TX' },
  { date: 'Mar 2024', venue: 'Paper Tiger', city: 'San Antonio, TX' },
];

export const BOOKING_TYPES = [
  { value: 'show', label: 'Live Performance', text: 'Full headline set or featured appearance: clubs, festivals, private events. Classic SPC era to current releases.' },
  { value: 'feature', label: 'Verse / Feature', text: 'Custom verses delivered on schedule with professional recording quality. One revision pass included.' },
  { value: 'interview', label: 'Interview / Podcast', text: 'Houston hip-hop history, the SPC, music-business independence. Remote or in person.' },
  { value: 'speaking', label: 'Speaking Engagement', text: 'Ownership, independence and longevity, for schools, conferences and community programs. Includes Q&A.' },
  { value: 'other', label: 'Other', text: '' },
];

export const MERCH = [
  ['SPC Basketball Jersey', 59.99], ['TrapU Football Jersey', 60], ['Trap University Dad Cap', 25],
  ['Trap University Men’s Slides (Black)', 50], ['Trap University Lady Crop Hoodie', 65], ['Trap University Men’s Slides (White + Black)', 50],
  ['Trap University Minimalist Backpack', 50], ['Trap University Heavyweight Tee', 45], ['Trap University Crop Top', 30],
  ['Trap University Crop Top II', 34.99], ['Trap University Crop Top III', 34.99], ['Mr. CAP x Sabet T-Shirt', 79.99],
  ['Mr. CAP x Sabet Sweatshirt', 84.99], ['Trap University Oversized Tee', 34.99], ['Mr. CAP + Sabet Hoodie 2', 99.99],
  ['SPC Logo Organic Bucket Hat', 29.99], ['SPC 1st Click Snapback', 34.99], ['Trap University T-Shirt', 29.5],
  ['Unisex Bomber Jacket', 64.99], ['Men’s Slides', 44.99],
].map(([name, price], i) => ({ name, price, img: `/intro/img/merch/${String(i + 1).padStart(2, '0')}.png` }));

export const STORE_URL = '/merch';

export const JOURNAL = [
  { title: 'Legacy Energy and Building a Digital Empire', cat: 'Music Industry Playbook', date: 'Mar 23, 2026', img: '/intro/img/blog/digital-empire.webp', href: '/blog/the-hustle-doesnt-age-it-evolves-mr-cap-on-legacy-energy-and-building-a-digital-empire' },
  { title: 'Why Music NFTs Will Change the Way You Collect Houston Hip Hop', cat: 'NFT Art & Music', date: 'Mar 19, 2026', img: '/intro/img/blog/music-nfts.webp', href: '/blog/why-music-nfts-will-change-the-way-you-collect-houston-hip-hop' },
  { title: '10 Things You Should Know About the South Park Coalition', cat: 'South Park Coalition', date: 'Mar 15, 2025', img: '/intro/img/blog/spc-10-things.jpg', href: '/blog/10-things-south-park-coalition' },
  { title: "Why 'Bet'n On Me' Is More Than a Song", cat: 'Behind the Music', date: 'Dec 19, 2024', img: '/intro/img/blog/betn-on-me.webp', href: '/blog/why-betn-on-me-is-more-than-a-song' },
  { title: "The Untold Story of Mr. CAP: Houston's Hidden Architect", cat: 'Houston Hip-Hop History', date: '2024', img: '/intro/img/blog/untold-story.webp', href: '/blog/the-untold-story-of-mr-cap' },
  { title: "How Blockchain, NFTs and Hip-Hop Collide", cat: 'Blockchain & AI', date: '2023', img: '/intro/img/blog/blockchain-nfts.webp', href: '/blog/blockchain-nfts-and-hip-hop-mr-cap' },
];

export const MORE_LINKS = [
  ['Full biography', '/who-is-mr-cap'],
  ['South Park Coalition archive', '/south-park-coalition'],
  ['Houston hip-hop history', '/houston-hip-hop-history'],
  ['Press kit (OPK)', '/opk'],
  ['Discography', '/mr-cap-discography'],
  ['Journal', '/blog'],
  ['Privacy policy', '/privacy'],
];
