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
  "NFT Art & Music",
  "Crypto",
  "Media & Press",
  "Collaborations",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "mr-cap-returns-to-his-musical-roots",
    title: "Mr. CAP Returns to His Musical Roots",
    excerpt: "After years of tech ventures and blockchain innovation, Mr. CAP reconnects with his South Park Coalition origins and the raw Houston sound that launched his career.",
    image: "/images/musical-roots-blog.jpg",
    content: `
## Back to the Beginning

After years of pioneering blockchain technology, NFT releases, and digital innovation, Mr. CAP is returning to what started it all – the raw, unfiltered sound of Houston hip-hop.

## South Park Coalition Legacy

As a founding member of the South Park Coalition, Mr. CAP has always carried the weight of Houston's underground legacy. This return to his musical roots represents a full-circle moment, reconnecting with the streets and sounds that shaped his artistry.

## The Balance of Innovation and Tradition

While Mr. CAP continues to push boundaries in the digital space, he understands the importance of staying connected to his foundation. The South Park Coalition's influence on Houston hip-hop cannot be overstated, and Mr. CAP remains committed to honoring that legacy.

## What's Next

Fans can expect new music that blends the classic Houston sound with modern production techniques. Mr. CAP proves that you can embrace the future while respecting the past.

Stay tuned for upcoming releases that showcase the best of both worlds – innovation rooted in tradition.
    `,
    category: "Behind the Music",
    date: "2024-03-15",
    author: "ISM",
    readTime: "3 min",
    tags: ["South Park Coalition", "Houston", "Hip Hop", "Legacy", "Music"],
  },
  {
    slug: "houston-rapper-lands-major-art-music-collaboration-with-artist-ali-sabet",
    title: "Houston Rapper Lands Major Art-Music Collaboration With Artist Ali Sabet",
    excerpt: "Mr. CAP teams up with internationally renowned visual artist Ali Sabet for 'Sunshade + Bet on Her,' a groundbreaking fusion of fine art and hip-hop featuring Billy Cook.",
    image: "/images/sunshade-sabet-blog.png",
    content: `
## A Groundbreaking Fusion

In 2020, Mr. CAP embarked on a unique creative journey with internationally acclaimed visual artist **Ali Sabet**. The result was **"Sunshade + Bet on Her"** – a groundbreaking project that merges fine art with hip-hop music.

## About Ali Sabet

Ali Sabet is a renowned Iranian-American artist known for his vibrant, expressive portraits and bold use of color. His work has been exhibited in galleries worldwide and collected by celebrities and art enthusiasts alike. This collaboration marks a significant crossover between the visual arts and music worlds.

## The Collaboration

The project pairs Sabet's iconic "Sunshade" artwork with Mr. CAP's track "Bet on Her" featuring Houston R&B legend **Billy Cook**. The combination creates a multi-sensory experience that bridges two creative disciplines.

## Art Meets Music NFT

This collaboration was later minted as an NFT, combining:

- Sabet's original digital artwork
- Mr. CAP's exclusive audio track
- Behind-the-scenes content from both artists

## Breaking Boundaries

The partnership demonstrates Mr. CAP's commitment to pushing boundaries beyond traditional hip-hop. By collaborating with established figures in the art world, he continues to expand the definition of what a hip-hop artist can achieve.

This project stands as a testament to the power of cross-disciplinary collaboration and the endless possibilities when art forms intersect.
    `,
    category: "Collaborations",
    date: "2020-06-15",
    author: "ISM",
    readTime: "3 min",
    tags: ["Ali Sabet", "Art", "Collaboration", "Billy Cook", "NFT", "Sunshade"],
  },
  {
    slug: "mr-cap-stands-tall-with-new-single-soarn",
    title: "Mr. CAP Stands Tall with New Single 'SOAR'N'",
    excerpt: "A hard-hitting single addressing social issues faced by young Black men, balancing pain with pride and reminding listeners that maintaining one's standards is an act of resistance.",
    image: "/images/soarn-blog.webp",
    content: `
## Standards Of A Real One

This post announces **"SOAR'N"** (short for *Standards Of A Real One*), a hard-hitting single produced by **Ciddy Boi Music** with co-production by **Dope-E**.

## Confronting Social Issues

The song confronts social issues faced by young Black men, addressing police brutality, systemic racism and everyday survival. Mr. CAP's lyrics balance pain with pride, reminding listeners that maintaining one's standards is an act of resistance.

## Release and Distribution

The release date was set for **1 August 2023** and the track is available on major platforms alongside an NFT edition. Each digital token includes:

- The song
- A lyric sheet
- A digital badge symbolising resilience

In the post Mr. CAP emphasises that the goal is not only to tell his story but also to empower others to stand tall in the face of adversity.

## Continuing the Tradition

"SOAR'N" continues Mr. CAP's tradition of socially conscious music and his experimentation with Web3 distribution. Stream the single, engage with the message and support independent artists pushing boundaries.
    `,
    category: "NFT Art & Music",
    date: "2023-07-26",
    author: "ISM",
    readTime: "3 min",
    tags: ["SOAR'N", "Social Justice", "Ciddy Boi Music", "NFT", "Conscious Hip Hop"],
  },
  {
    slug: "southern-sounds-mrcap-release",
    title: "Southern Sounds – Mr. CAP Release",
    excerpt: "A soulful collaboration with singer Venita Vyne that takes listeners on a sonic road trip through the American South.",
    image: "/images/southern-sounds-blog.jpg",
    content: `
## A Sonic Road Trip

In late 2023 Mr. CAP unveiled **"Southern Sounds,"** a soulful collaboration with singer **Venita Vyne** produced by **Ciddy Boi Music**.

The track is described as a sonic road trip through the American South. Over bluesy guitars and rolling drums Mr. CAP paints scenes of backroads, barbecue stands and block parties, while Venita Vyne's vocals add a melodic counterpoint.

## NFT Drop Announcement

The article also announces a special NFT drop: on **14 November 2023** a limited number of digital collectibles tied to the single were released. Each NFT includes:

- The song
- Exclusive artwork
- Access to a behind-the-scenes video

By tokenising the single, Mr. CAP connects traditional southern storytelling with cutting-edge distribution.

## Preserving Regional Culture

Fans are encouraged to listen to "Southern Sounds," share their favourite moments, and explore the accompanying NFT collection. The release reinforces the artist's commitment to preserving regional culture while experimenting with new technology.
    `,
    category: "Collaborations",
    date: "2023-10-26",
    author: "ISM",
    readTime: "3 min",
    tags: ["Southern Sounds", "Venita Vyne", "Ciddy Boi Music", "NFT", "R&B"],
  },
  {
    slug: "one-hunid-single-featuring-big-mike-geto-boys",
    title: "One Hunid (Single Featuring Big Mike, Geto Boys)",
    excerpt: "Mr. CAP links up with Big Mike of the legendary Geto Boys for this powerful collaboration.",
    content: `
## A Legendary Collaboration

In June 2019 Mr. CAP released **"One Hunid,"** a single featuring **Big Mike** of the legendary **Geto Boys**.

## Houston Hip-Hop Legacy

This collaboration brings together two generations of Houston hip-hop. Big Mike's contributions to the Geto Boys helped define the sound of Southern rap, and linking up with Mr. CAP creates a bridge between the classic era and independent innovation.

## More Details Coming

*Additional production credits, streaming links, and behind-the-scenes details coming soon.*
    `,
    category: "Collaborations",
    date: "2019-06-25",
    author: "ISM",
    readTime: "2 min",
    tags: ["Big Mike", "Geto Boys", "Houston", "Collaboration", "Hip Hop"],
  },
  {
    slug: "today-was-a-great-day",
    title: "Today Was A Great Day (Single)",
    excerpt: "Celebrating the release of the uplifting single 'Today Was A Great Day.'",
    image: "/images/today-great-day-blog.jpg",
    content: `
## Good Vibes

In February 2018 Mr. CAP released **"Today Was A Great Day,"** an uplifting single celebrating life's positive moments.

## A Different Energy

While Mr. CAP is known for conscious content and street narratives, this track showcases his range – proving he can deliver feel-good energy when the moment calls for it.

*Additional details about production and collaborators coming soon.*
    `,
    category: "Behind the Music",
    date: "2018-02-11",
    author: "ISM",
    readTime: "2 min",
    tags: ["Single", "Positive", "Feel Good"],
  },
  {
    slug: "patiently-waiting-artist-mr-cap",
    title: "Patiently Waiting Artist Mr. CAP",
    excerpt: "An exclusive interview with Memphis 10 on 93.7 The Beat radio.",
    content: `
## Radio Interview

This 2015 entry teased an exclusive interview with **Memphis 10** on **93.7 The Beat** radio.

## Building Buzz

Radio appearances have always been a crucial part of hip-hop promotion. This interview gave Mr. CAP a platform to share his story, discuss upcoming projects, and connect with Houston's hip-hop community.

*Full transcript and audio clips coming soon if available.*
    `,
    category: "Media & Press",
    date: "2015-07-18",
    author: "ISM",
    readTime: "2 min",
    tags: ["Radio", "Interview", "93.7 The Beat", "Memphis 10"],
  },
  {
    slug: "somebody-tell-wiz-khalifa-theres-only-one-mr-cap",
    title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
    excerpt: "A playful statement on identity and originality in hip-hop.",
    image: "/images/wiz-khalifa-blog.jpg",
    content: `
## One of a Kind

This 2015 headline makes a playful statement about Mr. CAP's unique identity in the hip-hop world.

## Originality Matters

In an industry full of similar names and borrowed styles, standing out requires authenticity. Mr. CAP has built his career on being unmistakably himself – from his South Park Coalition roots to his tech-forward approach.

*Full story and context coming soon.*
    `,
    category: "Behind the Music",
    date: "2015-04-20",
    author: "ISM",
    readTime: "2 min",
    tags: ["Identity", "Originality", "Hip Hop"],
  },
  {
    slug: "breaking-boundaries-mr-cap-pioneers-hip-hop-nfts-in-houston",
    title: "Breaking Boundaries: Mr. CAP Pioneers Hip Hop NFTs in Houston",
    excerpt: "On 25 February 2021 Mr. CAP minted and sold a one-of-a-kind NFT of his song 'Limitless' through OpenSea, becoming the first Houston rap artist to leverage non-fungible tokens.",
    image: "/images/limitless-blog.webp",
    content: `
## A Historic Moment for Houston Hip-Hop

**Houston, Texas** - The world of music and art took a major leap forward with the February 25, 2021 sale of the first-ever Hip Hop NFT by Mr. CAP, a Houston-based rapper. This marks a historic moment for both the artist and the city of Houston, as he becomes the first Houston Rap Artist to sell a non-fungible token (NFT) on the blockchain. The NFT in question was Mr. CAP's song, **"Limitless,"** which features local Houston rap legend, **K-Rino**, and was sold on the popular NFT marketplace, OpenSea.

## What is an NFT?

An NFT is a unique, digital asset that is verified on a blockchain, making it one-of-a-kind and allowing for its ownership to be transferred from one person to another. In this case, Mr. CAP's NFT was a piece of hip hop music, which was sold to an anonymous buyer for a significant amount of money.

## Three Decades of Houston Rap

Mr. CAP, born Cornelius A. Pratt, is a well-known figure in the Houston rap scene and has been making music for over three decades. With this groundbreaking sale, he has proven that not only is his music worthy of recognition, but it has value in the digital world as well.

> "I am extremely proud to be the first Houston Rap Artist to sell a Hip Hop NFT on the blockchain. This is a major milestone for me, and I hope it will inspire other artists to embrace this new technology and showcase their work in a new way."

## A New Era for Artists

The sale of the NFT has sparked a lot of interest and excitement in the music and art communities, and many are now looking at the potential of NFTs as a new way to monetize their work. Some experts believe that this could revolutionize the way artists are paid for their creations and could have a significant impact on the music industry.

> "The sale of Mr. CAP's Hip Hop NFT shows that there is a strong demand for unique, verified digital assets in the music world. This could be a game-changer for artists and musicians, as it opens up a new revenue stream and gives them more control over the distribution and ownership of their work."

## Putting Houston on the Map

In conclusion, the sale of Mr. CAP's Hip Hop NFT has set a new standard for artists, musicians, and the music industry as a whole. It highlights the potential of NFTs as a tool for artists to monetize their work and secure their digital assets in a way that was not possible before. With this historic sale, Mr. CAP has put Houston on the map as a hub for innovation and creativity in the world of music and art.
    `,
    category: "NFT Art & Music",
    date: "2024-01-30",
    author: "ISM",
    readTime: "4 min",
    tags: ["NFT", "Hip Hop", "Houston", "Blockchain", "History", "Limitless", "OpenSea"],
  },
  {
    slug: "mr-cap-is-shaking-up-the-nft-world-with-im-bout-to-blow",
    title: "Mr. CAP is Shaking Up the NFT World with \"I'm Bout To Blow\"",
    image: "/images/bout-to-blow-blog.png",
    excerpt: "In 2023 Mr. CAP revisited his 2019 single 'I'm Bout To Blow' and reimagined it as a digital collectible, offering fans a way to invest in his music and own a piece of hip-hop history.",
    content: `
## A Classic Reimagined

In 2023 Mr. CAP revisited his 2019 single **"I'm Bout To Blow"** and reimagined it as a digital collectible. The track is a gritty anthem about perseverance and self-belief – and now he's decided to mint it as an NFT.

By turning the song into a limited-edition digital asset he offers fans a way to invest in his music and own a piece of hip-hop history.

## Benefits of the NFT Release

The article details the benefits of the NFT release: each token unlocks exclusive artwork, behind-the-scenes access and the chance to participate in future drops.

Produced by longtime collaborator **Ciddy Boi Music**, the song's pounding drums and cinematic soundscapes are preserved in a format that can't be pirated or copied. Mr. CAP emphasises that blockchain technology gives artists direct control over their catalogue and rewards loyal supporters.

## Nostalgia Meets Innovation

For listeners who knew the original version, the NFT drop represents both nostalgia and innovation. The post encourages fans to explore the NFT marketplace and highlights that a portion of proceeds will fund upcoming projects.

**"I'm Bout To Blow"** is no longer just a song – it's a tokenised statement about independence and ownership in the digital era.
    `,
    category: "NFT Art & Music",
    date: "2023-12-20",
    author: "ISM",
    readTime: "4 min",
    tags: ["NFT", "Hip Hop", "New Release", "Music NFT", "Ciddy Boi Music"],
  },
  {
    slug: "dippin-thru-the-metaverse-pt-1",
    title: "Dippin Thru the Metaverse pt.1",
    excerpt: "Mr. CAP teams up with producer Ciddy Boi P to explore the fusion of hip-hop and emerging technology in this single that blends classic southern rap with futuristic sound design.",
    image: "/images/dippin-metaverse.png",
    content: `
## Hip-Hop Meets the Future

On this track Mr. CAP teams up with producer **Ciddy Boi P** to explore the fusion of hip-hop and emerging technology. **"Dippin Thru the Metaverse pt.1"** is a single that blends classic southern rap with futuristic sound design.

## Navigating the Blockchain Era

Lyrically the song paints a picture of navigating the blockchain era, mixing street lessons with references to cryptocurrencies and digital worlds.

## More Than a Gimmick

The project is more than a gimmick; it's a commentary on how technology is reshaping culture. Mr. CAP explains that the "metaverse" in the song represents both a virtual space and a state of mind where artists take control of their destiny.

By incorporating blockchain terminology and cyber-punk production, he aims to show that hip-hop can evolve without losing its soul.

## The Journey Continues

Readers are invited to listen to the track and reflect on the intersection of music and Web3. The post hints at future instalments that will further explore the metaverse concept, encouraging fans to follow the journey as the artist dips through new digital dimensions.
    `,
    category: "NFT Art & Music",
    date: "2023-12-20",
    author: "ISM",
    readTime: "3 min",
    tags: ["Metaverse", "Web3", "Ciddy Boi P", "Technology", "Hip Hop"],
  },
  {
    slug: "honoring-the-legacy-of-o-n-e-with-the-release-of-to-tha-grave",
    title: "Honoring the Legacy of O.N.E. with the Release of 'To Tha Grave'",
    excerpt: "This heartfelt post commemorates the remastered release of 'To Tha Grave,' originally recorded with Mr. CAP's cousin O.N.E. (Originality Never Ends).",
    image: "/images/to-tha-grave-blog.png",
    content: `
## A Tribute to Family

This heartfelt post commemorates the remastered release of **"To Tha Grave,"** originally recorded with Mr. CAP's cousin **O.N.E. (Originality Never Ends)**. O.N.E. passed away in 2021, and the updated version is both a tribute and a celebration of his contributions to Houston rap.

Mr. CAP recalls their creative partnership and the late artist's influence on the South Park Coalition's sound.

## Preserving Legacy on the Blockchain

The post describes how the single has been minted as an NFT to preserve O.N.E.'s legacy on the blockchain. Fans can stream the track for free or purchase the tokenised edition, which includes:

- The remastered audio
- Unseen photos
- A short documentary clip

Proceeds from the NFT will support O.N.E.'s family and a scholarship fund for aspiring musicians.

## Keeping Art Alive

In closing Mr. CAP encourages listeners to share the song, reflect on O.N.E.'s impact and honour those we've lost by keeping their art alive.
    `,
    category: "Behind the Music",
    date: "2022-12-22",
    author: "ISM",
    readTime: "4 min",
    tags: ["O.N.E.", "Tribute", "Family", "NFT", "South Park Coalition", "Legacy"],
  },
  {
    slug: "discover-pwa-power-weed-alcohol-the-hottest-collaboration-from-mr-cap-and-devyn-kelly",
    title: "Discover 'PWA (Power Weed & Alcohol)' – The Hottest Collaboration from Mr. CAP and Devyn Kelly",
    excerpt: "Mr. CAP teams up with singer Devyn Kelly and producer Ciddy Boi Music for a steamy blend of hip-hop and R&B.",
    image: "/images/pwa-blog.webp",
    content: `
## A Steamy Collaboration

On **8 April 2023** Mr. CAP teamed up with singer **Devyn Kelly** and producer **Ciddy Boi Music** to release **"PWA (Power Weed & Alcohol)."**

The track is a steamy blend of hip-hop and R&B, with Mr. CAP's verses delivered over sultry chords and Devyn Kelly's smooth hook. Lyrically it celebrates intoxicating nights and the chemistry between collaborators.

## Limited NFT Offering

The article highlights a special NFT offering: only **500** digital tokens were minted, each including:

- The single
- High-resolution artwork
- Access to a private listening session

Collectors who purchase the NFT would also receive a discount code for upcoming merchandise. Mr. CAP notes that the drop is designed to reward fans who believe in the duo's creative chemistry.

## Available Everywhere

For listeners who prefer traditional platforms, "PWA" was simultaneously released on major streaming services. The post invites audiences to experience the song, share it with friends and consider investing in the limited-edition NFT before it sells out.
    `,
    category: "Collaborations",
    date: "2023-04-08",
    author: "ISM",
    readTime: "3 min",
    tags: ["Devyn Kelly", "Ciddy Boi Music", "R&B", "NFT", "Collaboration"],
  },
  {
    slug: "h-town-represent",
    title: "H-Town Represent",
    excerpt: "Mr. CAP pays homage to Houston with the exclusive NFT anthem 'H-Town Represent' – a rallying cry for anyone proud to call Houston home.",
    image: "/images/h-town-represent-blog.png",
    content: `
## A Houston Anthem

Houston's hip-hop scene is known for its loyalty and swagger, and in this post Mr. CAP pays homage with the exclusive NFT anthem **"H-Town Represent."**

Produced by **Ciddy Boi P**, the song features heavy bass, chopped-and-screwed influences and lyrics that name-check neighbourhoods and legends. The track is more than music – it's a rallying cry for anyone proud to call Houston home.

## Limited NFT Release

The release includes a limited run of **100** NFTs. Each token bundles:

- The song
- A piece of cover art hand-drawn by Mr. CAP
- Access to an online meet-and-greet

The post notes that buyers will own a piece of Houston music history and help fund future creative projects.

## Reflecting on the Journey

Mr. CAP uses the article to reflect on his journey through the South Park Coalition and the city's influence on his craft. He encourages fans to secure their NFT early and to blast the anthem in celebration of H-Town's enduring legacy.
    `,
    category: "Houston Hip-Hop History",
    date: "2023-04-07",
    author: "ISM",
    readTime: "3 min",
    tags: ["Houston", "H-Town", "NFT", "Ciddy Boi P", "South Park Coalition"],
  },
  {
    slug: "dear-frank",
    title: "Dear Frank (Motion Picture Soundtrack)",
    excerpt: "Mr. CAP contributes to the motion picture 'Dear Frank' soundtrack, teaming up with Da Homie and E-Dogg on the song 'Get Me Right.'",
    content: `
## Contributing to Cinema

This post announces Mr. CAP's contribution to the motion picture **"Dear Frank,"** a dramatic film featuring Brian J. White, Claudia Jordan, Columbus Short and Kearia Schroeder.

## The Track

For the soundtrack Mr. CAP teams up with **Da Homie** and **E-Dogg** on the song **"Get Me Right,"** produced by **TrackHouse Productions**.

## Versatility in Action

The article serves as a credit roll, listing the artists involved and encouraging fans to watch the film and listen to the soundtrack. This post underscores Mr. CAP's versatility as both a performer and a contributor to multimedia projects.
    `,
    category: "Behind the Music",
    date: "2021-01-27",
    author: "ISM",
    readTime: "2 min",
    tags: ["Soundtrack", "Film", "Dear Frank", "Da Homie", "E-Dogg", "TrackHouse Productions"],
  },
  {
    slug: "hangin-with-mr-cap-of-the-spc",
    title: "Hangin' With Mr. CAP of the SPC",
    excerpt: "A look back at hanging out with Mr. CAP, a founding member of the South Park Coalition (SPC).",
    content: `
## A Founding Member

This post from March 2015 documents time spent with Mr. CAP, a founding member of the **South Park Coalition (SPC)**.

## The SPC Legacy

The South Park Coalition has been a cornerstone of Houston's underground hip-hop scene since the late 1980s. Mr. CAP's contributions to the collective helped shape the sound and philosophy that would influence generations of artists.

## More to Come

*Additional content, photos and reflections from this era coming soon.*
    `,
    category: "South Park Coalition",
    date: "2015-03-13",
    author: "ISM",
    readTime: "2 min",
    tags: ["South Park Coalition", "SPC", "Houston", "History"],
  },
  {
    slug: "mr-cap-interview-and-performance-on-fame-train",
    title: "Mr. CAP Interview & Performance on Fame Train",
    excerpt: "Mr. CAP appears on the television show Fame Train for an exclusive interview and live performance.",
    content: `
## Television Appearance

In 2016 Mr. CAP made an appearance on the television show **Fame Train** for an exclusive interview and live performance.

## More to Come

*Additional context about the interview, performance details and memorable quotes coming soon. Video links will be added when available.*
    `,
    category: "Media & Press",
    date: "2016-06-13",
    author: "ISM",
    readTime: "2 min",
    tags: ["Interview", "Television", "Fame Train", "Performance"],
  },
  {
    slug: "the-untold-story-of-mr-cap",
    title: "The Untold Story of Mr. CAP: Houston's Hidden Architect of Underground Hip-Hop",
    excerpt: "From Third Ward stages to South Park Coalition, prison to digital distribution, this is the untold story of Mr. CAP and how he became one of Houston's most slept-on architects of underground hip-hop.",
    content: `
## The Name You've Heard But Don't Know

In every city, there are artists whose fingerprints are all over the culture even if their names never sit comfortably in mainstream headlines. In Houston, one of those names is Mr. CAP—rapper, writer, technologist, and original South Park Coalition member whose story tracks the evolution of Southern hip-hop itself.

## From Third Ward to the Mic

Mr. CAP's journey starts in Houston's Third Ward, raised in a musical family and performing from a young age. Long before streaming, before social media, he was learning how to move a crowd face to face—talent shows, local stages, and wherever a microphone would stand still long enough.

## South Park Coalition & The Ethics of Independence

Becoming an original member of the South Park Coalition (SPC) didn't just plug CAP into a rap crew—it plugged him into a philosophy. Independence. Lyricism. Community. SPC was a place where wordplay mattered as much as hustle, and where artists learned to move like business owners long before it was trendy to call yourself a "brand."

## Life, Loss, and Lessons the Industry Doesn't Teach

CAP's story includes hard chapters—time behind bars, broken deals, missed opportunities. But those same chapters sharpened his perspective. Instead of chasing a quick hit, he started thinking about ownership, rights, and how easily artists can lose everything if they don't understand the paperwork behind the music.

## From 2 Tha Grave to The Ties That Bind Us

His debut album, *2 Tha Grave*, captured the hunger and raw reality of that era. Fast forward, *The Ties That Bind Us* picks up the story from a different angle—more seasoned, more reflective, but just as honest. Together, the catalog maps out a life lived in real time, not a label-manufactured storyline.

## Rapper, Yes—But Also Technologist

What separates Mr. CAP from a lot of his peers is what he did when he wasn't on stage. He studied Computer Network Engineering and Computer Science, worked in corporate environments, and later stepped into digital distribution, web design, blockchain, and AI.

That means when he talks about "owning your masters" or "controlling your data," it's not just rap rhetoric—he actually understands the systems behind the music.

## The Hidden Architect

You won't always see Mr. CAP centered in the spotlight. Sometimes he's behind the scenes—helping other artists navigate distribution, tech, or strategy. Other times he's building platforms and infrastructure independent artists can use long after the show ends.

That's why "hidden architect" fits. Not everybody knows the name. But if you trace enough stories, records, and ideas around Houston, his influence keeps showing up.

## Why This Story Matters Now

In a world where going viral can seem more important than building something that lasts, Mr. CAP's story is a reminder: legacy > trend. The artists who understand business, tech, and their own value are the ones who can keep creating on their own terms.

And if you're just now finding out who he is, you're not late. You're right on time.
    `,
    category: "Houston Hip-Hop History",
    date: "2024-12-03",
    author: "Mr. CAP",
    readTime: "10 min",
    image: "/images/untold-story-mrcap-blog.png",
    tags: ["Biography", "Houston", "South Park Coalition", "Underground Hip-Hop", "Third Ward"],
  },
  {
    slug: "blockchain-nfts-and-hip-hop-mr-cap",
    title: "How Blockchain, NFTs, and Hip-Hop Collide: Inside Mr. CAP's Tech Experiments",
    excerpt: "A look at how Mr. CAP blends Houston hip-hop, NFTs, and blockchain to experiment with new forms of ownership, payments, and legacy in the music game.",
    content: `
## Beyond the Buzzwords

For a lot of artists, blockchain and NFTs were just buzzwords in 2021. For Mr. CAP, they were another tool in a lifelong mission: making sure artists aren't last in line to get paid or recognized.

## Houston Hustle Meets Web3

Coming out of Houston's independent grind, the idea of direct-to-fan, traceable ownership felt natural. Mr. CAP didn't approach Web3 as a hype train—he approached it like a new distribution channel.

## The First Hip-Hop NFT from Houston

In February 2021, Mr. CAP minted "Limitless" on OpenSea, becoming the first Houston rapper to sell a Hip Hop NFT on the blockchain. The sale was for a four-figure sum, but the significance went far beyond money.

It was proof of concept: artists could tokenize their work, create scarcity, and build direct relationships with collectors—without a label or distributor in between.

## What NFTs Should Have Been About

Not "get rich quick," but:

- **Proven ownership** — Blockchain records who created what and when
- **Limited digital editions** — Scarcity that fans can actually own
- **Unlocking experiences** — Shows, calls, exclusives tied to tokens
- **Building a direct supporter base** — No algorithms deciding who sees your work

## Smart Contracts, Real Talk

Imagine every time a record gets resold or streamed in a new format, a smart contract sends your cut automatically. No chasing statements. No hoping someone accounted correctly. That's the future Mr. CAP experiments toward.

## Lessons for Independent Artists

1. **Don't jump into tech you don't understand.** Study first, experiment second.
2. **Use Web3 where it adds real value**, not just marketing hype.
3. **Focus on ownership**, not trends.
4. **Build community** before you drop anything.
5. **Think long-term** — tokens should represent lasting value, not quick flips.

## What's Next for Mr. CAP in Tech

From crypto concepts to AI-powered tools for artists, the experiments continue. Same mission: more control, more independence, more ways to build something that outlives the trend.

The technology will keep evolving. What matters is the principle behind it: artists should own their work, know their numbers, and have direct paths to their audience.

That's what Mr. CAP has been building toward for 30+ years. Blockchain is just the latest chapter.
    `,
    category: "Blockchain & AI",
    date: "2024-11-20",
    author: "Mr. CAP",
    readTime: "8 min",
    image: "/images/blockchain-nfts-hiphop-blog.png",
    tags: ["NFT", "Blockchain", "Web3", "Music Industry", "Innovation", "Ownership"],
  },
  {
    slug: "south-park-coalition-history-houston-hip-hop",
    title: "South Park Coalition: How a Houston Movement Rewrote the Rules for Independent Rap",
    excerpt: "The untold story of how SPC became one of the most influential underground hip-hop collectives in history.",
    content: `
## The Birth of a Movement

The South Park Coalition emerged from Houston's South Park neighborhood in the late 1980s, founded by K-Rino. What started as a group of friends passionate about hip-hop would grow into one of the most influential underground collectives in rap history.

## The Philosophy

SPC was never just about music. It was about:

- **Lyrical excellence** over commercial trends
- **Independence** before "independent" was cool
- **Community** over competition
- **Ownership** of your own work

## The Original Members

The original lineup included some of the most talented lyricists Houston has ever produced. Mr. CAP joined as one of the founding members, bringing his unique perspective and flow to the collective.

## Impact on Houston Hip-Hop

While Rap-A-Lot Records was putting Houston on the mainstream map, SPC was building an underground empire. The collective proved you could:

- Release records without major label backing
- Build a loyal fanbase through quality and consistency
- Maintain artistic integrity while still making money
- Create infrastructure that other artists could use

## The Numbers

Over 1,000 albums released collectively. Countless shows performed. Generations of artists influenced. And still going strong decades later.

## Lessons for Today's Artists

1. **Quality over quantity** — SPC releases always had substance
2. **Community over competition** — They elevated each other
3. **Long-term thinking** — Building catalogs, not just singles
4. **Business acumen** — Understanding the industry, not just the art

## The Legacy Continues

Today, South Park Coalition stands as a testament to what independent hip-hop can achieve. As members like Mr. CAP continue to release new music and embrace new technologies, SPC proves that authentic hip-hop never dies—it evolves.
    `,
    category: "South Park Coalition",
    date: "2024-11-15",
    author: "Mr. CAP",
    readTime: "8 min",
    tags: ["South Park Coalition", "Houston", "History", "Underground Hip-Hop", "K-Rino"],
  },
  {
    slug: "independent-artist-success-music-industry-2024",
    title: "The Independent Artist Playbook: Building a Career Without a Major Label in 2024",
    excerpt: "After 30+ years in the game, here's what I've learned about building a sustainable music career on your own terms.",
    content: `
## The Game Has Changed

When I started in the late '80s, the music industry looked completely different. Today, independent artists have more opportunities than ever—but also more competition and more noise to cut through.

Here's what actually works.

## Rule #1: Own Your Masters

This is non-negotiable. Never sign away ownership of your music unless you absolutely have to—and understand exactly what you're giving up.

Your catalog is your retirement plan. Every stream, every sync, every sample clearance for the rest of your life.

## Rule #2: Build Direct Relationships

Social media, email lists, NFTs, and community platforms allow you to connect directly with fans. Use these tools. Don't rely solely on algorithms or playlists to build your audience.

The artists who survive industry changes are the ones who can reach their fans without permission from platforms.

## Rule #3: Diversify Your Income

Music streaming pays pennies per stream. Smart artists think about:

- **Live shows** — Still the best money in music
- **Merchandise** — Especially limited editions
- **Sync licensing** — TV, film, commercials, games
- **NFTs and collectibles** — Direct-to-fan ownership
- **Teaching and consulting** — Share what you know

## Rule #4: Stay Consistent

I've been releasing music for over 30 years. Consistency builds legacy. Show up every day, even when it's hard, even when the numbers are low.

The artists who disappear for years at a time lose momentum. The ones who keep creating keep their name in the conversation.

## Rule #5: Embrace Technology

From blockchain to AI, new technology offers new opportunities. Don't be afraid to experiment. The artists who adapt survive. The ones who don't get left behind.

## Rule #6: Think Long-Term

Success in music isn't a sprint—it's a marathon. Focus on building something that lasts, not chasing the next viral moment.

The goal isn't one hit. The goal is a career.

## Final Thoughts

The industry will keep changing. New platforms will rise and fall. But the fundamentals stay the same:

- Make great music
- Own your work
- Build real relationships
- Stay in the game

That's the playbook. Now execute.
    `,
    category: "Music Industry Playbook",
    date: "2024-09-10",
    author: "Mr. CAP",
    readTime: "7 min",
    tags: ["Music Business", "Independent Artist", "Career Advice", "Success", "Strategy"],
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
  {
    slug: "why-betn-on-me-is-more-than-a-song",
    title: "Why 'Bet'n On Me' Is More Than a Song",
    excerpt: "The lead single from 'The Ties That Bind Us' isn't just a record — it's a philosophy shaped by decades of survival, independence, and ownership in the music industry.",
    image: "/images/betn-on-me-blog.jpg",
    content: `
## A Philosophy Shaped by Decades

"Bet'n On Me" isn't just a record — it's a philosophy shaped by decades of survival, independence, and ownership in the music industry.

When Mr. CAP stepped into the booth to record this track for the South Park Coalition's *The Ties That Bind Us* album, he wasn't just making another song. He was distilling 30+ years of lessons into three minutes and forty-five seconds.

## The SPC Mentality

The South Park Coalition taught its members something that most artists never learn: **you don't need permission to build something great**.

While the music industry was busy signing artists to exploitative contracts, SPC was:

- Pressing their own CDs
- Selling out of car trunks
- Building direct relationships with fans
- Keeping 100% of their masters

This wasn't just a business model — it was a survival strategy. And "Bet'n On Me" is the anthem for everyone who's ever had to bet on themselves when no one else would.

## The Independent Grind

Major labels offered deals. Industry gatekeepers made promises. But Mr. CAP understood something fundamental: **the only sure bet is the one you place on yourself**.

The track speaks to every entrepreneur, every artist, every hustler who's been told "no" more times than they can count. It's for the ones who kept going anyway.

## Industry Gatekeeping vs. Self-Ownership

The music industry has always been designed to extract value from artists. Record deals that look good on paper but leave artists broke. Publishing agreements that sign away lifetime rights. Distribution contracts that take 80% of revenue.

Mr. CAP saw through all of it.

Through CAP Distributions, he built an alternative — a way for independent artists to reach global platforms without surrendering their ownership. "Bet'n On Me" is the soundtrack to that mission.

## The Long-Term Vision

This isn't about betting on trends. It's not about chasing viral moments or algorithm hacks.

It's about:

- Building something that lasts
- Owning what you create
- Staying true to your roots while evolving with the times
- Proving that longevity beats hype every single time

## The Message

From South Park streets to blockchain technology, from cassette tapes to streaming platforms — the constant has always been the same: **bet on yourself**.

Because when you bet on yourself, you can never lose. Even when you fail, you learn. Even when you fall, you get back up. And eventually, the bets start paying off.

---

**This isn't about betting on trends.**  
**It's about betting on yourself.**

---

👉 [Listen to "Bet'n On Me"](/music)  
👉 [Explore the full legacy at mrcap1.com](/)
    `,
    category: "Behind the Music",
    date: "2024-12-20",
    author: "ISM",
    readTime: "5 min",
    tags: ["Bet'n On Me", "The Ties That Bind Us", "SPC", "Independence", "Philosophy", "South Park Coalition"],
  },
  {
    slug: "10-things-south-park-coalition",
    title: "Looking For Classic Houston Rap? Here Are 10 Things You Should Know About the South Park Coalition",
    excerpt: "Houston, Texas, is often celebrated as the epicenter of southern hip hop. At the very center of this movement stands the South Park Coalition (SPC), a collective that has remained the backbone of classic Houston rap for nearly four decades.",
    image: "/images/spc-10-things-blog.jpg",
    content: `Houston, Texas, is often celebrated as the epicenter of southern hip hop, a city that redefined the genre through its unique culture and unflinching independence. At the very center of this movement stands the South Park Coalition (SPC), a collective that has remained the backbone of **classic Houston rap** for nearly four decades.

The SPC is not just a group; it is a cultural institution. It represents a groundbreaking approach to the music industry that prioritized artistic integrity over commercial trends. To understand the true depth of **Houston rap history**, one must understand the South Park Coalition.

Here are 10 essential things you should know about the South Park Coalition and their enduring legacy in the world of hip hop.

## 1. Founded by the "Wizard" K-Rino in 1986

The South Park Coalition was established in 1986 by the legendary K-Rino. His vision was to create a unified front for the immense talent emerging from the South Park neighborhood of Houston.

From the beginning, K-Rino sought to foster an environment where lyricism and storytelling were paramount. This dedication to the craft turned SPC into an internationally acclaimed powerhouse of independent music.

The founding of the coalition marked a pivotal moment in the timeline of Texas hip hop. It provided a structure for artists who were often ignored by the mainstream to find their voice and build a dedicated global following.

![A young artist on a Houston street corner representing the 1980s origins of the South Park Coalition.](/images/spc-houston-origins.webp)

## 2. A Family Brotherhood, Not Just a Rap Crew

One of the most defining characteristics of the South Park Coalition is its structure. Unlike many rap "clicks" that are formed for business or marketing purposes, the SPC is a family.

This sense of brotherhood has allowed the collective to endure for over 35 years. The members share a bond that transcends the music industry, rooted in shared struggles and mutual respect.

This organic connection is the secret to their longevity. Members consistently emphasize that the loyalty within the group is priceless, creating a support system that has withstood the test of time and industry shifts.

## 3. The Blueprint for Independent Success

Long before the internet made independent distribution a standard practice, the South Park Coalition was mastering the art of the hustle. They are the architects of the independent blueprint in the South.

The SPC achieved massive success without the help of mainstream radio or major label budgets. They sold hundreds of thousands of records through grassroots marketing and direct-to-fan engagement.

This project stands as a testament to the power of self-reliance. By owning their masters and controlling their narrative, the SPC proved that an artist could build a sustainable career on their own terms.

## 4. Unmatched Lyrical Depth and Battle Roots

While some regions of hip hop focused on "club hits" or "vibes," the South Park Coalition remained committed to "substance." Their sound is defined by complex metaphors, social commentary, and high-level lyricism.

The group's foundations are firmly rooted in the competitive culture of battle rap. Many members sharpened their skills in high school talent shows and park performances, creating a culture of excellence within the ranks.

This commitment to lyrical depth has earned them a reputation as one of the most respected collectives in the underground scene. They have consistently pushed the boundaries of what **classic Houston rap** can be, blending street narratives with philosophical insights.

## 5. The Influence of Houston's Early Pioneers

The SPC did not emerge in a vacuum. Their sound and ethos were heavily influenced by earlier Houston legends who paved the way for the city's rap dominance.

Figures like Wicked Cricket, Lester Pace, and Jazzy Red were the heroes of the South Park neighborhood. The SPC members grew up watching these pioneers, viewing them as celebrities and mentors.

This connection to the [legacy](/legacy) of Houston music allowed the SPC to maintain a sense of history while innovating their own unique sound. They acted as a bridge between the old school and the modern era.

![Vintage vinyl record spinning on a turntable symbolizing the enduring legacy of classic Houston rap.](/images/spc-vinyl-legacy.webp)

## 6. Mr. CAP: A Pillar of the Coalition's Evolution

Among the elite roster of the SPC, Mr. CAP stands as a vital force in the collective's ongoing narrative. His contributions to the coalition represent a strategic fusion of tradition and innovation.

Mr. CAP's journey is a reflection of the SPC's overarching philosophy: staying true to your roots while embracing the future. His work is characterized by the same lyrical precision and authenticity that the group is known for.

In recent years, his [return to his musical roots](/blog/mr-cap-returns-to-his-musical-roots) has signaled a resurgence of interest in the classic SPC sound. He continues to push the brand forward, ensuring that the message of the coalition reaches a new generation of listeners.

![Mr. CAP — Keep'em Clappin single cover art](/images/spc-mr-cap-studio.jpg)

## 7. The Powerhouse Members: Point Blank and Klondike Kat

The strength of the South Park Coalition lies in its diversity of talent. Icons like Point Blank and Klondike Kat brought a distinct energy and presence to the collective.

Point Blank, known as "The Bull," brought a raw, aggressive power to his verses that perfectly complemented the more philosophical styles of other members. Klondike Kat provided a gritty, street-level perspective that resonated deeply with the local audience.

Together with artists like Murder One, Ganksta NIP, and Dope-E, they formed a lineup that was unmatched in its versatility. Each member brought a different flavor to the **South Park Coalition music** catalog, creating a rich tapestry of sounds.

## 8. The Signature Sound of Egypt and Dope-E

While the lyricism of the SPC was front and center, the production was equally groundbreaking. The group's signature sound was largely crafted by internal producers like Egypt and Dope-E.

The SPC sound is often described as dark, atmospheric, and hypnotic. It provided the perfect backdrop for the collective's heavy subject matter and intricate flows.

This internal production house allowed the group to maintain a consistent aesthetic across dozens of releases. It was a multi-sensory experience that defined the "Grown-Man" era of Houston hip hop.

![Analog mixing board with glowing lights capturing the signature production sound of Houston rap legends.](/images/spc-mixing-board.webp)

## 9. Embracing Innovation and the Digital Frontier

The South Park Coalition has never been afraid of change. While they are deeply rooted in tradition, they have consistently looked for new ways to innovate and reach their audience.

This forward-thinking mindset is evident in their early adoption of digital platforms and, more recently, their entry into the world of Web3 and [NFTs](/nft). By blending their rich history with cutting-edge technology, they are ensuring their survival in the modern music landscape.

A prime example of this innovation is the [collaboration with artist Ali Sabet](/blog/houston-rapper-lands-major-art-music-collaboration-with-artist-ali-sabet). This project represents a full-circle moment where music, visual art, and digital ownership intersect to create something truly unique.

## 10. A Legacy That Spans Over 35 Years

The most remarkable thing about the South Park Coalition is their endurance. In an industry where trends change overnight, the SPC has remained relevant for over 35 years.

This longevity is a testament to the quality of the music and the strength of the brand. They have remained true to their founding principles while adapting to the shifts in technology and culture.

The result is a legacy that is respected not just in Houston, but across the globe. From the streets of South Park to international stages, the SPC has proven that authenticity is the ultimate currency in hip hop.

![Houston skyline at twilight viewed from the South Park neighborhood, representing a global hip hop legacy.](/images/spc-houston-skyline.webp)

## The Future of the Coalition

The story of the South Park Coalition is far from over. As the music industry continues to evolve, the group remains a vibrant and influential part of the [Houston rap scene](/music).

Their journey serves as an inspiration for independent artists everywhere. It is a story of brotherhood, resilience, and an unwavering commitment to the art of rap. Whether you are a longtime fan or a newcomer looking for **classic Houston rap**, the South Park Coalition is essential listening.

This represents a full-circle moment for the collective, as they continue to bridge the gap between their storied past and a limitless future. Stay tuned for new releases and innovative projects coming from the legendary SPC camp.

Explore the latest from the collective and stay updated on upcoming events by visiting our [new releases](/new-releases) and [live performance](/live) pages. The legacy continues.`,
    category: "South Park Coalition",
    date: "2025-03-16",
    author: "ISM",
    readTime: "8 min",
    tags: ["South Park Coalition", "Houston Hip-Hop", "K-Rino", "Mr. CAP", "Point Blank", "Klondike Kat", "Classic Houston Rap", "Independent Music", "SPC"],
  },
  {
    slug: "why-music-nfts-will-change-the-way-you-collect-houston-hip-hop",
    title: "Why Music NFTs Will Change the Way You Collect Houston Hip Hop",
    excerpt: "From cassette tapes to the blockchain — how Music NFTs are reintroducing digital scarcity and verifiable ownership to Houston's legendary hip hop scene.",
    category: "NFT Art & Music",
    date: "2026-03-20",
    author: "Mr. CAP",
    image: "https://cdn.marblism.com/7p18rlR80ja.webp",
    readTime: "7 min",
    tags: ["Music NFTs", "Houston Hip-Hop", "Blockchain", "South Park Coalition", "Mr. CAP", "Digital Ownership", "NFT Art"],
    content: `The streets of Houston have always been a breeding ground for innovation. From the slow-churning rhythms of the chopped and screwed era to the fiercely independent spirit of the South Park Coalition, the Houston hip hop scene has consistently rewritten the rules of the music industry. Today, a new revolution is quietening the noise of the old world: the rise of Music NFTs.

For decades, collecting music meant holding a physical piece of history: a cassette tape, a vinyl record, or a limited-edition CD. However, the digital age stripped away that sense of ownership, replacing it with temporary access via streaming platforms. This is where the landscape shifts once again, merging the grit of the Texas underground with the cutting-edge transparency of the blockchain.

At the forefront of this digital frontier is Mr. CAP, a veteran with over 30 years of experience in the game. By bridging the gap between legacy and technology, he is redefining what it means to be a collector in the modern era. You can explore his verified digital art collections and collector access on the [NFT & Digital Art Gallery](/nft).

## The Groundbreaking Shift from Streaming to Ownership

For the average listener, streaming is a convenience. For the true collector, it is a hollow experience. You don't own the music; you rent the right to hear it. Music NFTs (Non-Fungible Tokens) are dismantling this model by reintroducing the concept of digital scarcity and verifiable ownership.

When you explore music NFTs for sale, you aren't just buying a file. You are acquiring a unique digital asset that is permanently etched into the blockchain. This technology allows fans to own a specific, documented piece of an artist's catalog, creating a level of exclusivity that streaming can never replicate. Browse the [full music catalog](/music) to discover the releases behind these collectible moments.

![Mr. CAP in South Park Coalition (SPC) gear—iconic Houston roots.](https://cdn.marblism.com/7p18rlR80ja.webp)

## Mr. CAP: A Pioneer on the Blockchain

Innovation is nothing new to the legendary figures of the South Park Coalition. However, Mr. CAP has solidified his status as a visionary by becoming the first Houston rap artist to sell a Hip Hop NFT on the blockchain. This wasn't just a career move; it was a strategic fusion of disparate worlds.

With a career spanning over three decades, Mr. CAP has witnessed the evolution of the Houston hip hop scene from the ground up. He understood early on that the future of music isn't just about the sound: it's about the sovereignty of the artist and the loyalty of the collector.

![Mr. CAP—groundbreaking Houston rap pioneer presence.](https://cdn.marblism.com/beoOR9Ow27g.webp)

## Preserving Houston Hip Hop History Through Technology

Music NFTs allow for the implementation of smart contracts. These are automated agreements that ensure artists receive their fair share of royalties every single time an NFT is resold on the secondary market. Imagine a world where a rare track from the South Park Coalition era could be traded like a high-end painting, with the artist benefiting from its growth in value over time. Dive deeper into the [South Park Coalition legacy](/south-park-coalition) and its influence on the Houston underground.

![Mr. CAP—internationally acclaimed Houston hip hop legacy.](https://cdn.marblism.com/Rs11ZdPA5aa.webp)

## Building a Future-Proof Legacy

The bridge between the past and the future is perhaps most evident in Mr. CAP's album, "The Ties That Bind Us". This work is a masterclass in storytelling, reflecting the deep roots of his 30-year journey while embracing the possibilities of the new digital economy. Listen to the album and explore the full discography on the [music page](/music), or connect your wallet on the [NFT gallery](/nft) to unlock exclusive collector-only content.

![SPC LEGACY LOGO](https://cdn.marblism.com/7363f76b-1e1c-47c6-a817-6206ad896555-spclegacy2.png)`,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};
