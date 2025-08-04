const CACHE_NAME = "melody-portfolio-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/color.html",
  "/todo.html",
  "/quote.html",
  "/manifest.json",
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
];

// Install: cache all files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate new service worker immediately
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// Fetch: Cache-first fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Listen for updates
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting(); // Force activate new SW
  }
});
