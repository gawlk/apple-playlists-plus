const sw = async () => {
    if (navigator.serviceWorker) {
        if (window.location.protocol === 'https:') {
            const registration = await navigator.serviceWorker.register(
                '/sw.js'
            )

            if (registration) {
                registration.addEventListener('updatefound', () => {
                    const worker = registration.installing

                    worker.addEventListener('statechange', () => {
                        if (
                            worker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            console.log('sw: update found')
                        }
                    })
                })
            }
        } else {
            const registrations = await navigator.serviceWorker.getRegistrations()

            if (registrations.length > 0) {
                registrations.forEach((registration) => {
                    registration.unregister()
                })

                location.reload()
            }
        }
    }
}

sw()
