const V = 'mt-shell-v1', M = 'mt-media-v1';
const SHELL = ['./', 'index.html', 'app.bin', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== M).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const p = url.pathname;
  if (req.mode === 'navigate' || p.endsWith('/') || p.endsWith('index.html') || p.endsWith('app.bin')) {
    const key = p.endsWith('app.bin') ? 'app.bin' : 'index.html';
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(key, cp)); } return r; }).catch(() => caches.match(key)));
    return; }
  e.respondWith(caches.match(req.url).then(r => r || caches.match(req, { ignoreSearch: true })).then(r => r || fetch(req)));
});
