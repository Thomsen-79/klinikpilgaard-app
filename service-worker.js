const CACHE_NAME = 'klinikpilgaard-v3';
const BASE_PATH = '/klinikpilgaard-app';

// Filer der altid skal være tilgængelige offline
const CORE_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/assets/styles.css`,
  `${BASE_PATH}/assets/logo-192.png`,
  `${BASE_PATH}/assets/logo-512.png`,
  `${BASE_PATH}/manifest.webmanifest`
];

// Install: cache kernefiler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: ryd gamle caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first med fallback
self.addEventListener('fetch', event => {
  const request = event.request;

  // Kun GET-requests caches
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          // Cache nye filer automatisk
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Offline fallback til index.html
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
    })
  );
});







