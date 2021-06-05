var APP_PREFIX = 'pwatest_'
var VERSION = 'version_05'
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [
  '/pwatest/',
  '/pwatest/index.html'
]


function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request); }
    return fetch(event.request).then(response => {
      // Update cache.
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    networkElseCache(e)
    //caches.match(e.request).then(function (request) {
    //  if (request) { // if cache is available, respond with cache
    //    console.log('responding with cache : ' + e.request.url)
    //    return request
    //  } else {       // if there are no cache, try fetching request
    //    console.log('file is not cached, fetching : ' + e.request.url)
    //    return fetch(e.request)
    //  }

      // You can omit if/else for console.log & put one line below here too.
      // return request || fetch(e.request)
    //})
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME)
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
