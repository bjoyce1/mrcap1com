import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getBlogPostBySlug, blogPosts } from "@/data/blogPosts";
import { ChevronRight, Clock, Calendar, Tag, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Person",
      "name": "Mr. CAP"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mrcapmusic.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", ")
  };

  const shareUrl = `https://mrcapmusic.com/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} | Mr. CAP Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://mrcapmusic.com/blog/${post.slug}`} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://mrcapmusic.com/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24">
          {/* Header */}
          <section className="py-16 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                </nav>
                
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime} read
                  </span>
                  <span>By {post.author}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          {post.image && (
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full rounded-xl border border-border/50 shadow-lg"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div 
                  className="prose prose-lg prose-invert max-w-none
                    prose-headings:font-display prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-blockquote:border-l-primary prose-blockquote:bg-card/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                    prose-strong:text-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/<br\/><h2>/g, '</p><h2>').replace(/<h2>([^<]+)/g, '<h2>$1</h2><p>') }}
                />
                
                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-card/50 border border-border/50 rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share:
                    </span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-card/50 hover:bg-card transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-card/50 hover:bg-card transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-card/50 hover:bg-card transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-card/20 border-t border-border/50">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-display font-bold mb-8">Related Posts</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        to={`/blog/${relatedPost.slug}`}
                        className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors"
                      >
                        <span className="text-xs text-primary">{relatedPost.category}</span>
                        <h3 className="font-bold mt-2 hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {relatedPost.readTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <section className="py-12 border-t border-border/50">
            <div className="container mx-auto px-4 text-center">
              <Button variant="fluxOutline" asChild>
                <Link to="/blog">
                  ← Back to Blog
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
