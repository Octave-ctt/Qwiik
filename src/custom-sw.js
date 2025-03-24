
// Basic service worker for PWA functionality
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open('qwiik-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico',
        '/icon-192.png',
        '/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// This is required for the injectManifest strategy
self.__WB_MANIFEST;
