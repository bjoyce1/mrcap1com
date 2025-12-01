import { Film, Quote, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const PressSection = () => {
  return (
    <section id="press" className="py-24 md:py-32 bg-section-gradient border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Media
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-2">
            Press & <span className="text-gradient-gold">Notable Appearances</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Mr. CAP's work crosses beyond music into film, media, and community storytelling. 
            His voice and perspective have been featured in documentaries, interviews, and regional press.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Documentary Feature */}
          <div className="bg-card-gradient rounded-2xl border border-border p-8 relative overflow-hidden">
            {/* Award Badge */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cap-gold/20 border border-cap-gold/30">
                <Award className="w-4 h-4 text-cap-gold" />
                <span className="text-xs text-cap-gold font-medium">Emmy Nominated</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl">Documentary Feature</h3>
                <p className="text-xs text-muted-foreground">2024 Lone Star Emmy Nominee</p>
              </div>
            </div>

            <h4 className="font-display text-2xl mb-4 text-foreground">
              The Life: Sex Trafficking and Modern-Day Slavery
            </h4>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mr. CAP appears in this powerful documentary, nominated for a 2024 Lone Star Emmy Award. 
              In the film, he offers insight from the viewpoint of an ex-pimp, adding firsthand 
              perspective to a difficult, critical conversation about human trafficking.
            </p>

            <p className="text-xs text-muted-foreground">
              For usage, screenings, or media quotes related to this project, 
              please contact the team for details and clearances.
            </p>
          </div>

          {/* Quotes & Downloads */}
          <div className="space-y-6">
            {/* Pull Quotes */}
            <div className="bg-card-gradient rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl">Press Quotes</h3>
              </div>

              <div className="space-y-4">
                <blockquote className="border-l-2 border-cap-gold pl-4 py-2">
                  <p className="text-foreground italic">
                    "A true architect of South Park storytelling — bridging old school 
                    reality rap with forward-thinking ideas."
                  </p>
                </blockquote>

                <blockquote className="border-l-2 border-primary pl-4 py-2">
                  <p className="text-foreground italic">
                    "Mr. CAP brings the perspective of someone who's lived it, 
                    learned from it, and decided to build something greater."
                  </p>
                </blockquote>
              </div>
            </div>

            {/* Media Downloads */}
            <div className="bg-card-gradient rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cap-gold/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-cap-gold" />
                </div>
                <h3 className="font-display text-xl">Media Downloads</h3>
              </div>

              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• High-resolution press photos</li>
                <li>• Official logo and wordmark</li>
                <li>• Album covers and single artwork</li>
                <li>• Artist biography (short & long form)</li>
              </ul>

              <Button variant="gold" className="w-full">
                <Download className="w-4 h-4" />
                Download Full Press Kit (ZIP)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressSection;
