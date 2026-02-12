import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, source: "join-the-legacy" });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the list!", description: "Check your inbox for updates." });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Welcome to the Legacy", description: "You're in. Watch your inbox." });
        setEmail("");
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cap-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl md:text-6xl tracking-tight mb-4">
          Join the <span className="text-gradient-gold">Legacy</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Exclusive drops, behind-the-scenes content, and first access to new music. 
          No spam — just real updates from Mr. CAP.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Button type="submit" variant="gold" size="lg" disabled={loading}>
            {loading ? "Joining..." : "Join Now"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground/60 mt-4">
          Unsubscribe anytime. Your email stays private.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBanner;
