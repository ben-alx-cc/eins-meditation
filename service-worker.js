const CACHE_NAME = 'abstract-play-v1.0.0';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Installation des Service Workers
self.addEventListener('install', (event) => {
  const scope = (self.registration && self.registration.scope) || self.location.origin + '/';
  const toCache = ASSETS.map(p => new URL(p, scope).toString());
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(toCache))
      .then(() => self.skipWaiting())
  );
});

// Aktivierung des Service Workers
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch Events abfangen für Offline-Funktionalität
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Background Sync (für zukünftige Features)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background Sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Hier könnten zukünftig Synchronisations-Aufgaben stehen
      Promise.resolve()
    );
  }
});

// Push Notifications (für zukünftige Features)
// (Optional) Push/Sync Features entfernt für Minimalismus

// Notification Click Handler
// (Optional) Notification Handling entfernt

// Message Handler für Kommunikation mit dem Main Thread
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message empfangen:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fehlerbehandlung
self.addEventListener('error', (event) => {
  console.error('[ServiceWorker] Fehler:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[ServiceWorker] Unbehandelte Promise Rejection:', event.reason);
});