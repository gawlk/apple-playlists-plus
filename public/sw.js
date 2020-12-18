// Regexes are sorted by priority

const regexesOnlineFirst = [
    // self.location.origin + '/api/',
]

const regexesOnlineOnly = [self.location.origin + '/api/', 'localhost', 'aws']

const regexesCacheFirst = [self.location.origin, 'https://rsms.me/inter/']

const regexesCacheOnly = []

// If the url doesn't match any of those regexes, it will do online first

// /!\ Warning /!\
// Variables auto updated by Gulp, do not change them !
const cacheName = 'cache-name-id'
const filesToPreCache = ['file']

console.log(`sw: origin: ${self.location.origin}`)

self.addEventListener('install', (event) => {
    console.log('sw: install')
    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log(`sw: creating cache: ${cacheName}`)
                return cache.addAll(filesToPreCache)
            })
            .then(() => {
                self.skipWaiting()
            })
    )
})

self.addEventListener('activate', (event) => {
    console.log('sw: activate')
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((thisCacheName) => {
                    if (thisCacheName !== cacheName) {
                        console.log(`sw: deleting: ${thisCacheName}`)
                        return caches.delete(thisCacheName)
                    }
                })
            ).then(() => self.clients.claim())
        })
    )
})

const update = (event, cache) => {
    return fetch(event.request)
        .then((response) => {
            return caches.open(cacheName).then((cache) => {
                if (event.request.method === 'GET') {
                    cache.put(event.request, response.clone())
                }
                return response
            })
        })
        .catch(() => {
            return cache
        })
}

const cacheFirst = {
    method: (event, cache) => {
        console.log(`sw: fetch: cache first: ${event.request.url}`)
        const fun = update(event, cache)
        return cache || fun
    },
    regexes: regexesCacheFirst,
}

const cacheOnly = {
    method: (event, cache) => {
        console.log(`sw: fetch: cache only: ${event.request.url}`)
        return cache || update(event, cache)
    },
    regexes: regexesCacheOnly,
}

const onlineFirst = {
    method: (event, cache) => {
        console.log(`sw: fetch: online first: ${event.request.url}`)
        return update(event, cache)
    },
    regexes: regexesOnlineFirst,
}

const onlineOnly = {
    method: (event) => {
        console.log(`sw: fetch: online only: ${event.request.url}`)
        return fetch(event.request)
    },
    regexes: regexesOnlineOnly,
}

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cache) => {
            // The order matters !
            const patterns = [cacheFirst, cacheOnly, onlineFirst, onlineOnly]

            for (let pattern of patterns) {
                for (let regex of pattern.regexes) {
                    if (RegExp(regex).test(event.request.url)) {
                        return pattern.method(event, cache)
                    }
                }
            }

            return onlineFirst.method(event, cache)
        })
    )
})
