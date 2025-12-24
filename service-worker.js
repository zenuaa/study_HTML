const CACHE_NAME = "calk-cache-v19";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./404.html",
  "./css/styles.css",
  "./js/js.js",
  "./manifest.json",
  "./images/clock72.png",
  "./images/clock96.png",
  "./images/clock128.png",
  "./images/clock144.png",
  "./images/clock152.png",
  "./images/clock192.png",
  "./images/face384.png",
  "./images/face.png",
  "./images/faceIOS.png",
  "./images/hat.png",
  "./images/time_table.png",
  "./images/pre.png",
];

// ---------------- INSTALL ----------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of CORE_ASSETS) {
        try { await cache.add(asset); } 
        catch (e) { /* не валимо install */ }
      }
    })
  );
});

// ---------------- ACTIVATE ----------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// ---------------- FETCH ----------------
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Сторонні домени — ігнор
  if (!url.origin.includes(self.location.origin)) return;

  // Боти — ігнор
  if (/bot|crawler|spider|google|bing|yandex/i.test(req.headers.get("user-agent") || "")) return;

  // Offline-first для сторінок (index.html та навігація)
  if (req.mode === "navigate") {
    event.respondWith(cacheThenNetwork(req));
    return;
  }

  // Online-first для JS/CSS
  if (url.pathname.endsWith("/js/js.js") || url.pathname.endsWith("/css/styles.css")) {
    event.respondWith(networkWithFallback(req));
    return;
  }

  // Cache-first для зображень та медіа
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|mp3)$/)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Інше — online-first + fallback
  event.respondWith(networkWithFallback(req));
});

// ---------------- STRATEGIES ----------------

// Cache-first (для зображень/медіа)
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  } catch {
    return new Response("", { status: 200 });
  }
}

// Offline-first для сторінок
async function cacheThenNetwork(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  if (cached) {
    // Показуємо користувачу кеш (offline = true, якщо мережа не доступна)
    notifyClients(true);

    // Паралельно намагаємось оновити кеш з мережі
    fetch(req)
      .then(res => {
        if (res && res.status === 200) {
          cache.put(req, res.clone());
          notifyClients(false); // мережа доступна
        }
      })
      .catch(() => notifyClients(true));

    return cached;
  }

  // Якщо кешу нема — беремо з мережі
  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone());
    notifyClients(false);
    return res;
  } catch {
    notifyClients(true);
    return cached || new Response("Offline", { status: 503 });
  }
}

// Online-first + fallback (JS/CSS/інші)
async function networkWithFallback(req) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone());
    notifyClients(false);
    return res;
  } catch {
    notifyClients(true);
    const cached = await cache.match(req);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}

// ---------------- MESSAGE ----------------
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting().then(() => self.clients.claim());
  }
});

// ---------------- HELPERS ----------------
function notifyClients(offline) {
  self.clients.matchAll().then(clients =>
    clients.forEach(c => c.postMessage({ offline }))
  );
}
