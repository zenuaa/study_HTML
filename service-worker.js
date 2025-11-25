const CACHE_NAME = "calk-v4"; // змінюй версію при оновленнях
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

// Install: кешуємо всі файли
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: видаляємо старі кеші
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: кеш-перший для всіх файлів
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
