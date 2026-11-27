const KEY = 'mrcap-analytics-consent';
export const CONSENT_EVENT = 'mrcap-analytics-consent-changed';
export function analyticsConsent(): boolean {
  try { return localStorage.getItem(KEY) === 'granted'; } catch { return false; }
}
export function setAnalyticsConsent(allowed: boolean): void {
  try { localStorage.setItem(KEY, allowed ? 'granted' : 'denied'); } catch { /* no persistent storage */ }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}
