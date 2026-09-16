const CACHE = 'idk-im-hungry-v0.1.0';
const ASSETS = [
  './',
  './index.html',
  './src/main.js',
  './src/styles.css',
  './src/data/foods.js',
  './src/data/restaurants.js',
  './src/engine/reactions.js',
  './src/engine/questions.js',
  './src/engine/session.js',
  './src/storage/profile.js',
  './public/manifest.webmanifest',
  './public/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
