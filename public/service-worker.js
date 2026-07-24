// Kill-switch worker mirrored at /service-worker.js for any historic
// registration that used this path. Behaviour identical to /sw.js.

const APP_CACHE_PREFIXES = [
  "workbox-",
  "precache-v",
  "runtime-",
  "googleAnalytics-",
  "mrcap-",
  "app-shell-",
  "vite-pwa-",
];

function isThisAppsCache(name) {
  const scope = self.registration.scope;
  const scopedSuffixMatch = typeof scope === "string" && name.endsWith(scope);
  const prefixMatch = APP_CACHE_PREFIXES.some((p) => name.startsWith(p) || name.includes(`-${p}`));
  return scopedSuffixMatch || prefixMatch;
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const toDelete = cacheNames.filter(isThisAppsCache);
        await Promise.allSettled(toDelete.map((name) => caches.delete(name)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(windowClients.map((client) => client.navigate(client.url)));
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);
