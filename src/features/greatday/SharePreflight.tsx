import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLATFORMS, campaignLink, type Platform } from './model';

export default function SharePreflight() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [day, setDay] = useState(1);
  const [status, setStatus] = useState('');
  const url = campaignLink(platform, day);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setStatus('Copied planned link. Do not distribute before approval.'); }
    catch { setStatus('Copy unavailable. Select the planned link below.'); }
  }
  return <div className="gd-share">
    <p className="gd-kicker">PLANNED, NOT LIVE</p>
    <div className="gd-control-row">
      <label>Platform<select aria-label="Campaign platform" value={platform} onChange={(e) => { setPlatform(e.target.value as Platform); setStatus(''); }}>{PLATFORMS.map((item) => <option key={item} value={item}>{item === 'x' ? 'X' : item.charAt(0).toUpperCase() + item.slice(1)}</option>)}</select></label>
      <label>Campaign day<select aria-label="Campaign day" value={day} onChange={(e) => { setDay(Number(e.target.value)); setStatus(''); }}>{Array.from({ length: 7 }, (_, i) => <option key={i} value={i + 1}>Day {i + 1}</option>)}</select></label>
      <Button variant="secondary" onClick={copy} className="gd-button"><Copy size={16} /> Copy planned link</Button>
    </div>
    <output className="gd-url">{url}</output>
    <p className="gd-muted">Preflight only. No social app is opened and nothing is posted.</p>
    <p role="status" className="gd-muted">{status && <Check size={14} className="inline mr-2" />}{status}</p>
  </div>;
}