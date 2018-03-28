var urlsToCache = [
'/',
'js/main.js',
'js/indexController.js',
'js/dbhelper.js',
'js/restaurant_info.js',
'css/styles.css',
'data/restaurants.json',
'/index.html',
'/restaurant.html?id=1',
'/restaurant.html?id=2',
'/restaurant.html?id=3',
'/restaurant.html?id=4',
'/restaurant.html?id=5',
'/restaurant.html?id=6',
'/restaurant.html?id=7',
'/restaurant.html?id=8',
'/restaurant.html?id=9',
'/restaurant.html?id=10',
'/restaurant.html',
'img/1.jpg',
'img/2.jpg',
'img/3.jpg',
'img/4.jpg',
'img/5.jpg',
'img/6.jpg',
'img/7.jpg',
'img/8.jpg',
'img/9.jpg',
'img/10.jpg',
];
var cacheName = "rReviews-static-v1";
self.addEventListener('install', function(event) 
{
  event.waitUntil
  (
    caches.open(cacheName).then(function(cache) 
    {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('active', function(event) 
{
  event.waitUntil
  (
    caches.keys().then(function(cacheNames) 
    {
      return Promise.all
      (
        cacheNames.filter(function(cName) 
        {
          return cName.startsWith('rReviews-') && cName != cacheName;
        }).map(function(cName) 
        {
          return cache.delete(cName);
        })
      )
    })
  );
});

self.addEventListener('fetch', function(event)
{
  event.respondWith
  (
    caches.open(cacheName).then(function(cache) 
    {
      return cache.match(event.request).then(function (response) 
      {
        return response || fetch(event.request).then(function(response) 
        {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});