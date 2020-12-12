import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

import token from './token.js'

addEventListener('fetch', (event) => {
    try {
        event.respondWith(handleEvent(event))
    } catch (e) {
        event.respondWith(new Response('Internal Error', { status: 500 }))
    }
})

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message)

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    // convert bytes to hex string
    const hashHex = hashArray
        .map((b) => ('00' + b.toString(16)).slice(-2))
        .join('')
    return hashHex
}

async function handleEvent(event) {
    const request = event.request

    const url = new URL(request.url)

    if (url.pathname === '/api/fetch') {
        let cache = caches.default

        const body = JSON.stringify(await request.json())

        const hash = await sha256(body)

        url.pathname = '/api/fetch?' + hash

        const cacheKey = new Request(url.toString(), {
            headers: request.headers,
            method: 'GET',
        })

        let response = await cache.match(cacheKey)

        if (!response) {
            response = await fetch('https://graphql.fauna.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body,
            })

            response = new Response(response.body, response)

            if (response.ok) {
                response.headers.set('Cache-Control', 'max-age=86400')

                event.waitUntil(cache.put(cacheKey, response.clone()))
            }
        }

        return response
    } else {
        try {
            return await getAssetFromKV(event)
        } catch (e) {
            // if an error is thrown try to serve the asset at 404.html
            try {
                let notFoundResponse = await getAssetFromKV(event, {
                    mapRequestToAsset: (req) =>
                        new Request(`${new URL(req.url).origin}/404.html`, req),
                })

                return new Response(notFoundResponse.body, {
                    ...notFoundResponse,
                    status: 404,
                })
            } catch (e) {}

            return new Response(e.message || e.toString(), { status: 500 })
        }
    }
}
