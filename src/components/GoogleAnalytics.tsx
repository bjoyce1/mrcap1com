import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { isAutomated, isLiveHost, isPrivatePath } from "@/lib/automation";

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

/** Streaming services, matched on the link's host. */
const DSP_HOSTS: [RegExp, string][] = [
  [/(^|\.)spotify\.com$/, "spotify"],
  [/^(music|itunes)\.apple\.com$/, "apple_music"],
  [/^music\.youtube\.com$/, "youtube_music"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)tidal\.com$/, "tidal"],
  [/^music\.amazon\./, "amazon_music"],
  [/(^|\.)audiomack\.com$/, "audiomack"],
  [/(^|\.)soundcloud\.com$/, "soundcloud"],
  [/(^|\.)deezer\.com$/, "deezer"],
  [/(^|\.)pandora\.com$/, "pandora"],
  [/(^|\.)bandcamp\.com$/, "bandcamp"],
];

const SOCIAL_HOSTS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(x\.com|twitter\.com)$/, "x"],
  [/(^|\.)facebook\.com$/, "facebook"],
  [/(^|\.)threads\.net$/, "threads"],
  [/(^|\.)linkedin\.com$/, "linkedin"],
];

/** What a clicked link means for the reports, or null when it's an ordinary page link. */
function classifyLink(href: string): { name: string; params: Record<string, string> } | null {
  if (href.startsWith("mailto:")) return { name: "email_click", params: {} };
  if (href.startsWith("tel:")) return { name: "call_click", params: {} };
  if (href.startsWith("sms:")) return { name: "text_click", params: {} };
  let host = "";
  try {
    const url = new URL(href, window.location.href);
    if (url.host === window.location.host) return null;
    host = url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  const dsp = DSP_HOSTS.find(([re]) => re.test(host));
  if (dsp) return { name: "dsp_click", params: { platform: dsp[1] } };
  const social = SOCIAL_HOSTS.find(([re]) => re.test(host));
  if (social) return { name: "social_click", params: { platform: social[1] } };
  return null;
}

/**
 * GA4 for real listeners only: scripted browsers never load the tag, staff
 * pages send nothing, and each route sends one page view after its own title
 * is in place. Off the live domain, events still reach window.dataLayer (handy
 * for checking them) but the tag itself never loads, so nothing is sent.
 */
const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();
  const enabled = useMemo(() => !isAutomated(), []);

  useEffect(() => {
    if (!enabled || /^\/(greatday-preview|admin\/greatday)(\/|$)/.test(location.pathname)) return;
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    if (isLiveHost()) document.head.appendChild(script1);

    // page views are sent by hand below, so the config sends none
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', { send_page_view: false });
    `;
    document.head.appendChild(script2);

    // streaming, social, email and phone links, wherever they sit on the page
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const hit = classifyLink(link.getAttribute("href") || "");
      if (hit) trackEvent(hit.name, { ...hit.params, link_url: link.href, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      script1.remove();
      document.head.removeChild(script2);
    };
  }, [measurementId, enabled, /^\/(greatday-preview|admin\/greatday)(\/|$)/.test(location.pathname)]);

  useEffect(() => {
    if (!enabled || isPrivatePath(location.pathname)) return;
    // the page's <SEO> sets the title right after it renders; report the view once it has
    const timer = window.setTimeout(() => {
      trackEvent("page_view", {
        page_location: window.location.href,
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, enabled]);

  return null;
};

// Analytics event tracking helper
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (/^\/(greatday-preview|admin\/greatday)(\/|$)/.test(window.location.pathname)) return;
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// ================================
// CONVERSION TRACKING EVENTS
// These are the key events to track in GA4
// ================================

// Booking form submission. GA4's recommended lead event, so it can be a key event.
export const trackBookingSubmit = (bookingType?: string) => {
  trackEvent("generate_lead", {
    lead_type: "booking",
    booking_type: bookingType || "unknown",
  });
};

// Legacy alias for backward compatibility
export const trackBookingFormSubmit = trackBookingSubmit;

// OPK download - tracks when someone downloads the press kit
export const trackOPKDownload = () => {
  trackEvent("opk_download", {
    event_category: "conversion",
    event_label: "opk_download",
  });
};

// Legacy alias for backward compatibility
export const trackEPKDownload = trackOPKDownload;

// Music click - tracks when someone clicks to stream music
export const trackMusicClick = (platform: string, trackName?: string) => {
  trackEvent("music_click", {
    event_category: "conversion",
    event_label: platform,
    track_name: trackName || "unknown",
  });
};

// Email list signup. GA4's recommended sign_up event; method says which form.
export const trackEmailSignup = (source?: string) => {
  trackEvent("sign_up", {
    method: source || "website",
  });
};

// Legacy alias for backward compatibility
export const trackNewsletterSignup = () => trackEmailSignup("newsletter");

// ================================
// ENGAGEMENT TRACKING EVENTS
// ================================

// Track music play in on-site player
export const trackMusicPlay = (trackName: string) => {
  trackEvent("select_content", {
    event_category: "music",
    event_label: trackName,
    content_type: "audio",
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkType: string) => {
  trackEvent("click", {
    event_category: "external_link",
    event_label: linkType,
    link_url: url,
  });
};

// Track NFT views
export const trackNFTView = (nftName: string) => {
  trackEvent("view_item", {
    event_category: "nft",
    event_label: nftName,
    content_type: "nft",
  });
};

// Track blog post reads
export const trackBlogRead = (postSlug: string, postTitle: string) => {
  trackEvent("view_item", {
    event_category: "blog",
    event_label: postSlug,
    post_title: postTitle,
  });
};

// Track video plays
export const trackVideoPlay = (videoName: string) => {
  trackEvent("video_start", {
    event_category: "video",
    event_label: videoName,
  });
};

// Track social share clicks
export const trackSocialShare = (platform: string, contentType: string) => {
  trackEvent("share", {
    event_category: "social",
    event_label: platform,
    content_type: contentType,
  });
};

export default GoogleAnalytics;
