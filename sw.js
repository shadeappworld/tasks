const CACHE_NAME = 'task-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/style.js',
  '/InShot_20240314_092405934.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {
        return response; // Return the cached version
      }
      return fetch(event.request); // Fetch from the network
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Task Reminder';
  const options = {
    body: data.body || 'Check your tasks for today!',
    icon: 'icon.png'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
