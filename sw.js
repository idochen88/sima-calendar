// מטמון לעבודה אופליין. בכל עדכון של קבצי האפליקציה — להעלות את מספר הגרסה.
const CACHE = 'sima-calendar-v6';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/logic.js',
  './js/db.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

// cache: 'reload' עוקף את מטמון הדפדפן, כדי שכל הקבצים יגיעו מאותה גרסה
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// קודם מהרשת (תמיד הגרסה העדכנית), ובלי אינטרנט מהמטמון
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE).then((c) => c.put(key, copy)));
        }
        return res;
      })
      .catch(() => caches.match(key, { ignoreSearch: true })),
  );
});
