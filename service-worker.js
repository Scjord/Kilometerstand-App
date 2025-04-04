const CACHE_NAME = "kilometer-cache-v1";
const urlsToCache = [
  '/Kilometerstand-App/',
  '/Kilometerstand-App/index.html',
  '/Kilometerstand-App/style.css',
  '/Kilometerstand-App/app.js',
  '/Kilometerstand-App/manifest.json',
  '/Kilometerstand-App/icons/icon-192.png',
  '/Kilometerstand-App/icons/icon-512.png'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
