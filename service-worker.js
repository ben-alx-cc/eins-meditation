const CACHE_NAME = 'eins-meditation-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Installation des Service Workers
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Dateien werden gecacht');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forciert den neuen Service Worker sofort zu aktivieren
        return self.skipWaiting();
      })
  );
});

// Aktivierung des Service Workers
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Aktivierung');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Lösche alte Caches
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Alter Cache wird gelöscht:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Übernimmt die Kontrolle über alle Clients sofort
      return self.clients.claim();
    })
  );
});

// Fetch Events abfangen für Offline-Funktionalität
self.addEventListener('fetch', (event) => {
  // Nur GET-Requests cachen
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Datei aus Cache geladen:', event.request.url);
          return response;
        }

        // Cache miss - fetch from network
        return fetch(event.request).then((response) => {
          // Prüfe ob wir eine gültige Response erhalten haben
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone die Response da sie nur einmal verwendet werden kann
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              console.log('[ServiceWorker] Neue Datei gecacht:', event.request.url);
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Network failed - return cached version if available
          console.log('[ServiceWorker] Netzwerkfehler, Fallback auf Cache');
          return caches.match('/index.html');
        });
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
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push Notification empfangen');
  
  const options = {
    body: 'Zeit für eine neue Meditation',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Meditation starten',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Später',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('EINS Meditation', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Öffne oder fokussiere die App
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

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