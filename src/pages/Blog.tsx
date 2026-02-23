import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { ChevronRight, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const Blog = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "name": "Mr. CAP Blog",
        "description": "Insights on Houston hip-hop history, South Park Coalition, music industry success, blockchain innovation, and independent artist strategies.",
        "url": "https://mrcap1.com/blog",
        "author": { "@type": "Person", "name": "Mr. CAP" },
        "blogPost": blogPosts.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "datePublished": post.date,
          "author": { "@type": "Person", "name": post.author },
          "url": `https://mrcap1.com/blog/${post.slug}`,
          "description": post.excerpt
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrcap1.com" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://mrcap1.com/blog" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Blog | Mr. CAP – Houston Hip-Hop, Music Industry & Blockchain Insights</title>
        <meta name="description" content="Insights from Mr. CAP on Houston hip-hop history, South Park Coalition legacy, music industry success strategies, and blockchain innovation for independent artists." />
        <link rel="canonical" href="https://mrcap1.com/blog" />
        <meta property="og:title" content="Blog | Mr. CAP" />
        <meta property="og:description" content="Insights on Houston hip-hop, music industry, and blockchain innovation from Mr. CAP." />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content="https://mrcap1.com/blog" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Blog</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-flux-accent">
                  Blog
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Insights on Houston hip-hop, music industry success, and blockchain innovation.
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 bg-card/20 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-muted-foreground py-2">Categories:</span>
                {blogCategories.map((category) => (
                  <button
                    key={category}
                    className="text-sm bg-card/50 border border-border/50 rounded-full px-4 py-2 hover:border-primary/50 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {blogPosts.map((post, index) => (
                  <ScrollReveal key={post.slug} width="100%" delay={0.1 * index}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="blog-card group bg-card/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all block"
                    >
                      {post.image ? (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 via-card to-flux-accent/20 flex items-center justify-center relative">
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-24 h-24 border border-primary/30 rounded-full" />
                            <div className="absolute bottom-4 right-4 w-16 h-16 border border-flux-accent/30 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-border/30 rotate-45" />
                          </div>
                          <span className="text-2xl font-display font-bold text-primary/40 group-hover:text-primary/60 transition-colors">
                            MR. CAP
                          </span>
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-sm mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className="text-primary text-sm font-medium group-hover:underline">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-20 bg-gradient-to-b from-primary/10 to-background border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Stay Updated
                  </h2>
                  <p className="text-muted-foreground">
                    Get the latest posts, music releases, and tour announcements delivered to your inbox.
                  </p>
                </div>
                <NewsletterSignup source="blog" variant="default" />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
