import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, Circle, LockKeyhole } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import SharePreflight from './SharePreflight';
import { EVENT_DICTIONARY, PLANNED_URL, RELEASE_GATES } from './model';
import './greatday.css';

export default function GreatDayStudio() {
  return <div className="greatday-world gd-studio"><Helmet><title>Great Day Release Studio | Mr. CAP</title><meta name="description" content="Private release readiness and campaign preflight review." /><meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" /></Helmet><Navigation /><main className="gd-section">
    <p className="gd-kicker"><LockKeyhole size={14} className="inline mr-2" /> PRIVATE / REVIEW ONLY</p><h1>Great Day<br />Release Studio</h1><p className="gd-large">Today Was A Great Day (Remix)</p><p className="gd-muted">Mr. CAP ft. Paul Wall, Lil Keke &amp; Lisa Dinero</p>
    <div className="gd-studio-actions"><Button asChild variant="secondary" className="gd-button"><Link to="/greatday-preview">Open private preview <ArrowUpRight size={17} /></Link></Button><Button asChild variant="secondary" className="gd-button"><Link to="/admin/captions">Existing Caption Studio <ArrowUpRight size={17} /></Link></Button><Button asChild variant="ghost"><Link to="/admin">Back to admin</Link></Button></div>
    <section className="gd-studio-section"><h2>Host &amp; release status</h2><p className="gd-kicker">PLANNED, NOT LIVE</p><p className="gd-url">{PLANNED_URL}</p><p className="gd-muted">No release date set. Domain connection, publication, real signups, audio and sales are not authorized.</p></section>
    <section className="gd-studio-section"><h2>Publication gates</h2><p className="gd-muted">Review checklist only. No item can be approved or persisted from this page.</p><ul className="gd-gates">{RELEASE_GATES.map((gate) => <li key={gate}><Circle size={16} /><span>{gate}</span><strong>PENDING REVIEW</strong></li>)}</ul></section>
    <section className="gd-studio-section"><h2>Seven-day campaign preflight</h2><SharePreflight /></section>
    <section className="gd-studio-section"><h2>Future event dictionary</h2><p className="gd-muted">Documentation only. No Great Day events are collected during private review.</p><dl className="gd-events">{EVENT_DICTIONARY.map(([name, detail]) => <div key={name}><dt>{name}</dt><dd>{detail}</dd></div>)}</dl></section>
  </main><footer className="gd-footer"><strong>CAP Distributions</strong><p>Private planning only. Nothing is published, sold, collected or distributed here.</p></footer></div>;
}