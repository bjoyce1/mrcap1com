import { ARTISTS, GAME_CONFIG, PAYLINES } from '../legends/config';
import { breadcrumb, personRef } from '../../seo/builders';
import { abs } from '../../seo/site';
import type { SeoEntry } from '../../seo/types';

export const CAMPAIGN = 'operation_713_legends_takeover';
export const artistArtwork = (id: string) => `/games/spc-legends/symbols/${id}.webp`;
export const cultureLinks = [
  { href: '/south-park-coalition', label: 'South Park Coalition' },
  { href: '/houston-hip-hop-history', label: 'Houston hip-hop history' },
  { href: '/who-is-mr-cap', label: 'Meet Mr. CAP' },
  { href: '/music', label: 'Listen to the music' },
];
export const hubLinks = [
  { href: '/legends/about', label: 'About the experience' },
  { href: '/legends/how-to-play', label: 'How to play' },
  { href: '/legends/artists', label: 'Meet the Legends' },
  { href: '/legends/news', label: 'Stories' },
  { href: '/legends/media', label: 'Press & media' },
  { href: '/legends/faq', label: 'Questions' },
];
export const FAQ = [
  { question: 'What is SPC Legends?', answer: 'SPC Legends: Spin the Mix is a browser-based, music-inspired arcade experience presented by 713MIXHOUSE / Mr. CAP. It celebrates South Park Coalition artists through character artwork, Houston symbols and win music.' },
  { question: 'Is this a real-money gambling game?', answer: 'No. This is simulated slot-style entertainment. Spins, XP, coins, collections, skins and titles have no cash value and cannot be exchanged for money or real-world prizes. Optional purchases cost real money through PayPal. Wins never award extra spins.' },
  { question: 'How many free spins do I get?', answer: `Guests can try ${GAME_CONFIG.guestTries} spins in their browser. Accounts start with ${GAME_CONFIG.welcomeSpins.toLocaleString()} one-time welcome spins, then receive ${GAME_CONFIG.dailySpins} free spins each Houston calendar day. Paid packs are optional.` },
  { question: 'How do matching lines work?', answer: `The board has ${GAME_CONFIG.reels} reels and ${GAME_CONFIG.rows} rows. Standard wins start at reel one and need three consecutive matching symbols on one of ${PAYLINES.length} paylines. Vertical stacks are separate wins. The Winning Lines viewer shows the exact positions.` },
  { question: 'Can a Wild count as an artist for SPC Unity?', answer: 'No. Wilds substitute in standard matching lines and vertical stacks, but SPC Unity and Supreme Legendary require actual artist tiles. Read the Rewards page and inspect your result for the credited rules.' },
  { question: 'Are all Legends available on account reels?', answer: 'Account reels use your owned collection and unlocks, with Mr. CAP as the starter. Buying a locked Legend makes that artist eligible for your reels and changes the available symbol pool. Guest tries use the full roster.' },
  { question: 'Where can I learn about the artists and the culture?', answer: 'Explore the roster directory, the South Park Coalition page, the Houston hip-hop history feature and Mr. CAP’s official biography and music catalog. Reviewed artist profiles will appear in the directory when approved.' },
  { question: 'What is the age requirement for purchases?', answer: 'Purchase checkout requires confirmation that you are 18 or older. The campaign is intended for adults and does not promise earnings or monetary rewards. See the game purchase terms before buying.' },
];

export const infoPages = [
  {
    path: '/legends/about', title: 'About SPC Legends | Houston Hip-Hop Arcade', h1: 'SPC Legends: Spin the Mix',
    description: 'Meet SPC Legends: Spin the Mix, a Houston hip-hop browser arcade presented by 713MIXHOUSE and Mr. CAP, celebrating South Park Coalition music and culture.',
    summary: [FAQ[0].answer, 'The experience brings artist portraits, Houston neighborhoods, studio symbols and music together on a six-reel board. It is entertainment, not a way to earn money.'],
  },
  {
    path: '/legends/how-to-play', title: 'How to Play SPC Legends | Spins, Lines & XP', h1: 'Find your mix.',
    description: 'Learn SPC Legends spins, matching paylines, vertical stacks and virtual XP. Explore the Winning Lines viewer, account collections and Houston-day free spins.',
    summary: [FAQ[2].answer, FAQ[3].answer, FAQ[4].answer, FAQ[5].answer],
  },
  {
    path: '/legends/artists', title: 'SPC Legends Artists | Meet the Featured Roster', h1: 'The artists. The culture.',
    description: 'Explore the featured SPC Legends artist roster with approved character artwork, connections to South Park Coalition music and links to the Houston arcade.',
    summary: [`The current artist roster features ${ARTISTS.map(a => a.name).join(', ')}.`, 'These are the artists represented in the game, not a complete membership list of the South Park Coalition. Legendary Guardians and development-only guests are separate from the artist roster.'],
  },
  {
    path: '/legends/news', title: 'SPC Legends Stories | Music, Culture & the Game', h1: 'Inside the mixhouse.',
    description: 'Read approved SPC Legends stories about music, Houston culture and the game. Explore the existing Mr. CAP editorial archive and South Park Coalition history.',
    summary: ['Stories about music, Houston culture and the SPC Legends experience appear here after editorial review.', 'Explore the existing Mr. CAP blog and press archive for published first-party material while new interviews and game stories are prepared.'],
  },
  {
    path: '/legends/media', title: 'SPC Legends Media | Official Press Resources', h1: 'SPC Legends. For the record.',
    description: 'Official SPC Legends project description, approved game artwork and media contacts. Find Mr. CAP biography, music, press resources and Houston cultural context.',
    summary: [FAQ[0].answer, 'Presented by 713MIXHOUSE / Mr. CAP. For interviews and media inquiries, contact mrcap11@gmail.com or use the existing booking form. Official biography, music and press assets remain in the Mr. CAP press archive.'],
  },
  {
    path: '/legends/faq', title: 'SPC Legends FAQ | Gameplay, Artists & Virtual Rewards', h1: 'Questions from the mix.',
    description: 'Answers about SPC Legends gameplay, free spins, artist collections, Wild symbols and virtual rewards. Read the rules and purchase terms before joining the mix.',
    summary: [FAQ[0].answer, FAQ[1].answer, FAQ[2].answer],
  },
] satisfies Array<{path: string; title: string; h1: string; description: string; summary: string[]}>;
export const MARKETING_ROUTES: SeoEntry[] = infoPages.map(p => ({ ...p, links: [...hubLinks.filter(l => l.href !== p.path), ...cultureLinks, {href: '/legends', label: 'Play SPC Legends'}], jsonLd: [
  { '@type': p.path.endsWith('/artists') || p.path.endsWith('/news') ? 'CollectionPage' : 'WebPage', '@id': abs(p.path), url: abs(p.path), name: p.h1, description: p.description, isPartOf: {'@id': abs('/#website')}, about: {'@id': abs('/legends#game')} },
  ...(p.path.endsWith('/artists') ? [{ '@type': 'ItemList', itemListElement: ARTISTS.map((a, i) => ({'@type': 'ListItem', position: i + 1, name: a.name, image: abs(artistArtwork(a.id))})) }] : []),
  breadcrumb(['SPC Legends', '/legends'], [p.h1, p.path]),
] }));
export const gameSchema = {
  '@type': 'VideoGame', '@id': abs('/legends#game'), name: 'SPC Legends: Spin the Mix', url: abs('/legends'),
  description: FAQ[0].answer, genre: ['Music', 'Arcade'], gamePlatform: 'Web browser', playMode: 'SinglePlayer',
  creator: personRef, inLanguage: 'en-US', applicationCategory: 'Game', operatingSystem: 'Web browser',
};

export interface MarketingContent {
  id: string; kind: 'artist' | 'article'; slug: string; title: string; excerpt: string; body: string; image_url: string;
  sources: string[]; links: Array<{label: string; href: string}>; category: string; tags: string[]; seo_title: string; seo_description: string;
  author: string; reviewed: boolean; status: 'draft' | 'published'; published_at: string | null; updated_at: string;
}
export const contentPath = (row: Pick<MarketingContent, 'kind' | 'slug'>) => `/legends/${row.kind === 'artist' ? 'artists' : 'news'}/${row.slug}`;
export const safeHttps = (value: string) => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };
export function publicationErrors(row: MarketingContent): string[] {
  const errors: string[] = [];
  if (!row.reviewed) errors.push('Editorial review is required.');
  if (row.body.trim().length < 120) errors.push('Add a complete, verified body of at least 120 characters.');
  if (!row.sources.length || !row.sources.every(safeHttps)) errors.push('Add valid HTTPS source links.');
  if (!row.excerpt.trim()) errors.push('Add a summary.');
  if (!safeHttps(row.image_url)) errors.push('Add an approved HTTPS image.');
  if (!row.seo_title.trim() || row.seo_title.length > 59) errors.push('SEO title must contain 1 to 59 characters.');
  if (row.seo_description.length < 140 || row.seo_description.length > 160) errors.push('SEO description must contain 140 to 160 characters.');
  if (row.kind === 'article' && !row.author.trim()) errors.push('Add an author.');
  if (row.kind === 'artist' && !ARTISTS.some(a => a.id === row.slug)) errors.push('Artist must be in the current game roster.');
  return errors;
}
export const isPublished = (row: MarketingContent, now = Date.now()) => row.status === 'published' && publicationErrors(row).length === 0 && !!row.published_at && Date.parse(row.published_at) <= now;
export function contentSeo(row: MarketingContent): SeoEntry {
  const path = contentPath(row); const published = isPublished(row);
  return {path, title: row.seo_title || `${row.title} | SPC Legends`, description: row.seo_description || row.excerpt, h1: row.title,
    summary: [row.excerpt, ...row.body.split(/\n\s*\n/).filter(Boolean)].slice(0, 4), ogType: row.kind === 'article' ? 'article' : 'profile',
    ogImage: row.image_url || undefined, ogImageAlt: row.title, noIndex: !published,
    links: [{href: '/legends', label: 'Play SPC Legends'}, ...cultureLinks],
    jsonLd: [row.kind === 'article' ? {'@type': 'Article', headline: row.title, description: row.excerpt, image: row.image_url, datePublished: row.published_at, dateModified: row.updated_at,
      author: ['Mr. CAP', 'Cornelius A. Pratt'].includes(row.author) ? personRef : {'@type': 'Person', name: row.author}, mainEntityOfPage: abs(path), publisher: personRef}
      : {'@type': 'ProfilePage', mainEntity: row.slug === 'mr-cap' ? personRef : {'@type': 'Person', '@id': abs(`${path}#person`), name: row.title}, url: abs(path), image: row.image_url},
      breadcrumb(['SPC Legends', '/legends'], [row.kind === 'artist' ? 'Artists' : 'Stories', row.kind === 'artist' ? '/legends/artists' : '/legends/news'], [row.title, path])],
  };
}
export const draftTopics = ['The Story Behind SPC Legends: Spin the Mix', 'The History and Legacy of the South Park Coalition', 'How Houston Helped Shape Southern Hip-Hop', 'Meet the Artists Behind SPC Legends', 'The Evolution of Underground Houston Rap', "Houston’s Independent Music Movement", 'From Music to Gaming: The SPC Legends Experience', "The Cultural Influence of Houston’s South Park", 'How Technology Is Changing Independent Hip-Hop', 'Behind the Scenes of SPC Legends', "Understanding Houston’s Unique Hip-Hop Sound", 'Preserving Houston Hip-Hop History for Future Generations'];
export const calendarTasks = ['Technical SEO review','Campaign announcement','Founder introduction','Game overview','Promotional trailer review','Press release review','Email announcement review','K-Rino spotlight','Mr. CAP spotlight','Point Blank spotlight','Klondike Kat spotlight','Artist interview request','Character feature','Artist collaboration request','Houston neighborhood story','South Park Coalition history','Independent music culture','Podcast outreach draft','Media outreach draft','Cultural editorial review','Community story','Founder interview','Development update','Community feedback','Artist interview edit','SEO performance review','Content performance review','Campaign optimization','Approval review','Next-month planning'];
export interface CalendarItem {day: number; title: string; status: string; platform?: string; theme?: string; caption?: string; assets?: string; url?: string}
export interface CampaignLink {label: string; url: string; status: string}
export interface SearchSetup {gscStatus: string; bingStatus: string; ga4Status: string; gscNote: string; bingNote: string}
const PLATFORMS = ['Instagram','TikTok','Facebook','X','YouTube Shorts','Email'];
const SLOGAN = 'Spin the Mix. Play the Culture. Become a Legend.';
const FOOT = 'For adults. Virtual rewards only, no cash value.';
export function calendarDraft(day: number, title: string): CalendarItem {
  const theme = CALENDAR_THEMES[(day - 1) % CALENDAR_THEMES.length];
  const platform = PLATFORMS[(day - 1) % PLATFORMS.length];
  const artist = ARTISTS[(day - 1) % ARTISTS.length];
  const spotlight = /spotlight|Character feature/i.test(title);
  const name = spotlight ? (title.match(/^(.*) spotlight$/)?.[1] ?? artist.name) : '';
  const path = name ? '/legends/artists' : theme === 'Houston Hip-Hop History' ? '/legends/news' : theme === 'Behind the Game' ? '/legends/how-to-play' : '/legends';
  const caption = name ? `Meet ${name}, one of the twelve artists on the SPC Legends reels. ${SLOGAN} ${FOOT}`
    : theme === 'Behind the Game' ? `Six reels, 26 paylines and twelve Houston artists. Here is how SPC Legends works. ${SLOGAN} ${FOOT}`
    : theme === 'Houston Hip-Hop History' ? `Houston built its own sound. Read the story behind the culture on the reels. ${SLOGAN}`
    : theme === 'South Park Coalition Legacy' ? `South Park gave the coalition its name. Explore the SPC legacy behind the game. ${SLOGAN}`
    : theme === 'Independent Artist Ownership' ? `Independent from the start. How Houston artists built their own lane. ${SLOGAN}`
    : theme === 'Music Meets Technology' ? `Hit a Legend and hear their song. Music and play in one Houston arcade. ${SLOGAN} ${FOOT}`
    : `The 713 Takeover starts now. Twelve Legends, five Houston hoods, one mix. ${SLOGAN} ${FOOT}`;
  const source = platform === 'Email' ? 'email' : platform === 'YouTube Shorts' ? 'youtube' : platform.toLowerCase();
  return {day, title, status: 'draft', platform, theme, caption: `${caption} #SPCLegends #HoustonHipHop`, assets: name ? `${name} approved character artwork, vertical crop` : 'Approved game screen capture or logo, platform-sized crop', url: `https://mrcap1.com${path}?utm_source=${source}&utm_medium=${source === 'email' ? 'newsletter' : 'social'}&utm_campaign=${CAMPAIGN}&utm_content=day_${day}`};
}
export const initialWorkspace = () => ({
  calendar: calendarTasks.map((title, i) => calendarDraft(i + 1, title)),
  captions: PLATFORMS.map(platform => ({platform, status: 'draft', text: `${SLOGAN} Explore SPC Legends at mrcap1.com/legends. ${FOOT} #SPCLegends #SouthParkCoalition #713MixHouse #HoustonHipHop #MrCAP`})),
  outreach: [] as Array<{name: string; channel: string; status: string; notes: string}>,
  links: [] as CampaignLink[],
  search: {gscStatus: 'not-started', bingStatus: 'not-started', ga4Status: 'tag-configured', gscNote: '', bingNote: ''} as SearchSetup,
});
/** Fill fields added after a workspace was first saved, without overwriting saved drafts. */
export function mergeWorkspace(saved: Partial<ReturnType<typeof initialWorkspace>> | null | undefined) {
  const base = initialWorkspace();
  if (!saved) return base;
  return {...base, ...saved,
    calendar: (saved.calendar?.length ? saved.calendar : base.calendar).map((item, i) => item.caption ? item : {...calendarDraft(item.day ?? i + 1, item.title), status: item.status}),
    links: saved.links ?? base.links, search: {...base.search, ...(saved.search ?? {})}};
}
export type Workspace = ReturnType<typeof initialWorkspace>;

export type ContentFilter = 'all' | 'research' | 'artwork' | 'review' | 'ready' | 'published' | 'updating';
export const FILTER_LABELS: Record<ContentFilter, string> = {all:'All', research:'Needs research', artwork:'Needs artwork', review:'Needs editorial review', ready:'Ready to publish', published:'Published', updating:'Needs updating'};
const STALE_MS = 180 * 24 * 3600 * 1000;
/** Editorial quality checks. An editorial indicator only, never a ranking prediction. */
export function scorecard(row: MarketingContent) {
  const internal = row.links.filter(l => l.href.startsWith('/')).length + (row.body.match(/mrcap1\.com\//g) ?? []).length;
  const checks = [
    {label:'Title', ok: !!row.seo_title.trim() && row.seo_title.length <= 59},
    {label:'Meta description', ok: row.seo_description.length >= 140 && row.seo_description.length <= 160},
    {label:'Heading structure', ok: (row.body.match(/^## /gm) ?? []).length >= 2},
    {label:'Original content', ok: row.body.replace(/\s+/g,' ').length >= 600 && !/Research needed|What this story needs/.test(row.body)},
    {label:'Internal links', ok: internal >= 2},
    {label:'Source references', ok: row.sources.length >= 2 && row.sources.every(safeHttps)},
    {label:'Image', ok: safeHttps(row.image_url)},
    {label:'Image alt text', ok: safeHttps(row.image_url) && !!row.title.trim()},
    {label:'Canonical URL', ok: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug)},
    {label:'Social sharing', ok: safeHttps(row.image_url) && !!row.seo_title && !!row.seo_description},
    {label:'Editorial review', ok: row.reviewed},
    {label:'Publication ready', ok: publicationErrors(row).length === 0},
  ];
  return {checks, score: checks.filter(c => c.ok).length, total: checks.length};
}
export function matchesFilter(row: MarketingContent, filter: ContentFilter, now = Date.now()): boolean {
  switch (filter) {
    case 'research': return row.tags.includes('needs-research') || row.sources.length < 2 || /Research needed|What this story needs|Needs verification|Sources needed/.test(row.body);
    case 'artwork': return !safeHttps(row.image_url);
    case 'review': return !row.reviewed;
    case 'ready': return row.status === 'draft' && publicationErrors(row).length === 0;
    case 'published': return row.status === 'published';
    case 'updating': return row.status === 'published' && now - Date.parse(row.updated_at) > STALE_MS;
    default: return true;
  }
}
export const CAMPAIGN_CHANNELS = [
  {source:'instagram',medium:'social',label:'Instagram'},{source:'facebook',medium:'social',label:'Facebook'},{source:'tiktok',medium:'social',label:'TikTok'},
  {source:'x',medium:'social',label:'X'},{source:'youtube',medium:'video',label:'YouTube'},{source:'email',medium:'newsletter',label:'Email newsletter'},
  {source:'qr',medium:'flyer',label:'QR flyer'},{source:'press',medium:'earned_media',label:'Press coverage'},{source:'podcast',medium:'audio',label:'Podcast appearance'},
];
export const CALENDAR_THEMES = ['The 713 Takeover','Meet the Legends','Houston Hip-Hop History','Behind the Game','South Park Coalition Legacy','Independent Artist Ownership','Music Meets Technology'];
