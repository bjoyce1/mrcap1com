import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Play, Crown, Star, ExternalLink, Hexagon, Triangle, Command, Ghost, Gem, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MagneticWrapper } from '@/hooks/useMagneticHover';
import { gsap } from '@/hooks/useGSAP';
import { Progress } from '@/components/ui/progress';

// --- Marquee platforms ---
const PLATFORMS = [
  { name: "OpenSea", icon: Hexagon },
  { name: "Ethereum", icon: Triangle },
  { name: "MetaMask", icon: Command },
  { name: "IPFS", icon: Ghost },
  { name: "Polygon", icon: Gem },
  { name: "Rarible", icon: Cpu },
];

interface NFTHeroSectionProps {
  imageUrl1?: string;
  imageUrl2?: string;
  className?: string;
}

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <p className="text-2xl font-display font-semibold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
};

export const NFTHeroSection = ({
  imageUrl1 = '/placeholder.svg',
  imageUrl2 = '/placeholder.svg',
  className,
}: NFTHeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.hero-animate'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden bg-background text-foreground pt-32 pb-20 md:pt-40 md:pb-28',
        className
      )}
    >
      {/* Scoped marquee animation */}
      <style>{`
        @keyframes nft-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-nft-marquee { animation: nft-marquee 35s linear infinite; }
      `}</style>

      {/* Background gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">

          {/* --- LEFT COLUMN --- */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Badge */}
            <div className="hero-animate inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-1 ring-primary/20 bg-primary/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-primary">
                Web3 · Live On-Chain
              </span>
            </div>

            {/* Heading */}
            <h1 className="hero-animate text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tighter leading-[0.95]">
              Pioneering
              <br />
              <span className="text-gradient-orange">Digital Art</span>
              <br />
              On-Chain
            </h1>

            {/* Description */}
            <p className="hero-animate mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed font-light">
              Houston hip-hop meets Web3. Explore MR. CAP's tokenized music,
              exclusive collaborations, and blockchain collectibles — crafted for collectors.
            </p>

            {/* CTA Buttons */}
            <div className="hero-animate flex flex-wrap items-center gap-4 mt-8">
              <MagneticWrapper strength={0.25}>
                <a
                  href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="flux" size="lg" className="h-12 px-8 text-base">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </MagneticWrapper>

              <a href="#collection" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <span className="flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-border group-hover:ring-primary/40 transition-colors">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </span>
                Watch Showreel
              </a>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex flex-col gap-5">

            {/* Stats Card (glassmorphism) */}
            <div className="hero-animate relative rounded-2xl ring-1 ring-border bg-card/60 backdrop-blur-xl p-6 overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-5">
                {/* Top row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-semibold text-foreground">11</p>
                    <p className="text-xs text-muted-foreground">Tracks Tokenized</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Collection Minted</span>
                    <span className="text-primary font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2 bg-muted" />
                </div>

                <div className="h-px bg-border" />

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4">
                  <StatItem value="2021" label="First Mint" />
                  <StatItem value="ETH" label="Blockchain" />
                  <StatItem value="1st" label="Houston NFT" />
                </div>

                {/* Pills */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-[hsl(142_76%_36%/0.3)] bg-[hsl(142_76%_36%/0.1)] text-[hsl(142_71%_45%)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_71%_45%)] animate-pulse" />
                    LIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-primary/30 bg-primary/10 text-primary">
                    <Star className="w-3 h-3" />
                    PIONEER
                  </span>
                </div>
              </div>
            </div>

            {/* NFT Preview Cards — independent tilt */}
            <div className="hero-animate relative h-[260px] md:h-[320px]">
              {/* Back card */}
              <TiltCard className="absolute right-4 top-4 w-[55%] h-full rounded-2xl overflow-hidden ring-1 ring-border rotate-3 shadow-2xl shadow-primary/10">
                <img src={imageUrl2} alt="NFT Preview 2" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </TiltCard>
              {/* Front card */}
              <TiltCard className="absolute left-4 top-0 w-[55%] h-full rounded-2xl overflow-hidden ring-1 ring-primary/20 -rotate-3 shadow-2xl shadow-primary/20">
                <img src={imageUrl1} alt="NFT Preview 1" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </TiltCard>
            </div>

            {/* Marquee Card */}
            <div className="hero-animate rounded-2xl ring-1 ring-border bg-card/60 backdrop-blur-xl p-4 overflow-hidden">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">
                Available On Leading Platforms
              </p>
              <div className="relative overflow-hidden">
                <div className="flex animate-nft-marquee w-max">
                  {[...PLATFORMS, ...PLATFORMS, ...PLATFORMS].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 px-6">
                      <p.icon className="w-5 h-5 text-muted-foreground/60" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTHeroSection;
