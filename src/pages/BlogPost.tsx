import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, Fragment } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getBlogPostBySlug, blogPosts } from "@/data/blogPosts";
import { useSanityBlogPost, useSanityBlogPosts } from "@/hooks/useSanity";
import { ChevronRight, Clock, Calendar, Tag, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackBlogRead } from "@/components/GoogleAnalytics";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  // Try Sanity first, fall back to static
  const { data: sanityPost } = useSanityBlogPost(slug ?? "");
  const { data: sanityAll } = useSanityBlogPosts();
  const staticPost = slug ? getBlogPostBySlug(slug) : undefined;

  const post = useMemo(() => {
    if (sanityPost) {
      const s = sanityPost;
      const resolvedSlug = typeof s.slug === "string" ? s.slug : s.slug?.current ?? "";
      return {
        slug: resolvedSlug,
        title: s.title,
        excerpt: s.excerpt ?? "",
        category: s.category ?? "",
        date: s.publishedAt,
        author: s.author ?? "Mr. CAP",
        image: s.coverImage,
        readTime: s.readTime ? `${s.readTime} min` : "5 min",
        tags: s.tags ?? [],
        content: "", // Portable Text body handled below
        body: s.body, // raw Portable Text
      };
    }
    return staticPost ? { ...staticPost, body: undefined } : undefined;
  }, [sanityPost, staticPost]);

  // Related posts
  const relatedPosts = useMemo(() => {
    if (sanityAll && sanityAll.length > 0 && post) {
      return sanityAll
        .filter((p) => {
          const pSlug = typeof p.slug === "string" ? p.slug : p.slug?.current ?? "";
          return pSlug !== post.slug && p.category === post.category;
        })
        .slice(0, 2)
        .map((p) => ({
          slug: typeof p.slug === "string" ? p.slug : p.slug?.current ?? "",
          title: p.title,
          category: p.category ?? "",
          readTime: p.readTime ? `${p.readTime} min` : "5 min",
        }));
    }
    return blogPosts
      .filter((p) => post && p.slug !== post.slug && p.category === post.category)
      .slice(0, 2);
  }, [sanityAll, post]);

  const wordCount = post.content ? post.content.split(/\s+/).length : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://mrcap1.com/who-is-mr-cap",
      "sameAs": [
        "https://instagram.com/mrcapism",
        "https://twitter.com/mrcap1"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mr. CAP",
      "url": "https://mrcap1.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mrcap1.com/og-image.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mrcap1.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    ...(post.image ? { "image": { "@type": "ImageObject", "url": post.image } } : {}),
    ...(wordCount > 0 ? { "wordCount": wordCount } : {}),
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "about": {
      "@type": "Person",
      "name": "Mr. CAP",
      "description": "Houston hip-hop veteran and Web3 pioneer"
    }
  };

  const shareUrl = `https://mrcap1.com/blog/${post.slug}`;

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
                >
                  {/* If Sanity Portable Text body exists, render blocks; else parse static content */}
                  {(post as any).body && Array.isArray((post as any).body)
                    ? (post as any).body.map((block: any, i: number) => {
                        if (block._type === "block") {
                          const Tag = block.style === "h2" ? "h2" : block.style === "h3" ? "h3" : block.style === "h4" ? "h4" : block.style === "blockquote" ? "blockquote" : "p";
                          const text = block.children?.map((c: any) => c.text).join("") ?? "";
                          if (!text.trim()) return null;
                          return <Tag key={block._key || i}>{text}</Tag>;
                        }
                        if (block._type === "image" && block.asset?._ref) {
                          return <img key={block._key || i} alt={block.alt || ""} className="rounded-lg" />;
                        }
                        return null;
                      })
                    : post.content.split(/\n/).map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                        if (line.trim() === '') return null;
                        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                        if (imgMatch) {
                          return (
                            <figure key={i} className="my-8">
                              <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full rounded-xl border border-border/50 shadow-lg" />
                              {imgMatch[1] && <figcaption className="text-sm text-muted-foreground mt-3 text-center">{imgMatch[1]}</figcaption>}
                            </figure>
                          );
                        }
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        if (linkRegex.test(line)) {
                          const parts: React.ReactNode[] = [];
                          let lastIndex = 0;
                          linkRegex.lastIndex = 0;
                          let match;
                          while ((match = linkRegex.exec(line)) !== null) {
                            if (match.index > lastIndex) parts.push(line.slice(lastIndex, match.index));
                            const href = match[2];
                            parts.push(
                              href.startsWith("/")
                                ? <Link key={`${i}-${match.index}`} to={href} className="text-primary hover:underline">{match[1]}</Link>
                                : <a key={`${i}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{match[1]}</a>
                            );
                            lastIndex = match.index + match[0].length;
                          }
                          if (lastIndex < line.length) parts.push(line.slice(lastIndex));
                          return <p key={i}>{parts}</p>;
                        }
                        return <p key={i}>{line}</p>;
                      })
                  }
                </div>
                
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

                {/* Newsletter CTA */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-display font-bold mb-2">Enjoyed this post?</h3>
                    <p className="text-sm text-muted-foreground">Get more content like this delivered to your inbox.</p>
                  </div>
                  <NewsletterSignup source="blog_post" variant="default" />
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
