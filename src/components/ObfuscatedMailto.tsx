import { useEffect, useState, type ReactNode } from "react";

interface ObfuscatedMailtoProps {
  /** Local part of the email (before @). */
  user: string;
  /** Domain part of the email (after @). */
  domain: string;
  /** Optional subject line for the mailto link. */
  subject?: string;
  /** Class names applied to the rendered anchor / span. */
  className?: string;
  /** Children to render inside the link. Defaults to the rendered address. */
  children?: ReactNode;
}

/**
 * Renders an email address only after hydration so the raw string never
 * appears in source HTML (no plaintext for scrapers / spam crawlers).
 * Falls back to a "Contact via form" link to /booking if JS is disabled.
 */
const ObfuscatedMailto = ({
  user,
  domain,
  subject,
  className,
  children,
}: ObfuscatedMailtoProps) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <a href="/booking" className={className} rel="nofollow">
        {children ?? "Contact via form"}
      </a>
    );
  }

  const address = `${user}@${domain}`;
  const href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

  return (
    <a href={href} className={className}>
      {children ?? address}
    </a>
  );
};

export default ObfuscatedMailto;
