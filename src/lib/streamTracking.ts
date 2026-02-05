import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/components/GoogleAnalytics";

export function getSessionId(): string {
  const key = "mrcap_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function reportQualifiedStream(params: {
  trackId: string;
  secondsListened: number;
  pagePath: string;
}) {
  const sessionId = getSessionId();

  try {
    const { data, error } = await supabase.functions.invoke("stream-track", {
      body: {
        trackId: params.trackId,
        sessionId,
        secondsListened: params.secondsListened,
        pagePath: params.pagePath,
      },
    });

    // Fire GA4 event
    trackEvent("stream_qualified", {
      track_id: params.trackId,
      seconds_listened: params.secondsListened,
      page_path: params.pagePath,
    });

    if (error) console.warn("Stream report error:", error);
    return data;
  } catch (err) {
    console.warn("Stream report failed:", err);
  }
}
