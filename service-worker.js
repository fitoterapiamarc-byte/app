const CACHE_NAME = 'cuerpoclaro-v1-20260829';
const APP_SHELL = [
  './', './index.html', './style.css', './daily.css', './analysis.css',
  './recommendations.css', './profile.css', './education.css', './phytotherapy.css',
  './safety.css', './data-manager.css', './app.js', './recommendations.js',
  './profile.js', './profile-safety.js', './education.js', './home-profile.js',
  './phytotherapy-data.js', './interaction-engine.js', './phytotherapy.js',
  './nutrition-data.js', './nutrition.js', './safety.js', './data-manager.js',
  './pwa.js', './manifest.json', './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});