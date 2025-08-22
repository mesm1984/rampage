/**
 * Service Worker pour optimisation des performances
 * Red Bull Rampage 2024 - Performance & SEO
 */

const CACHE_NAME = 'redbull-rampage-v2.1';
const STATIC_CACHE = 'static-v2.1';
const DYNAMIC_CACHE = 'dynamic-v2.1';
const IMAGE_CACHE = 'images-v2.1';

// Ressources à mettre en cache immédiatement
const STATIC_FILES = [
  '/',
  '/index.html',
  '/galerie.html',
  '/Forum.html',
  '/Podiums.html',
  '/Classement_Masculin.html',
  '/Classement_Feminin.html',
  '/Connexion.html',
  '/css/style.css',
  '/css/performance-optimized.css',
  '/js/chatbot.js',
  '/js/forum-api.js',
  '/images/logo noir.jpg',
  '/manifest.json'
];

// Ressources critiques pour les performances
const PERFORMANCE_CRITICAL = [
  '/css/style.css',
  '/js/main.js',
  '/images/logo noir.jpg'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache des fichiers statiques
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Preload des ressources critiques
      caches.open('critical-v2.1').then(cache => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(PERFORMANCE_CRITICAL);
      })
    ])
  );
  
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    // Nettoyage des anciens caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheName.includes('v2.1')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Stratégies de mise en cache optimisées
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ne pas intercepter les requêtes vers d'autres domaines (analytics, etc.)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Stratégie par type de ressource
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Gestion optimisée des images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Retourner l'image en cache immédiatement
      return cachedResponse;
    }
    
    // Fetch l'image avec timeout
    const fetchPromise = fetchWithTimeout(request, 5000);
    const response = await fetchPromise;
    
    if (response && response.status === 200) {
      // Cloner avant de mettre en cache
      const responseClone = response.clone();
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.warn('[SW] Image fetch failed:', error);
    // Retourner une image de fallback
    return new Response('<svg>...</svg>', {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

// Gestion des documents HTML avec mise à jour en arrière-plan
async function handleDocumentRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Stratégie "Stale While Revalidate"
    const fetchPromise = fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cachedResponse);
    
    return cachedResponse || await fetchPromise;
  } catch (error) {
    console.warn('[SW] Document fetch failed:', error);
    return cachedResponse || new Response('Page non disponible hors ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// Gestion des API avec stratégie Network First
async function handleApiRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
      // Essayer le réseau d'abord
      const response = await fetchWithTimeout(request, 3000);
      
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (networkError) {
      // Fallback sur le cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      throw networkError;
    }
  } catch (error) {
    console.warn('[SW] API request failed:', error);
    return new Response(JSON.stringify({ error: 'Service non disponible' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Gestion des ressources statiques
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn('[SW] Static resource fetch failed:', error);
    throw error;
  }
}

// Utilitaire pour fetch avec timeout
function fetchWithTimeout(request, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);
    
    fetch(request)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

// Gestion des messages pour les mises à jour
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Préchargement intelligent en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'background-preload') {
    event.waitUntil(preloadCriticalResources());
  }
});

async function preloadCriticalResources() {
  const cache = await caches.open('preload-v2.1');
  const criticalUrls = [
    '/api/forum/topics',
    '/images/red-bull-rampage-2024.jpeg',
    '/images/podium-homme.jpg'
  ];
  
  return Promise.all(
    criticalUrls.map(url => 
      fetch(url).then(response => {
        if (response.status === 200) {
          cache.put(url, response);
        }
      }).catch(() => {})
    )
  );
}
