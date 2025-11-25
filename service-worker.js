const CACHE_NAME = "calk-v1"; // змінюй на v3, v4… при оновленнях
const FILES_TO_CACHE = [
  "/study_HTML/",
  "/study_HTML/index.html",
  "/study_HTML/style.css",
  "/study_HTML/script.js",
  "/study_HTML/manifest.json",
  "/study_HTML/images/face.png",
  "/study_HTML/images/faceIOS.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
