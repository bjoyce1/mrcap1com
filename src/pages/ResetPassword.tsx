import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    if (recovery) supabase.auth.getUser().then(({ data, error }) => setReady(!error && !!data.user));
    return () => subscription.unsubscribe();
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || password.length < 6 || password !== confirmation) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success('Password updated'); navigate('/legends', { replace: true }); }
  }
  return <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24 pb-32">
    <Helmet><title>Reset Password | Mr. CAP Legacy</title><meta name="robots" content="noindex" /></Helmet>
    <div className="w-full max-w-md space-y-6">
      <h1 className="font-display text-3xl">Reset password</h1>
      {ready ? <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></div>
        {confirmation && confirmation !== password && <p className="text-destructive text-sm">Passwords must match.</p>}
        <Button type="submit" variant="flux" className="w-full" disabled={busy || password.length < 6 || password !== confirmation}>{busy ? 'Saving...' : 'Save password'}</Button>
      </form> : <p className="text-muted-foreground">Open the password reset link from your email. If it has expired, request a new one.</p>}
      <Button asChild variant="link"><Link to="/auth">Back to sign in</Link></Button>
    </div>
  </div>;
}