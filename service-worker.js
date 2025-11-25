const CACHE_NAME = "calk-v2"; // змінюй при оновленнях
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
  "./images/time.jpg",
  "./files/2024%20ВІДОМІСТЬ%20.xls",
  "./files/2024%20ВІДОМІСТЬ.pdf"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          FILES_TO_CACHE.map(url =>
            fetch(url).then(res => {
              if (!res.ok) throw new Error(`Файл не знайдено: ${url}`);
              return cache.put(url, res);
            }).catch(err => console.log(err))
          )
        )
      )
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
