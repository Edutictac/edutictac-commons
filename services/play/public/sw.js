const CACHE = 'edutictac-play-shell-v13';
const SCOPE = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE).pathname;
const SHELL = [
  '',
  'index.html',
  'app.js',
  'styles.css',
  'manifest.json',
  'i18n/es.json',
  'i18n/ca.json',
  'i18n/en.json',
  'icons/play-192.svg',
  'icons/play-512.svg',
].map((file) => SCOPE + file);
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith(`${SCOPE_PATH}api/`) || url.pathname.startsWith(`${SCOPE_PATH}h5p-libraries/`)) return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || (event.request.mode === 'navigate' ? caches.match(SCOPE + 'index.html') : Response.error()))));
});
