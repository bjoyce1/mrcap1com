import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NFTHeroSectionProps {
  imageUrl1?: string;
  imageUrl2?: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const cardsVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0, 0, 0.2, 1] as const,
      staggerChildren: 0.3,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

export const NFTHeroSection = ({
  imageUrl1 = '/placeholder.svg',
  imageUrl2 = '/placeholder.svg',
  className,
}: NFTHeroSectionProps) => {
  const gridBackgroundStyle = {
    backgroundImage:
      'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
    backgroundSize: '3rem 3rem',
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-background text-foreground pt-32 pb-20 md:pt-40 md:pb-28',
        className
      )}
    >
      {/* Grid Background */}
      <div className="absolute inset-0" style={gridBackgroundStyle} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Orange Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="relative max-w-7xl mx-auto flex min-h-[60vh] items-center justify-between px-6 lg:flex-row flex-col gap-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left: Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">
          {/* Badge */}
          <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Web3 · Live On-Chain
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tighter leading-[0.95] text-glow"
            variants={itemVariants}
          >
            NFT
            <br />
            <span className="text-gradient-orange">Portfolio</span>
          </motion.h1>
          
          <motion.p
            className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed font-light"
            variants={itemVariants}
          >
            Pioneering Houston hip-hop in Web3. Explore MR. CAP's digital art collection, 
            featuring tokenized music, exclusive collaborations, and blockchain collectibles.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-8">
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
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap gap-8 md:gap-12 mt-12"
            variants={itemVariants}
          >
            <div className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-display font-medium text-gradient-orange">2021</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">First Houston Hip-Hop NFT</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-display font-medium text-primary">11</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Album Tracks Tokenized</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-display font-medium text-foreground">ETH</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Ethereum Blockchain</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Card Images */}
        <motion.div
          className="relative lg:w-1/2 h-[350px] md:h-[450px] w-full flex items-center justify-center"
          variants={cardsVariants}
        >
          {/* Back Card */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -10, rotate: -5, transition: { duration: 0.3 } }}
            className="absolute h-64 md:h-96 w-48 md:w-72 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden transform rotate-[-6deg] translate-x-20 md:translate-x-28 border border-white/10 bg-white/[0.02]"
          >
            <img
              src={imageUrl2}
              alt="NFT Preview 2"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>
          
          {/* Front Card */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -10, rotate: 5, transition: { duration: 0.3 } }}
            className="absolute h-64 md:h-96 w-48 md:w-72 rounded-2xl shadow-2xl shadow-primary/30 overflow-hidden transform rotate-[6deg] -translate-x-16 md:-translate-x-20 border border-white/10 bg-white/[0.02]"
          >
            <img
              src={imageUrl1}
              alt="NFT Preview 1"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NFTHeroSection;
