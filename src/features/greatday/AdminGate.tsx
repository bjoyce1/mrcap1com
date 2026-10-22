import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { greatdayAccess } from './model';

export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [verified, setVerified] = useState<{ id: string; admin: boolean } | null>(null);
  useEffect(() => {
    // Also neutralize unmanaged app-shell robots tags for direct preview visits.
    const tags = Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="robots"]:not([data-rh]), meta[name="googlebot"]:not([data-rh])'));
    const previous = tags.map((tag) => tag.content);
    tags.forEach((tag) => { tag.content = 'noindex, nofollow'; });
    return () => { tags.forEach((tag, index) => { tag.content = previous[index]; }); };
  }, []);
  useEffect(() => {
    let active = true;
    if (!user) { setVerified(null); return; }
    const id = user.id;
    async function verify() {
      try {
        const { data: auth, error } = await supabase.auth.getUser();
        if (error || auth.user?.id !== id) {
          if (active) setVerified({ id, admin: false });
          return;
        }
        const { data, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', id).eq('role', 'admin').maybeSingle();
        if (active) setVerified({ id, admin: !roleError && data?.role === 'admin' });
      } catch {
        if (active) setVerified({ id, admin: false });
      }
    }
    void verify();
    return () => { active = false; };
  }, [user?.id]);
  const checking = loading || (!!user && verified?.id !== user.id);
  const access = greatdayAccess(checking, !!user, isAdmin && verified?.admin === true);
  return <>
    <Helmet><title>Private review | Mr. CAP</title><meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" /></Helmet>
    {access === 'signin' ? <Navigate to="/auth" state={{ greatdayReturnTo: location.pathname }} replace /> : access === 'allow' ? children : <>
      <Navigation />
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-5 px-6 text-center">
        {access === 'loading' ? <p role="status">Checking private access...</p> : <><h1 className="text-3xl">Access denied</h1><p>This review is available to Mr. CAP Legacy administrators only.</p><Button asChild variant="secondary"><Link to="/">Back to Mr. CAP Legacy</Link></Button></>}
      </main>
    </>}
  </>;
}