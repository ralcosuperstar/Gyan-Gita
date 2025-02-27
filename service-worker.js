/**
 * GyanGita Service Worker
 * Provides offline functionality and caching
 */

// Cache names
const STATIC_CACHE_NAME = 'gyangita-static-v1';
const DYNAMIC_CACHE_NAME = 'gyangita-dynamic-v1';
const VERSE_CACHE_NAME = 'gyangita-verses-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.php',
  '/pages/browse.php',
  '/pages/practice.php',
  '/pages/dashboard.php',
  '/pages/search.php',
  '/assets/css/tailwind.css',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/js/verse-display.js',
  '/assets/js/mood-selector.js',
  '/assets/js/practice.js',
  '/assets/js/dashboard.js',
  '/assets/js/recommendations.js',
  '/assets/fonts/Sanskrit2003.woff2',
  '/assets/fonts/Sanskrit2003.woff',
  '/assets/images/general/empty-state.svg',
  '/assets/images/general/empty-favorites.svg',
  '/assets/images/general/empty-history.svg',
  '/assets/images/general/empty-practice.svg',
  '/assets/images/general/logo.png',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install event - Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheAllowlist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, VERSE_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheAllowlist.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Serve from cache, then network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle API requests separately
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle verse requests (for offline access)
  if (url.pathname.includes('/browse.php') && url.search.includes('chapter=') && url.search.includes('verse=')) {
    event.respondWith(handleVerseRequest(event.request));
    return;
  }
  
  // Handle other requests with standard strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache for cross-origin requests, non-GET, or partial responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic'
                || event.request.method !== 'GET') {
              return networkResponse;
            }
            
            // Cache the network response in the dynamic cache
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed:', error);
            
            // For HTML pages, return a custom offline page
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/pages/offline.php');
            }
            
            // Just return the error for other resources
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('API fetch failed, using cache:', error);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return error
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: 'You are offline and this content is not available offline.' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle verse requests with special caching strategy
async function handleVerseRequest(request) {
  const cache = await caches.open(VERSE_CACHE_NAME);
  
  // Get chapter and verse from URL
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const chapter = params.get('chapter');
  const verse = params.get('verse');
  
  if (chapter && verse) {
    // Try network first for verse page
    try {
      const networkResponse = await fetch(request);
      cache.put(request, networkResponse.clone());
      
      // Also cache the corresponding API response for offline access
      const apiUrl = `/api/get-verse.php?chapter=${chapter}&verse=${verse}`;
      fetch(apiUrl)
        .then(apiResponse => cache.put(apiUrl, apiResponse))
        .catch(e => console.log('Failed to cache verse API response', e));
      
      return networkResponse;
    } catch (error) {
      console.log('Verse fetch failed, using cache:', error);
      
      // Fallback to cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If no cache, return offline verse view
      return caches.match('/pages/offline-verse.php');
    }
  }
  
  // Normal handling for other verse-related requests
  return caches.match(request)
    .then(cachedResponse => {
      return cachedResponse || fetch(request)
        .then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch(() => caches.match('/pages/offline.php'));
    });
}

// Background sync for saving user data when offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'sync-practice') {
    event.waitUntil(syncPractice());
  }
});

// Function to sync favorites when back online
async function syncFavorites() {
  const dbPromise = indexedDB.open('gyangita-offline-db', 1);
  
  dbPromise.onupgradeneeded = event => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('pending-favorites')) {
      db.createObjectStore('pending-favorites', { keyPath: 'id' });
    }
  };
  
  try {
    const db = await new Promise((resolve, reject) => {
      dbPromise.onsuccess = event => resolve(event.target.result);
      dbPromise.onerror = event => reject(event.target.error);
    });
    
    const tx = db.transaction('pending-favorites', 'readonly');
    const store = tx.objectStore('pending-favorites');
    const pendingItems = await store.getAll();
    
    for (let item of pendingItems) {
      await fetch('/api/save-preferences.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data)
      });
      
      // Remove from pending store
      const deleteTx = db.transaction('pending-favorites', 'readwrite');
      const deleteStore = deleteTx.objectStore('pending-favorites');
      await deleteStore.delete(item.id);
    }
    
    return true;
  } catch (error) {
    console.error('Sync favorites failed:', error);
    return false;
  }
}

// Function to sync practice sessions when back online
async function syncPractice() {
  // Similar to syncFavorites but for practice data
  // Implementation would depend on your backend API design
  return true;
}

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/images/app-icons/icon-192x192.png',
    badge: '/assets/images/app-icons/badge-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});