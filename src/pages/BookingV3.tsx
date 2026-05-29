import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DSRoot,
  NavV3,
  FooterV3,
  Scene,
  Stage,
  Display,
  Eyebrow,
  Lead,
  Body,
  Caption,
  CTA,
  MarqueeRow,
} from "@/design-system";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────
const PROOF = [
  { number: "30+", label: "Years on stage" },
  { number: "SPC", label: "Founding-era member" },
  { number: "GLOBAL", label: "Houston-based, booking worldwide" },
];

const OPTIONS = [
  {
    title: "Live Performance",
    description: "Full headline set or featured appearance. Festivals, clubs, private events.",
    tag: "Stage",
  },
  {
    title: "Verse / Feature",
    description: "Studio collaborations and custom verses delivered radio-ready.",
    tag: "Studio",
  },
  {
    title: "Interview / Podcast",
    description: "Long-form press, radio, and podcast appearances on the catalog and culture.",
    tag: "Media",
  },
  {
    title: "Speaking Engagement",
    description: "Independence, ownership, Web3, and the business of Houston hip-hop.",
    tag: "Keynote",
  },
];

const PROCESS = [
  { step: "01", title: "Submit", body: "Send your inquiry with date, city, venue, and scope." },
  { step: "02", title: "Reply", body: "You'll hear back within 48 hours with availability and rates." },
  { step: "03", title: "Confirm", body: "Contracts, riders, and logistics handled directly." },
  { step: "04", title: "Show up", body: "Mr. CAP arrives prepared. Every time." },
];

const FAQ = [
  {
    q: "How do I book Mr. CAP for an event?",
    a: "Submit the inquiry form on this page with your event details, date, city, and scope. You'll receive a personal reply within 48 hours.",
  },
  {
    q: "What types of bookings are available?",
    a: "Live performances, verse/feature collaborations, podcast and radio interviews, and speaking engagements on hip-hop culture, ownership, and Web3.",
  },
  {
    q: "What does a Mr. CAP booking cost?",
    a: "Rates depend on event type, location, travel, and scope. Submit your inquiry for a custom quote. Press materials and EPK are available for download.",
  },
  {
    q: "Where is Mr. CAP based and how far will he travel?",
    a: "Based in Houston, Texas. Available worldwide for shows, festivals, private events, and media appearances.",
  },
];

// ── Validation ───────────────────────────────────────────────
const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  booking_type: z.enum(["show", "feature", "interview", "speaking", "other"]),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  venue: z.string().trim().max(200).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});
type BookingForm = z.infer<typeof bookingSchema>;

// ── JSON-LD ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://mrcap1.com/booking",
      name: "Book Mr. CAP",
      url: "https://mrcap1.com/booking",
      description:
        "Official booking page for Mr. CAP — live shows, features, interviews, and speaking engagements.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mrcap1.com" },
        { "@type": "ListItem", position: 2, name: "Booking", item: "https://mrcap1.com/booking" },
      ],
    },
  ],
};

// ── Page ─────────────────────────────────────────────────────
const BookingV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { booking_type: "show" },
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const bg = heroRef.current.querySelector(".booking-hero-bg");
        if (bg) {
          gsap.to(bg, {
            yPercent: 20,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      }
    });
    return () => ctx.revert();
  }, []);

  const onSubmit = async (values: BookingForm) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        booking_type: values.booking_type,
        city: values.city || null,
        venue: values.venue || null,
        event_date: values.event_date || null,
        message: values.message || null,
      };
      const { error } = await supabase.from("booking_requests").insert(payload);
      if (error) throw error;
      setSubmitted(true);
      reset();
      toast.success("Inquiry received. Expect a reply within 48 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or email directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DSRoot>
      <Helmet>
        <title>Book Mr. CAP — Live Shows, Features & Speaking | Houston</title>
        <meta
          name="description"
          content="Official booking page for Mr. CAP. Live performances, verse features, podcast interviews, and speaking engagements. Houston-based, available worldwide."
        />
        <link rel="canonical" href="https://mrcap1.com/booking" />
        <meta property="og:title" content="Book Mr. CAP — Live Shows, Features & Speaking" />
        <meta
          property="og:description"
          content="Book Mr. CAP for live performances, features, interviews, and speaking engagements. 48-hour response."
        />
        <meta property="og:url" content="https://mrcap1.com/booking" />
        <meta property="og:image" content="https://mrcap1.com/images/mrcap-hero-bg.webp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      {/* ───── Hero ───── */}
      <div ref={heroRef} className="relative">
        <Scene scrim={0.7} align="start" justify="end" minH="90vh" className="overflow-hidden">
          <img
            src="/images/mrcap-hero-bg.webp"
            alt=""
            className="booking-hero-bg absolute inset-0 w-full h-[115%] object-cover will-change-transform"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--ds-scrim)/0.5) 0%, hsl(var(--ds-scrim)/0.7) 60%, hsl(var(--ds-bg)) 100%)",
            }}
          />
          <Stage py="none">
            <Eyebrow accent className="mb-6">
              Bookings & Inquiries
            </Eyebrow>
            <Display size="monument" italic as="h1">
              Book Mr.&nbsp;CAP
            </Display>
            <div className="mt-8 max-w-xl">
              <Lead>
                A booking with weight. Three decades of stage. Houston in every bar.
                Worldwide on every flight.
              </Lead>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <CTA variant="primary" to="#inquire">
                Start an inquiry
              </CTA>
              <CTA variant="ghost" to="/opk">
                Download EPK
              </CTA>
            </div>
          </Stage>
        </Scene>
      </div>

      <MarqueeRow
        items={["Live Performance", "Features", "Interviews", "Speaking", "Festivals", "Private Events"].map(
          (t) => (
            <span key={t}>{t}</span>
          ),
        )}
        duration={70}
      />

      {/* ───── Proof ───── */}
      <Stage py="lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow className="mb-4">Why book CAP</Eyebrow>
          <Display size="lg" italic as="h2">
            The receipts speak first.
          </Display>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {PROOF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Display size="xl" italic as="div" className="!leading-[0.85]">
                {p.number}
              </Display>
              <Body dim className="mt-4 max-w-xs">
                {p.label}
              </Body>
            </motion.div>
          ))}
        </div>
      </Stage>

      {/* ───── Booking Options ───── */}
      <Stage py="md">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Choose your format</Eyebrow>
            <Display size="lg" italic as="h2">
              Four ways to book.
            </Display>
          </div>
          <Body className="max-w-md opacity-70">
            Tell us the format and we'll handle scope, rate, and logistics from there.
          </Body>
        </div>
        <div className="grid gap-px bg-[hsl(var(--ds-bone)/0.08)] sm:grid-cols-2">
          {OPTIONS.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-[hsl(var(--ds-bg))] p-10 transition-colors hover:bg-[hsl(var(--ds-elevated))]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-widest opacity-50">
                  {opt.tag}
                </span>
                <span className="font-mono text-xs opacity-30">0{i + 1}</span>
              </div>
              <h3 className="ds-font-display mt-6 text-3xl tracking-tight md:text-4xl">
                {opt.title}
              </h3>
              <Body dim className="mt-4 max-w-md">
                {opt.description}
              </Body>
            </motion.div>
          ))}
        </div>
      </Stage>

      {/* ───── Process ───── */}
      <Stage py="md" className="bg-[hsl(var(--ds-elevated))]">
        <Eyebrow className="mb-4">How it works</Eyebrow>
        <Display size="lg" italic as="h2">
          From inquiry to stage.
        </Display>
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="font-mono text-xs uppercase tracking-widest opacity-50">
                {p.step}
              </div>
              <h3 className="ds-font-display mt-4 text-2xl tracking-tight">{p.title}</h3>
              <Body dim className="mt-3">
                {p.body}
              </Body>
            </motion.div>
          ))}
        </div>
      </Stage>

      {/* ───── Inquiry Form ───── */}
      <section id="inquire">
        <Stage py="lg">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <Eyebrow className="mb-4">Start the conversation</Eyebrow>
              <Display size="lg" italic as="h2">
                Send your inquiry.
              </Display>
              <Body dim className="mt-6 max-w-md">
                The more detail you share — date, city, venue, scope — the faster the reply.
                You'll hear back within 48 hours.
              </Body>
              <div className="mt-10 space-y-4">
                <Caption>Press kit and rider available on request.</Caption>
                <CTA variant="link" to="/opk">
                  Download EPK
                </CTA>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[hsl(var(--ds-bone)/0.15)] p-12 text-center"
              >
                <Eyebrow accent className="mb-6">
                  Inquiry received
                </Eyebrow>
                <Display size="md" italic as="h3">
                  Thank you.
                </Display>
                <Body dim className="mx-auto mt-6 max-w-md">
                  Your inquiry is in. Expect a reply within 48 hours. In the meantime,
                  explore the catalog or download the EPK.
                </Body>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <CTA to="/music" variant="ghost">
                    The catalog
                  </CTA>
                  <CTA to="/opk">Download EPK</CTA>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
                noValidate
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name *" error={errors.name?.message}>
                    <input
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      {...register("name")}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email *" error={errors.email?.message}>
                    <input
                      type="email"
                      maxLength={255}
                      autoComplete="email"
                      {...register("email")}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      type="tel"
                      maxLength={20}
                      autoComplete="tel"
                      {...register("phone")}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Booking type *" error={errors.booking_type?.message}>
                    <select {...register("booking_type")} className={inputCls}>
                      <option value="show">Live Performance</option>
                      <option value="feature">Verse / Feature</option>
                      <option value="interview">Interview / Podcast</option>
                      <option value="speaking">Speaking Engagement</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <Field label="City">
                    <input
                      type="text"
                      maxLength={100}
                      {...register("city")}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Venue">
                    <input
                      type="text"
                      maxLength={200}
                      {...register("venue")}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Event date">
                    <input type="date" {...register("event_date")} className={inputCls} />
                  </Field>
                </div>

                <Field label="Details" error={errors.message?.message}>
                  <textarea
                    rows={6}
                    maxLength={1000}
                    placeholder="Tell us about the event, audience, scope, and budget."
                    {...register("message")}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-3 bg-[hsl(var(--ds-bone))] px-8 py-4 font-mono text-xs uppercase tracking-widest text-[hsl(var(--ds-bg))] transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : "Send inquiry"}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                  <Caption className="opacity-60">
                    Your details are sent securely. No spam, ever.
                  </Caption>
                </div>
              </form>
            )}
          </div>
        </Stage>
      </section>

      {/* ───── FAQ ───── */}
      <Stage py="md">
        <div className="mb-14">
          <Eyebrow className="mb-4">Frequently asked</Eyebrow>
          <Display size="lg" italic as="h2">
            Before you book.
          </Display>
        </div>
        <div className="divide-y divide-[hsl(var(--ds-bone)/0.1)]">
          {FAQ.map((f, i) => (
            <details key={f.q} className="group py-8" open={i === 0}>
              <summary className="flex cursor-pointer items-baseline justify-between gap-6 list-none">
                <span className="ds-font-display text-2xl tracking-tight md:text-3xl">
                  {f.q}
                </span>
                <span className="font-mono text-xs opacity-50 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <Body dim className="mt-6 max-w-2xl">
                {f.a}
              </Body>
            </details>
          ))}
        </div>
      </Stage>

      {/* ───── Closing ───── */}
      <Scene align="center" justify="center" minH="70vh">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, hsl(var(--ds-oxblood) / 0.35), transparent 60%)",
          }}
        />
        <Stage py="none" className="relative text-center">
          <Eyebrow accent>Ready when you are</Eyebrow>
          <Display size="xl" italic as="h2" className="mt-6">
            Let's build the night.
          </Display>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CTA to="#inquire">Start an inquiry</CTA>
            <CTA to="/opk" variant="ghost">
              Download EPK
            </CTA>
          </div>
        </Stage>
      </Scene>

      <FooterV3 />
    </DSRoot>
  );
};

// ── Form helpers ─────────────────────────────────────────────
const inputCls =
  "w-full bg-transparent border-0 border-b border-[hsl(var(--ds-bone)/0.2)] py-3 text-base text-[hsl(var(--ds-bone))] placeholder:text-[hsl(var(--ds-bone)/0.3)] focus:border-[hsl(var(--ds-bone))] focus:outline-none transition-colors appearance-none";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">{label}</span>
    <div className="mt-2">{children}</div>
    {error && (
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--ds-oxblood))]">
        {error}
      </span>
    )}
  </label>
);

export default BookingV3;
