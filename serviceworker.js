// This code executes in its own worker or thread
const urlsToCache = ["/", "script.js", "style.css", "assets/*", "app.manifest"];
self.addEventListener("install", (event) => {
   event.waitUntil(async () => {
      const cache = await caches.open("pwa-assets");
      return cache.addAll(urlsToCache);
   });
});


 self.addEventListener("activate", event => {
    console.log("Service worker activated");
 });



self.addEventListener("fetch", event => {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
          const networkFetch = fetch(event.request).then(response => {
            // update the cache with a clone of the network response
            caches.open("pwa-assets").then(cache => {
                cache.put(event.request, response.clone());
            });
          });
          // prioritize cached response over network
          return cachedResponse || networkFetch;
      }
    )
   )
 });