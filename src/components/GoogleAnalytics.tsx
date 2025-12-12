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

// Pre-defined event trackers for common actions
export const trackBookingFormSubmit = () => {
  trackEvent("generate_lead", {
    event_category: "booking",
    event_label: "booking_form_submit",
  });
};

export const trackNewsletterSignup = () => {
  trackEvent("sign_up", {
    event_category: "newsletter",
    event_label: "newsletter_signup",
  });
};

export const trackMusicPlay = (trackName: string) => {
  trackEvent("select_content", {
    event_category: "music",
    event_label: trackName,
    content_type: "audio",
  });
};

export const trackEPKDownload = () => {
  trackEvent("file_download", {
    event_category: "epk",
    event_label: "epk_download",
  });
};

export const trackExternalLink = (url: string, linkType: string) => {
  trackEvent("click", {
    event_category: "external_link",
    event_label: linkType,
    link_url: url,
  });
};

export const trackNFTView = (nftName: string) => {
  trackEvent("view_item", {
    event_category: "nft",
    event_label: nftName,
    content_type: "nft",
  });
};

export default GoogleAnalytics;
