/* Mr. CAP Analytics Tracker v1.0.0
 * Lightweight, privacy-minded site analytics.
 * Add this to mrcap1.com after deploying the dashboard server:
 * <script defer src="https://YOUR-ANALYTICS-DOMAIN.com/tracker.js" data-site-id="mrcap1.com"></script>
 */
(function () {
  'use strict';

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var DEFAULT_ENDPOINT = 'https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/analytics-collect';
  var cfg = {
    siteId: (script && script.dataset.siteId) || location.hostname,
    endpoint: (script && script.dataset.endpoint) || DEFAULT_ENDPOINT,
    requireConsent: script && script.dataset.requireConsent === 'true',
    respectDnt: !(script && script.dataset.respectDnt === 'false'),
    sampleRate: Math.max(0, Math.min(1, parseFloat((script && script.dataset.sampleRate) || '1') || 1)),
    debug: script && script.dataset.debug === 'true'
  };

  var STORAGE_PREFIX = 'mrcap_analytics_';
  var SCROLL_MARKS = [25, 50, 75, 90];
  var firedScrollMarks = {};
  var pageStartedAt = Date.now();
  var lastPath = location.pathname + location.search;
  var queue = [];
  var flushTimer = null;
  var isEnabled = true;

  function log() {
    if (cfg.debug && window.console) console.log.apply(console, ['[MrCAP Analytics]'].concat([].slice.call(arguments)));
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getStorage(storage, key) {
    try { return storage.getItem(STORAGE_PREFIX + key); } catch (_) { return null; }
  }

  function setStorage(storage, key, value) {
    try { storage.setItem(STORAGE_PREFIX + key, value); } catch (_) {}
  }

  function hasConsent() {
    if (!cfg.requireConsent) return true;
    return getStorage(localStorage, 'consent') === 'yes' || window.mrcapAnalyticsConsent === true;
  }

  function shouldTrack() {
    if (!isEnabled) return false;
    if (Math.random() > cfg.sampleRate) return false;
    if (cfg.respectDnt && (navigator.doNotTrack === '1' || window.doNotTrack === '1')) return false;
    return hasConsent();
  }

  function getVisitorId() {
    var id = getStorage(localStorage, 'visitor_id');
    if (!id) {
      id = uuid();
      setStorage(localStorage, 'visitor_id', id);
      setStorage(localStorage, 'first_seen', new Date().toISOString());
    }
    return id;
  }

  function getSessionId() {
    var id = getStorage(sessionStorage, 'session_id');
    if (!id) {
      id = uuid();
      setStorage(sessionStorage, 'session_id', id);
      setStorage(sessionStorage, 'started_at', new Date().toISOString());
    }
    return id;
  }

  function getDeviceType() {
    var width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0, screen.width || 0);
    var ua = navigator.userAgent || '';
    if (/Mobi|Android|iPhone|iPod/i.test(ua) || width < 768) return 'mobile';
    if (/iPad|Tablet/i.test(ua) || (width >= 768 && width < 1100)) return 'tablet';
    return 'desktop';
  }

  function utm(name) {
    try { return new URLSearchParams(location.search).get('utm_' + name) || ''; } catch (_) { return ''; }
  }

  function inferPageStatus() {
    var title = document.title || '';
    if (/404|not found/i.test(title) || /404|not-found/i.test(location.pathname)) return '404';
    return '200';
  }

  function basePayload(type, props, metrics) {
    return {
      event_id: uuid(),
      event_type: type,
      site_id: cfg.siteId,
      ts: new Date().toISOString(),
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      url: location.href,
      path: location.pathname,
      title: document.title || '',
      referrer: document.referrer || '',
      source: utm('source'),
      medium: utm('medium'),
      campaign: utm('campaign'),
      term: utm('term'),
      content: utm('content'),
      user_agent: navigator.userAgent || '',
      geo: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        language: navigator.language || ''
      },
      device: {
        type: getDeviceType(),
        screen_width: screen.width || 0,
        screen_height: screen.height || 0,
        viewport_width: window.innerWidth || 0,
        viewport_height: window.innerHeight || 0,
        browser_language: navigator.language || ''
      },
      props: Object.assign({ page_status: inferPageStatus() }, props || {}),
      metrics: metrics || {}
    };
  }

  function enqueue(event) {
    if (!shouldTrack()) {
      log('tracking skipped', event && event.event_type);
      return;
    }
    queue.push(event);
    if (queue.length >= 8) flush(false);
    else scheduleFlush();
  }

  function scheduleFlush() {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(function () { flush(false); }, 1500);
  }

  function flush(useBeacon) {
    clearTimeout(flushTimer);
    if (!queue.length) return;
    var batch = queue.splice(0, queue.length);
    var body = JSON.stringify({ events: batch });

    if (useBeacon && navigator.sendBeacon) {
      try {
        var ok = navigator.sendBeacon(cfg.endpoint, new Blob([body], { type: 'application/json' }));
        if (ok) return;
      } catch (_) {}
    }

    try {
      fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: body,
        keepalive: !!useBeacon,
        mode: 'cors',
        credentials: 'omit'
      }).catch(function () {});
    } catch (_) {}
  }

  function track(type, props, metrics) {
    enqueue(basePayload(type, props, metrics));
  }

  function trackPageview(reason) {
    firedScrollMarks = {};
    pageStartedAt = Date.now();
    lastPath = location.pathname + location.search;
    track('pageview', { reason: reason || 'load' });
  }

  function trackPerformance() {
    if (!('performance' in window) || !performance.getEntriesByType) return;
    setTimeout(function () {
      var nav = performance.getEntriesByType('navigation')[0];
      if (!nav) return;
      track('performance', {}, {
        load_time_ms: Math.round(nav.loadEventEnd || nav.duration || 0),
        dom_content_loaded_ms: Math.round(nav.domContentLoadedEventEnd || 0),
        response_time_ms: Math.round((nav.responseEnd || 0) - (nav.requestStart || 0)),
        transfer_size: Math.round(nav.transferSize || 0)
      });
    }, 0);
  }

  function trackTimeOnPage(reason) {
    var ms = Date.now() - pageStartedAt;
    if (ms < 500) return;
    track('time_on_page', { reason: reason || 'visibility' }, { engagement_time_ms: ms, time_on_page_ms: ms });
  }

  function closestTrackable(element) {
    while (element && element !== document) {
      if (element.matches && element.matches('a,button,[role="button"],[data-analytics-event],[data-analytics-click]')) return element;
      element = element.parentNode;
    }
    return null;
  }

  function elementLabel(el) {
    if (!el) return '';
    return (el.getAttribute('data-analytics-label') || el.getAttribute('aria-label') || el.innerText || el.textContent || el.title || el.href || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var el = closestTrackable(event.target);
      if (!el || el.hasAttribute('data-analytics-ignore')) return;
      var href = el.href || '';
      var isOutbound = href && el.hostname && el.hostname !== location.hostname;
      track(isOutbound ? 'outbound_click' : 'click', {
        label: elementLabel(el),
        href: href,
        tag: (el.tagName || '').toLowerCase(),
        id: el.id || '',
        classes: typeof el.className === 'string' ? el.className.slice(0, 160) : ''
      });
    }, { capture: true, passive: true });

    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || form.hasAttribute('data-analytics-ignore')) return;
      track('form_submit', {
        form_id: form.id || '',
        form_name: form.getAttribute('name') || '',
        form_action: form.getAttribute('action') || '',
        form_label: form.getAttribute('data-analytics-label') || ''
      });
    }, { capture: true });

    document.addEventListener('focusin', function (event) {
      var form = event.target && event.target.closest ? event.target.closest('form') : null;
      if (!form || form.hasAttribute('data-analytics-started')) return;
      form.setAttribute('data-analytics-started', 'true');
      track('form_start', {
        form_id: form.id || '',
        form_name: form.getAttribute('name') || '',
        form_label: form.getAttribute('data-analytics-label') || ''
      });
    });

    window.addEventListener('scroll', function () {
      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      var scrollHeight = Math.max(body.scrollHeight, doc.scrollHeight, body.offsetHeight, doc.offsetHeight, body.clientHeight, doc.clientHeight) - window.innerHeight;
      if (scrollHeight <= 0) return;
      var depth = Math.round((scrollTop / scrollHeight) * 100);
      SCROLL_MARKS.forEach(function (mark) {
        if (depth >= mark && !firedScrollMarks[mark]) {
          firedScrollMarks[mark] = true;
          track('scroll_depth', { depth_percent: mark }, { depth_percent: mark });
        }
      });
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage('hidden');
        flush(true);
      } else {
        pageStartedAt = Date.now();
      }
    });

    window.addEventListener('pagehide', function () {
      trackTimeOnPage('pagehide');
      flush(true);
    });

    patchHistory();
    window.addEventListener('popstate', function () { setTimeout(checkPathChange, 0); });
  }

  function patchHistory() {
    ['pushState', 'replaceState'].forEach(function (method) {
      var original = history[method];
      if (!original) return;
      history[method] = function () {
        var result = original.apply(history, arguments);
        setTimeout(checkPathChange, 0);
        return result;
      };
    });
  }

  function checkPathChange() {
    var current = location.pathname + location.search;
    if (current !== lastPath) {
      trackTimeOnPage('route_change');
      trackPageview('route_change');
    }
  }

  window.MrCapAnalytics = {
    track: function (eventName, props, metrics) { track(eventName || 'custom_event', props || {}, metrics || {}); },
    conversion: function (name, value, props) { track('conversion', Object.assign({ conversion_name: name || 'conversion' }, props || {}), { value: Number(value || 0) }); },
    enableConsent: function () { setStorage(localStorage, 'consent', 'yes'); isEnabled = true; trackPageview('consent_enabled'); },
    disable: function () { isEnabled = false; setStorage(localStorage, 'consent', 'no'); },
    flush: function () { flush(false); }
  };

  if (shouldTrack()) {
    bindEvents();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { trackPageview('load'); trackPerformance(); });
    } else {
      trackPageview('load');
      trackPerformance();
    }
  } else if (cfg.requireConsent) {
    window.MrCapAnalytics.enable = window.MrCapAnalytics.enableConsent;
    log('waiting for consent');
  } else {
    log('disabled by settings');
  }
})();
