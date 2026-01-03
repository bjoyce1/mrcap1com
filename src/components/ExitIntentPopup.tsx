import { useState, useEffect, useCallback } from 'react';
import { X, Mail, Loader2, Check } from 'lucide-react';
import { z } from 'zod';
import mrCapCoin from '@/assets/mr-cap-coin.png';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { trackEmailSignup } from '@/components/GoogleAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
});

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger on exit toward top of page (leaving viewport)
    if (e.clientY <= 0 && !hasShown) {
      // Check if user has already seen popup in this session
      const hasSeenPopup = sessionStorage.getItem('exitPopupShown');
      if (!hasSeenPopup) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    }
  }, [hasShown]);

  useEffect(() => {
    // Check if user is already subscribed (from localStorage)
    const isAlreadySubscribed = localStorage.getItem('newsletterSubscribed');
    if (isAlreadySubscribed) {
      setHasShown(true);
      return;
    }

    // Add event listener for mouse leaving viewport
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Invalid email');
      setIsSubmitting(false);
      return;
    }

    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email: email.toLowerCase(),
      source: 'exit_popup',
    });

    if (dbError) {
      if (dbError.code === '23505') {
        toast.info("You're already subscribed!");
        setIsSubscribed(true);
        localStorage.setItem('newsletterSubscribed', 'true');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } else {
      setIsSubscribed(true);
      localStorage.setItem('newsletterSubscribed', 'true');
      toast.success('Welcome to the Inner Circle!');
      trackEmailSignup('exit_popup');
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-card transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-flux-accent/10 pointer-events-none" />
              
              <div className="relative p-8">
                {isSubscribed ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">You're In!</h3>
                    <p className="text-muted-foreground mb-6">
                      Check your inbox for exclusive content and updates.
                    </p>
                    <Button variant="fluxOutline" onClick={handleClose}>
                      Continue Browsing
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6">
                      <img src={mrCapCoin} alt="Mr CAP Coin" className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold mb-2">
                        Wait! Don't Miss Out
                      </h3>
                      <p className="text-muted-foreground">
                        Get exclusive tracks, behind-the-scenes content, and early access to shows.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          className="bg-card/50 border-border/50 h-12 text-center"
                          autoFocus
                        />
                        {error && <p className="text-xs text-destructive mt-1 text-center">{error}</p>}
                      </div>

                      <Button
                        type="submit"
                        variant="flux"
                        className="w-full h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Get Exclusive Access
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      No spam, ever. Unsubscribe anytime.
                    </p>

                    <button
                      onClick={handleClose}
                      className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                    >
                      No thanks, I'll pass
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
