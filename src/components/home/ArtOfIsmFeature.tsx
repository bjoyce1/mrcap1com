import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import artOfIsmTitle from "@/assets/art-of-ism-title.webp";
import artOfIsmPoster from "@/assets/art-of-ism-poster.webp";
import artOfIsmBg from "@/assets/art-of-ism-bg.webp";
import SectionShell from "@/components/home/SectionShell";
import SectionBackground from "@/components/home/SectionBackground";

const ArtOfIsmFeature = () => {
  return (
    <SectionBackground
      image={artOfIsmBg}
      opacity={0.5}
      gradient="left"
      overlay={
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      }
    >
      <SectionShell index="04" eyebrow="New Book">
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-10 items-center max-w-4xl mx-auto relative z-10">
        <Link to="/art-of-ism" className="block group">
          <img
            src={artOfIsmPoster}
            alt="The Art of ISM by Mr. CAP"
            className="w-full rounded-xl shadow-xl shadow-primary/10 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] ring-1 ring-white/10 rounded-full">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Now Available</span>
          </div>
          <img
            src={artOfIsmTitle}
            alt="The Art of ISM"
            className="h-20 md:h-28 object-contain mx-auto md:mx-0"
          />
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto md:mx-0">
            A philosophy built from experience. Refined through movement.
            11 immersive chapters, exclusive ISM Codes, and a Quote Vault —
            enter the interactive online book experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button variant="default" size="lg" asChild>
              <a href="https://theartofism.com" target="_blank" rel="noopener noreferrer">
                Read Now <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/vinyl">
                <Disc3 className="w-4 h-4 mr-2" /> Order the Vinyl
              </Link>
            </Button>
          </div>
        </div>
        </div>
      </SectionShell>
    </SectionBackground>
  );
};

export default ArtOfIsmFeature;
