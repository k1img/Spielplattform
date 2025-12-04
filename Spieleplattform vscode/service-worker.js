const CACHE_NAME = 'klickzaehler-cache-v1';
const urlsToCache = [
    'index.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'impressum.html',   /* NEU hinzugefügt */
    'datenschutz.html', /* NEU hinzugefügt */
    'icon-192x192.png', /* NEU hinzugefügt */
    'icon-512x512.png'  /* NEU hinzugefügt */
];

// Installation: Cache öffnen und Dateien hinzufügen
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Abrufen: Dateien aus dem Cache bereitstellen, wenn verfügbar
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache-Hit - zurückgeben der Response
                if (response) {
                    return response;
                }
                // Kein Cache-Hit - Netzwerk-Fetch durchführen
                return fetch(event.request);
            })
    );
});
