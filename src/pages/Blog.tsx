import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { EarlyAccessCard } from "@/components/music/EarlyAccess";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { useSanityBlogPosts, SanityBlogPost } from "@/hooks/useSanity";
import { ChevronRight, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";
import { blogListLd } from "@/seo/builders";

/** Map a Sanity blog post to the shape used by the static data */
const sanityToLocal = (s: SanityBlogPost) => ({
  slug: typeof s.slug === "string" ? s.slug : s.slug?.current ?? "",
  title: s.title,
  excerpt: s.excerpt ?? "",
  category: s.category ?? "",
  date: s.publishedAt,
  author: s.author ?? "Mr. CAP",
  image: s.coverImage,
  readTime: s.readTime ? `${s.readTime} min` : "5 min",
  tags: s.tags ?? [],
  content: "", // body rendered separately on detail page
});

const POSTS_PER_PAGE = 10;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: sanityPosts } = useSanityBlogPosts();
  const hasSanity = sanityPosts && sanityPosts.length > 0;
  const allPosts = (hasSanity ? sanityPosts.map(sanityToLocal) : [...blogPosts])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return allPosts;
    return allPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, allPosts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const posts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <SEO entry={routeSeo("/blog")} extraJsonLd={allPosts.length ? [blogListLd(allPosts)] : undefined} />

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
                <button
                  onClick={() => { setActiveCategory(null); setCurrentPage(1); }}
                  className={`text-sm rounded-full px-4 py-2 transition-colors ${
                    !activeCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 border border-border/50 hover:border-primary/50"
                  }`}
                >
                  All
                </button>
                {blogCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
                    className={`text-sm rounded-full px-4 py-2 transition-colors ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/50 border border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto" style={{ position: 'relative', minHeight: '400px' }}>
              <ChromaGrid
                  items={posts.map((post) => ({
                    image: post.image,
                    title: post.title,
                    subtitle: post.excerpt,
                    borderColor: "hsl(var(--primary))",
                    gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.06), hsl(var(--background)))",
                    slug: post.slug,
                    category: post.category,
                    readTime: post.readTime,
                    date: post.date,
                  } as ChromaGridItem))}
                  columns={2}
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  renderCard={(item) => (
                    <Link
                      to={`/blog/${item.slug}`}
                      className="block h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.image ? (
                        <div className="aspect-video overflow-hidden rounded-t-[20px]">
                          <img 
                            src={item.image as string} 
                            alt={item.title || ''}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 via-card to-flux-accent/20 flex items-center justify-center relative rounded-t-[20px]">
                          <span className="text-2xl font-display font-bold text-primary/40">
                            MR. CAP
                          </span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                            {item.category as string}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime as string}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-foreground">{item.title}</h2>
                        <p className="text-muted-foreground text-sm mb-4">{item.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.date as string).toLocaleDateString('en-US', { 
                              month: 'long', day: 'numeric', year: 'numeric' 
                            })}
                          </span>
                          <span className="text-primary text-sm font-medium">Read More →</span>
                        </div>
                      </div>
                    </Link>
                  )}
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => { e.preventDefault(); goToPage(page); }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (page === 2 && currentPage > 3) {
                        return <PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>;
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 2) {
                        return <PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-20 bg-gradient-to-b from-primary/10 to-background border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <EarlyAccessCard source="blog" />
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
