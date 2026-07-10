// Token-protected analytics summary. Mirrors the original Node aggregate() output
// shape so the bundled dashboard at /analytics works without changes.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type, x-dashboard-token, x-client-info, apikey, authorization",
  "access-control-max-age": "86400",
};

type Event = {
  event_id: string;
  event_type: string;
  site_id: string;
  ts: string;
  received_at: string;
  visitor_id: string;
  session_id: string;
  url: string;
  path: string;
  title: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  device: Record<string, unknown>;
  geo: { country?: string; timezone?: string; language?: string };
  metrics: Record<string, number>;
  props: Record<string, unknown>;
};

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}
function pctChange(curr: number, prev: number) {
  if (!prev && !curr) return 0;
  if (!prev) return 100;
  return ((curr - prev) / prev) * 100;
}
function percentile(values: number[], p: number) {
  const nums = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!nums.length) return null;
  const idx = Math.min(nums.length - 1, Math.max(0, Math.floor((p / 100) * nums.length)));
  return nums[idx];
}
function isSearchReferrer(ref: string) {
  return /google\.|bing\.|yahoo\.|duckduckgo\.|ecosia\.|baidu\.|yandex\./i.test(ref || "");
}
function isSocialReferrer(s: string) {
  return /(facebook|instagram|threads|twitter|x\.com|tiktok|youtube|linkedin|reddit|pinterest|snapchat)/i.test(s || "");
}
function classifyChannel(e: Event) {
  const medium = String(e.medium || "").toLowerCase();
  const source = String(e.source || "").toLowerCase();
  const ref = String(e.referrer || "").toLowerCase();
  if (/^(cpc|ppc|paid|paidsearch|sem|display|retargeting)$/.test(medium)) return "Paid Search";
  if (/email|newsletter/.test(medium) || /email|newsletter|mailchimp|klaviyo|constantcontact/.test(source)) return "Email";
  if (isSocialReferrer(source) || isSocialReferrer(ref) || /social/.test(medium)) return "Social";
  if (isSearchReferrer(ref) || /organic/.test(medium)) return "Organic Search";
  if (ref) return "Referral";
  return "Direct";
}
function sourceMedium(e: Event) {
  const src = e.source || (() => {
    try { return e.referrer ? new URL(e.referrer).hostname.replace(/^www\./, "") : "direct"; }
    catch { return "direct"; }
  })();
  const med = e.medium || (e.referrer ? (isSearchReferrer(e.referrer) ? "organic" : "referral") : "none");
  return `${src} / ${med}`;
}
function formatDeviceType(e: Event) {
  const type = String((e.device as any)?.type || "").toLowerCase();
  if (type) return type[0].toUpperCase() + type.slice(1);
  const width = Number((e.device as any)?.screen_width || 0);
  if (width && width < 768) return "Mobile";
  if (width && width < 1100) return "Tablet";
  return "Desktop";
}
function normalizePath(p: string) {
  if (!p || typeof p !== "string") return "/";
  try { return new URL(p, "https://x.test").pathname || "/"; }
  catch { return p.startsWith("/") ? p.slice(0, 200) : `/${p.slice(0, 199)}`; }
}
function createEmptyTrend(days: number) {
  const today = startOfDay(new Date());
  const items: any[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    items.push({ date: isoDay(d), users: 0, sessions: 0, pageviews: 0, conversions: 0, revenue: 0 });
  }
  return items;
}

function buildFunnel(events: any[]) {
  const stageDefs = [
    { key: "landing", label: "Landing Page Visit", test: (e: any) => e.event_type === "pageview" },
    { key: "product_service", label: "Product/Service Page", test: (e: any) => e.event_type === "pageview" && /(music|new-releases|booking|about|videos|press|blog|nft|spc|services|product|pricing)/i.test(e.path || "") },
    { key: "form_start", label: "Form Start", test: (e: any) => e.event_type === "form_start" },
    { key: "submit", label: "Booking/Form Submit", test: (e: any) => /^(form_submit|booking_submit|lead)$/.test(e.event_type) },
    { key: "conversion", label: "Conversion", test: (e: any) => /^(conversion|purchase|lead|booking_submit)$/.test(e.event_type) },
  ];
  const sessionsByStage = new Map<string, Set<string>>();
  for (const def of stageDefs) sessionsByStage.set(def.key, new Set());
  for (const e of events) {
    for (const def of stageDefs) {
      if (def.test(e) && e.session_id) sessionsByStage.get(def.key)!.add(e.session_id);
    }
  }
  const firstCount = Math.max(1, sessionsByStage.get(stageDefs[0].key)!.size);
  return stageDefs.map((def, idx) => {
    const count = sessionsByStage.get(def.key)!.size;
    const prevCount = idx === 0 ? count : sessionsByStage.get(stageDefs[idx - 1].key)!.size;
    return {
      key: def.key,
      label: def.label,
      sessions: count,
      rate_from_start: count / firstCount,
      rate_from_previous: prevCount ? count / prevCount : 0,
    };
  });
}

function aggregate(events: Event[], days = 30) {
  const rangeDays = Math.max(1, Math.min(365, Number(days) || 30));
  const now = new Date();
  const start = new Date(startOfDay(now));
  start.setDate(start.getDate() - (rangeDays - 1));
  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - rangeDays);

  const eventsWithTime = events
    .map((e: any) => ({ ...e, _time: new Date(e.ts || e.received_at || 0) }))
    .filter((e: any) => Number.isFinite(e._time.getTime()));

  const current = eventsWithTime.filter((e: any) => e._time >= start && e._time <= now);
  const previous = eventsWithTime.filter((e: any) => e._time >= previousStart && e._time < start);

  const summarizeCore = (bucket: any[]) => {
    const pageviews = bucket.filter((e: any) => e.event_type === "pageview").length;
    const users = new Set(bucket.map((e: any) => e.visitor_id).filter(Boolean)).size;
    const sessions = new Set(bucket.map((e: any) => e.session_id).filter(Boolean)).size;
    const conversions = bucket.filter((e: any) => /^(conversion|form_submit|booking_submit|purchase|lead)$/.test(e.event_type)).length;
    const revenue = bucket.reduce((s: number, e: any) => s + (Number(e.metrics?.revenue || e.metrics?.value || 0) || 0), 0);
    return { users, sessions, pageviews, conversions, revenue };
  };

  const core = summarizeCore(current);
  const previousCore = summarizeCore(previous);

  const sessionsMap = new Map<string, any>();
  for (const e of current) {
    const sid = e.session_id || `event:${e.event_id}`;
    if (!sessionsMap.has(sid)) {
      sessionsMap.set(sid, {
        session_id: sid, visitor_id: e.visitor_id, first_ts: e._time, last_ts: e._time,
        pageviews: 0, conversions: 0, clicks: 0, events: 0, engagement_ms: 0,
        first_pageview: null, source_event: null, revenue: 0,
      });
    }
    const s = sessionsMap.get(sid)!;
    s.first_ts = e._time < s.first_ts ? e._time : s.first_ts;
    s.last_ts = e._time > s.last_ts ? e._time : s.last_ts;
    s.events += 1;
    if (e.event_type === "pageview") {
      s.pageviews += 1;
      if (!s.first_pageview || e._time < s.first_pageview._time) s.first_pageview = e;
    }
    if (/^(conversion|form_submit|booking_submit|purchase|lead)$/.test(e.event_type)) s.conversions += 1;
    if (/^(click|outbound_click|cta_click)$/.test(e.event_type)) s.clicks += 1;
    s.engagement_ms += Number(e.metrics?.engagement_time_ms || e.metrics?.time_on_page_ms || 0) || 0;
    s.revenue += Number(e.metrics?.revenue || e.metrics?.value || 0) || 0;
    if (!s.source_event && (e.event_type === "pageview" || e.source || e.medium || e.referrer)) s.source_event = e;
  }

  const sessions = Array.from(sessionsMap.values());
  const bounces = sessions.filter((s: any) => s.pageviews <= 1 && s.conversions === 0 && s.clicks === 0 && s.engagement_ms < 10000).length;
  const engaged = sessions.filter((s: any) => s.pageviews >= 2 || s.conversions > 0 || s.clicks > 0 || s.engagement_ms >= 10000).length;
  const sessionDurations = sessions.map((s: any) => Math.max(s.engagement_ms, s.last_ts - s.first_ts)).filter((x: number) => x >= 0);
  const avgSessionMs = sessionDurations.length ? Math.round(sessionDurations.reduce((a: number, b: number) => a + b, 0) / sessionDurations.length) : 0;

  const trend = createEmptyTrend(rangeDays);
  const trendMap = new Map(trend.map((x: any) => [x.date, { ...x, _users: new Set<string>(), _sessions: new Set<string>() }]));
  for (const e of current) {
    const day = isoDay(e._time);
    const row = trendMap.get(day);
    if (!row) continue;
    if (e.visitor_id) row._users.add(e.visitor_id);
    if (e.session_id) row._sessions.add(e.session_id);
    if (e.event_type === "pageview") row.pageviews += 1;
    if (/^(conversion|form_submit|booking_submit|purchase|lead)$/.test(e.event_type)) row.conversions += 1;
    row.revenue += Number(e.metrics?.revenue || e.metrics?.value || 0) || 0;
  }
  const trendRows = Array.from(trendMap.values()).map((row: any) => ({
    date: row.date, users: row._users.size, sessions: row._sessions.size,
    pageviews: row.pageviews, conversions: row.conversions,
    revenue: Math.round(row.revenue * 100) / 100,
  }));

  const byChannel = new Map<string, any>();
  const bySourceMedium = new Map<string, any>();
  const byLandingPage = new Map<string, any>();
  const byDevice = new Map<string, any>();
  const byGeo = new Map<string, any>();
  const byCampaign = new Map<string, any>();

  for (const s of sessions) {
    const event = s.source_event || s.first_pageview || {};
    const channel = classifyChannel(event);
    const sm = sourceMedium(event);
    const landing = normalizePath(s.first_pageview?.path || event.path || "/");
    const device = formatDeviceType(event);
    const country = event.geo?.country || "Unknown";
    const campaign = event.campaign || "Unassigned";

    const add = (map: Map<string, any>, key: string) => {
      if (!map.has(key)) {
        map.set(key, {
          name: key, sessions: 0, users: new Set<string>(),
          pageviews: 0, conversions: 0, revenue: 0, bounces: 0, engaged: 0,
        });
      }
      const row = map.get(key)!;
      row.sessions += 1;
      if (s.visitor_id) row.users.add(s.visitor_id);
      row.pageviews += s.pageviews;
      row.conversions += s.conversions;
      row.revenue += s.revenue;
      row.bounces += s.pageviews <= 1 && s.conversions === 0 && s.clicks === 0 && s.engagement_ms < 10000 ? 1 : 0;
      row.engaged += s.pageviews >= 2 || s.conversions > 0 || s.clicks > 0 || s.engagement_ms >= 10000 ? 1 : 0;
      return row;
    };

    add(byChannel, channel);
    add(bySourceMedium, sm);
    add(byLandingPage, landing);
    add(byDevice, device);
    add(byGeo, country);
    if (campaign !== "Unassigned") add(byCampaign, campaign);
  }

  const finalizeRows = (map: Map<string, any>, limit = 10) =>
    Array.from(map.values()).map((row: any) => ({
      name: row.name,
      users: row.users.size,
      sessions: row.sessions,
      pageviews: row.pageviews,
      conversions: row.conversions,
      revenue: Math.round(row.revenue * 100) / 100,
      bounce_rate: row.sessions ? row.bounces / row.sessions : 0,
      engagement_rate: row.sessions ? row.engaged / row.sessions : 0,
      conversion_rate: row.sessions ? row.conversions / row.sessions : 0,
    })).sort((a, b) => b.sessions - a.sessions).slice(0, limit);

  const pageMap = new Map<string, any>();
  for (const e of current.filter((x: any) => x.event_type === "pageview")) {
    const key = normalizePath(e.path || "/");
    if (!pageMap.has(key)) pageMap.set(key, { path: key, pageviews: 0, users: new Set<string>(), title: e.title || "" });
    const row = pageMap.get(key)!;
    row.pageviews += 1;
    if (e.visitor_id) row.users.add(e.visitor_id);
  }
  const pages = Array.from(pageMap.values()).map((row: any) => ({
    path: row.path, title: row.title, pageviews: row.pageviews, users: row.users.size,
  })).sort((a, b) => b.pageviews - a.pageviews).slice(0, 12);

  const allVisitors = new Map<string, Date>();
  for (const e of eventsWithTime) {
    if (!e.visitor_id) continue;
    const existing = allVisitors.get(e.visitor_id);
    if (!existing || e._time < existing) allVisitors.set(e.visitor_id, e._time);
  }
  let newUsers = 0;
  let returningUsers = 0;
  for (const v of new Set(current.map((e: any) => e.visitor_id).filter(Boolean))) {
    const first = allVisitors.get(v as string);
    if (first && first >= start) newUsers += 1;
    else returningUsers += 1;
  }

  const perfEvents = current.filter((e: any) => e.event_type === "performance");
  const loadTimes = perfEvents.map((e: any) => Number(e.metrics?.load_time_ms || 0)).filter((x: number) => x > 0);
  const p75Load = percentile(loadTimes, 75);
  const error404 = current.filter((e: any) => e.event_type === "pageview" && (e.props?.page_status === "404" || /404|not found/i.test(e.title || ""))).length;
  const lastEventTs = eventsWithTime.length ? Math.max(...eventsWithTime.map((e: any) => e._time.getTime())) : null;
  const last24h = current.filter((e: any) => now.getTime() - e._time.getTime() <= 24 * 60 * 60 * 1000).length;
  const last7 = trendRows.slice(-7).reduce((s, x) => s + x.pageviews, 0);
  const prev7 = trendRows.slice(-14, -7).reduce((s, x) => s + x.pageviews, 0);
  const anomalyCount = prev7 && last7 < prev7 * 0.5 ? 1 : 0;

  // ---- Real-Time (last 30 minutes) ----
  const thirtyMinAgo = now.getTime() - 30 * 60 * 1000;
  const recent = eventsWithTime.filter((e: any) => e._time.getTime() >= thirtyMinAgo);
  const rtMinutes: any[] = [];
  for (let i = 29; i >= 0; i--) {
    const bucketEnd = now.getTime() - i * 60 * 1000;
    const bucketStart = bucketEnd - 60 * 1000;
    const slice = recent.filter((e: any) => e._time.getTime() >= bucketStart && e._time.getTime() < bucketEnd);
    rtMinutes.push({
      minute: new Date(bucketEnd).toISOString(),
      pageviews: slice.filter((e: any) => e.event_type === "pageview").length,
      events: slice.length,
    });
  }
  const activeVisitors = new Set(
    recent.filter((e: any) => now.getTime() - e._time.getTime() <= 5 * 60 * 1000)
      .map((e: any) => e.visitor_id).filter(Boolean)
  ).size;
  const livePagesMap = new Map<string, number>();
  for (const e of recent.filter((x: any) => x.event_type === "pageview")) {
    const p = normalizePath(e.path || "/");
    livePagesMap.set(p, (livePagesMap.get(p) || 0) + 1);
  }
  const livePages = Array.from(livePagesMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views).slice(0, 10);
  const liveFeed = recent.slice(-20).reverse().map((e: any) => ({
    ts: e._time.toISOString(), event_type: e.event_type, path: normalizePath(e.path || "/"),
    country: e.geo?.country || null, source: e.source || null,
  }));

  // ---- Events breakdown ----
  const eventsByTypeMap = new Map<string, number>();
  for (const e of current) eventsByTypeMap.set(e.event_type, (eventsByTypeMap.get(e.event_type) || 0) + 1);
  const eventsByType = Array.from(eventsByTypeMap.entries())
    .map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const recentEvents = current.slice(-50).reverse().map((e: any) => ({
    ts: e._time.toISOString(), event_type: e.event_type, path: normalizePath(e.path || "/"),
    visitor_id: e.visitor_id ? String(e.visitor_id).slice(0, 8) : null,
    country: e.geo?.country || null,
  }));

  // ---- Languages / Browsers / OS ----
  const langMap = new Map<string, number>();
  const browserMap = new Map<string, number>();
  const osMap = new Map<string, number>();
  for (const s of sessions) {
    const ev = s.source_event || s.first_pageview || {};
    langMap.set(ev.geo?.language || "Unknown", (langMap.get(ev.geo?.language || "Unknown") || 0) + 1);
    const browser = (ev.device as any)?.browser || "Unknown";
    browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
    const os = (ev.device as any)?.os || "Unknown";
    osMap.set(os, (osMap.get(os) || 0) + 1);
  }
  const finalizeSimple = (m: Map<string, number>, limit = 8) =>
    Array.from(m.entries()).map(([name, sessions]) => ({ name, sessions }))
      .sort((a, b) => b.sessions - a.sessions).slice(0, limit);

  return {
    generated_at: new Date().toISOString(),
    days: rangeDays,
    site_id: current[0]?.site_id || "mrcap1.com",
    date_range: { start: isoDay(start), end: isoDay(now) },
    comparison: { start: isoDay(previousStart), end: isoDay(new Date(start.getTime() - 1)) },
    totals: {
      users: core.users, sessions: core.sessions, pageviews: core.pageviews,
      engagement_rate: core.sessions ? engaged / core.sessions : 0,
      bounce_rate: core.sessions ? bounces / core.sessions : 0,
      avg_session_duration_ms: avgSessionMs,
      conversions: core.conversions,
      conversion_rate: core.sessions ? core.conversions / core.sessions : 0,
      revenue: Math.round(core.revenue * 100) / 100,
      pages_per_session: core.sessions ? core.pageviews / core.sessions : 0,
    },
    changes: {
      users: pctChange(core.users, previousCore.users),
      sessions: pctChange(core.sessions, previousCore.sessions),
      pageviews: pctChange(core.pageviews, previousCore.pageviews),
      conversions: pctChange(core.conversions, previousCore.conversions),
      revenue: pctChange(core.revenue, previousCore.revenue),
    },
    trend: trendRows,
    traffic_sources: finalizeRows(byChannel, 8),
    source_medium: finalizeRows(bySourceMedium, 12),
    landing_pages: finalizeRows(byLandingPage, 12).map((x: any) => ({ landing_page: x.name, ...x })),
    devices: finalizeRows(byDevice, 5),
    geo: finalizeRows(byGeo, 10).map((x: any) => ({ country: x.name, ...x })),
    campaigns: finalizeRows(byCampaign, 10).map((x: any) => ({
      campaign: x.name, cpa: null, roas: x.revenue ? x.revenue / Math.max(1, x.conversions || 1) : null, ...x,
    })),
    pages,
    audience: {
      new_users: newUsers, returning_users: returningUsers, total_users: core.users,
      languages: finalizeSimple(langMap, 8),
      browsers: finalizeSimple(browserMap, 8),
      operating_systems: finalizeSimple(osMap, 8),
    },
    funnel: buildFunnel(current),
    realtime: {
      active_visitors: activeVisitors,
      pageviews_30m: recent.filter((e: any) => e.event_type === "pageview").length,
      events_30m: recent.length,
      by_minute: rtMinutes,
      top_pages: livePages,
      feed: liveFeed,
    },
    events_data: {
      total: current.length,
      by_type: eventsByType,
      recent: recentEvents,
    },
    technical: {
      tag_status: last24h > 0 ? "Healthy" : "No events in last 24h",
      conversion_tracking: core.conversions > 0 ? "Healthy" : "No conversion events yet",
      errors_404: error404,
      site_speed_p75_ms: p75Load,
      site_speed_status: p75Load == null ? "No performance data yet" : (p75Load < 2500 ? "Good" : (p75Load < 4000 ? "Needs review" : "Slow")),
      traffic_anomalies: anomalyCount,
      last_event_at: lastEventTs ? new Date(lastEventTs).toISOString() : null,
      events_24h: last24h,
      total_events_period: current.length,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const supplied = req.headers.get("x-dashboard-token") || url.searchParams.get("token") || "";
  const expected = Deno.env.get("DASHBOARD_TOKEN") || "";
  if (!supplied || !expected || !timingSafeEqual(supplied, expected)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized. Provide x-dashboard-token or ?token=..." }),
      { status: 401, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

  try {
    const days = Math.max(1, Math.min(365, Number(url.searchParams.get("days") || 30)));
    // Pull just enough range (current + previous period for change %).
    const sinceMs = Date.now() - days * 2 * 24 * 60 * 60 * 1000;
    const since = new Date(sinceMs).toISOString();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const sinceDay = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const [eventsRes, streamsRes, tracksRes] = await Promise.all([
      supabase.from("analytics_events").select("*").gte("ts", since).order("ts", { ascending: true }).limit(50000),
      supabase.from("stream_logs").select("track_id,session_id,seconds_listened,streamed_date,created_at").gte("streamed_date", sinceDay).limit(50000),
      supabase.from("tracks").select("id,title,slug,artist,play_count,cover_art_url").limit(500),
    ]);
    if (eventsRes.error) throw eventsRes.error;

    const summary: any = aggregate((eventsRes.data as Event[]) || [], days);

    // ---- Music aggregation ----
    const streams = (streamsRes.data as any[]) || [];
    const tracksById = new Map<string, any>();
    for (const t of (tracksRes.data as any[]) || []) tracksById.set(t.id, t);
    const byTrack = new Map<string, any>();
    for (const s of streams) {
      const tr = tracksById.get(s.track_id);
      if (!byTrack.has(s.track_id)) {
        byTrack.set(s.track_id, {
          track_id: s.track_id,
          title: tr?.title || "Unknown track",
          slug: tr?.slug || null,
          artist: tr?.artist || "Mr. CAP",
          cover_art_url: tr?.cover_art_url || null,
          streams: 0, listeners: new Set<string>(), seconds: 0,
        });
      }
      const row = byTrack.get(s.track_id)!;
      row.streams += 1;
      if (s.session_id) row.listeners.add(s.session_id);
      row.seconds += Number(s.seconds_listened || 0);
    }
    const topTracks = Array.from(byTrack.values()).map((r: any) => ({
      track_id: r.track_id, title: r.title, slug: r.slug, artist: r.artist,
      cover_art_url: r.cover_art_url, streams: r.streams, listeners: r.listeners.size,
      avg_seconds: r.streams ? Math.round(r.seconds / r.streams) : 0,
    })).sort((a, b) => b.streams - a.streams).slice(0, 20);

    const streamsByDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      streamsByDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const s of streams) {
      const k = String(s.streamed_date);
      if (streamsByDay.has(k)) streamsByDay.set(k, (streamsByDay.get(k) || 0) + 1);
    }
    summary.music = {
      total_streams: streams.length,
      unique_listeners: new Set(streams.map((s: any) => s.session_id).filter(Boolean)).size,
      total_seconds: streams.reduce((a: number, s: any) => a + Number(s.seconds_listened || 0), 0),
      top_tracks: topTracks,
      trend: Array.from(streamsByDay.entries()).map(([date, streams]) => ({ date, streams })),
      catalog_size: (tracksRes.data || []).length,
    };

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("analytics-summary error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
