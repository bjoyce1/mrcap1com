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
export const initialWorkspace = () => ({
  calendar: calendarTasks.map((title, i) => ({day: i + 1, title, status: 'draft'})),
  captions: ['Instagram','TikTok','Facebook','X','YouTube Shorts','Email'].map(platform => ({platform, status: 'draft', text: 'Spin the Mix. Play the Culture. Become a Legend. Explore SPC Legends at mrcap1.com/legends. For adults. Virtual rewards only, no cash value. #SPCLegends #SouthParkCoalition #713MixHouse #HoustonHipHop #MrCAP'})),
  outreach: [] as Array<{name: string; channel: string; status: string; notes: string}>,
});
export type Workspace = ReturnType<typeof initialWorkspace>;
