import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "already" | "invalid" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (j.valid) setState("valid");
        else if (j.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    setBusy(false);
    if (error) setState("error");
    else if (data?.success) setState("done");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  const copy: Record<State, string> = {
    loading: "Checking your link.",
    valid: "Stop getting emails from Mr. CAP at this address?",
    already: "This address is already unsubscribed.",
    invalid: "This unsubscribe link is not valid or has expired.",
    done: "You're unsubscribed. You won't get any more emails from us.",
    error: "Something went wrong. Please try again in a moment.",
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe | Mr. CAP</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h1 className="text-3xl font-display font-bold mb-6">Email preferences</h1>
            <p className="text-muted-foreground mb-8">{copy[state]}</p>
            {state === "valid" && (
              <Button onClick={confirm} disabled={busy} size="lg" className="rounded-2xl">
                {busy ? "Working..." : "Confirm unsubscribe"}
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Unsubscribe;
