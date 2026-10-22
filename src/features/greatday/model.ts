export const PLANNED_URL = 'https://greatday.mrcap1.com/';
export const PRIVATE_GREATDAY_PATHS = ['/greatday-preview', '/admin/greatday'] as const;
export const PLATFORMS = ['instagram', 'tiktok', 'x', 'facebook'] as const;
export type Platform = typeof PLATFORMS[number];
export const TIERS = [
  { name: 'Single', price: '$2.99', detail: 'Proposed single edition. Contents pending approval.' },
  { name: 'Deluxe', price: '$9.99', detail: 'Proposed expanded edition. Contents pending approval.' },
  { name: 'Supporter', price: '$24.99', detail: 'Proposed supporter edition. Contents pending approval.' },
] as const;
export const RELEASE_GATES = [
  'Signed recording and featured-performer rights',
  'Approved master WAV',
  'New ISRC if this is a distinct version',
  'Composition and publisher clearance for interactive streams and downloads',
  'Approved final artwork and campaign assets',
  'Privacy consent and real signup review',
  'Verified secure checkout, webhook and private downloads',
  'Final copy, credits, legal review and analytics QA',
] as const;
export const EVENT_DICTIONARY = [
  ['greatday_view', 'Public world entry after launch'],
  ['greatday_play', 'User starts cleared audio after launch'],
  ['greatday_optin', 'Confirmed, consented signup after launch'],
  ['greatday_wall_submit', 'Consented story submitted for moderation'],
  ['greatday_share', 'User chooses a sharing destination'],
  ['greatday_checkout', 'Verified checkout begins after launch'],
  ['greatday_purchase', 'Webhook-confirmed order, never client-reported'],
] as const;
export function campaignLink(platform: Platform, day: number): string {
  const safeDay = Number.isFinite(day) ? Math.min(7, Math.max(1, Math.trunc(day))) : 1;
  const url = new URL(PLANNED_URL);
  url.searchParams.set('utm_source', platform);
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'great_day_remix_7day');
  url.searchParams.set('utm_content', `day_${safeDay}`);
  return url.toString();
}
export function greatdayDemoAccess(pathname: string): boolean {
  return pathname === '/greatday-preview';
}
export function greatdayAccess(loading: boolean, hasUser: boolean, isAdmin: boolean) {
  if (loading) return 'loading';
  if (!hasUser) return 'signin';
  return isAdmin ? 'allow' : 'denied';
}
export function safeGreatdayReturn(value: unknown): string {
  return typeof value === 'string' && PRIVATE_GREATDAY_PATHS.some((path) => path === value) ? value : '/admin';
}