// Service Worker para PWA - Liderazgo en Terreno
// Versión 1.0.0

const CACHE_NAME = 'liderazgo-terreno-v1';
const ASSETS_TO_CACHE = [
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando recursos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.error('[Service Worker] Error al cachear:', error);
            })
    );
    
    // Forzar la activación inmediata
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Eliminando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Tomar control inmediatamente de todas las páginas
    return self.clients.claim();
});

// Estrategia de caché: Network First, luego Cache
self.addEventListener('fetch', (event) => {
    // Solo interceptar peticiones GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la respuesta es válida, clonarla y guardarla en caché
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                
                return response;
            })
            .catch(() => {
                // Si falla la red, intentar servir desde caché
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
                        return cachedResponse;
                    }
                    
                    // Si no está en caché y es una página HTML, servir página offline
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            }).then(() => {
                console.log('[Service Worker] Caché limpiada');
            })
        );
    }
});

// Sincronización en segundo plano (opcional - para futuras mejoras)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        console.log('[Service Worker] Sincronizando formularios...');
        // Aquí se podría implementar sincronización de datos pendientes
    }
});

// Notificaciones push (opcional - para futuras mejoras)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: './icon-192.png',
        badge: './icon-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver',
                icon: './icon-72.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: './icon-72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Liderazgo en Terreno', options)
    );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

console.log('[Service Worker] Cargado correctamente');
