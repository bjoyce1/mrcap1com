import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Megaphone, Save, Copy, Download, Plus, ArrowUpRight } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SEO from '@/components/SEO';
import { routeSeo } from '@/seo/routes';
import { CAMPAIGN, initialWorkspace, publicationErrors, safeHttps, type MarketingContent, type Workspace } from './content';
import { campaignUrl, SOURCES } from './attribution';
import './marketing.css';

type Tab = 'Overview' | 'Editorial' | 'Campaign' | 'Calendar' | 'Outreach' | 'Search setup';
const tabs: Tab[] = ['Overview','Editorial','Campaign','Calendar','Outreach','Search setup'];
const selectClass = 'bg-secondary text-foreground rounded-md px-3 py-2 min-h-11 max-w-full';
function download(name: string, body: string) { const url = URL.createObjectURL(new Blob([body],{type:'application/json'})); const a = document.createElement('a'); a.href=url;a.download=name;a.click();URL.revokeObjectURL(url); }
async function copy(text: string) { try { await navigator.clipboard.writeText(text);toast.success('Copied'); } catch { toast.error('Copy unavailable'); } }
function emptyContent(): MarketingContent {return {id:crypto.randomUUID(),kind:'article',slug:'',title:'',excerpt:'',body:'',image_url:'',sources:[],links:[],category:'Houston hip-hop',tags:[],seo_title:'',seo_description:'',author:'',reviewed:false,status:'draft',published_at:null,updated_at:new Date().toISOString()};}

export default function MarketingAdmin() {
  const {user,isAdmin,loading} = useAuth();
  if (loading) return <main className="legends-editorial editorial-top p-10" role="status">Checking access...</main>;
  if (!user) return <Navigate to="/auth" state={{returnTo:'/admin/legends-marketing'}} replace />;
  if (!isAdmin) return <main className="legends-editorial editorial-top p-10"><SEO entry={routeSeo('/admin/legends-marketing')} /><h1>Administrator access required</h1><Button asChild className="mt-6"><Link to="/legends">Back to SPC Legends</Link></Button></main>;
  return <CommandCenter />;
}
function CommandCenter() {
  const [tab,setTab] = useState<Tab>('Overview');
  const [rows,setRows] = useState<MarketingContent[]>([]);
  const [workspace,setWorkspace] = useState<Workspace>(initialWorkspace);
  const [edit,setEdit] = useState<MarketingContent | null>(null);
  const [busy,setBusy] = useState(false); const [ready,setReady] = useState(false); const [error,setError] = useState('');
  const [shareCount,setShareCount] = useState<number | null>(null);
  const [source,setSource] = useState('instagram'); const [medium,setMedium] = useState('social'); const [path,setPath] = useState('/legends'); const [content,setContent] = useState('character_reveal'); const [term,setTerm] = useState('');
  const [url,setUrl] = useState(''); const [qr,setQr] = useState('');
  const [contact,setContact] = useState({name:'',channel:'press',status:'draft',notes:''});
  async function refresh() {
    setBusy(true); setError('');
    try {
      const [editorial, saved, shares] = await Promise.all([
        supabase.from('legends_marketing_content').select('*').order('updated_at',{ascending:false}),
        supabase.from('legends_marketing_workspace').select('data').eq('id','operation_713').maybeSingle(),
        supabase.from('share_events').select('id',{count:'exact',head:true}).eq('content_type','legends'),
      ]);
      if (editorial.error) throw editorial.error; if (saved.error) throw saved.error;
      setRows((editorial.data ?? []) as unknown as MarketingContent[]);
      if (saved.data) setWorkspace(saved.data.data as unknown as Workspace);
      setShareCount(shares.error ? null : shares.count); setReady(true);
    } catch {setError('Marketing data is unavailable. Try refreshing.');} finally {setBusy(false);}
  }
  useEffect(() => {void refresh();},[]);
  async function saveWorkspace() {
    setBusy(true);
    try {const {error: failure} = await supabase.from('legends_marketing_workspace').upsert({id:'operation_713',data:JSON.parse(JSON.stringify(workspace)),updated_at:new Date().toISOString()});if(failure)throw failure;toast.success('Marketing drafts saved');} catch {toast.error('Drafts were not saved');} finally {setBusy(false);}
  }
  async function saveContent(publish: boolean) {
    if (!edit) return;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(edit.slug) || !edit.title.trim()) {toast.error('Add a title and a lowercase hyphenated slug.');return;}
    const issues = publish ? publicationErrors(edit) : [];
    if (issues.length) {toast.error(issues.join(' '));return;}
    const row = {...edit,status:publish ? 'published' as const : 'draft' as const,published_at:publish ? edit.published_at ?? new Date().toISOString() : edit.published_at,updated_at:new Date().toISOString()};
    setBusy(true);
    try {const {error: failure} = await supabase.from('legends_marketing_content').upsert({...row,links:JSON.parse(JSON.stringify(row.links))});if(failure)throw failure;toast.success(publish ? 'Content published. Site publish refreshes search previews and sitemap.' : 'Draft saved and unavailable to public readers');setEdit(null);void refresh();} catch {toast.error('Content was not saved. Check required fields and access.');} finally {setBusy(false);}
  }
  async function generate() {try {const result = campaignUrl(path,source,medium,content,term);setUrl(result);setQr(await QRCode.toDataURL(result,{width:192,margin:2,errorCorrectionLevel:'M'}));}catch {toast.error('Choose a public Legends path and nonpersonal lowercase campaign labels.');}}
  const published = rows.filter(r => r.status === 'published');
  const problems = rows.flatMap(r => publicationErrors(r).map(message => ({title:r.title,message})));
  return <><SEO entry={routeSeo('/admin/legends-marketing')} /><main className="legends-editorial editorial-top"><div className="editorial-inner">
    <Link to="/admin" className="text-gold underline">Admin dashboard</Link>
    <div className="flex flex-wrap justify-between items-start gap-5 mt-8"><div><p className="text-gold uppercase text-sm mb-3">Operation 713: The Legends Takeover</p><h1>SPC Legends Marketing Command Center</h1><p className="text-muted-foreground mt-4">Spin the Mix. Play the Culture. Become a Legend.</p></div><Megaphone className="h-10 w-10 text-gold" /></div>
    <div role="tablist" aria-label="Marketing sections" className="flex flex-wrap gap-2 my-8">{tabs.map(t => <Button role="tab" id={`tab-${t}`} aria-controls={`panel-${t}`} aria-selected={tab === t} key={t} variant={tab === t ? 'default' : 'secondary'} onClick={() => {setTab(t);setEdit(null);}}>{t}</Button>)}</div>
    {error && <p role="alert" className="text-destructive mb-5">{error}</p>}
    <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
    {tab === 'Overview' && <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-5">{[{label:'Published artist profiles',value:ready ? published.filter(r => r.kind === 'artist').length : 'Data Unavailable'},{label:'Published articles',value:ready ? published.filter(r => r.kind === 'article').length : 'Data Unavailable'},{label:'Recorded Legends shares',value:shareCount ?? 'Data Unavailable'}].map(m => <div className="editorial-card p-6" key={m.label}><p className="text-sm text-muted-foreground">{m.label}</p><strong className="text-3xl block mt-3 text-gold">{m.value}</strong></div>)}</div>
      <section><h2>Audience reporting</h2><p className="text-muted-foreground mt-4">Visitors, organic traffic, campaign traffic, returning visitors, registrations, top content and referrals: Data Unavailable. GA4 tag G-PBL8BBQMK4 is configured; no reporting API is connected here.</p></section>
      <section><h2>Editorial readiness</h2><p className="mt-3">{ready ? `${rows.filter(r=>r.status==='draft').length} private drafts. ${problems.length} incomplete publication fields.` : 'Data Unavailable'}</p><p className="text-muted-foreground mt-3">Foundation audit: November 27, 2026, nine passing checks. Broken-link crawling, image-alt auditing, schema rich-result validation and real-user performance monitoring are not connected to this workspace.</p><Button variant="secondary" className="mt-4" onClick={() => setTab('Editorial')}>Review content</Button></section>
      <Button disabled={busy} variant="secondary" onClick={() => void refresh()}>Refresh verified data</Button>
    </div>}
    {tab === 'Editorial' && (edit ? <div className="max-w-3xl space-y-5"><h2>{edit.title || 'New editorial draft'}</h2>
      <label className="block">Content type<select className={`${selectClass} block mt-2`} value={edit.kind} onChange={e=>setEdit({...edit,kind:e.target.value as MarketingContent['kind']})}><option value="article">Article</option><option value="artist">Artist profile</option></select></label>
      {(['title','slug','excerpt','image_url','seo_title','seo_description','author','category'] as const).map(key=><label className="block" key={key}>{({title:'Title',slug:'URL slug',excerpt:'Summary',image_url:'Approved image HTTPS URL',seo_title:'SEO title',seo_description:'Meta description',author:'Author',category:'Category'})[key]}<Input className="mt-2" value={edit[key]} onChange={e=>setEdit({...edit,[key]:e.target.value,reviewed:false})} /></label>)}
      <label className="block">Verified biography or article<Textarea className="mt-2 min-h-64" value={edit.body} onChange={e=>setEdit({...edit,body:e.target.value,reviewed:false})} /></label>
      <label className="block">Sources, one HTTPS link per line<Textarea className="mt-2" value={edit.sources.join('\n')} onChange={e=>setEdit({...edit,sources:e.target.value.split('\n').filter(Boolean),reviewed:false})} /></label>
      <label className="block">Official links, one label | HTTPS URL per line<Textarea className="mt-2" value={edit.links.map(l=>`${l.label} | ${l.href}`).join('\n')} onChange={e=>setEdit({...edit,links:e.target.value.split('\n').map(line=>{const [label,href]=line.split('|');return {label:label?.trim()??'',href:href?.trim()??''};}),reviewed:false})} /></label>
      <label className="block">Tags, comma separated<Input className="mt-2" value={edit.tags.join(', ')} onChange={e=>setEdit({...edit,tags:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} /></label>
      <label className="flex items-start gap-3"><input type="checkbox" checked={edit.reviewed} onChange={e=>setEdit({...edit,reviewed:e.target.checked})} />I reviewed the facts, sources, artwork rights and age-appropriate marketing.</label>
      <ul className="text-sm text-muted-foreground space-y-2">{publicationErrors(edit).map(e=><li key={e}>{e}</li>)}</ul>
      <div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={()=>void saveContent(false)}><Save className="h-4 w-4 mr-2" />Save private draft / unpublish</Button><Button variant="secondary" disabled={busy || publicationErrors(edit).length>0} onClick={()=>void saveContent(true)}>Publish reviewed content</Button><Button variant="ghost" onClick={()=>setEdit(null)}>Cancel</Button></div>
    </div> : <div className="space-y-5"><div className="flex flex-wrap justify-between gap-4"><h2>Artist profiles & editorial drafts</h2><Button disabled={!ready} onClick={()=>setEdit(emptyContent())}><Plus className="h-4 w-4 mr-2" />New draft</Button></div><p className="text-muted-foreground">Only reviewed, complete published records are public. Static page titles and redirects remain managed by the existing site configuration. Search previews and sitemap refresh on the next site publish.</p>{rows.map(r=><div className="editorial-card p-5 flex flex-wrap items-center justify-between gap-4" key={r.id}><div><p className="text-sm uppercase text-gold">{r.kind} · {r.status}</p><h3 className="mt-2">{r.title}</h3><p className="text-sm text-muted-foreground mt-2">{publicationErrors(r).length} publication checks remaining</p></div><Button variant="secondary" onClick={()=>setEdit(r)}>Edit</Button></div>)}</div>)}
    {tab === 'Campaign' && <div className="space-y-10"><section className="max-w-3xl space-y-5"><h2>Campaign link & QR code</h2><p className="text-sm text-muted-foreground break-all">{CAMPAIGN}</p><div className="grid sm:grid-cols-2 gap-4"><label>Destination<Input value={path} onChange={e=>{setPath(e.target.value);setUrl('');setQr('');}} /></label><label>Source<select className={`${selectClass} block w-full`} value={source} onChange={e=>{setSource(e.target.value);setUrl('');setQr('');}}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></label><label>Medium<Input value={medium} onChange={e=>{setMedium(e.target.value);setUrl('');setQr('');}} /></label><label>Content label<Input value={content} onChange={e=>{setContent(e.target.value);setUrl('');setQr('');}} /></label><label>Term label<Input value={term} onChange={e=>{setTerm(e.target.value);setUrl('');setQr('');}} /></label></div><Button onClick={()=>void generate()}>Generate campaign link</Button>{url && <div className="space-y-4"><p className="break-all text-gold">{url}</p><Button variant="secondary" onClick={()=>void copy(url)}><Copy className="h-4 w-4 mr-2" />Copy link</Button>{qr && <><img src={qr} alt="QR code for the campaign link" className="qr-image" /><Button variant="secondary" asChild><a href={qr} download="operation-713-qr.png"><Download className="h-4 w-4 mr-2" />Download QR</a></Button></>}</div>}</section>
      <section className="space-y-5"><h2>Caption library</h2>{workspace.captions.map((c,i)=><div className="editorial-card p-5 space-y-4" key={c.platform}><div className="flex flex-wrap items-center justify-between gap-3"><h3>{c.platform}</h3><select aria-label={`${c.platform} caption status`} className={selectClass} value={c.status} onChange={e=>setWorkspace({...workspace,captions:workspace.captions.map((v,n)=>n===i?{...v,status:e.target.value}:v)})}><option value="draft">Draft</option><option value="pending-approval">Pending approval</option><option value="approved">Approved</option></select></div><Textarea aria-label={`${c.platform} caption`} className="min-h-28" value={c.text} onChange={e=>setWorkspace({...workspace,captions:workspace.captions.map((v,n)=>n===i?{...v,text:e.target.value,status:'draft'}:v)})} /><Button variant="secondary" onClick={()=>void copy(c.text)}><Copy className="h-4 w-4 mr-2" />Copy caption</Button></div>)}<div className="flex flex-wrap gap-3"><Button disabled={busy || !ready} onClick={()=>void saveWorkspace()}><Save className="h-4 w-4 mr-2" />Save drafts</Button><Button variant="secondary" onClick={()=>download('operation-713-captions.json',JSON.stringify(workspace.captions,null,2))}><Download className="h-4 w-4 mr-2" />Export captions</Button><Button variant="secondary" asChild><Link to="/admin/captions">Existing Caption Studio <ArrowUpRight className="h-4 w-4 ml-2" /></Link></Button></div></section>
    </div>}
    {tab === 'Calendar' && <section className="space-y-6"><h2>30-day draft calendar</h2><p className="text-muted-foreground">No posts, emails or ads are scheduled or sent automatically.</p><div className="grid md:grid-cols-2 gap-4">{workspace.calendar.map((task,i)=><div className="editorial-card p-5 space-y-3" key={task.day}><p className="text-gold text-sm">Day {task.day}</p><Input aria-label={`Day ${task.day} task`} value={task.title} onChange={e=>setWorkspace({...workspace,calendar:workspace.calendar.map((t,n)=>n===i?{...t,title:e.target.value}:t)})} /><select className={selectClass} aria-label={`Day ${task.day} status`} value={task.status} onChange={e=>setWorkspace({...workspace,calendar:workspace.calendar.map((t,n)=>n===i?{...t,status:e.target.value}:t)})}><option value="draft">Draft</option><option value="pending-approval">Pending approval</option><option value="approved">Approved</option><option value="completed">Completed manually</option></select></div>)}</div><Button disabled={busy || !ready} onClick={()=>void saveWorkspace()}><Save className="h-4 w-4 mr-2" />Save calendar</Button></section>}
    {tab === 'Outreach' && <section className="space-y-5"><h2>Press & artist collaboration tracker</h2><p className="text-muted-foreground">Track contact plans only. No messages are sent.</p><div className="max-w-3xl space-y-4"><label>Contact or artist name<Input value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} /></label><label>Channel<select className={`${selectClass} block`} value={contact.channel} onChange={e=>setContact({...contact,channel:e.target.value})}><option value="press">Press</option><option value="artist">Artist collaboration</option><option value="podcast">Podcast</option></select></label><label>Notes<Textarea value={contact.notes} onChange={e=>setContact({...contact,notes:e.target.value})} /></label><Button disabled={!contact.name.trim()} onClick={()=>{setWorkspace({...workspace,outreach:[...workspace.outreach,contact]});setContact({name:'',channel:'press',status:'draft',notes:''});}}>Add to tracker</Button></div>{workspace.outreach.map((c,i)=><div className="editorial-card p-5 space-y-3" key={`${c.name}-${i}`}><h3>{c.name} · {c.channel}</h3><p className="text-muted-foreground">{c.notes}</p><select className={selectClass} aria-label={`${c.name} outreach status`} value={c.status} onChange={e=>setWorkspace({...workspace,outreach:workspace.outreach.map((r,n)=>n===i?{...r,status:e.target.value}:r)})}><option value="draft">Draft</option><option value="pending-approval">Pending approval</option><option value="contacted">Contacted manually</option><option value="response-received">Response received</option></select></div>)}<Button disabled={busy || !ready} onClick={()=>void saveWorkspace()}><Save className="h-4 w-4 mr-2" />Save tracker</Button></section>}
    {tab === 'Search setup' && <section className="space-y-7 max-w-3xl"><h2>Search connections</h2><p className="text-muted-foreground">Google Analytics tag: configured. Search Console and Bing reporting: Not Connected to this command center. Existing ownership verification is not confirmed here.</p><ol className="list-decimal pl-6 space-y-5"><li>Publish the reviewed site updates first. Check https://mrcap1.com/sitemap.xml.</li><li><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-gold underline">Open Google Search Console</a>. Add the mrcap1.com Domain property and copy its DNS TXT verification value into your domain provider. Keep verification tokens out of captions and campaign links.</li><li>After verification, open Sitemaps and submit sitemap.xml. Inspect https://mrcap1.com/legends and each approved public page. Request indexing for selected updated pages. Submission does not guarantee indexing.</li><li><a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-gold underline">Open Bing Webmaster Tools</a>. Import your verified Search Console property or use DNS verification, then submit the same sitemap.</li><li><a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-gold underline">Open Google Analytics</a>. Check web stream G-PBL8BBQMK4, consent settings and approved events in Realtime. No new tag is needed.</li></ol><p className="text-muted-foreground">Review adult-audience eligibility and platform rules before any paid campaign. No financial reward promotions or minor-targeted ads. Rich-result and Core Web Vitals validation remain manual.</p><Button variant="secondary" asChild><a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Validate structured data</a></Button></section>}
    </div>
  </div></main></>;
}
