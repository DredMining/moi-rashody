// Opens instantly from the saved copy, then quietly fetches the fresh version for next launch.
const CACHE = 'moi-rashody-v58';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon4-192.png', './icon4-512.png', './apple-touch-icon4.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const own = url.origin === location.origin;
  if (!own && !FONT_HOSTS.includes(url.hostname)) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: own });
    const fresh = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; });
    if (hit) { if (own) e.waitUntil(fresh.catch(() => {})); return hit; }
    return fresh.catch(() => own ? c.match('./index.html') : Response.error());
  }));
});
