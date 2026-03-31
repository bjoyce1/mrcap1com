import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteBlockProps {
  quote: string;
  attribution?: string;
}

const QuoteBlock = ({ quote, attribution }: QuoteBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = attribution ? `"${quote}" — ${attribution}` : `"${quote}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = attribution ? `"${quote}" — ${attribution}` : `"${quote}"`;
    if (navigator.share) {
      navigator.share({ text, url: window.location.href });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="relative border-l-2 border-primary/60 pl-6 py-4 my-8 bg-card/20 rounded-r-xl pr-6"
    >
      <p className="text-lg italic text-foreground/90 leading-relaxed">"{quote}"</p>
      {attribution && (
        <cite className="block mt-2 text-sm text-muted-foreground not-italic">— {attribution}</cite>
      )}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Share2 className="w-3 h-3" /> Share
        </button>
      </div>
    </motion.blockquote>
  );
};

export default QuoteBlock;
