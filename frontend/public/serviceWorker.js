const CACHE_NAME = 'ncdconnect-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-metrics') {
    event.waitUntil(syncMetrics());
  }
});

async function syncMetrics() {
  const offlineData = await getOfflineData();
  if (offlineData.length > 0) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(offlineData)
      });
      await clearOfflineData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
} 