/**
 * Mr. CAP unified API client.
 * Drop this into any of your other Lovable sites and call with your API key.
 *
 *   import { createMrCapClient } from "@/lib/mrcapApi";
 *   const api = createMrCapClient({ key: import.meta.env.VITE_MRCAP_API_KEY });
 *   const { data: albums } = await api.music.albums();
 */

const DEFAULT_BASE = "https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/api-v1";

export interface MrCapClientOptions {
  key: string;
  baseUrl?: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
  error?: string;
}

export function createMrCapClient({ key, baseUrl = DEFAULT_BASE }: MrCapClientOptions) {
  const request = async <T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> => {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        ...(init?.headers || {}),
      },
    });
    const body = await res.json().catch(() => ({ error: "Invalid JSON" }));
    if (!res.ok) throw new Error(body.error || `API error ${res.status}`);
    return body as ApiEnvelope<T>;
  };

  return {
    music: {
      albums: (params?: { limit?: number }) => {
        const qs = params?.limit ? `?limit=${params.limit}` : "";
        return request<unknown[]>(`/music/albums${qs}`);
      },
      album: (slug: string) => request<unknown>(`/music/albums/${slug}`),
      tracks: (params?: { year?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.year) q.set("year", String(params.year));
        if (params?.limit) q.set("limit", String(params.limit));
        const qs = q.toString() ? `?${q.toString()}` : "";
        return request<unknown[]>(`/music/tracks${qs}`);
      },
      track: (slug: string) => request<unknown>(`/music/tracks/${slug}`),
    },
    events: () => request<unknown[]>(`/events`),
    fans: {
      signup: (body: { email: string; name?: string; source_page?: string; favorite_song?: string }) =>
        request<{ ok: boolean }>(`/fans`, { method: "POST", body: JSON.stringify(body) }),
    },
    analytics: {
      event: (body: { event_type: string; path?: string; referrer?: string; properties?: Record<string, unknown> }) =>
        request<{ ok: boolean }>(`/analytics/event`, { method: "POST", body: JSON.stringify(body) }),
    },
    raw: request,
  };
}

export type MrCapClient = ReturnType<typeof createMrCapClient>;
