import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEmailSignup } from "@/components/GoogleAnalytics";
import { ShelfHeader } from "./ShelfParts";
import { WRAP } from "./catalog";
import { cn } from "@/lib/utils";

/**
 * The early access list. Fans who join hear new songs before they reach
 * Spotify and Apple Music. Every form saves to newsletter_subscribers with its
 * own source, and an address that's already on the list counts as joined.
 */

const PITCH = "New Mr. CAP songs reach the list before they hit Spotify and Apple Music. One email when there's new music. Unsubscribe anytime.";
const STORE_KEY = "cap_early_access";
const SNOOZE_DAYS = 30;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Joined, or dismissed the player prompt within the last month. */
export function earlyAccessSettled(): boolean {
  try {
    const v = localStorage.getItem(STORE_KEY) || "";
    if (v === "joined") return true;
    const at = Number(v.split(":")[1]);
    return v.startsWith("dismissed:") && Date.now() - at < SNOOZE_DAYS * 864e5;
  } catch {
    return false;
  }
}

const remember = (value: string) => {
  try {
    localStorage.setItem(STORE_KEY, value);
  } catch {
    /* private mode: the prompt may show again, which is fine */
  }
};

type Status = "idle" | "sending" | "joined" | "error";

function useEarlyAccess(source: string) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const address = email.trim().toLowerCase();
    if (!EMAIL.test(address)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: address, source: `early_access:${source}` });
    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage("That didn't go through. Try again in a moment.");
      return;
    }
    remember("joined");
    setStatus("joined");
    setMessage("You're on the list. The next release reaches you first.");
    if (!error) trackEmailSignup(`early_access:${source}`);
  };

  return { email, setEmail, status, message, submit };
}

function SignupForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const { email, setEmail, status, message, submit } = useEarlyAccess(source);
  const inputId = useId();

  if (status === "joined") {
    return (
      <p role="status" className="flex items-center gap-3 text-base text-foreground">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent-gold)/0.12)] text-[hsl(var(--accent-gold))]">
          <Check className="h-4 w-4" aria-hidden />
        </span>
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row")}>
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error"}
          className={cn(
            "min-w-0 shrink-0 rounded-full border border-border bg-background/70 px-5 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--accent-gold)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            // stacked on phones: full width at its own height; side by side it takes the free width
            compact ? "h-11 flex-1 shrink" : "h-12 w-full sm:w-auto sm:flex-1 sm:shrink",
          )}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "candy-sheen flex shrink-0 items-center justify-center gap-2 rounded-full font-medium text-primary-foreground shadow-lg disabled:opacity-70",
            compact ? "h-11 w-11" : "h-12 px-6",
          )}
          aria-label={compact ? "Get early access" : undefined}
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : compact ? <ArrowRight className="h-4 w-4" aria-hidden /> : <>Get early access <ArrowRight className="h-4 w-4" aria-hidden /></>}
        </button>
      </div>
      <p role="status" className={cn("mt-2 min-h-[1.25rem] text-sm", status === "error" ? "text-destructive" : "text-muted-foreground")}>
        {status === "error" ? message : ""}
      </p>
    </form>
  );
}

/** Full-width section for /music: the heading on the left, the form opposite. */
export function EarlyAccessSection({ source }: { source: string }) {
  return (
    <section aria-labelledby="early-access-title" className="catalog-section relative overflow-x-clip py-20 md:py-28">
      <div className={WRAP}>
        <span className="catalog-stamp mb-4 block">Early access</span>
        <ShelfHeader
          id="early-access-title"
          title="Hear It First"
          description={PITCH}
          aside={
            <div className="w-full max-w-md">
              <SignupForm source={source} />
            </div>
          }
        />
      </div>
    </section>
  );
}

/** Boxed version for release pages. */
export function EarlyAccessCard({ source, className }: { source: string; className?: string }) {
  return (
    <aside aria-labelledby="early-access-card" className={cn("rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8", className)}>
      <span className="catalog-stamp mb-3 block">Early access</span>
      <h3 id="early-access-card" className="font-display text-3xl leading-none text-foreground md:text-4xl">
        Hear the next one first
      </h3>
      <p className="mt-3 max-w-xl text-base text-muted-foreground">{PITCH}</p>
      <div className="mt-5 max-w-lg">
        <SignupForm source={source} />
      </div>
    </aside>
  );
}

/** The player's prompt after a song, or a preview, plays through. */
export function EarlyAccessNudge({ source, onClose }: { source: string; onClose: () => void }) {
  const dismiss = () => {
    remember(`dismissed:${Date.now()}`);
    onClose();
  };
  return (
    <div
      role="dialog"
      aria-labelledby="early-access-nudge"
      className="absolute bottom-full right-3 mb-3 w-[min(24rem,calc(100vw-1.5rem))] rounded-2xl border border-border/60 bg-card/95 p-5 shadow-2xl backdrop-blur-xl md:right-6"
    >
      <button type="button" onClick={dismiss} aria-label="Not now" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <X className="h-4 w-4" aria-hidden />
      </button>
      <span className="catalog-stamp mb-2 block">Early access</span>
      <p id="early-access-nudge" className="pr-8 font-display text-2xl leading-none text-foreground">
        Hear the next one first
      </p>
      <p className="mt-2 text-sm text-muted-foreground">New songs reach the list before Spotify and Apple Music.</p>
      <div className="mt-4">
        <SignupForm source={source} compact />
      </div>
    </div>
  );
}
