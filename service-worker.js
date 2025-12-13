const CACHE_NAME = "calk-cache-v1";

const FILES_TO_CACHE = [
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
  "./images/time.png",
  "./images/hat.png",

  "./files/2025_VIDOMIST.xlsx",
  "./files/2025_VIDOMIST.pdf",
  "./files/christmas.mp3"
];

// ---------- INSTALL ----------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // 🔑 активуємо новий SW одразу
});

// ---------- ACTIVATE ----------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
    ).then(() => self.clients.claim()) // 🔑 контролюємо всі вкладки одразу
  );
});

// ---------- FETCH ----------
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 🔴 Критичні файли: index.html, JS та CSS – без таймауту
  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/js/js.js") ||
    url.pathname.endsWith("/css/styles.css")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch (err) {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          return new Response("Offline", { status: 503 });
        }
      })
    );
    return;
  }

  // 🖼 Картинки / аудіо – cache-first
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|mp3)$/)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          return new Response("", { status: 200 });
        }
      })
    );
    return;
  }

  // 🌐 Інші ресурси – online-first з таймаутом 3.5 сек
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const networkPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timeout")), 3500);

        fetch(event.request)
          .then(response => {
            clearTimeout(timer);
            if (response && response.status === 200 && response.type === "basic") {
              cache.put(event.request, response.clone());
            }
            resolve(response);
          })
          .catch(err => {
            clearTimeout(timer);
            reject(err);
          });
      });

      try {
        const response = await networkPromise;
        // ONLINE
        self.clients.matchAll().then(clients =>
          clients.forEach(c => c.postMessage({ offline: false }))
        );
        return response;
      } catch {
        // OFFLINE
        self.clients.matchAll().then(clients =>
          clients.forEach(c => c.postMessage({ offline: true }))
        );

        const cached = await cache.match(event.request);
        if (cached) return cached;

        return new Response("Offline", { status: 503 });
      }
    })()
  );
});

// ---------- MESSAGE ----------
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
