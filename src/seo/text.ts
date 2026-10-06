/**
 * Text rules for everything the SEO layer outputs: no em or en dashes, titles under
 * 60 characters, descriptions between 140 and 160.
 */

const EM = "\u2014";
const EN = "\u2013";

/**
 * Replace em and en dashes with plain punctuation. Number ranges keep a hyphen
 * (2024-2026); a spaced dash between words becomes a comma.
 */
export function noDashes(input: string): string {
  if (!input) return input;
  return input
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
    .replace(/\s+[\u2013\u2014]\s+/g, ", ")
    .replace(/[\u2013\u2014]/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+,/g, ",");
}

export const hasDash = (s: string) => s.includes(EM) || s.includes(EN);

/** Deep-clean every string in a JSON-LD value. */
export function cleanJson<T>(value: T): T {
  if (typeof value === "string") return noDashes(value) as unknown as T;
  if (Array.isArray(value)) return value.map(cleanJson) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, cleanJson(v)])) as T;
  }
  return value;
}

export const TITLE_MAX = 59; // "under 60 characters"
export const DESC_MIN = 140;
export const DESC_MAX = 160;

/** Cut at a word boundary so the result (plus an optional ellipsis) fits `max`. */
function cutWords(s: string, max: number, ellipsis = "...") {
  if (s.length <= max) return s;
  const room = max - ellipsis.length;
  const cut = s.slice(0, room + 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > room * 0.5 ? cut.slice(0, at) : cut.slice(0, room)).replace(/[\s,;:.]+$/, "")}${ellipsis}`;
}

/**
 * "Main | Suffix" under 60 characters. If it doesn't fit, try the main part up to its
 * first natural break (":" or "?"), then drop the suffix, then shorten the words.
 */
export function fitTitle(main: string, suffix: string | string[] = "Mr. CAP"): string {
  // several suffixes: use the first one that lets the whole title fit
  if (Array.isArray(suffix)) {
    for (const s of suffix) {
      const t = `${noDashes(main).trim()} | ${s}`;
      if (t.length <= TITLE_MAX) return t;
    }
    return fitTitle(main, suffix[0]);
  }
  const m = noDashes(main).trim();
  const join = (a: string) => (suffix ? `${a} | ${suffix}` : a);
  if (join(m).length <= TITLE_MAX) return join(m);
  const head = m.match(/^(.{12,}?[:?])\s/)?.[1];
  if (head && join(head.replace(/:$/, "")).length <= TITLE_MAX) return join(head.replace(/:$/, ""));
  if (m.length <= TITLE_MAX) return m;
  return suffix ? join(cutWords(m, TITLE_MAX - suffix.length - 3)) : cutWords(m, TITLE_MAX);
}

/** A sentence, or a list of interchangeable wordings of it (longest first). */
export type DescPart = string | string[];

/**
 * Build a 140 to 160 character description. `parts` are in priority order: the first is
 * always used, each later one is optional, and a list means "at most one of these
 * wordings". `fillers` are short closing lines used only to reach the minimum. Of every
 * combination that fits, the one that keeps the most important parts wins; ties go to
 * the longer text. A first sentence that is too long on its own is cut at a word.
 */
export function fitDescription(parts: DescPart[], fillers: string[] = []): string {
  const clean = (s: string) => noDashes(s).trim();
  const options = parts.map((p) => (Array.isArray(p) ? p : [p]).map(clean).filter(Boolean)).filter((o) => o.length);
  const extra = fillers.map(clean).filter(Boolean);
  if (!options.length) return "";
  const first = options[0][0];
  if (first.length > DESC_MAX) return cutWords(first, DESC_MAX);

  let best = { text: first, rank: -1, len: first.length };
  const consider = (text: string, weight: number) => {
    if (text.length > DESC_MAX) return;
    const inRange = text.length >= DESC_MIN ? 1 : 0;
    const rank = inRange * 1e6 + weight;
    if (rank > best.rank || (rank === best.rank && text.length > best.len)) best = { text, rank, len: text.length };
  };
  const withFillers = (text: string, weight: number, i = 0) => {
    consider(text, weight);
    for (let k = i; k < extra.length; k++) withFillers(`${text} ${extra[k]}`, weight, k + 1);
  };
  const walk = (i: number, text: string, weight: number) => {
    if (text.length > DESC_MAX) return;
    if (i === options.length) return withFillers(text, weight);
    walk(i + 1, text, weight); // leave this part out
    for (const o of options[i]) walk(i + 1, `${text} ${o}`, weight + 2 ** (options.length - i));
  };
  walk(1, first, 0);
  return best.text;
}

/** Plain text for HTML output: strips markdown emphasis, links and headings. */
export function plainText(md: string): string {
  return noDashes(
    md
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/[*_`>]+/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

/** First n paragraphs of a markdown body, as plain text, each capped at ~420 characters. */
export function paragraphs(md: string, n = 3): string[] {
  return md
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^#{1,6}\s/.test(p) && !/^[-*]\s/.test(p) && !/^\|/.test(p))
    .map(plainText)
    .filter((p) => p.length > 40)
    .slice(0, n)
    .map((p) => (p.length > 420 ? cutWords(p, 420) : p));
}
