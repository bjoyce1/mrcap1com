import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { safeAuthReturn, rememberAuthReturn, storedAuthReturn, clearAuthReturn } from '@/lib/auth-return';
import { lovable } from '@/integrations/lovable';
import { supabase } from '@/integrations/supabase/client';
import { GAME_CONFIG } from '@/features/legends/config';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  
  const { user, loading, isAdmin, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = location.state as { greatdayReturnTo?: unknown; returnTo?: unknown } | null;
  const requestedReturn = safeAuthReturn(authState?.returnTo) ?? safeAuthReturn(authState?.greatdayReturnTo) ?? storedAuthReturn();
  const fromLegends = requestedReturn?.startsWith('/legends') ?? false;
  const returnTo = requestedReturn ?? (isAdmin ? '/admin' : '/legends');

  useEffect(() => {
    if (user && !loading) {
      clearAuthReturn();
      navigate(returnTo, { replace: true });
    }
  }, [user, loading, navigate, returnTo]);

  const handleGoogle = async () => {
    setIsLoading(true);
    rememberAuthReturn(returnTo);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: `${window.location.origin}/auth/callback`,
        extraParams: { prompt: 'select_account' },
      });
      if (result.error) toast.error(result.error.message);
      if (result.redirected) return;
    } catch { toast.error('Google sign-in could not open. Please try again.'); }
    setIsLoading(false);
  };

  const handleReset = async () => {
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) { setErrors({ email: 'Enter your email address first' }); return; }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${window.location.origin}/reset-password` });
    setIsLoading(false);
    if (error) toast.error(error.message);
    else setNotice('If an account exists for this email, a password reset link is on its way. Check your inbox and spam folder.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setNotice('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(result.data.email, result.data.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setNotice('The email or password was not accepted. Use Forgot password below, or continue with Google.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const result = signupSchema.safeParse({ fullName, email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        rememberAuthReturn(returnTo);
        const { error, needsConfirmation } = await signUp(result.data.email, result.data.password, result.data.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists');
          } else {
            toast.error(error.message);
          }
        } else {
          if (needsConfirmation) setNotice('Check your email to confirm your account before signing in. If you already have an account, sign in or reset your password instead.');
          else toast.success('Account created successfully!');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO entry={routeSeo("/auth")} />

      <Navigation />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 pt-24">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>

          {/* Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/5 p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium tracking-tight mb-2">
                {fromLegends ? 'Play SPC Legends' : isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {fromLegends
                  ? isLogin
                    ? `Sign in to keep spinning. New here? Sign up below for ${GAME_CONFIG.welcomeSpins} free spins.`
                    : `Create a free account and your first ${GAME_CONFIG.welcomeSpins} spins are on us.`
                  : isLogin
                    ? 'Welcome back to Mr. CAP Legacy'
                    : 'Create an account to get started'}
              </p>
            </div>

            <Button type="button" variant="outline" className="w-full mb-6 gap-2" disabled={isLoading || loading} onClick={handleGoogle}>
              <span aria-hidden="true" className="font-bold">G</span> Continue with Google
            </Button>
            {notice && <p role="status" className="text-sm text-muted-foreground mb-5">{notice}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      autoComplete="name"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-secondary/50 border-white/10"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    autoComplete="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-white/10"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary/50 border-white/10"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {isLogin && <Button type="button" variant="link" className="px-0" disabled={isLoading} onClick={handleReset}>Forgot password?</Button>}

              <Button
                type="submit"
                variant="flux"
                className="w-full"
                disabled={isLoading || loading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
