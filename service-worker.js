const CACHE_NAME = 'klinik-pilgaard-v1';
const BASE_PATH = '/klinikpilgaard-app';

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/assets/styles.css`,
  `${BASE_PATH}/assets/logo-192.png`,
  `${BASE_PATH}/assets/logo-512.png`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});



