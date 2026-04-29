const CACHE_NAME = 'campus-conecta-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/control_escolar/',
    '/control_escolar/index.html',
    '/control_escolar/asistencia.html',
    '/control_escolar/recursos.html',
    '/control_escolar/estilos/styles.css',
    '/control_escolar/js/app.js',
    '/control_escolar/manifest.json'
];

// INSTALAR SERVICE WORKER Y CACHEAR ASSETS
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cacheando assets:', ASSETS_TO_CACHE);
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// ACTIVAR SERVICE WORKER Y LIMPIAR CACHE ANTIGUO
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// INTERCEPTAR PETICIONES (STRATEGY: Cache First, Network Fallback)
self.addEventListener('fetch', function(event) {
    // No cachear peticiones a APIs externas (clima)
    if (event.request.url.includes('open-meteo.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    // Cache hit - return response
                    console.log('Sirviendo desde caché:', event.request.url);
                    return response;
                }

                // Cache miss - fetch from network
                return fetch(event.request)
                    .then(function(response) {
                        // Verificar respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
            .catch(function() {
                // Si falla tanto caché como red, mostrar página offline
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/control_escolar/index.html');
                }
            })
    );
});
