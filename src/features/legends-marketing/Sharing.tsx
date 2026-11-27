import { Copy, Share2, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackEvent } from '@/components/GoogleAnalytics';
import { analyticsConsent } from '@/lib/analyticsConsent';
import { supabase } from '@/integrations/supabase/client';

export default function Sharing({path, title}: {path: string; title: string}) {
  const url = `https://mrcap1.com${path}`;
  async function log(platform: string) {
    if (!analyticsConsent()) return;
    trackEvent('social_share', {platform, page_path: path});
    const {error} = await supabase.from('share_events').insert({platform,content_type:'legends',content_title:title,slug:path});
    if (error) console.warn('Share measurement unavailable');
  }
  async function copy() { try { await navigator.clipboard.writeText(url); toast.success('Link copied'); void log('copy_link'); } catch { toast.error('Could not copy the link'); } }
  async function native() { if (!navigator.share) return copy(); try { await navigator.share({title,url}); void log('native_share'); } catch { /* cancelled */ } }
  function open(platform: string, destination: string) { window.open(destination,'_blank','noopener,noreferrer'); void log(platform); }
  return <div className="flex flex-wrap gap-2" aria-label="Share this page">
    <Button variant="secondary" size="icon" title="Share" aria-label="Share" onClick={() => void native()}><Share2 className="h-4 w-4" /></Button>
    <Button variant="secondary" size="icon" title="Copy link" aria-label="Copy link" onClick={() => void copy()}><Copy className="h-4 w-4" /></Button>
    <Button variant="secondary" size="icon" title="Share on Facebook" aria-label="Share on Facebook" onClick={() => open('facebook',`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}><Facebook className="h-4 w-4" /></Button>
    <Button variant="secondary" size="icon" title="Share on X" aria-label="Share on X" onClick={() => open('twitter',`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)}>X</Button>
    <Button variant="secondary" size="icon" title="Share on WhatsApp" aria-label="Share on WhatsApp" onClick={() => open('whatsapp',`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`)}><MessageCircle className="h-4 w-4" /></Button>
  </div>;
}
