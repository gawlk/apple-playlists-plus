<template>
    <header class="text-center flex flex-col justify-center -space-y-2">
        <a :href="url">
            <img src="/apple-music.png" class="h-auto w-48 sm:w-72 mx-auto" />
            <div class="space-y-1">
                <p
                    style="color: #ffe9eb"
                    class="text-4xl sm:text-6xl font-bold"
                >
                    <span class="font-thin"> Apple</span> Playlists +
                </p>
                <p
                    style="color: #e6424a"
                    class="text-lg sm:text-2xl font-medium"
                >
                    A better way to search for playlists
                </p>
            </div>
        </a>
    </header>
</template>

<script setup>
    export const url = window.location.origin
</script>
