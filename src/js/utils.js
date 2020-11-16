export const getParams = () => {
    const params = {}

    new URLSearchParams(window.location.search).forEach((value, key) => {
        params[key] = decodeURIComponent(value)
    })

    return params
}

export const setParam = (key, value = '') => {
    const params = getParams()

    // SPA navigation edge cases
    if (key === 'mode') {
        if (params.value) {
            delete params['value']
            delete params['cursor']
        }
    } else if (key === 'value' && String(value)) {
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

    window.history.pushState({}, null, paramsString)
}
