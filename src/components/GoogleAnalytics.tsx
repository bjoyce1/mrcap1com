import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // Initialize gtag
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  return null;
};

// Analytics event tracking helper
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// ================================
// CONVERSION TRACKING EVENTS
// These are the key events to track in GA4
// ================================

// Booking form submission - tracks when someone submits a booking request
export const trackBookingSubmit = () => {
  trackEvent("booking_submit", {
    event_category: "conversion",
    event_label: "booking_form_submit",
  });
};

// Legacy alias for backward compatibility
export const trackBookingFormSubmit = trackBookingSubmit;

// EPK download - tracks when someone downloads the press kit
export const trackEPKDownload = () => {
  trackEvent("epk_download", {
    event_category: "conversion",
    event_label: "epk_download",
  });
};

// Music click - tracks when someone clicks to stream music
export const trackMusicClick = (platform: string, trackName?: string) => {
  trackEvent("music_click", {
    event_category: "conversion",
    event_label: platform,
    track_name: trackName || "unknown",
  });
};

// Email signup - tracks newsletter signups
export const trackEmailSignup = (source?: string) => {
  trackEvent("email_signup", {
    event_category: "conversion",
    event_label: source || "website",
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
