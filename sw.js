// Opens instantly from the saved copy, then quietly fetches the fresh version for next launch.
const CACHE = 'moi-rashody-v59';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon4-192.png', './icon4-512.png', './apple-touch-icon4.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
// the page under both its names: whichever is fetched, both saved copies get it
const PAGE = [new URL('./', location).href, new URL('./index.html', location).href];
// a spare copy of the page outside the caches: another app on this address may clear every cache but its own
// (the tour calculator's worker does), and the app must still open offline
const spare = (mode, f) => new Promise((ok, no) => { const o = indexedDB.open('moi-rashody-page', 1); o.onupgradeneeded = () => o.result.createObjectStore('page'); o.onerror = () => no(o.error);
  o.onsuccess = () => { const db = o.result; try { const t = db.transaction('page', mode), q = f(t.objectStore('page')); t.oncomplete = () => { db.close(); ok(q.result); }; t.onerror = t.onabort = () => { db.close(); no(t.error); }; } catch (x) { db.close(); no(x); } }; });
const keep = r => r.text().then(t => spare('readwrite', s => s.put(t, 'html'))).catch(() => {});
const spareCopy = () => spare('readonly', s => s.get('html')).then(t => t ? new Response(t, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }) : Response.error(), () => Response.error());
// a new version takes its files from the server, not from the browser's HTTP cache (it may still hold the old ones)
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' }))).then(() => c.match(PAGE[0])).then(r => r && keep(r)))); self.skipWaiting(); });
// only this app's old copies go: another app on the same address keeps its own
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('moi-rashody-') && n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const own = url.origin === location.origin;
  if (!own && !FONT_HOSTS.includes(url.hostname)) return;
  const nav = e.request.mode === 'navigate', page = own && PAGE.includes(url.origin + url.pathname);
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(page ? PAGE[0] : e.request, { ignoreSearch: own });
    // a font's address carries its version: the saved copy is used as it is, Google isn't asked again
    if (hit && !own) return hit;
    // own files: checked with the server past the HTTP cache, so the next launch gets what is published now;
    // fonts are asked for openly (CORS), so a Google error is seen as one and never saved in place of a font
    const req = !own ? new Request(url.href, { mode: 'cors', credentials: 'omit' }) : nav ? new Request(url.href, { cache: 'no-cache', redirect: 'manual' }) : new Request(e.request, { cache: 'no-cache' });
    const fresh = (own ? fetch(req) : fetch(req).catch(() => fetch(e.request))).then(r => { if (r.ok) { (page ? PAGE : [e.request]).forEach(k => c.put(k, r.clone()).catch(() => {})); if (page) e.waitUntil(keep(r.clone())); } return r; });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    // offline: a page opens from the saved copy (or the spare one, if the cache was cleared); a missing picture or file is a plain network error, not the page
    return fresh.catch(() => nav ? c.match(PAGE[0]).then(r => r || spareCopy()) : Response.error());
  }));
});
