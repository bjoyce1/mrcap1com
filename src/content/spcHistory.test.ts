import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blogPosts";
import { SYMBOL_LORE } from "@/features/legends/config";
import { routeSeo } from "@/seo/routes";
import { SPC_FAQ } from "@/seo/faqs";
import { HISTORICAL_SOURCE, LONG_BIO } from "@/content/pressKit";
import {
  SPC_FOUNDING_SOURCE_NOTE,
  SPC_FOUNDING_YEAR,
} from "./spcHistory";

describe("South Park Coalition founding history", () => {
  it("uses 1987 and Mr. CAP's firsthand confirmation as the primary source", () => {
    expect(SPC_FOUNDING_YEAR).toBe(1987);
    expect(SPC_FOUNDING_SOURCE_NOTE).toContain("Mr. CAP");
    expect(SPC_FOUNDING_SOURCE_NOTE).toContain("firsthand knowledge on November 27, 2026");
  });

  it("corrects both affected published articles without leaving 1986", () => {
    const affected = blogPosts.filter((post) =>
      ["the-hustle-doesnt-age-it-evolves-mr-cap-on-legacy-energy-and-building-a-digital-empire", "10-things-south-park-coalition"].includes(post.slug),
    );
    expect(affected).toHaveLength(2);
    for (const post of affected) {
      expect(post.content).toContain("1987");
      expect(post.content).toContain(SPC_FOUNDING_SOURCE_NOTE);
      expect(post.content).not.toContain("1986");
    }
  });

  it("corrects K-Rino's Legends biography", () => {
    expect(SYMBOL_LORE["k-rino"].bio).toContain("1987");
    expect(SYMBOL_LORE["k-rino"].bio).not.toContain("1986");
  });

  it("publishes 1987 and the primary source in search schema", () => {
    const group = routeSeo("/south-park-coalition").jsonLd?.find(
      (node) => node["@type"] === "MusicGroup" && node.name === "South Park Coalition",
    );
    expect(group).toMatchObject({ foundingDate: "1987" });
    expect(SPC_FAQ[0].answer).toContain(SPC_FOUNDING_SOURCE_NOTE);
  });

  it("keeps the press kit at 1987 and records the source", () => {
    expect(LONG_BIO).toContain("founded in 1987");
    expect(LONG_BIO).not.toContain("1986");
    expect(HISTORICAL_SOURCE).toBe(SPC_FOUNDING_SOURCE_NOTE);
  });
});
