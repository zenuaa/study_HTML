const CACHE_NAME = "calk-cache-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
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
  "./images/time_table.png"
];

// ---------------- INSTALL ----------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (e) {
          // важливо: не валимо install
        }
      }
    })
  );
});

// ---------------- ACTIVATE ----------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    ).then(() => self.clients.claim())
  );
});

// ---------------- FETCH ----------------
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🟢 Googlebot та інші боти — БЕЗ КЕШУ, БЕЗ ВТРУЧАННЯ
  if (/bot|crawler|spider|google|bing|yandex/i.test(req.headers.get("user-agent") || "")) {
    return; // браузер сам піде в мережу
  }

  // 🔴 Навігація та критичні файли (online-first + 3s timeout)
  if (
    req.mode === "navigate" ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/js/js.js") ||
    url.pathname.endsWith("/css/styles.css")
  ) {
    event.respondWith(networkWithTimeout(req, 3000));
    return;
  }

  // 🖼 Статика (cache-first)
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|mp3)$/)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // 🌐 Інше — online-first + fallback
  event.respondWith(networkWithTimeout(req, 3000));
});

// ---------------- STRATEGIES ----------------
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response("", { status: 200 });
  }
}

async function networkWithTimeout(req, timeout) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(req, { signal: controller.signal });
    clearTimeout(id);

    if (res && res.status === 200 && res.type === "basic") {
      cache.put(req, res.clone());
    }

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
    self.skipWaiting().then(() => {
      self.clients.claim();
    });
  }
});


// ---------------- HELPERS ----------------
function notifyClients(offline) {
  self.clients.matchAll().then(clients =>
    clients.forEach(c => c.postMessage({ offline }))
  );
}
