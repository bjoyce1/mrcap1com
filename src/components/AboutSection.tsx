import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { number: "30+", label: "Years in the Game" },
  { number: "100+", label: "Tracks Released" },
  { number: "1st", label: "Houston NFT Rapper" },
  { number: "Emmy", label: "Award Contributor" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-spacing relative overflow-hidden">
      {/* Background Image with Fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/images/about-bg.png"
          alt=""
          className="absolute right-0 top-0 h-[120%] w-auto object-cover object-left opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-primary" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                Biography
              </span>
            </div>
            <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl tracking-tight">
              About <span className="text-gradient-orange">Mr. CAP</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-6">
            <ScrollReveal width="100%">
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-light text-balance">
                <span className="text-primary font-medium">Mr. CAP</span> (born Cornelius A. Pratt, April 5, 1973) is a Houston-based
                rapper, entrepreneur, and media producer whose career spans decades within the Southern hip hop underground.
                Raised in Houston's Third Ward, he began performing at a young age and later became an original member of the
                South Park Coalition, one of Texas' most enduring independent hip hop collectives.
              </p>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.15}>
              <p className="text-muted-foreground leading-relaxed font-light text-balance">
                Known for narrative-driven lyricism and Houston-rooted authenticity, Mr. CAP has released solo and
                collaborative projects while maintaining a strong presence in the city's cultural ecosystem. His work
                has been covered by major outlets including{" "}
                <span className="text-foreground">Houston Press</span> and{" "}
                <span className="text-foreground">Houston Chronicle</span>, documenting both his musical output and
                long-standing role in Houston hip hop.
              </p>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.25}>
              <p className="text-muted-foreground leading-relaxed font-light text-balance">
                Beyond music, Mr. CAP contributed to the documentary{" "}
                <span className="italic text-foreground">"The Life: Sex Trafficking and Modern-Day Slavery"</span>,
                which won a <span className="text-primary font-medium">Lone Star Emmy Award</span>. He was also honored during the
                50th Anniversary of Hip Hop by Broadcast Houston and received a{" "}
                <span className="text-foreground">Certificate of Congressional Recognition</span> from Congresswoman Sheila Jackson Lee.
              </p>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.35}>
              <blockquote className="border-l-2 border-primary pl-8 py-6 my-10">
                <p className="text-xl md:text-2xl text-foreground italic font-light leading-relaxed">
                  "These recognitions reflect not just music, but years of cultural contribution and storytelling."
                </p>
                <cite className="text-sm text-muted-foreground not-italic mt-3 block">— Mr. CAP</cite>
              </blockquote>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.4}>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link
                  to="/who-is-mr-cap"
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Read Full Biography →
                </Link>
                <Link
                  to="/mr-cap-discography"
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  View Full Discography →
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, index) => (
                <ScrollReveal key={index} width="100%" delay={0.1 * index}>
                  <div className="stat-card glass rounded-2xl p-6 text-center">
                    <p className="font-display text-3xl md:text-4xl text-primary mb-2">
                      {item.number}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
