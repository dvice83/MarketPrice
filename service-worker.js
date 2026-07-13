const CACHE = "marketprice-v1";
const FILES = ["./", "./index.html", "./style.css", "./script.js", "./manifest.webmanifest"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => event.respondWith(caches.match(event.request).then(found => found || fetch(event.request))));
