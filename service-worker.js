const CACHE_NAME = "calk-cache"; 
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
  "./files/2025_VIDOMIST.xlsx",
  "./files/2025_VIDOMIST.pdf",
  "./files/christmas.mp3",
  "./images/hat.png"
];

// ---------- Install ----------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ---------- Activate ----------
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => !cacheWhitelist.includes(key) ? caches.delete(key) : null))
    ).then(() => self.clients.claim())
  );
});

// ---------- Fetch ----------
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // --- Зображення для preloading / іконки --- cache-first без таймауту
  if (url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const response = await fetch(event.request);
          if (response && response.status === 200 && response.type === "basic") {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch (err) {
          return new Response("", { status: 200, statusText: "Offline fallback" });
        }
      })
    );
    return;
  }

  // --- Інші файли: online-first з таймаутом 3.5 сек ---
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
        self.clients.matchAll().then(clients =>
          clients.forEach(client => client.postMessage({ offline: false }))
        );
        return response;
      } catch (err) {
        self.clients.matchAll().then(clients =>
          clients.forEach(client => client.postMessage({ offline: true }))
        );

        const cached = await cache.match(event.request);
        if (cached) return cached;

        return new Response("Offline і даних у кеші немає", {
          status: 503,
          statusText: "SW offline fallback"
        });
      }
    })()
  );
});

// ---------- Повідомлення від сторінки ----------
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
