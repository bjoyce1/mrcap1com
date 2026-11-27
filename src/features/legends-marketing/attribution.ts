import { CAMPAIGN } from './content';
export const SOURCES = ['facebook','instagram','tiktok','x','youtube','email','qr','artist','press','podcast','google'];
const token = (s: string) => /^[a-z0-9_-]{1,80}$/.test(s) ? s : '';
export function campaignUrl(path: string, source: string, medium: string, content = '', term = ''): string {
  const url = new URL(path, 'https://mrcap1.com');
  if (url.origin !== 'https://mrcap1.com' || !/^\/legends(?:\/(about|how-to-play|artists(?:\/[a-z0-9-]+)?|news(?:\/[a-z0-9-]+)?|media|faq|rewards))?$/.test(url.pathname)) throw new Error('Choose a public SPC Legends page.');
  url.search = ''; url.hash = '';
  if (!SOURCES.includes(source) || !token(medium)) throw new Error('Choose a source and a nonpersonal campaign medium.');
  url.searchParams.set('utm_source',source); url.searchParams.set('utm_medium',medium); url.searchParams.set('utm_campaign',CAMPAIGN);
  if (token(content)) url.searchParams.set('utm_content',content);
  if (token(term)) url.searchParams.set('utm_term',term);
  return url.href;
}
export function readAttribution(search: string) {
  const params = new URLSearchParams(search);
  if (params.get('utm_campaign') !== CAMPAIGN || !SOURCES.includes(params.get('utm_source') ?? '')) return null;
  return Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(key => [key,token(params.get(key) ?? '')]).filter(([,v]) => v));
}
export function rememberAttribution(search: string, storage: Pick<Storage,'getItem'|'setItem'>): void {
  const attribution = readAttribution(search); if (!attribution) return;
  try {
    if (!storage.getItem('legends-first-touch')) storage.setItem('legends-first-touch',JSON.stringify(attribution));
    storage.setItem('legends-last-touch',JSON.stringify(attribution));
  } catch { /* unavailable storage must not block content */ }
}
