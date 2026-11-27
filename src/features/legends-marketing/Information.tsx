import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { analyticsConsent, CONSENT_EVENT, setAnalyticsConsent } from '@/lib/analyticsConsent';
import { FAQ, hubLinks, cultureLinks } from './content';
import Sharing from './Sharing';
import './marketing.css';
import { rememberAttribution } from './attribution';
export function useCampaignAttribution() { useEffect(() => { if (analyticsConsent()) rememberAttribution(window.location.search, sessionStorage); }, []); }
export function AnalyticsPreference() {
  const [allowed,setAllowed] = useState(analyticsConsent);
  useEffect(() => { const update = () => setAllowed(analyticsConsent()); window.addEventListener(CONSENT_EVENT,update); return () => window.removeEventListener(CONSENT_EVENT,update); },[]);
  return <label className="flex items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={allowed} onChange={e => setAnalyticsConsent(e.target.checked)} />Allow optional audience analytics <Link className="underline" to="/privacy">Privacy</Link></label>;
}
export function EditorialNavigation() {
  return <nav aria-label="Explore SPC Legends" className="flex flex-wrap gap-x-6 gap-y-3 py-6">{hubLinks.map(l => <Link key={l.href} className="text-sm text-gold hover:underline" to={l.href}>{l.label}</Link>)}</nav>;
}
export default function LegendsInformation() {
  useCampaignAttribution();
  return <section className="legends-editorial" aria-labelledby="legends-information-title"><div className="editorial-inner">
    <p className="text-sm uppercase text-gold mb-4">713MIXHOUSE / Mr. CAP</p>
    <h1 id="legends-information-title">SPC Legends: Spin the Mix</h1>
    <p className="mt-5 max-w-3xl text-muted-foreground">Spin the Mix. Play the Culture. Become a Legend.</p>
    <EditorialNavigation />
    <details className="max-w-3xl py-4"><summary className="cursor-pointer text-lg font-semibold">The music, the culture and the experience</summary><div className="space-y-5 pt-5"><p>{FAQ[0].answer}</p><p>The six-reel board brings together approved artist portraits, Houston neighborhoods and studio symbols. Music and character celebrations make each result part of the mix. The game is one way to explore the culture, alongside the records and first-party stories on this site.</p><p>{FAQ[1].answer}</p><div className="flex flex-wrap gap-4">{cultureLinks.map(l => <Link className="text-gold underline" key={l.href} to={l.href}>{l.label}</Link>)}</div></div></details>
    <div className="flex flex-wrap items-center justify-between gap-6 mt-8"><Sharing path="/legends" title="SPC Legends: Spin the Mix" /><AnalyticsPreference /></div>
  </div></section>;
}
