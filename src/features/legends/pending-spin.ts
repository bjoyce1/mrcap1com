/** Keep only the unresolved request ID in this tab's session storage, scoped to the account.
 * Never store outcomes, balances or credentials here. The server is authoritative.
 */
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const storageKey = (user: string) => `spc-legends-pending-spin:${user}`;
const valid = (key: string | null): key is string => !!key && /^[A-Za-z0-9_:.-]{8,100}$/.test(key);

export function readPendingSpin(store: Store, user: string): string | null {
  try { const key = store.getItem(storageKey(user)); return valid(key) ? key : null; }
  catch { return null; }
}

export function writePendingSpin(store: Store, user: string, key: string | null): void {
  try {
    if (valid(key)) store.setItem(storageKey(user), key);
    else store.removeItem(storageKey(user));
  } catch { /* in-memory retry remains available if storage is unavailable */ }
}
