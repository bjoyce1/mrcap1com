import { useState } from "react";
import { Mail, MapPin, Music, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Props {
  sourcePage: string;
  headline?: string;
  subheadline?: string;
  variant?: "banner" | "inline" | "modal";
  className?: string;
}

export default function FanCaptureBanner({
  sourcePage,
  headline = "Get New Releases First",
  subheadline = "Join Mr. CAP Legacy — be the first to hear new music, see new visuals, and get show alerts.",
  variant = "banner",
  className = "",
}: Props) {
  const [form, setForm] = useState({ name: "", email: "", city: "", favorite_song: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      toast({ title: "Email required", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("fan_signups").insert({
      name: form.name || null,
      email: form.email,
      city: form.city || null,
      favorite_song: form.favorite_song || null,
      source_page: sourcePage,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "You're in! 🎶", description: "Welcome to CAP Legacy." });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-8 ${className}`}
      >
        <p className="text-xl font-display text-primary">You're in the Legacy.</p>
        <p className="text-sm text-muted-foreground mt-2">Watch your inbox for new drops.</p>
      </motion.div>
    );
  }

  const isInline = variant === "inline";

  return (
    <section className={`relative overflow-hidden ${isInline ? "" : "border border-border/20 rounded-2xl bg-card/30 backdrop-blur-sm"} ${className}`}>
      {!isInline && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      )}

      <div className={`relative ${isInline ? "" : "p-8 md:p-12"}`}>
        <div className="max-w-2xl mx-auto text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-display text-foreground">{headline}</h3>
          <p className="text-sm text-muted-foreground mt-2">{subheadline}</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="relative">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Favorite Mr. CAP song"
                value={form.favorite_song}
                onChange={(e) => setForm({ ...form, favorite_song: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Join CAP Legacy
          </button>
        </form>
      </div>
    </section>
  );
}
