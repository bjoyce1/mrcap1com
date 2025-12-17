import { useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { selfLove2024 } from "@/data/selfLove2024";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { gsap } from "@/hooks/useGSAP";
import { ArrowLeft } from "lucide-react";

export default function SelfLoveStory() {
  const nav = useNavigate();
  const { slug } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const story = useMemo(
    () => selfLove2024.find((s) => s.slug === slug),
    [slug]
  );

  useEffect(() => {
    if (!contentRef.current || !story) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [story]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <section className="mx-auto max-w-3xl px-4 py-20 pt-32">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="mt-6 text-2xl font-semibold">Story not found</h1>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="mx-auto max-w-4xl px-4 py-20 pt-32">
        <Link
          to="/self-love/2024"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Room
        </Link>

        <div
          ref={contentRef}
          className="mt-8 overflow-hidden rounded-2xl border border-border/20 bg-card/50"
        >
          {story.bgImage && (
            <div className="max-h-[480px] overflow-hidden bg-muted/20">
              <img
                src={story.bgImage}
                alt=""
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              {story.character}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold uppercase tracking-wide">
              {story.storyTitle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {story.roomTitle}
            </p>

            <div className="mt-8 prose prose-invert max-w-none">
              {story.body.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-foreground/90 leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
