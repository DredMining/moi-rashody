// Opens instantly from the saved copy, then quietly fetches the fresh version for next launch.
const CACHE = 'moi-rashody-v137';
// the fonts are the app's own files: saved with the page at install, so offline every one of them is at hand
const FONTS = ['GolosText-cyrillic-q5uCsoe9Lv', 'GolosText-latin-q5uCsoe9Lv', 'IBMPlexMono-cyrillic--F63fjptAg', 'IBMPlexMono-latin--F63fjptAg', 'IBMPlexMono-cyrillic--F6qfjptAg', 'IBMPlexMono-latin--F6qfjptAg', 'Unbounded-cyrillic-Yq6W-LOTXC', 'Unbounded-latin-Yq6W-LOTXC',
  // ₽ for each face (it is in neither the Latin nor the Cyrillic file)
  'GolosText-rub400-2626f3c1', 'GolosText-rub500-1ffbb4e5', 'GolosText-rub600-48126017', 'IBMPlexMono-rub400-928d7d82', 'IBMPlexMono-rub500-4b52133d', 'Unbounded-rub500-fd96e1a7', 'Unbounded-rub700-56dd8e8b'].map(f => `./fonts/${f}.woff2`);
// the launch screens of the home-screen app (iPhone 17 Pro Max, dark and light) are kept with it too
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-wallet-192.png', './icon-wallet-512.png', './apple-touch-icon-wallet.png', './splash-1320x2868-dark.png', './splash-1320x2868-light.png', ...FONTS];
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
  // the page asks nothing of other sites (its fonts are its own files), so only its own files are handled
  if (url.origin !== location.origin) return;
  const nav = e.request.mode === 'navigate', page = PAGE.includes(url.origin + url.pathname);
  e.respondWith(caches.open(CACHE).then(async c => {
    // the caches cleared by another app on this address: opening the page online puts back what is missing of FILES (fonts, icons, launch screens)
    if (nav && page) e.waitUntil(c.keys().then(ks => { const have = new Set(ks.map(r => r.url)), miss = FILES.map(u => new URL(u, location).href).filter(u => !have.has(u) && !PAGE.includes(u)); return miss.length && c.addAll(miss.map(u => new Request(u, { cache: 'reload' }))); }).catch(() => {}));
    const hit = await c.match(page ? PAGE[0] : e.request, { ignoreSearch: true });
    // a font's file name carries its version: the saved copy is used as it is, the server isn't asked again
    if (hit && url.pathname.endsWith('.woff2')) return hit;
    // checked with the server past the HTTP cache, so the next launch gets what is published now
    const req = nav ? new Request(url.href, { cache: 'no-cache', redirect: 'manual' }) : new Request(e.request, { cache: 'no-cache' });
    const fresh = fetch(req).then(r => { if (r.ok) { (page ? PAGE : [e.request]).forEach(k => c.put(k, r.clone()).catch(() => {})); if (page) e.waitUntil(keep(r.clone())); } return r; });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    // offline: a page opens from the saved copy (or the spare one, if the cache was cleared); a missing picture or file is a plain network error, not the page
    return fresh.catch(() => nav ? c.match(PAGE[0]).then(r => r || spareCopy()) : Response.error());
  }));
});
