import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  DSRoot,
  NavV3,
  FooterV3,
  Scene,
  Stage,
  Display,
  Eyebrow,
  Lead,
  Body,
  Caption,
  CTA,
} from "@/design-system";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { useSanityBlogPosts, SanityBlogPost } from "@/hooks/useSanity";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  content: "",
});

const POSTS_PER_PAGE = 10;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogV3() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: sanityPosts } = useSanityBlogPosts();
  const hasSanity = sanityPosts && sanityPosts.length > 0;

  const allPosts = (hasSanity ? sanityPosts.map(sanityToLocal) : [...blogPosts]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const filtered = useMemo(
    () => (activeCategory ? allPosts.filter((p) => p.category === activeCategory) : allPosts),
    [activeCategory, allPosts],
  );

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const posts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const featured = currentPage === 1 && !activeCategory ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Mr. CAP — The Field Notes",
    url: "https://mrcap1.com/blog",
    blogPost: allPosts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://mrcap1.com/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <DSRoot>
      <Helmet>
        <title>Field Notes | Mr. CAP — Essays on Houston Hip-Hop, NFTs & Legacy</title>
        <meta
          name="description"
          content="Long-form essays from Mr. CAP on Houston hip-hop history, South Park Coalition, Web3 ownership, and the architecture of an independent music career."
        />
        <link rel="canonical" href="https://mrcap1.com/blog" />
        <meta property="og:title" content="Field Notes | Mr. CAP" />
        <meta property="og:url" content="https://mrcap1.com/blog" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      <main>
        {/* HERO */}
        <Scene minH="60vh" align="start" justify="end" scrim={0} grain>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, hsl(var(--ds-oxblood)/0.18) 0%, hsl(var(--ds-bg)) 60%)",
            }}
          />
          <Stage py="none">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-4xl"
            >
              <Eyebrow accent className="mb-6">Essays · Field Notes · Long-form</Eyebrow>
              <Display size="xl" italic className="mb-6">
                The record between the records.
              </Display>
              <Lead className="text-[hsl(var(--ds-bone-dim))] max-w-2xl">
                Thirty years of notes from the studio, the street, and the blockchain.
                Read at your own pace.
              </Lead>
            </motion.div>
          </Stage>
        </Scene>

        {/* CATEGORY FILTER */}
        <Stage py="sm">
          <div className="flex flex-wrap gap-3 border-b border-[hsl(var(--ds-bone)/0.08)] pb-6">
            <button
              onClick={() => { setActiveCategory(null); setCurrentPage(1); }}
              className={`ds-font-eyebrow text-[0.7rem] tracking-[0.22em] uppercase px-4 py-2 transition-colors ${
                !activeCategory
                  ? "text-[hsl(var(--ds-bone))] bg-[hsl(var(--ds-bone)/0.08)]"
                  : "text-[hsl(var(--ds-bone-faint))] hover:text-[hsl(var(--ds-bone))]"
              }`}
            >
              All
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`ds-font-eyebrow text-[0.7rem] tracking-[0.22em] uppercase px-4 py-2 transition-colors ${
                  activeCategory === cat
                    ? "text-[hsl(var(--ds-bone))] bg-[hsl(var(--ds-bone)/0.08)]"
                    : "text-[hsl(var(--ds-bone-faint))] hover:text-[hsl(var(--ds-bone))]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Stage>

        {/* FEATURED POST */}
        {featured && (
          <Stage py="md">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
                {featured.image && (
                  <div className="relative overflow-hidden aspect-[4/3] bg-[hsl(var(--ds-elevated))] shadow-[0_8px_40px_hsl(0_0%_0%/0.5)]">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--ds-dur-slow)] group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <Eyebrow accent className="mb-4">Featured · {featured.category}</Eyebrow>
                  <Display size="lg" italic className="mb-6 group-hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors duration-[var(--ds-dur-fast)]">
                    {featured.title}
                  </Display>
                  <Body dim className="mb-6">{featured.excerpt}</Body>
                  <div className="flex items-center gap-6">
                    <Caption>{fmtDate(featured.date)}</Caption>
                    <Caption>{featured.readTime}</Caption>
                  </div>
                </div>
              </div>
            </Link>
          </Stage>
        )}

        {/* POST GRID */}
        <Stage py="md">
          <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {rest.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    {post.image && (
                      <div className="relative overflow-hidden aspect-[4/3] bg-[hsl(var(--ds-elevated))] mb-5">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--ds-dur-slow)] group-hover:scale-105"
                        />
                      </div>
                    )}
                    <Eyebrow className="mb-3">{post.category}</Eyebrow>
                    <Display size="md" as="h3" className="!text-[1.5rem] leading-tight mb-3 group-hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors duration-[var(--ds-dur-fast)]">
                      {post.title}
                    </Display>
                    <Body dim className="!text-[0.95rem] line-clamp-3 mb-4">{post.excerpt}</Body>
                    <div className="flex items-center gap-4">
                      <Caption>{fmtDate(post.date)}</Caption>
                      <Caption>·</Caption>
                      <Caption>{post.readTime}</Caption>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <Body dim>No essays in this category yet.</Body>
              </div>
            )}
          </div>
        </Stage>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Stage py="sm">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }} />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => { e.preventDefault(); goToPage(p); }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </Stage>
        )}

        {/* CLOSER */}
        <Scene minH="60vh" align="center" justify="center" scrim={0} grain>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(var(--ds-oxblood)/0.22) 0%, hsl(var(--ds-bg)) 70%)",
            }}
          />
          <Stage py="none">
            <div className="text-center max-w-3xl mx-auto">
              <Eyebrow accent className="mb-6">Stay on the list</Eyebrow>
              <Display size="lg" italic className="mb-10">
                New essays. No noise.
              </Display>
              <div className="flex flex-wrap gap-4 justify-center">
                <CTA variant="primary" to="/booking">Work with me</CTA>
                <CTA variant="ghost" to="/music">Hear the catalog</CTA>
              </div>
            </div>
          </Stage>
        </Scene>
      </main>

      <FooterV3 />
    </DSRoot>
  );
}
