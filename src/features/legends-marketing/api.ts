import { supabase } from '@/integrations/supabase/client';
import { isPublished, type MarketingContent } from './content';
export async function loadPublishedContent(): Promise<MarketingContent[]> {
  const {data, error} = await supabase.from('legends_marketing_content').select('*').eq('status','published').eq('reviewed',true).lte('published_at',new Date().toISOString()).order('published_at',{ascending: false});
  if (error) throw error;
  return ((data ?? []) as unknown as MarketingContent[]).filter(row => isPublished(row));
}
