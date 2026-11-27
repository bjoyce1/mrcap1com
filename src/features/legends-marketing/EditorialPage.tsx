import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ARTISTS } from '@/features/legends/config';
import { routeSeo } from '@/seo/routes';
import { loadPublishedContent } from './api';
import { artistArtwork, contentPath, contentSeo, cultureLinks, FAQ, safeHttps } from './content';
import { AnalyticsPreference, EditorialNavigation, useCampaignAttribution } from './Information';
import Sharing from './Sharing';
import '@fontsource/russo-one/400.css';
import './marketing.css';

export default function EditorialPage() {
  const {pathname} = useLocation(); const {slug} = useParams(); useCampaignAttribution();
  const {data = [],isLoading,error} = useQuery({queryKey:['legends-editorial'],queryFn:loadPublishedContent,staleTime:60000});
  const kind = pathname.includes('/artists') ? 'artist' : 'article';
  const row = slug ? data.find(r => r.kind === kind && r.slug === slug) : undefined;
  const entry = slug ? row ? contentSeo(row) : {path:pathname,title:'Content unavailable | SPC Legends',description:'This SPC Legends profile or article is not available for public reading. Return to the artist directory, explore approved stories or play the Houston game.',h1:'Not available for public reading.',summary:[],noIndex:true} : routeSeo(pathname);
  const directory = pathname === '/legends/artists'; const news = pathname === '/legends/news';
  return <><SEO entry={entry} /><main className="legends-editorial editorial-top"><div className="editorial-inner">
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-8 flex flex-wrap gap-3"><Link to="/">Home</Link><span>/</span><Link to="/legends">SPC Legends</Link><span>/</span><span>{slug ? row?.title ?? 'Content' : directory ? 'Artists' : news ? 'Stories' : entry.h1}</span></nav>
    <div className="flex items-center justify-between gap-6 mb-6"><p className="text-gold text-sm uppercase">713MIXHOUSE / Mr. CAP</p><Button asChild variant="secondary"><Link to="/legends"><Gamepad2 className="h-4 w-4 mr-2" />Play SPC Legends</Link></Button></div>
    <h1 className="max-w-4xl">{entry.h1}</h1>
    <EditorialNavigation />
    {slug ? isLoading ? <p role="status">Loading approved content...</p> : row ? <article className="max-w-3xl space-y-7">
      <p className="text-lg text-muted-foreground">{row.excerpt}</p>
      <img src={row.image_url} alt={`${row.title}, approved artwork`} className="max-h-[560px] w-full object-contain" />
      {row.kind === 'article' && <p className="text-sm text-muted-foreground">{row.author} · <time dateTime={row.published_at ?? undefined}>{row.published_at ? new Date(row.published_at).toLocaleDateString() : ''}</time> · Updated {new Date(row.updated_at).toLocaleDateString()}</p>}
      <div className="editorial-body">{row.body}</div>
      <h2>Sources & further reading</h2><ul className="space-y-3">{row.sources.filter(safeHttps).map(url => <li key={url}><a className="text-gold underline break-all" href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname}{new URL(url).pathname}</a></li>)}</ul>
      {row.links.filter(l => safeHttps(l.href)).map(l => <a key={l.href} className="block text-gold underline" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
      <Sharing path={pathname} title={row.title} />
    </article> : <div className="space-y-5"><p>{error ? 'Approved content could not be loaded. Please try again later.' : 'This page is not published. Explore the approved directory and the existing music archive.'}</p><Button asChild><Link to="/legends/artists">Artist directory</Link></Button></div> : <>
      {!directory && !news && <div className="max-w-3xl space-y-5 text-muted-foreground">{entry.summary.map(p => <p key={p}>{p}</p>)}</div>}
      {directory && <><p className="max-w-3xl text-muted-foreground mb-8">{entry.summary[1]}</p><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">{ARTISTS.map(a => {
        const profile = data.find(r => r.kind === 'artist' && r.slug === a.id);
        return <article className="min-w-0" key={a.id}><img src={artistArtwork(a.id)} alt={`${a.name} SPC Legends character artwork`} width={450} height={600} loading="lazy" className="artist-art" /><h2 className="mt-4 text-lg">{a.name}</h2>{profile ? <Link className="inline-flex gap-2 items-center text-gold mt-3 text-sm" to={contentPath(profile)}>Read profile <ArrowUpRight className="h-4 w-4" /></Link> : a.id === 'mr-cap' ? <Link className="inline-flex gap-2 items-center text-gold mt-3 text-sm" to="/who-is-mr-cap">Official biography <ArrowUpRight className="h-4 w-4" /></Link> : <p className="text-sm text-muted-foreground mt-3">Featured game artist</p>}</article>;
      })}</div>{error && <p role="status" className="mt-6">Artist profiles are temporarily unavailable; the game roster remains visible.</p>}</>}
      {news && <div className="space-y-6"><p className="text-muted-foreground">{entry.summary[0]}</p>{isLoading && <p role="status">Loading stories...</p>}{error && <p role="alert">Stories are temporarily unavailable.</p>}{data.filter(r => r.kind === 'article').map(r => <article className="editorial-card p-6 flex flex-col sm:flex-row gap-6" key={r.id}><img src={r.image_url} alt={r.title} loading="lazy" className="w-full sm:w-40 aspect-video object-cover rounded-md" /><div><p className="text-sm text-gold">{r.category}</p><h2 className="mt-2"><Link to={contentPath(r)}>{r.title}</Link></h2><p className="text-muted-foreground mt-3">{r.excerpt}</p></div></article>)}<Button variant="secondary" asChild><Link to="/blog">Explore the Mr. CAP editorial archive <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div>}
      {(pathname.endsWith('/faq') || pathname.endsWith('/how-to-play')) && <div className="max-w-3xl mt-10 space-y-5">{FAQ.map(f => <details key={f.question} className="py-4"><summary className="cursor-pointer text-lg font-semibold">{f.question}</summary><p className="mt-4 text-muted-foreground">{f.answer}</p></details>)}<Button variant="secondary" asChild><Link to="/legends/rewards">See credited XP rewards</Link></Button><Link className="ml-5 text-gold underline" to="/legends/terms">Purchase terms</Link></div>}
      {pathname.endsWith('/media') && <section className="mt-10 space-y-6"><h2>Houston Hip-Hop Veteran Mr. CAP Bridges Music, Gaming and Technology With SPC Legends</h2><p className="max-w-3xl text-muted-foreground">SPC Legends connects the music-inspired arcade experience to the artists and first-party cultural stories on Mr. CAP’s official site. For approved biographies, photos and press materials, visit the existing media archive.</p><div className="flex flex-wrap gap-4"><Button asChild><Link to="/press">Official press resources</Link></Button><Button asChild variant="secondary"><a href="mailto:mrcap11@gmail.com">Media inquiries</a></Button><Button asChild variant="secondary"><Link to="/videos">Official video archive</Link></Button></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl">{ARTISTS.slice(0,4).map(a => <figure key={a.id}><img src={artistArtwork(a.id)} className="artist-art" alt={`${a.name} approved game character artwork`} loading="lazy" /><figcaption className="text-sm mt-3">{a.name}</figcaption></figure>)}</div></section>}
      <section className="mt-12"><h2>Keep the culture in the mix.</h2><div className="flex flex-wrap gap-5 mt-5">{cultureLinks.map(l => <Link className="text-gold underline" key={l.href} to={l.href}>{l.label}</Link>)}</div></section>
      <div className="mt-10"><Sharing path={pathname} title={entry.h1} /></div>
    </>}
    <div className="mt-12"><AnalyticsPreference /></div>
  </div></main><Footer /></>;
}
