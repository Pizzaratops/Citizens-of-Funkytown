// Unregister immediately - let browser handle caching via HTTP headers
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Pass-through: no caching, always fetch fresh
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => new Response('Offline', {status: 503})));
});
