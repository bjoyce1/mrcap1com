import { describe, it, expect } from 'vitest';
import { campaignLink, greatdayAccess, greatdayDemoAccess, PLATFORMS, safeGreatdayReturn, TIERS } from './model';
import { isPrivatePath } from '@/lib/automation';
import { collectPages } from '@/seo/pages';
import { sitemapUrls } from '@/seo/sitemap';

describe('Great Day review rules', () => {
  it('temporarily opens only the Great Day demo without authentication', () => {
    expect(greatdayDemoAccess('/greatday-preview')).toBe(true);
    for (const path of ['/admin/greatday', '/admin', '/admin/captions', '/library', '/auth']) {
      expect(greatdayDemoAccess(path)).toBe(false);
    }
  });
  it('waits during auth loading', () => expect(greatdayAccess(true, true, true)).toBe('loading'));
  it('requires a signed-in user even if an admin flag exists', () => expect(greatdayAccess(false, false, true)).toBe('signin'));
  it('denies signed-in non-admins', () => expect(greatdayAccess(false, true, false)).toBe('denied'));
  it('allows only a signed-in admin', () => expect(greatdayAccess(false, true, true)).toBe('allow'));
  it('uses exactly the three proposed prices', () => expect(TIERS.map((tier) => [tier.name, tier.price])).toEqual([['Single', '$2.99'], ['Deluxe', '$9.99'], ['Supporter', '$24.99']]));
  it('generates distinct tagged planned links for all four channels', () => {
    const links = PLATFORMS.map((platform) => campaignLink(platform, 3));
    expect(new Set(links).size).toBe(4);
    PLATFORMS.forEach((platform, i) => {
      const url = new URL(links[i]);
      expect(url.origin).toBe('https://greatday.mrcap1.com');
      expect(url.searchParams.get('utm_source')).toBe(platform);
      expect(url.searchParams.get('utm_medium')).toBe('social');
      expect(url.searchParams.get('utm_campaign')).toBe('great_day_remix_7day');
      expect(url.searchParams.get('utm_content')).toBe('day_3');
    });
  });
  it('limits the organic campaign to seven days', () => {
    expect(new URL(campaignLink('x', 99)).searchParams.get('utm_content')).toBe('day_7');
    expect(new URL(campaignLink('x', 0)).searchParams.get('utm_content')).toBe('day_1');
  });
  it('only allows local private return paths', () => {
    expect(safeGreatdayReturn('/greatday-preview')).toBe('/greatday-preview');
    expect(safeGreatdayReturn('/admin/greatday')).toBe('/admin/greatday');
    expect(safeGreatdayReturn('https://evil.example/')).toBe('/admin');
    expect(safeGreatdayReturn('//evil.example')).toBe('/admin');
  });
  it('excludes both private routes from analytics without excluding Music', () => {
    expect(isPrivatePath('/greatday-preview')).toBe(true);
    expect(isPrivatePath('/admin/greatday')).toBe(true);
    expect(isPrivatePath('/music')).toBe(false);
  });
  it('keeps private pages noindex and out of the sitemap', () => {
    const pages = collectPages();
    for (const path of ['/greatday-preview', '/admin/greatday']) {
      expect(pages.find((page) => page.path === path)?.entry.noIndex).toBe(true);
      expect(sitemapUrls(pages)).not.toContain(`https://mrcap1.com${path}`);
    }
  });
});