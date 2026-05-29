import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA } from "./CTA";

const LINKS = [
  { to: "/discography", label: "Music" },
  { to: "/legacy", label: "Legacy" },
  { to: "/nft", label: "Visual" },
  { to: "/press", label: "Press" },
];

/**
 * NavV3 — minimal global nav for the V3 system.
 * Wordmark left, links centered, single Book CTA right.
 * Becomes opaque after small scroll.
 */
export const NavV3 = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-[var(--ds-dur-fast)]",
        scrolled
          ? "bg-[hsl(var(--ds-bg)/0.85)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div
        className="mx-auto flex items-center justify-between h-16 md:h-20"
        style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)", maxWidth: "var(--ds-max)" }}
      >
        <Link
          to="/"
          className="ds-font-display italic text-[hsl(var(--ds-bone))] text-xl md:text-2xl tracking-tight"
        >
          Mr.&nbsp;CAP
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "ds-font-eyebrow text-[0.75rem] transition-colors duration-[var(--ds-dur-fast)]",
                  isActive
                    ? "text-[hsl(var(--ds-bone))]"
                    : "text-[hsl(var(--ds-bone-dim))] hover:text-[hsl(var(--ds-bone))]",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <CTA variant="primary" to="/booking" arrow={false} className="!py-3 !px-5 !text-[0.7rem]">
            Book
          </CTA>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[hsl(var(--ds-bone))] p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden bg-[hsl(var(--ds-bg))] border-t border-[hsl(var(--ds-bone)/0.06)]">
          <nav
            className="flex flex-col py-6 gap-1"
            style={{ paddingLeft: "var(--ds-gutter)", paddingRight: "var(--ds-gutter)" }}
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="py-3 ds-font-display italic text-2xl text-[hsl(var(--ds-bone))]"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-4">
              <CTA variant="primary" to="/booking" arrow={false}>Book a show</CTA>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
