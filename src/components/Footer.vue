<template>
    <footer class="space-y-4">
        <div
            class="flex justify-center text-center font-medium space-x-2 sm:space-x-4 text-xs xs:text-sm sm:text-base"
        >
            <a
                href="https://spotify-premium-playlists.gawlk.workers.dev/"
                class="outline-none opacity-50 hover:opacity-75"
            >
                Spotify version
            </a>
            <span class="opacity-25">·</span>
            <a
                href="https://github.com/gawlk/apple-playlists-plus"
                rel="noopener noreferrer"
                target="_blank"
                class="outline-none opacity-50 hover:opacity-75"
            >
                Source code
            </a>
            <span class="opacity-25">·</span>
            <a
                href="https://www.buymeacoffee.com/gawlk"
                rel="noopener noreferrer"
                target="_blank"
                class="outline-none opacity-50 hover:opacity-75"
            >
                Buy me a coffee
            </a>
        </div>
        <p class="p-4 text-center text-xs font-medium opacity-50">
            © {{ new Date().getFullYear() }} Apple Playlists ➕, No right
            reserved.
        </p>
    </footer>
</template>
