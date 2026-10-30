// Content for the private Great Day preview. Everything here is either approved (roster, credits
// and artwork from the official cover, theme line, the owner's lyric sheet) or an empty slot waiting on the owner.
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

/** One part of the song, from the owner's lyric sheet (2026-10-29). */
export interface LyricPart {
  part: string;
  voice: string;
  lines: string[];
  /** [start, end) line ranges shown before release; the rest wait for the record */
  peek: [number, number][];
  /** the 30-second preview (0:15 to 0:45) plays from inside this part */
  inPreview?: boolean;
}

/** The hook, sung by Lisa Dinero, as the owner's corrected sheet gives it. */
export const HOOK: LyricPart = {
  part: 'The Hook', voice: 'Lisa Dinero', peek: [[0, 4]],
  lines: [
    'Slab on swangas, the sun’s still shinin’',
    'Today’s a great day, I can see the silver lining',
    'You just don’t know how it feels to me-eeeee',
    'Today was a great day',
    'Free in the streets, everything’s chill',
    'South side rollin’ while I’m workin’ wood wheel',
    'You just don’t know how',
    'Today was a great day',
  ],
};

export const VERSES: LyricPart[] = [
  {
    part: 'Verse 1', voice: 'Mr. CAP', peek: [[0, 4], [10, 12]], inPreview: true,
    lines: [
      'Woke up this morning, gave praise to the Most High',
      'I don’t know, but today I feel kinda fly',
      'Turned on the news, nobody in the hood died',
      'And I ain’t trippin’ off the bud, I’m on a natural high',
      'Draped up and dripped out, know what I’m talkin’ ’bout',
      'Ate breakfast, grabbed my keys, then I dipped out',
      'And I ain’t even bring the banger',
      'The laws in H-Town, they be rollin’ on swangas',
      'Check Facebook, last post got a million likes',
      'Bam’s on Griggs got the Range Rover lookin’ tight',
      'Paint drippin’ candy, everything dandy',
      'R.I.P. DJ Screw, holla at Lil Randy',
      'Haters can’t stand me, but I ain’t gotta call ’em out',
      'Rocked the show last night in front of a packed house',
      'Yeah, I’m from the era of the gray tape',
      'I gotta say, today was a great day',
    ],
  },
  {
    part: 'Verse 2', voice: 'Paul Wall', peek: [[0, 6]],
    lines: [
      'I woke up to another day with air in my lungs',
      'I thank God for every moment with my daughter and son',
      'I give praise ’cause God saved me more times than one',
      'Hopped in the Lac time to bend some corners for fun',
      'I’m candy red, turnin’ heads with the trunk up',
      'The law man passed me by and gave me two thumbs up',
      'It ain’t no time for play or hate ’cause it’s money to make',
      'Gone get ya camera ready, I got pictures to take',
      'The PayPal went through, I just got the alert',
      'Paid me for another concert, ten more shirts',
      'Thank God I got work, no more hard times',
      'Mama told me no excuses, just get out and grind',
      'So I got what’s mine with a smile on my face',
      'I got expensive taste so I hustle with fast pace',
      'I got a bond with my wife, it can’t be replaced',
      'Then we straight, I gotta say, today was a great day',
    ],
  },
  {
    part: 'Verse 3', voice: 'Lil Keke', peek: [[0, 4], [10, 12]],
    lines: [
      'H-Town legend for real, still grindin’',
      'Ninety-five degrees in my city, the streets shinin’',
      'Self-made, 713, my own brand',
      'Mama just called, she’s still my biggest fan',
      'Ridin’ in the snow-white Benz and feelin’ lovely',
      'Everything straight and legit, they can’t touch me',
      'Twenty years, couldn’t be better',
      'Got a little time, sent my homie a letter and some cheddar',
      'Today was a real good day and gettin’ greater',
      'The last thing that crossed my mind was another hater',
      'Don Ke, I keep on pushin’, ain’t nothin’ crucial',
      'Crawlin’ still, cuttin’ these corners the slab beautiful',
      'Alive and free, the best thang for a G',
      'Get this money and ride, now that’s key',
      'Keep God in your life and the blessings keep comin’',
      '’Cause I’m good to my kids and a king to my women',
    ],
  },
];

export interface Voice {
  name: string;
  monogram: string;
  role: 'Lead artist' | 'Featuring';
  note?: string;
  /** portrait, cropped from the official cover */
  photo?: string;
  /** Instagram handle, as the owner gave it (2026-10-29) */
  instagram?: string;
}

/** Roles in the owner's words: original members, never founders. */
export const VOICES: Voice[] = [
  { name: 'Mr. CAP', monogram: 'CAP', role: 'Lead artist', note: 'South Park Coalition', photo: portraitCap, instagram: 'mrcapism' },
  { name: 'Paul Wall', monogram: 'PW', role: 'Featuring', note: 'Swishahouse', photo: portraitPaul, instagram: 'paulwallbaby' },
  { name: 'Lil Keke', monogram: 'LK', role: 'Featuring', note: 'Screwed Up Click', photo: portraitKeke, instagram: 'donke713' },
  { name: 'Lisa Dinero', monogram: 'LD', role: 'Featuring', photo: portraitLisa, instagram: 'iamlisacrawford' },
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
