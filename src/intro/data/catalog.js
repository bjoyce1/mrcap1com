// Mr. CAP catalog — pulled from the live mrcap1.com `albums` / `tracks` tables (public rows).
// `audio` is a path inside the Supabase `audio` storage bucket (see config.js → STREAM.storage),
// or an absolute /media path for files hosted with the site. Lyrics are intentionally not mirrored.

export const ALBUMS = [
  {
    slug: 'the-art-of-ism', title: 'The Art of ISM', artist: 'Mr. CAP', year: 2019, count: 11,
    cover: '/intro/img/covers/art-of-ism.webp', price: 999, tone: '#d9a441',
    desc: 'The statement album, released through Sony Music / The Orchard. A philosophy pressed to wax, with production by Patrick "Ciddi Boy" Rodriguez.',
    spotify: null, apple: 'https://music.apple.com/us/album/the-art-of-ism/1480463642',
  },
  {
    slug: 'the-ties-that-bind-us', title: 'The Ties That Bind Us', artist: 'South Park Coalition', year: 2024, count: 19,
    cover: '/intro/img/covers/ties.webp', price: 999, tone: '#c8323a',
    desc: 'The South Park Coalition group album: Mr. CAP, K-Rino, Point Blank and Klondike Kat. 19 tracks, over an hour of grown-man Houston hip-hop.',
    spotify: null, apple: 'https://music.apple.com/us/album/the-ties-that-bind-us/1796200885',
  },
  {
    slug: '2-tha-grave', title: '2 Tha Grave', artist: 'Mr. CAP', year: 2011, count: 10,
    cover: '/intro/img/covers/grave.webp', price: 999, tone: '#8e7cc3',
    desc: 'Loyalty to the streets and the sound. Raw lyricism, storytelling and Southern grit. Houston underground, uncompromised.',
  },
  {
    slug: 'tha-cold-ass-pimp', title: 'Tha Cold Ass Pimp', artist: 'Mr. CAP', year: 2006, count: 10,
    cover: '/intro/img/covers/cold-ass-pimp.webp', price: 999, tone: '#d12e7b',
    desc: 'An early solo statement: street realism as literature.',
  },
  {
    slug: 'one-on-one', title: 'O.N.E. on O.N.E.', artist: 'O.N.E x Mr. CAP', year: 2005, count: 12,
    cover: '/intro/img/covers/one-on-one.jpg', price: 999, tone: '#5b8bd9',
    desc: 'The debut collaboration album. The grind years: independent releases that built a catalog one record at a time.',
    streamOnly: true,
  },
];

const SP = 'https://open.spotify.com/track/';
const AM_TIES = 'https://music.apple.com/us/album/the-ties-that-bind-us/1796200885';
const AM_ISM = 'https://music.apple.com/us/album/the-art-of-ism/1480463642';

// id, title, slug, [feat], album, #, secs, audio path, cover, explicit, year, plays, links, story
const T = (o) => ({ artist: 'Mr. CAP', ft: null, album: null, n: null, d: null, audio: null, e: false, plays: 0, ...o });

export const TRACKS = [
  // ── 2026 singles
  T({ id: '25321aac-5383-4e22-ab8e-da844f4fb581', title: 'Big Boy Drip', slug: 'big-boy-drip', ft: 'Ciddy Boi P', d: 119, audio: 'big-boy-drip.mp3', cover: '/intro/img/covers/big-boy-drip.webp', e: true, year: 2026, plays: 1 }),
  T({ id: '667d67e3-d9bd-450e-9662-769fac631ec3', title: 'My World', slug: 'my-world', ft: 'Billy Cook', d: 236, audio: 'my-world/My%20World%20(mastered).wav', cover: '/intro/img/covers/my-world.webp', year: 2026, plays: 2 }),
  T({
    id: 'd80f6fb9-0b4f-4582-b085-b5014e9e44c3', title: 'Bet On Her', slug: 'bet-on-her', ft: 'Billy Cook', d: 259,
    audio: 'bet-on-her/Bet%20On%20Her%20(Master).wav', cover: '/intro/img/covers/bet-on-her.webp', year: 2026, plays: 6,
    story: 'A high-stakes anthem about recognizing real value in a world full of illusions. Inspired by the energy of Las Vegas, Mr. CAP flips gambling into a metaphor for relationships, loyalty, and choosing right.',
    credits: 'Featuring Billy Cook · Production by C.U.S.H · Ciddy Boi Music',
  }),
  // ── 2025 singles
  T({
    id: '5426cb2f-6ec2-42bd-82ac-9afd27ae58d3', title: 'Put The Dope Down', slug: 'put-the-dope-down', ft: 'S.A.A.K. & Bosey-B', d: 192,
    audio: 'singles/Put-The-Dope-Down.mp3', cover: '/intro/img/covers/put-the-dope-down.jpg', e: true, year: 2025, plays: 5,
    apple: 'https://music.apple.com/us/album/put-the-dope-down-feat-saak-bosey-b-single/1684608469',
    story: 'Recorded during the C.U.S.H. era and re-released in 2025. A raw street anthem with heavy bass, sharp wordplay and storytelling from the trenches.',
  }),
  T({ id: '18deec88-3ae2-4a17-9e1f-32a0ea860da5', title: 'Panties on My Piano', slug: 'panties-on-my-piano', ft: 'Ciddi Boy P', d: 210, audio: 'singles/panties-on-my-piano.mp3', cover: '/intro/img/covers/panties-on-my-piano.webp', e: true, year: 2025, plays: 14, credits: 'Produced by Mr. CAP' }),
  T({ id: 'e11f682c-7b9d-49f7-bec8-856fa047d3c1', title: 'Big Navi (L.A. Remix)', slug: 'big-navi-la-remix', ft: 'Big Prez', d: 338, audio: 'tracks/Big%20Navi%20remix.mp3', cover: '/intro/img/covers/big-navi-remix.webp', e: true, year: 2025, plays: 6, apple: 'https://music.apple.com/us/album/big-navi-feat-big-prez-l-a-remix-single/827108067' }),
  // ── 2024 singles
  T({ id: '09aa34c7-b890-4929-99a8-2e87c2b4aa26', title: 'Today Was a Great Day', slug: 'today-was-a-great-day', audio: 'tracks/today-was-a-great-day.mp3', cover: '/intro/img/covers/today-great-day.png', year: 2024, spotify: SP + '3a4JqImOyX4XZclqwu14fc', apple: 'https://music.apple.com/us/album/today-was-a-great-day-feat-paul-wall-lil-keke-lisa/1348973769' }),
  T({ id: '57306f16-c41c-47bd-a770-cbec847fedbd', title: 'Unsolved Mysteries', slug: 'unsolved-mysteries', audio: 'tracks/unsolved-mysteries.mp3', cover: '/intro/img/covers/unsolved-mysteries.jpg', year: 2024, spotify: SP + '6yovVFcjPCu50pkbPp4Hyv' }),
  T({ id: '82718687-60a2-4170-96a0-eaa0cfd30f66', title: 'Social Media is a Ho Stroll', slug: 'social-media-is-a-ho-stroll', ft: "Ai'Eshsa", d: 215, cover: '/intro/img/covers/social-media-ho-stroll.jpg', year: 2024, spotify: 'https://open.spotify.com/album/4bsmgfprURANYz7rGGnXUu', apple: 'https://music.apple.com/us/album/social-media-is-a-ho-stroll-feat-aieshsa-single/1778566538' }),
  // ── 2023 / 2022 singles
  T({ id: '17a8cdb4-4773-445c-9e63-d99b58d8c095', title: 'Southern Sounds (Ultra ISM)', slug: 'southern-sounds-ultra-ism', ft: 'Venita Vyne', d: 235, cover: '/intro/img/covers/southern-sounds.webp', year: 2023, spotify: 'https://open.spotify.com/album/29ySLtV4S9h7VoUJu6MJkW', apple: 'https://music.apple.com/us/album/southern-sounds-ultra-ism-feat-venita-vyne-single/1716274688' }),
  T({ id: '6aa3da13-e24a-4dba-b077-f3f3c8e80a4e', title: 'H-Town Represent', slug: 'h-town-represent', ft: 'Ciddy Boi P', d: 198, cover: '/intro/img/covers/h-town-represent.webp', year: 2023, spotify: 'https://open.spotify.com/album/2kKaArS06vOQ04WlZfi3VF', apple: 'https://music.apple.com/us/album/h-town-represent-feat-ciddy-boi-p-single/1684608475' }),
  T({
    id: 'a5aa4ec8-0ee5-42ca-a493-65cc8abe88e3', title: 'Dippin Thru the Metaverse', slug: 'dippin-thru-the-metaverse', ft: 'Ciddy Boi P', d: 210,
    audio: 'singles/dippin-thru-metaverse.mp3', cover: '/intro/img/covers/dippin-metaverse.webp', year: 2023,
    story: 'Houston street culture meets emerging digital worlds: classic Southern swagger with the language of blockchain, NFTs and the new creative frontier.',
    credits: 'Written & produced by Mr. CAP · Executive produced by CAP Distributions',
  }),
  T({ id: 'f42be915-7cae-4886-ac75-036ddaf0dbe0', title: 'Bout to Blow', slug: 'bout-to-blow', d: 205, cover: '/intro/img/covers/bout-to-blow.webp', year: 2022, spotify: SP + '1fJ6DPwYRmKLn0fHb0M1dv', apple: 'https://music.apple.com/us/album/im-bout-to-blow-single/1484204759' }),
  T({ id: '1267dc13-3c4d-4b62-b6c2-82f44dc6472b', title: 'Limitless', slug: 'limitless', d: 230, audio: 'singles/limitless.mp3', cover: '/intro/img/covers/limitless.webp', year: 2022, spotify: SP + '6udpodXU5175FuC8t62rd0' }),

  // ── The Ties That Bind Us (2024)
  ...[
    [1, '52aa8bf8-fa48-482a-91fe-b51bdbd6ac41', 'Scarface Speaks', 'scarface-speaks', 59, '01.%20SCAREFACE%20SPEAKS%20(M).mp3', '3ls4v3GZBSk440dSLZV5HO', 1],
    [2, '347cb2e3-b4e1-4ed1-9b01-28ff229429f5', 'Ties That Bind Us', 'ties-that-bind-us', 210, '02.%20TIES%20THAT%20BIND%20US%20(M).mp3', '2wSn5CkTrZevQNYgpJV20u', 1],
    [3, '5d49a5eb-e523-4726-980d-00a342d22718', 'Respect', 'respect-ties', null, '03.%20RESPECT%20(M).mp3', '6zzTlQ53ITwV8hAfXD6G3e', 0],
    [4, '83796a62-8e96-40c4-adc8-679c21db60d5', 'Come Get It If You Want It', 'come-get-it-if-you-want-it', 225, '04.%20COME%20GET%20IF%20YOU%20WANT%20IT%20(M).mp3', '5YKjwcBwPQUHDnDZSWNw71', 1],
    [5, '9116c916-634e-4806-ab07-2a679201b9b7', 'Misplaced Trust', 'misplaced-trust', 179, '05.%20MISPLACED%20TRUST%20(M).mp3', '58BI0C7GUrLwUVbJ8haclF', 0],
    [6, 'd693184a-177b-47d4-a8fb-bafeb3d55bda', "Bet'n On Me", 'bet-on-me', 119, '06.%20BET%20ON%20ME%20(M).mp3', '4ZhkHaZ5GxZbentBbJO2Uz', 1],
    [7, '82bcbed9-bdfa-4638-ae00-f1a493360f31', 'No Justice', 'no-justice', 292, '07.%20NO%20JUSTICE%20(M).mp3', '7wQaagfZYqerVty3TaT1Wq', 0],
    [8, '692b8ddf-451b-4b09-972b-4a683803d77c', 'So Thankful', 'so-thankful', 209, '08.%20SO%20THANKFUL%20(M).mp3', '3FGfD3gLn9gPRBVp4Qrymp', 1],
    [9, '8cb4d0d4-50ea-4d5f-9b44-08284dedd343', 'New Better Do Better', 'new-better-do-better', 267, '09.%20NEW%20BETTER%20DO%20BETTER%20(M).mp3', '2IVFJDlmmOXkzlz87gmuDB', 1],
    [10, 'cbde8d8d-5b26-40f9-8c94-909885e585e7', 'Without Me', 'without-me', 199, '10.%20WITHOUT%20ME%20(M).mp3', '3UsrH9rQaSz5OGzTSYZfwI', 0],
    [11, '4423f8bd-4768-4bf0-bf8f-103f7e71c9a1', 'Eternal Legacy', 'eternal-legacy', 203, '11.%20ETERNAL%20LEGACY%20(M).mp3', '1SHKTxka5XtIUZNzJmAySC', 1],
    [12, 'b78e80ce-c57b-4eeb-8b7f-ca7a512580f2', 'Recon the Opp', 'recon-the-opp', 329, '12.%20RECON%20THE%20OPP%20(M).mp3', '2BTGceSSab6rortCeWQatd', 4],
    [13, '0a97fc71-c2f7-484f-8ab7-56de2591c4b3', 'Lips N Hips', 'lips-n-hips', 189, '13.%20LIPS%20N%20HIPS%20(M).mp3', '7DxxwobTm6f8vMhQcz6hEU', 1],
    [14, '0e724597-d615-4602-a2d9-07ef5977a606', 'If I Say So', 'if-i-say-so', 271, '14.%20IF%20I%20SAY%20SO%20(M).mp3', '1aZBvWpgG6bGN96Nf1myE2', 1],
    [15, '3efe5ccb-c029-42af-b41f-e42f8c91f50a', "Something You're Not", 'something-youre-not', 191, '15.%20SOMETHING%20YOUR%20NOT%20(M).mp3', '6pCb4OnWjY3Nw9ZejFkYk4', 1],
    [16, '4500e7ac-1bb0-42cd-95ca-c69892c070d7', 'Letter to Me', 'letter-to-me', 213, '16.%20LETTER%20TO%20ME%20(M).mp3', '19XO2VCVusNu01cKEawV6C', 0],
    [17, '2fe691ec-3bb0-4951-9478-658bf73f77e5', 'Nobody Comes Close', 'nobody-comes-close', 155, '17.%20NOBODY%20COMES%20CLOSE%20(M).mp3', '2arc8Od3oKsS1cZwnzcc1B', 0],
    [18, 'b9b6a362-6ca5-4e41-af20-4bd7f010f3fc', 'A.C. Chill', 'ac-chill', 154, '18.%20A.C%20CHILL%20(M).mp3', '1e26GHRn2A9guE3BXXgAhg', 0],
    [19, 'c4699c83-24d5-48cc-a569-3aaaceaa86af', 'The Coalition', 'the-coalition', 479, '19.%20THE%20COALITION%20(M).mp3', '7r7z5cRdVpue2xk8bt0ThH', 0],
  ].map(([n, id, title, slug, d, file, sp, plays]) => T({
    id, title, slug, n, d, plays, artist: 'South Park Coalition', album: 'the-ties-that-bind-us', year: 2024,
    audio: 'The-Ties-That-Bind-Us/' + file, cover: '/intro/img/covers/ties.webp', spotify: SP + sp, apple: AM_TIES,
  })),

  // ── The Art of ISM (2019)
  ...[
    [1, 'bf991d35-3afb-4fbd-be49-77483a34be1c', 'Evolution of the 16th Letter', 'evolution-of-the-16th-letter', 245, '01 Evolution of the16th Letter.mp3', '1JK2otvz80R3nS4Ssb2SJU'],
    [2, '2916d415-c74b-4b87-86d9-4db3deccb056', 'Focus', 'focus', 210, '02 Focus.mp3', null],
    [3, '931e8805-ce11-4a9d-8b46-c012171e76cd', 'International Club Hopper', 'international-club-hopper', 198, '03 International Club Hopper.mp3', '09goH61xSnfq5GRDnwehF0'],
    [4, '97522a96-a5ba-4f24-844e-4281fef8aa60', 'How You Feel', 'how-you-feel', 220, '04 How You Feel About It.mp3', null],
    [5, '2ab5a087-2a46-4dc1-95d6-6e73f2075357', 'Words Of ISM', 'words-of-ism', 235, '05 Words Of ISM.mp3', null],
    [6, 'e6b06385-9c60-4857-a814-876f006d5a52', 'Let Me Touch It', 'let-me-touch-it', 215, '06 Let Me Touch It.mp3', null],
    [7, '196552ac-d151-420c-818c-2347e673169b', 'Space Age ISM', 'space-age-ism', 240, '07 Space Age ISM.mp3', null],
    [8, 'f22ec1cd-2f64-4b7b-a305-b7a57e1d94ed', 'The Realest', 'the-realest', 228, '08 The Realest.mp3', '1c0aX0LZz9WW89OKIsHGUt'],
    [9, 'd18b9e09-214d-4114-9e60-1b2ff7f0a3f7', 'For Money', 'for-money', 205, '09 For Money.mp3', '3C0CJNkrLf8QgX8ANv6BCb'],
    [10, '5f757905-f640-4f49-a81c-6124d6c7d254', 'Nothing Without It', 'nothing-without-it', 195, '10 Nothing Without It.mp3', null],
    [11, '29ee20a5-75d5-4c51-9569-48d21935f1b4', 'Capism', 'capism', 250, '11 Capism.mp3', '6RiTkDvUJymIH22St3ImdR'],
  ].map(([n, id, title, slug, d, file, sp]) => T({
    id, title, slug, n, d, album: 'the-art-of-ism', year: 2019,
    audio: 'art-of-ism/' + encodeURI(file), cover: '/intro/img/covers/art-of-ism-nft.webp', spotify: sp ? SP + sp : null, apple: AM_ISM,
  })),

  // ── 2 Tha Grave (2011)
  ...[
    [1, 'bfdbabe1-fcc7-4cd2-b557-c80361a204e6', '2 Tha Grave', '2-tha-grave', 243, '2 tha grave.mp3'],
    [3, 'c36009d7-e9b1-43ba-812a-2fd67815a404', 'Gotta Get Mine', 'gotta-get-mine', 294, 'Gotta Get Mine.mp3'],
    [4, '3df216fc-5299-4c97-be34-6483cc60ab60', 'Head Bashin', 'head-bashin', null, 'Head Bashin.mp3'],
    [5, 'b876e3a2-10a8-41de-97ac-3658e5077241', 'I Want Money', 'i-want-money', null, 'I Want Money.mp3'],
    [6, '6f552eaf-7e55-47fa-8ed8-ade20b959e3d', 'Live My Life', 'live-my-life', null, 'Live My Life.mp3'],
    [7, '0bd2bccd-098b-4a53-991f-a09ba5a31eb2', 'My Neck of Da Hood', 'my-neck-of-da-hood', 262, 'My Neck of Da Hood.mp3'],
    [8, '780b2ab9-912d-4f2d-ab63-cb9bc1131c74', 'Purple Dream', 'purple-dream', 179, 'Purple Dream.mp3'],
    [9, '25745596-341b-4839-9b7f-9a9af4083fd0', 'Sittin In My Room', 'sittin-in-my-room', null, 'Sittin In My Room .mp3'],
    [10, '5fb83e55-be0c-4a8b-ac5c-98d65a152f28', 'What You Want', 'what-you-want', 199, 'What You Want.mp3'],
  ].map(([n, id, title, slug, d, file]) => T({
    id, title, slug, n, d, album: '2-tha-grave', year: 2011, audio: '2-tha-grave/' + encodeURI(file), cover: '/intro/img/covers/grave.webp',
  })),

  // ── Tha Cold Ass Pimp (2006)
  ...[
    [1, 'ba04429d-0812-4ae3-8d16-61d4329cafec', 'Are You Pimpin', 'are-you-pimpin', null, 'Are%20You%20Pimpin.mp3', false],
    [2, '53298c73-c21b-49aa-8b76-9bab0eda58bf', 'Back @ My Pimpin', 'back-at-my-pimpin', null, 'Back%20%40%20My%20Pimpin.mp3', false],
    [3, 'a33dce43-76a4-49aa-a7ff-03d9bcbe663f', "Can't Nobody", 'cant-nobody', null, "Can't%20Nobody.mp3", false],
    [4, '98b6c47a-ec0b-42c2-8b63-52f61ace696a', 'Gettin Some Head (Remix)', 'gettin-some-head-remix', null, 'Gettin%20Some%20Head%20(Remix).mp3', true],
    [5, 'd6759044-60c7-482f-801d-2eaa95077e1f', "I'm Pimpin", 'im-pimpin', null, "I'm%20Pimpin.mp3", false],
    [6, 'bfb757e3-e1ba-401a-a752-be28e9afd6b0', "I'm Straight", 'im-straight', 296, "I'm%20Straight.mp3", false],
    [7, '672ad0da-4ef1-40b9-863f-c768344766dd', 'Pimp On It', 'pimp-on-it', 278, 'Pimp%20On%20It.mp3', false],
    [8, 'aeb30bb8-9a7f-4c8d-87e3-f14e0a346d34', 'R.A.P. (Rap And Pimp)', 'rap-and-pimp', 162, 'R.A.P.%20(Rap%20And%20Pimp).mp3', false],
    [9, 'e76e0d96-086d-40b5-837f-57113a8a47ad', 'That Bitch', 'that-bitch', null, 'That%20Bitch.mp3', true],
    [10, 'ba69b32d-ccc5-4c1c-9274-335870fbc2a0', "You Ain't Pimpin", 'you-aint-pimpin', 163, "You%20Ain't%20Pimpin.mp3", false],
  ].map(([n, id, title, slug, d, file, e]) => T({
    id, title, slug, n, d, e, album: 'tha-cold-ass-pimp', year: 2006, audio: 'Cold-Ass-Pimp/' + file, cover: '/intro/img/covers/cold-ass-pimp.webp',
  })),
];

// The hero record: "Bet'n On Me" is hosted with the site itself and plays in full (as on the live homepage).
export const HERO_TRACK = {
  ...TRACKS.find((t) => t.slug === 'bet-on-me'),
  audio: '/audio/betn-on-me.mp3', free: true, d: null,
};

export const bySlug = Object.fromEntries(TRACKS.map((t) => [t.slug, t]));
export const albumBySlug = Object.fromEntries(ALBUMS.map((a) => [a.slug, a]));
export const albumTracks = (slug) => TRACKS.filter((t) => t.album === slug).sort((a, b) => a.n - b.n);
export const SINGLES = TRACKS.filter((t) => !t.album).sort((a, b) => b.year - a.year);
export const HOUSE_CHARTS = [...TRACKS].filter((t) => t.plays > 0).sort((a, b) => b.plays - a.plays).slice(0, 5);
export const LATEST = ['bet-on-her', 'my-world', 'big-boy-drip'].map((s) => bySlug[s]);
