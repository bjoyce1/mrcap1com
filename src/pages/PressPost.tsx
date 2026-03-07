import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
import { pressPageData } from "@/content/press";
import { useSanityPressEntries, type SanityPressEntry } from "@/hooks/useSanity";
import NewsletterSignup from "@/components/NewsletterSignup";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PressPost = () => {
  const { pressSlug } = useParams<{ pressSlug: string }>();
  const { data: sanityPress } = useSanityPressEntries();

  // Try Sanity first, fall back to static
  const allEntries = (sanityPress && sanityPress.length > 0)
    ? sanityPress.map((e) => ({ ...e, slug: slugify(e.title) }))
    : pressPageData.timeline.map((e) => ({ ...e, slug: slugify(e.title), _id: slugify(e.title) }));

  const entry = allEntries.find((e) => e.slug === pressSlug);

  if (!entry) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground text-lg">Press entry not found</p>
          <Link to="/press" className="text-primary hover:underline mt-2 inline-block">← Back to Press</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
    publisher: { "@type": "Organization", name: entry.outlet },
    datePublished: entry.date,
    description: entry.summary,
    url: `https://mrcap1.com/press/${pressSlug}`,
    about: { "@type": "Person", name: "Mr. CAP" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${entry.title} | Mr. CAP Press`}
        description={entry.summary}
        canonical={`https://mrcap1.com/press/${pressSlug}`}
        jsonLd={jsonLd}
      />
      <Navigation />

      <article className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/press" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Press
          </Link>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">{entry.outlet}</p>
            <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">{entry.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {entry.author && (
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {entry.author}</span>
              )}
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed">{entry.summary}</p>
          </div>

          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:underline"
            >
              Read original article at {entry.outlet} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Cross-links */}
          <div className="mt-12 border-t border-border/20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/music" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Music Catalog</Link>
            <Link to="/videos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Videos</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Mr. CAP</Link>
            <Link to="/booking" className="text-sm text-muted-foreground hover:text-primary transition-colors">Book / Inquire →</Link>
          </div>

          {/* Fan Capture */}
          <section className="mt-8">
            <NewsletterSignup source={`press-${pressSlug}`} variant="compact" />
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default PressPost;
