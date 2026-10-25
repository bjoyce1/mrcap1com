// Content for the private Great Day preview. Everything here is either approved
// (roster, theme line, catalog track) or an empty slot waiting on the owner.

/** The original 2024 single in the catalog; the preview plays its 30-second clip until the remix master is cleared. */
export const ORIGINAL_SINGLE_ID = '09aa34c7-b890-4929-99a8-2e87c2b4aa26';
export const PREVIEW_SECONDS = 30;
/** temporary cover art (not final), shown in the pendant and on the edition discs */
export const COVER = '/images/covers/opt/today-great-day-cover-480.webp';

export const THEME_LINE = 'A Great Day Is a State of Mind';
export const HASHTAG = '#TodayWasAGreatDay';

/**
 * Remix lyrics, supplied by the owner. `at` is the second the line starts in the
 * audio that is playing; leave it out to show the words without line timing.
 */
export const LYRICS: { line: string; at?: number }[] = [];

export interface Voice {
  name: string;
  monogram: string;
  role: 'Lead artist' | 'Featuring';
  note?: string;
  /** cleared portrait, supplied by the owner */
  photo?: string;
}

export const VOICES: Voice[] = [
  { name: 'Mr. CAP', monogram: 'CAP', role: 'Lead artist', note: 'Original Member of the South Park Coalition' },
  { name: 'Paul Wall', monogram: 'PW', role: 'Featuring' },
  { name: 'Lil Keke', monogram: 'LK', role: 'Featuring' },
  { name: 'Lisa Dinero', monogram: 'LD', role: 'Featuring' },
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
