import SEO from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

/** Placeholder for the Self Love rooms that haven't opened yet (2025, 2026). Same look as before, now with its own SEO. */
export default function SelfLoveComingSoon({ year }: { year: 2025 | 2026 }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <SEO entry={routeSeo(`/self-love/${year}`)} />
      <p className="text-xl">{year}: Coming Soon</p>
    </div>
  );
}
