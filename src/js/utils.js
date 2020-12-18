export const fetchGQL = async (query, variables) => {
    const result = await fetch('/api/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    })

    if (result.status === 200) {
        return await result.json()
    }
}

export const getParams = () => {
    const params = {}

    new URLSearchParams(window.location.search).forEach((value, key) => {
        params[key] = decodeURIComponent(value)
    })

    return params
}

export const setParam = (key, value = '', replace = false) => {
    const params = getParams()

    // SPA navigation edge cases
    if (key === 'mode') {
        delete params['value']
        delete params['cursor']
    } else if (key === 'value') {
        delete params['cursor']
    }

    if (String(key) && String(value)) {
        params[key] = value
    } else if (key) {
        delete params[key]
    }

    let paramsString = '/?'

    for (const [key, value] of Object.entries(params)) {
        paramsString += `${key}=${encodeURIComponent(value)}&`
    }

    paramsString = paramsString.slice(0, -1)

    if (replace) {
        window.history.replaceState({}, null, paramsString)
    } else {
        window.history.pushState({}, null, paramsString)
    }
}
