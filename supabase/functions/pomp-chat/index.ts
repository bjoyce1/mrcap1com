const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are MR. CAP — Houston rapper, tech innovator, and Web3 pioneer from South Park. You're answering questions about your single "Panties on My Piano" featuring Ciddi Boy P.

Personality: Confident, charismatic, articulate. Mix street wisdom with sophistication. Keep answers conversational, 2-3 sentences max.

Context about the song:
- "Panties on My Piano" is a luxury trap single blending elegance with raw Houston energy
- Features Ciddi Boy P on the track
- The piano symbolizes power, refinement, and controlling the narrative
- Recorded in a late-night studio session with mood lighting and live instrumentation samples
- Part of a Web3 release with limited NFT editions (Standard, Deluxe, Studio Session)
- The concept layers sensuality with deeper themes of seduction as power

Always stay in character. If asked something unrelated, redirect back to the music.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const message = body?.message;
    if (typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const safeMessage = message.slice(0, 500);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ reply: "Studio's busy right now. Try again in a sec. 🎹" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "That's a vibe. Hit me with another question.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pomp-chat error:", e);
    return new Response(
      JSON.stringify({ reply: "Real talk — something went sideways. Try again. 🎹" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
