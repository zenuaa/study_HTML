// test update version 0

const CACHE_NAME = "calk-cache"; // стабільна назва кешу
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
  "./files/2024_VIDOMIST.xls",
  "./files/2024_VIDOMIST.pdf"
];

// ---------- Install ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
        } catch (err) {
          console.error("Failed to cache:", file, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// ---------- Activate ----------
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (!cacheWhitelist.includes(key)) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});


// ---------- Fetch: кеш-перший + автоматичне оновлення ----------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        // якщо успішний запит, оновлюємо кеш
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        // якщо офлайн або помилка, віддаємо кеш
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        // якщо немає у кеші — fallback
        return new Response("Файл недоступний офлайн", {
          status: 503,
          statusText: "Service Worker: Offline fallback"
        });
      }
    })
  );
});

// ---------- Повідомлення від сторінки ----------
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
