var urlsToCache = [
'/',
'js/idb.js',
'js/indexController.js',
'js/dbhelper.js',
'js/restaurant_info.js',
'css/styles.css',
'/index.html'
];
var cacheName = "rReviews-static-v4";
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
          if (response.status == 404) 
          {
            return new Response(`<div style="position:absolute;top:50%;left:50%;width:200px;height:200px;margin:-100px 0 0 -100px;font-size:1.5em;"><strong>Page not found 404</strong></div>`, {
              headers: {"Content-Type": "text/html"}
            });
          }
          return response;
        }).catch(function() 
        {
          return new Response(`<div style="position:absolute;top:50%;left:50%;width:200px;height:200px;margin:-100px 0 0 -100px;font-size:1.5em;"><strong>Page not found, you appear to be offline</strong></div>`, {
              headers: {"Content-Type": "text/html"}
            });
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