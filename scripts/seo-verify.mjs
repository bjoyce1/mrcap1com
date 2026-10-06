// Check that a deployed (or locally served) build sends every route its own HTML.
//
//   node scripts/seo-verify.mjs                      check https://mrcap1.com (key routes)
//   node scripts/seo-verify.mjs https://mrcap1.com --all     every route the build wrote
//   node scripts/seo-verify.mjs http://127.0.0.1:4173        a local build (npm run seo:preview)
//   node scripts/seo-verify.mjs https://mrcap1.com --bots    also fetch as social and AI crawlers
//
// It reads <base>/seo-pages.json (written by the build) to know what each page should say,
// fetches each page without running JavaScript, and exits 1 if anything is off.
const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) || "https://mrcap1.com").replace(/\/$/, "");
const ALL = args.includes("--all");
const BOTS = args.includes("--bots");

const BOT_AGENTS = {
  facebook: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  twitter: "Twitterbot/1.0",
  slack: "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  claudebot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
};
const DASH = /[\u2013\u2014]/;
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const first = (html, re) => unescape((html.match(re)?.[1] ?? "").trim());
const count = (html, re) => (html.match(re) || []).length;

async function fetchText(url, ua) {
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": ua || "Mozilla/5.0 (compatible; mrcap-seo-verify)", "cache-control": "no-cache" } });
  return { status: res.status, html: await res.text() };
}

function check(page, { status, html }) {
  const head = html.slice(0, html.indexOf("</head>"));
  const body = html.match(/<!--seo:body-->([\s\S]*?)<!--\/seo:body-->/)?.[1] ?? "";
  const got = {
    title: first(head, /<title>([^<]*)<\/title>/),
    canonical: first(head, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/),
    h1: first(body, /<h1[^>]*>([^<]*)<\/h1>/),
    site: first(head, /property="og:site_name" content="([^"]*)"/),
    robots: first(head, /name="robots" content="([^"]*)"/),
  };
  const issues = [];
  if (status !== 200) issues.push(`status ${status}`);
  if (got.title !== page.title) issues.push(`title "${got.title}" (expected "${page.title}")`);
  for (const [name, re] of [["title", /<title>/g], ["description", /name="description"/g], ["og:title", /property="og:title"/g], ["og:site_name", /property="og:site_name"/g], ["robots", /name="robots"/g]])
    if (count(head, re) !== 1) issues.push(`${count(head, re)} ${name} tags`);
  if (page.canonical && got.canonical !== page.canonical) issues.push(`canonical "${got.canonical}"`);
  if (got.site !== "Mr. CAP") issues.push(`og:site_name "${got.site}"`);
  if (page.noIndex !== /noindex/.test(got.robots)) issues.push(`robots "${got.robots}"`);
  if (!got.h1) issues.push("no H1 in the content block");
  for (const m of head.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { issues.push("invalid JSON-LD"); }
  }
  if (DASH.test(head) || DASH.test(body)) issues.push("em or en dash in the head or content block");
  return { got, issues };
}

const manifest = await fetchText(`${base}/seo-pages.json`).catch(() => null);
if (!manifest || manifest.status !== 200 || !manifest.html.trim().startsWith("{")) {
  console.error(`No ${base}/seo-pages.json: the build with route pages isn't live there.`);
  process.exit(1);
}
const { builtAt, pages } = JSON.parse(manifest.html);
const isData = (p) => /^\/(music|track|album|albums|city|blog|press)\/./.test(p.path) || /^\/self-love\/\d{4}\/./.test(p.path);
const sample = ALL
  ? pages
  : [
      ...pages.filter((p) => !isData(p)),
      ...["/music/", "/track/", "/albums/", "/album/", "/city/", "/blog/", "/press/", "/self-love/2024/"].flatMap((prefix) => pages.filter((p) => p.path.startsWith(prefix) && isData(p)).slice(0, 2)),
    ];

console.log(`${base}: build from ${builtAt}, checking ${sample.length} of ${pages.length} pages\n`);
const failures = [];
const queue = [...sample];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const page = queue.shift();
      try {
        const { got, issues } = check(page, await fetchText(base + page.path));
        if (issues.length) failures.push(`${page.path}: ${issues.join("; ")}`);
        else if (!ALL) console.log(`ok  ${page.path.padEnd(34)} ${got.title}`);
      } catch (e) {
        failures.push(`${page.path}: ${e.message}`);
      }
    }
  }),
);

if (BOTS) {
  console.log("\nAs crawlers (no JavaScript):");
  for (const path of ["/music", "/south-park-coalition", "/who-is-mr-cap"]) {
    const page = pages.find((p) => p.path === path);
    for (const [bot, ua] of Object.entries(BOT_AGENTS)) {
      const { got, issues } = check(page, await fetchText(base + path, ua));
      if (issues.length) failures.push(`${path} as ${bot}: ${issues.join("; ")}`);
      else console.log(`ok  ${path.padEnd(24)} ${bot.padEnd(10)} ${got.title}`);
    }
  }
}

console.log(failures.length ? `\nFAILED (${failures.length}):\n${failures.join("\n")}` : `\nAll ${sample.length} pages pass.`);
process.exit(failures.length ? 1 : 0);
