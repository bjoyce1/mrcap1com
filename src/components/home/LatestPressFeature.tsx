import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { pressPageData } from "@/content/press";

const LatestPressFeature = () => {
  const latestPosts = pressPageData.timeline.filter((e) => e.url?.startsWith("/press/")).slice(0, 2);

  if (latestPosts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
              From the Press Room
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cap-gold">
                News
              </span>
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" asChild>
            <Link to="/press">
              All Press <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {latestPosts.map((post, i) => (
            <motion.div
              key={post.slug || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={post.url!}
                className="block group p-6 rounded-2xl border border-border/20 bg-card/30 hover:border-primary/30 transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{post.outlet}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-primary mt-4 group-hover:underline">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPressFeature;
