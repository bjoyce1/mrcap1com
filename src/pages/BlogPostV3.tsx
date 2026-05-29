import { useParams, Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
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
import { getBlogPostBySlug, blogPosts } from "@/data/blogPosts";
import { useSanityBlogPost, useSanityBlogPosts } from "@/hooks/useSanity";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// Markdown-lite line parser (mirrors existing BlogPost logic)
const renderLine = (line: string, i: number) => {
  if (line.startsWith("## ")) {
    return (
      <Display size="md" as="h2" italic key={i} className="!text-[1.75rem] md:!text-[2.25rem] mt-16 mb-6">
        {line.slice(3)}
      </Display>
    );
  }
  if (line.trim() === "") return null;

  const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imgMatch) {
    return (
      <figure key={i} className="my-12">
        <div className="relative overflow-hidden bg-[hsl(var(--ds-elevated))] shadow-[0_8px_40px_hsl(0_0%_0%/0.5)]">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto" loading="lazy" />
        </div>
        {imgMatch[1] && <Caption className="mt-4 text-center">{imgMatch[1]}</Caption>}
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
        href.startsWith("/") ? (
          <Link key={`${i}-${match.index}`} to={href} className="text-[hsl(var(--ds-oxblood-glow))] underline-offset-4 hover:underline">
            {match[1]}
          </Link>
        ) : (
          <a key={`${i}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--ds-oxblood-glow))] underline-offset-4 hover:underline">
            {match[1]}
          </a>
        ),
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    return (
      <Body key={i} dim className="!text-[1.0625rem] md:!text-[1.125rem] leading-[1.85] mb-6">
        {parts}
      </Body>
    );
  }

  return (
    <Body key={i} dim className="!text-[1.0625rem] md:!text-[1.125rem] leading-[1.85] mb-6">
      {line}
    </Body>
  );
};

export default function BlogPostV3() {
  const { slug } = useParams<{ slug: string }>();
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
        content: "",
        body: s.body,
      };
    }
    return staticPost ? { ...staticPost, body: undefined as any } : undefined;
  }, [sanityPost, staticPost]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = useMemo(() => {
    const pool = sanityAll && sanityAll.length > 0
      ? sanityAll.map((p) => ({
          slug: typeof p.slug === "string" ? p.slug : p.slug?.current ?? "",
          title: p.title,
          category: p.category ?? "",
          readTime: p.readTime ? `${p.readTime} min` : "5 min",
          image: p.coverImage,
        }))
      : blogPosts.map((p) => ({ slug: p.slug, title: p.title, category: p.category, readTime: p.readTime, image: p.image }));
    return pool.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  }, [sanityAll, post]);

  const shareUrl = `https://mrcap1.com/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://mrcap1.com/who-is-mr-cap",
    },
    publisher: {
      "@type": "Organization",
      name: "Mr. CAP Legacy",
      url: "https://mrcap1.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
  };

  return (
    <DSRoot>
      <Helmet>
        <title>{post.title} | Mr. CAP — Field Notes</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {post.image && <meta property="og:image" content={post.image} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <NavV3 />

      <main>
        {/* HERO */}
        <Scene
          bgImage={post.image}
          scrim={0.75}
          align="start"
          justify="end"
          minH="85vh"
        >
          <Stage py="none">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-4xl"
            >
              <Eyebrow accent className="mb-6">{post.category}</Eyebrow>
              <Display size="xl" italic className="mb-8">
                {post.title}
              </Display>
              <Lead className="text-[hsl(var(--ds-bone-dim))] max-w-3xl mb-8">
                {post.excerpt}
              </Lead>
              <div className="flex flex-wrap items-center gap-6">
                <Caption>{fmtDate(post.date)}</Caption>
                <Caption>·</Caption>
                <Caption>{post.readTime} read</Caption>
                <Caption>·</Caption>
                <Caption>By {post.author}</Caption>
              </div>
            </motion.div>
          </Stage>
        </Scene>

        {/* ARTICLE BODY */}
        <Stage py="md" narrow>
          <article>
            {post.body && Array.isArray(post.body)
              ? post.body.map((block: any, i: number) => {
                  if (block._type === "block") {
                    const style = block.style;
                    const text = block.children?.map((c: any) => c.text).join("") ?? "";
                    if (!text.trim()) return null;
                    if (style === "h2" || style === "h3" || style === "h4") {
                      return (
                        <Display
                          key={block._key || i}
                          as={style as any}
                          size="md"
                          italic
                          className="!text-[1.75rem] md:!text-[2.25rem] mt-16 mb-6"
                        >
                          {text}
                        </Display>
                      );
                    }
                    if (style === "blockquote") {
                      return (
                        <blockquote
                          key={block._key || i}
                          className="my-10 pl-6 border-l-2 border-[hsl(var(--ds-oxblood))]"
                        >
                          <Display as="p" size="md" italic className="!text-[1.5rem] leading-snug">
                            {text}
                          </Display>
                        </blockquote>
                      );
                    }
                    return (
                      <Body
                        key={block._key || i}
                        dim
                        className="!text-[1.0625rem] md:!text-[1.125rem] leading-[1.85] mb-6"
                      >
                        {text}
                      </Body>
                    );
                  }
                  return null;
                })
              : post.content.split(/\n/).map(renderLine)}
          </article>

          {/* TAGS */}
          {post.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[hsl(var(--ds-bone)/0.08)]">
              <Caption className="uppercase tracking-[0.22em] mb-4">Tags</Caption>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="ds-font-eyebrow text-[0.7rem] tracking-[0.22em] uppercase px-3 py-1.5 bg-[hsl(var(--ds-bone)/0.05)] text-[hsl(var(--ds-bone-dim))]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SHARE */}
          <div className="mt-12 pt-8 border-t border-[hsl(var(--ds-bone)/0.08)] flex flex-wrap items-center gap-6">
            <Caption className="uppercase tracking-[0.22em]">Share</Caption>
            <CTA
              variant="link"
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
            >
              Twitter
            </CTA>
            <CTA
              variant="link"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            >
              Facebook
            </CTA>
            <CTA
              variant="link"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
            >
              LinkedIn
            </CTA>
          </div>
        </Stage>

        {/* RELATED */}
        {related.length > 0 && (
          <Stage py="md">
            <div className="border-t border-[hsl(var(--ds-bone)/0.08)] pt-16">
              <Eyebrow accent className="mb-4">Keep reading</Eyebrow>
              <Display size="lg" italic className="mb-12">More from {post.category}.</Display>
              <div className="grid md:grid-cols-3 gap-8">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="group block">
                    {r.image && (
                      <div className="relative overflow-hidden aspect-[4/3] bg-[hsl(var(--ds-elevated))] mb-4">
                        <img
                          src={r.image}
                          alt={r.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--ds-dur-slow)] group-hover:scale-105"
                        />
                      </div>
                    )}
                    <Eyebrow className="mb-2">{r.category}</Eyebrow>
                    <Display size="md" as="h3" className="!text-[1.25rem] leading-tight mb-2 group-hover:text-[hsl(var(--ds-oxblood-glow))] transition-colors">
                      {r.title}
                    </Display>
                    <Caption>{r.readTime}</Caption>
                  </Link>
                ))}
              </div>
            </div>
          </Stage>
        )}

        {/* CLOSER */}
        <Scene minH="60vh" align="center" justify="center" scrim={0} grain>
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(var(--ds-oxblood)/0.2) 0%, hsl(var(--ds-bg)) 70%)",
            }}
          />
          <Stage py="none">
            <div className="text-center max-w-3xl mx-auto">
              <Eyebrow accent className="mb-6">Back to the index</Eyebrow>
              <Display size="lg" italic className="mb-10">All field notes.</Display>
              <div className="flex flex-wrap gap-4 justify-center">
                <CTA variant="primary" to="/blog">Read more essays</CTA>
                <CTA variant="ghost" to="/booking">Work with me</CTA>
              </div>
            </div>
          </Stage>
        </Scene>
      </main>

      <FooterV3 />
    </DSRoot>
  );
}
