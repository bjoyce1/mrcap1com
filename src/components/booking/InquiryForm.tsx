import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";

const REQUEST_TYPES = [
  { value: "show", label: "Live Performance" },
  { value: "feature", label: "Verse / Feature" },
  { value: "interview", label: "Interview / Podcast" },
  { value: "speaking", label: "Speaking Engagement" },
  { value: "other", label: "Other" },
];

const InquiryForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    venue: "",
    city: "",
    event_date: "",
    booking_type: "show" as string,
    budget: "",
    message: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("booking_requests").insert({
        name: form.name,
        email: form.email,
        venue: form.venue || null,
        city: form.city || null,
        event_date: form.event_date || null,
        booking_type: form.booking_type as any,
        message: form.budget ? `Budget: ${form.budget}\n\n${form.message}` : form.message || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display font-bold text-foreground text-xl mb-2">Thanks for reaching out.</h3>
        <p className="text-muted-foreground text-sm">
          Your inquiry has been received and will be reviewed shortly.
        </p>
        <Button
          variant="fluxOutline"
          className="mt-6 rounded-2xl"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", venue: "", city: "", event_date: "", booking_type: "show", budget: "", message: "" });
          }}
        >
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="rounded-xl bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-xl bg-muted/30" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue">Organization / Venue</Label>
          <Input id="venue" value={form.venue} onChange={(e) => update("venue", e.target.value)} className="rounded-xl bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City / State</Label>
          <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-xl bg-muted/30" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Date</Label>
          <Input id="event_date" type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} className="rounded-xl bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking_type">Request Type</Label>
          <Select value={form.booking_type} onValueChange={(v) => update("booking_type", v)}>
            <SelectTrigger className="rounded-xl bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Budget Range</Label>
        <Input id="budget" value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. $1,000 – $5,000" className="rounded-xl bg-muted/30" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Details</Label>
        <Textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} rows={4} className="rounded-xl bg-muted/30" />
      </div>
      <Button type="submit" disabled={loading} size="lg" className="rounded-2xl w-full sm:w-auto">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : "Submit Inquiry"}
      </Button>
    </form>
  );
};

export default InquiryForm;
