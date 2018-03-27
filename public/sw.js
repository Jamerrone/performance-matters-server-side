self.addEventListener('install', event =>
  event.waitUntil(
    caches
      .open('bs-v1-core')
      .then(cache =>
        cache.addAll([
          '/',
          '/sw.js',
          '/images/logo.png',
          '/scripts/bundle.js',
          'https://use.fontawesome.com/releases/v5.0.8/js/all.js',
          'https://cdn.jsdelivr.net/npm/lazyload@2.0.0-beta.1/lazyload.js',
          'https://fonts.googleapis.com/css?family=Vollkorn:400,600'
        ])
      )
      .then(self.skipWaiting())
  )
)

self.addEventListener('fetch', event => {
  const request = event.request
  if (
    request.mode === 'navigate' ||
    request.url.match('.jpg|.png|.gif|.tif$')
  ) {
    event.respondWith(
      fetch(request)
        .then(response => cachePage(request, response))
        .catch(err => getCachedPage(request))
        .catch(err => fetchCoreFile('/'))
    )
  } else {
    event.respondWith(
      fetch(request)
        .catch(err => fetchCoreFile(request.url))
        .catch(err => fetchCoreFile('/'))
    )
  }
})

function fetchCoreFile (url) {
  return caches
    .open('bs-v1-core')
    .then(cache => cache.match(url))
    .then(response => response || Promise.reject())
}

function getCachedPage (request) {
  return caches
    .open('bs-v1-pages')
    .then(cache => cache.match(request))
    .then(response => response || Promise.reject())
}

function cachePage (request, response) {
  const clonedResponse = response.clone()
  caches.open('bs-v1-pages').then(cache => cache.put(request, clonedResponse))
  return response
}
