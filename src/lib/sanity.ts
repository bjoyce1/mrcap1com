import { supabase } from "@/integrations/supabase/client";

/**
 * Execute a pre-defined GROQ query template against Sanity via our edge
 * function proxy. The edge function only accepts a fixed set of template
 * names and declared parameters — arbitrary GROQ is not allowed.
 */
export async function sanityQuery<T = unknown>(
  template: string,
  params?: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("sanity-query", {
    body: { template, params },
  });

  if (error) throw new Error(`Sanity fetch failed: ${error.message}`);
  if (data?.error) throw new Error(`Sanity API: ${data.error}`);
  return data.result as T;
}

/**
 * Build a Sanity CDN image URL from a Sanity image reference.
 * Example ref: "image-abc123-1200x800-jpg"
 */
export function sanityImageUrl(
  ref: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "";
  const dataset = "production";

  // Parse Sanity asset ref: image-{id}-{dimensions}-{format}
  const parts = ref.replace("image-", "").split("-");
  const format = parts.pop();
  const dimensions = parts.pop(); // e.g. "1200x800" (unused for URL)
  const id = parts.join("-");

  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

  const qs: string[] = [];
  if (options?.width) qs.push(`w=${options.width}`);
  if (options?.height) qs.push(`h=${options.height}`);
  if (options?.quality) qs.push(`q=${options.quality}`);
  if (qs.length) url += `?${qs.join("&")}`;

  return url;
}
