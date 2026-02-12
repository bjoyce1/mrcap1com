import { useState } from "react";
import { Headphones, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/1pSXGKxJIw95dV3xQX4TjS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/artist/mr-cap/276295771",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.463-.23.55-.506.026-.085.042-.174.042-.263V9.333a.56.56 0 00-.04-.22c-.038-.09-.102-.15-.198-.15-.064 0-.132.015-.197.03l-4.57 1.072c-.025.006-.05.014-.074.022-.16.052-.24.158-.253.324-.003.04-.003.082-.003.124v7.266c0 .365-.043.727-.194 1.065-.31.69-.845 1.11-1.573 1.3-.318.082-.643.124-.974.138-.95.04-1.77-.6-1.93-1.542a1.88 1.88 0 011.038-2.023c.315-.155.654-.243.996-.32.39-.085.783-.162 1.17-.258.275-.068.46-.233.543-.507.02-.072.034-.148.034-.224V7.292c0-.27.07-.507.248-.7.15-.167.34-.274.555-.327l5.28-1.244c.13-.03.264-.054.397-.058.335-.01.545.198.573.537.004.052.003.104.003.157v4.458z" />
      </svg>
    ),
  },
];

const ListenFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 glass rounded-xl p-3 min-w-[180px] border border-white/10 shadow-[0_8px_32px_hsl(0,0%,0%,0.4)]"
          >
            <p className="text-xs text-muted-foreground mb-2 px-2 font-medium uppercase tracking-wider">
              Stream Now
            </p>
            {platforms.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-white/10 transition-colors"
              >
                {p.icon}
                {p.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center text-primary hover:scale-110 transition-all duration-300 shadow-[0_0_30px_hsl(43,91%,61%,0.2)]"
        aria-label="Listen Now"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ListenFAB;
