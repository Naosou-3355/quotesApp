// Increment this version string each time you update index.html on GitHub
const CACHE = 'quoteapp-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './data.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  // Do NOT call skipWaiting() — let the app show the update banner
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Listen for skip message from the app (when user taps "update")
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
