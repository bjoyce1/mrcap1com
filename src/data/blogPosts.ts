export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  image?: string;
  readTime: string;
  tags: string[];
}

export const blogCategories = [
  "Houston Hip-Hop History",
  "South Park Coalition",
  "Music Industry Playbook",
  "Artist Success",
  "Blockchain & AI",
  "Behind the Music",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "south-park-coalition-history-houston-hip-hop",
    title: "The History of South Park Coalition: Houston's Most Influential Hip-Hop Collective",
    excerpt: "From the streets of South Park to worldwide recognition, the story of how SPC changed Houston hip-hop forever.",
    content: `
## The Birth of a Movement

The South Park Coalition emerged from Houston's South Park neighborhood in the late 1980s, founded by K-Rino. What started as a group of friends passionate about hip-hop would grow into one of the most influential underground collectives in rap history.

## The Original Members

The original lineup included some of the most talented lyricists Houston has ever produced. Mr. CAP joined as one of the founding members, bringing his unique perspective and flow to the collective.

## Impact on Houston Hip-Hop

SPC's influence on Houston's rap scene cannot be overstated. While Rap-A-Lot Records was putting Houston on the mainstream map, SPC was building an underground empire that prioritized lyrical excellence over commercial appeal.

## Legacy

Today, South Park Coalition stands as a testament to what independent hip-hop can achieve. With over 1,000 albums released collectively, the group has built a legacy that continues to inspire new generations of artists.

## The Future

As members like Mr. CAP continue to release new music and embrace new technologies like NFTs and blockchain, SPC proves that authentic hip-hop never dies—it evolves.
    `,
    category: "South Park Coalition",
    date: "2024-11-15",
    author: "Mr. CAP",
    readTime: "8 min",
    tags: ["South Park Coalition", "Houston", "History", "Underground Hip-Hop"],
  },
  {
    slug: "first-houston-rapper-nft-blockchain",
    title: "How I Became the First Houston Rapper to Sell an NFT",
    excerpt: "On February 25, 2021, I made history by minting 'Limitless' on OpenSea. Here's the full story.",
    content: `
## The Beginning

When I first heard about NFTs in late 2020, I immediately saw the potential for independent artists. Blockchain technology offered something we'd been fighting for decades: true ownership and direct connection to fans.

## Why 'Limitless'?

I chose to mint "Limitless" because the song embodies everything I believe about an artist's potential. There are no limits to what we can achieve when we embrace new technology and stay true to our art.

## The Day Everything Changed

February 25, 2021. I minted "Limitless" on OpenSea and became the first Houston rap artist to sell a Hip Hop NFT on the blockchain. The sale was for a four-figure sum, but the significance went far beyond money.

## What It Means for Artists

This wasn't just about me. It was about showing every independent artist that there are new paths to ownership and success. You don't need a major label to build value in your art.

## Looking Forward

Since that day, I've continued to explore how blockchain and AI can empower artists. The future is being built right now, and I'm proud to be part of it.
    `,
    category: "Blockchain & AI",
    date: "2024-10-20",
    author: "Mr. CAP",
    readTime: "6 min",
    tags: ["NFT", "Blockchain", "Web3", "Music Industry", "Innovation"],
  },
  {
    slug: "independent-artist-success-music-industry-2024",
    title: "The Independent Artist Playbook: Building a Career in 2024",
    excerpt: "After 30+ years in the game, here's what I've learned about building a sustainable music career.",
    content: `
## The Game Has Changed

When I started in the late '80s, the music industry looked completely different. Today, independent artists have more opportunities than ever—but also more competition.

## Own Your Masters

This is rule number one. Never sign away ownership of your music unless you absolutely have to. Your catalog is your retirement plan.

## Build Direct Relationships

Social media, email lists, and NFTs allow you to connect directly with fans. Use these tools. Don't rely solely on algorithms.

## Diversify Your Income

Music streaming pays pennies. Think about merchandise, live shows, sync licensing, NFTs, and other revenue streams.

## Stay Consistent

I've been releasing music for over 30 years. Consistency builds legacy. Show up every day, even when it's hard.

## Embrace Technology

From blockchain to AI, new technology offers new opportunities. Don't be afraid to experiment.

## The Long Game

Success in music isn't a sprint—it's a marathon. Focus on building something that lasts.
    `,
    category: "Music Industry Playbook",
    date: "2024-09-10",
    author: "Mr. CAP",
    readTime: "7 min",
    tags: ["Music Business", "Independent Artist", "Career Advice", "Success"],
  },
  {
    slug: "art-of-ism-album-making-story",
    title: "The Making of 'The Art of ISM': Working with Zaytoven and Metro Boomin",
    excerpt: "Behind the scenes of my 2019 album that brought together Houston's underground with Atlanta's hitmakers.",
    content: `
## The Vision

When I started working on "The Art of ISM," I knew I wanted to create something that bridged generations and sounds. Houston's underground meets Atlanta's production powerhouses.

## The Producers

Getting Zaytoven and Metro Boomin on the project was a dream come true. These producers understand how to create beats that knock while leaving room for lyrical artists to shine.

## Recording Process

We recorded over 30 tracks before narrowing it down to the final 11. Each song had to earn its place on the album.

## Standout Tracks

"Words Of ISM" became the breakout single, going viral and introducing a whole new generation to my music. But every track on the album holds a special place.

## Sony Music Partnership

Releasing through Sony Music / The Orchard gave the album the distribution it deserved while allowing me to maintain creative control.

## The Legacy

"The Art of ISM" proved that underground artists can work with major producers and labels without compromising their authenticity.
    `,
    category: "Behind the Music",
    date: "2024-08-05",
    author: "Mr. CAP",
    readTime: "9 min",
    tags: ["The Art of ISM", "Zaytoven", "Metro Boomin", "Album", "Production"],
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};
