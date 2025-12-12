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
  "./files/2025_VIDOMIST.xlsx",
  "./files/2025_VIDOMIST.pdf",
  "./files/christmas.mp3",
  "./images/hat.png"

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


// ---------- Fetch ----------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const networkPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timeout")), 3500); // 3.5 сек

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
        // повідомляємо сторінку, що ONLINE
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ offline: false }));
        });
        return response;
      } catch (err) {
        // повідомляємо сторінку, що дані беруться з кешу
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ offline: true }));
        });

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
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
