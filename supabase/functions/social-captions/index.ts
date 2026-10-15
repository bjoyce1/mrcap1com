import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "openai/gpt-6-astra";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function tag(link: string, source: string, slug: string): string {
  try {
    const u = new URL(link);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", `release_${slug}`);
    u.searchParams.set("utm_content", "ai_caption");
    return u.toString();
  } catch {
    return link;
  }
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["instagram", "tiktok", "x"],
  properties: {
    instagram: { type: "string" },
    tiktok: { type: "string" },
    x: { type: "string" },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await sb.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!userData?.user) return json({ error: "Sign in required" }, 401);
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admins only" }, 403);

    const body = await req.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 200) : "";
    const details = typeof body?.details === "string" ? body.details.trim().slice(0, 2000) : "";
    const link = typeof body?.link === "string" ? body.link.trim().slice(0, 500) : "";
    if (!title || !link || !/^https?:\/\//i.test(link)) return json({ error: "Title and a valid music link are required" }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured" }, 500);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40) || "release";
    const links = { instagram: tag(link, "instagram", slug), tiktok: tag(link, "tiktok", slug), x: tag(link, "x", slug) };

    const system = `You write social posts for Mr. CAP, a Houston rapper from South Park (South Park Coalition). Voice: confident, charismatic, street smart, polished. Write three DISTINCT posts, each native to its platform:
- instagram: 2 to 4 short lines, storytelling hook, a call to action to tap the link in bio or the link below, then 5 to 8 hashtags on their own line.
- tiktok: a punchy first line hook under 80 characters, one or two short lines, a call to action, then 3 to 5 hashtags including #fyp.
- x: under 220 characters before the link, sharp and conversational, at most 2 hashtags.
Include the exact platform link given for each post, unchanged. Never use em dashes or en dashes. Do not invent facts beyond the details given.`;
    const user = `Release title: ${title}\nSong details: ${details || "none given"}\nInstagram link: ${links.instagram}\nTikTok link: ${links.tiktok}\nX link: ${links.x}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      signal: req.signal,
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: MODEL,
        input: [{ role: "system", content: system }, { role: "user", content: user }],
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        text: { format: { type: "json_schema", name: "captions", strict: true, schema: SCHEMA } },
      }),
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => "");
      let message = "The caption writer is unavailable right now.";
      try { message = JSON.parse(errText)?.error?.message ?? JSON.parse(errText)?.message ?? message; } catch { /* keep default */ }
      if (res.status === 402) message = "AI credits are used up. Add credits in Settings, Plans and credits.";
      if (res.status === 429) message = "Too many requests. Wait a moment and try again.";
      return json({ error: message }, res.status);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let streamError = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const ev = JSON.parse(data);
          if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
          if (ev.type === "error" || ev.type === "response.failed") streamError = ev.error?.message ?? ev.response?.error?.message ?? "Generation failed";
        } catch { /* partial line */ }
      }
    }
    if (streamError) return json({ error: streamError }, 502);
    if (!text) return json({ error: "The model returned no captions. Try again." }, 502);
    const captions = JSON.parse(text);
    return json({ captions, links });
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error("social-captions error:", e);
    return json({ error: "Something went wrong generating captions." }, 500);
  }
});
