// Content for the private Great Day preview. Everything here is either approved
// (roster, credits and artwork from the official cover, theme line) or an empty slot waiting on the owner.
import cover from '@/assets/greatday/art/twagd-slowed-chopped-cover.webp';
import coverSmall from '@/assets/greatday/art/twagd-slowed-chopped-cover-480.webp';
import portraitCap from '@/assets/greatday/art/portrait-cap.webp';
import portraitPaul from '@/assets/greatday/art/portrait-paul.webp';
import portraitKeke from '@/assets/greatday/art/portrait-keke.webp';
import portraitLisa from '@/assets/greatday/art/portrait-lisa.webp';

export const TITLE = 'Today Was a Great Day';
export const VERSION = 'Slowed & Chopped';
/** the credit as the cover prints it */
export const CHOPPED_BY = 'Chopped and Slowed by Lil Randy';
export const PRODUCTION = 'Single produced by P-Rod · Trackhouse Productions';
export const PREVIEW_SECONDS = 30;
/** the official Slowed & Chopped cover, full size and a small copy for record labels */
export const COVER = cover;
export const COVER_SMALL = coverSmall;

export const THEME_LINE = 'A Great Day Is a State of Mind';
export const HASHTAG = '#TodayWasAGreatDay';

/**
 * Lyrics, supplied by the owner. `at` is the second the line starts in the
 * audio that is playing; leave it out to show the words without line timing.
 */
export const LYRICS: { line: string; at?: number }[] = [];

export interface Voice {
  name: string;
  monogram: string;
  role: 'Lead artist' | 'Featuring';
  note?: string;
  /** portrait, cropped from the official cover */
  photo?: string;
}

export const VOICES: Voice[] = [
  { name: 'Mr. CAP', monogram: 'CAP', role: 'Lead artist', note: 'Original Member of the South Park Coalition', photo: portraitCap },
  { name: 'Paul Wall', monogram: 'PW', role: 'Featuring', photo: portraitPaul },
  { name: 'Lil Keke', monogram: 'LK', role: 'Featuring', photo: portraitKeke },
  { name: 'Lisa Dinero', monogram: 'LD', role: 'Featuring', photo: portraitLisa },
];

/** Behind-the-record clips, supplied by the owner. Until then the concept image holds the space. */
export const CLIPS: { src: string; poster?: string; title: string }[] = [];

/** Written for the preview to show the wall's shape. Never presented as fan stories. */
export const SAMPLE_STORIES = [
  'Slow morning. Long talk with my mama. Nothing to rush.',
  'Windows down on 288. Same streets, new feeling.',
  'Everybody made it to the table tonight.',
  'Took my daughter to the park and stayed till the lights came on.',
  'Got the call back. Celebrated with a plate from the spot.',
];
