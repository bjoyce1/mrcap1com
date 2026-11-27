import { describe, expect, it } from 'vitest';
import { campaignUrl, readAttribution } from './attribution';
import { publicationErrors, isPublished, contentSeo, type MarketingContent } from './content';
import { collectPages } from '@/seo/pages';
import { sitemapUrls } from '@/seo/sitemap';
const base: MarketingContent = {id:'1',kind:'artist',slug:'k-rino',title:'K-Rino',excerpt:'Verified summary',body:'x'.repeat(130),image_url:'https://mrcap1.com/a.webp',sources:['https://mrcap1.com/source'],links:[],category:'Artist',tags:[],seo_title:'K-Rino | SPC Legends',seo_description:'y'.repeat(150),author:'',reviewed:true,status:'published',published_at:'2026-01-01T00:00:00Z',updated_at:'2026-01-01T00:00:00Z'};
describe('Operation 713 safeguards', () => {
  it('builds attribution only for public Legends pages', () => {
    expect(campaignUrl('/legends/faq','instagram','social','reveal')).toBe('https://mrcap1.com/legends/faq?utm_source=instagram&utm_medium=social&utm_campaign=operation_713_legends_takeover&utm_content=reveal');
    expect(() => campaignUrl('/admin/legends-marketing','instagram','social')).toThrow();
    expect(readAttribution('?utm_source=instagram&utm_medium=social&utm_campaign=other')).toBeNull();
  });
  it('blocks unreviewed or unsourced publication', () => {
    expect(publicationErrors({...base,reviewed:false})).toContain('Editorial review is required.');
    expect(isPublished({...base,sources:[]})).toBe(false);
    expect(isPublished(base, Date.parse('2026-02-01'))).toBe(true);
  });
  it('lists only published profiles in the sitemap', () => {
    const urls = sitemapUrls(collectPages({legendsContent:[base,{...base,slug:'mr-cap',reviewed:false}]}));
    expect(urls).toContain('https://mrcap1.com/legends/artists/k-rino');
    expect(urls).not.toContain('https://mrcap1.com/legends/artists/mr-cap');
    expect(urls).not.toContain('https://mrcap1.com/admin/legends-marketing');
    expect(contentSeo({...base,reviewed:false}).noIndex).toBe(true);
  });
});
import { matchesFilter, scorecard, mergeWorkspace, initialWorkspace } from './content';
describe('Phase 2 editorial tools', () => {
  it('flags research drafts and ready content', () => {
    const draft = {...base, status: 'draft' as const, body: '## Intro\nText\n\n## Research needed\nMore'};
    expect(matchesFilter(draft, 'research')).toBe(true);
    expect(matchesFilter({...base, status: 'draft'}, 'ready')).toBe(true);
    expect(matchesFilter({...base, image_url: ''}, 'artwork')).toBe(true);
    expect(scorecard({...base, reviewed: false}).checks.find(c => c.label === 'Editorial review')?.ok).toBe(false);
  });
  it('keeps saved drafts when filling new workspace fields', () => {
    const saved = {...initialWorkspace(), links: [{label: 'x', url: 'u', status: 'draft'}]};
    expect(mergeWorkspace(saved).links).toHaveLength(1);
    expect(mergeWorkspace({calendar: [{day: 1, title: 'Old', status: 'approved'}]} as never).calendar[0]).toMatchObject({status: 'approved', title: 'Old'});
    expect(initialWorkspace().calendar.every(c => c.url?.includes('operation_713_legends_takeover'))).toBe(true);
  });
});
