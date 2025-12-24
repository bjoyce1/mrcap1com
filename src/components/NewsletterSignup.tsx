import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, Check, Sparkles } from 'lucide-react';
import { trackEmailSignup } from '@/components/GoogleAnalytics';

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
  name: z.string().trim().max(100).optional(),
});

interface NewsletterSignupProps {
  source?: string;
  variant?: 'default' | 'compact' | 'hero';
}

const NewsletterSignup = ({ source = 'website', variant = 'default' }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = emailSchema.safeParse({ email, name: name || undefined });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Invalid input');
      setIsSubmitting(false);
      return;
    }

    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email: email.toLowerCase(),
      name: name || null,
      source,
    });

    if (dbError) {
      if (dbError.code === '23505') {
        // Unique constraint violation - already subscribed
        toast.info("You're already subscribed!");
        setIsSubscribed(true);
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } else {
      setIsSubscribed(true);
      toast.success('Welcome to the Inner Circle!');
      trackEmailSignup(source);
    }

    setIsSubmitting(false);
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-3 ${variant === 'compact' ? '' : 'p-4 bg-green-400/5 rounded-xl border border-green-400/20'}`}>
        <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="font-medium text-sm">You're in!</p>
          <p className="text-xs text-muted-foreground">Check your inbox for updates.</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="bg-secondary/50 border-white/10 flex-1"
        />
        <Button type="submit" variant="flux" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        </Button>
      </form>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium">Join the Inner Circle</h3>
            <p className="text-xs text-muted-foreground">New music, shows, & exclusive content</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-secondary/50 border-white/10"
          />
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="bg-secondary/50 border-white/10"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" variant="flux" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Subscribe
              </>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="bg-secondary/50 border-white/10"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" variant="flux" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Join the Inner Circle
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
