const RETURN_KEY = 'mrcap-auth-return';
const ALLOWED = new Set(['/legends', '/legends/vault', '/library', '/admin', '/admin/captions', '/admin/library', '/admin/api', '/admin/roadmap', '/admin/greatday', '/greatday-preview']);

export function safeAuthReturn(value: unknown): string | null {
  return typeof value === 'string' && ALLOWED.has(value) ? value : null;
}

export function rememberAuthReturn(value: string) {
  try { sessionStorage.setItem(RETURN_KEY, safeAuthReturn(value) ?? '/legends'); } catch { /* This visit can still sign in. */ }
}

export function storedAuthReturn(): string | null {
  try { return safeAuthReturn(sessionStorage.getItem(RETURN_KEY)); } catch { return null; }
}

export function clearAuthReturn() {
  try { sessionStorage.removeItem(RETURN_KEY); } catch { /* Storage may be unavailable. */ }
}