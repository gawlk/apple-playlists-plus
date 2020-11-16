<template>
    <a
        rel="noopener noreferrer"
        target="_blank"
        :href="playlist.url"
        class="transform duration-200 ease-in-out hover:-translate-y-1"
    >
        <img
            ref="image"
            class="w-full h-auto rounded-lg cosha"
            :src="playlist.artwork.replace('{w}', 200).replace('{h}', 200)"
            @load="updateImage('image-' + playlist._id)"
        />
        <div class="text-xs font-medium -space-y-0.5 px-1">
            <p class="truncate font-semibold">
                {{ playlist.name }}
            </p>
            <p class="truncate opacity-50">
                {{ playlist.curator }}
            </p>
        </div>
    </a>
</template>

<script setup="props">
    import { ref } from 'vue'
    import { coshaUpdateImage } from '/src/js/cosha'

    export default {
        props: {
            playlist: Object,
        },
    }

    export const image = ref()

    export const updateImage = (id) => coshaUpdateImage(image.value)
</script>
