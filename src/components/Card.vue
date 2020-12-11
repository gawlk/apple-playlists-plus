<template>
    <a
        rel="noopener noreferrer"
        target="_blank"
        :href="props.playlist.url"
        class="transform duration-200 ease-in-out hover:-translate-y-1"
    >
        <img
            ref="image"
            class="w-full h-auto rounded-lg cosha"
            :src="
                props.playlist.artwork.replace('{w}', 200).replace('{h}', 200)
            "
            @load="updateImage('image-' + props.playlist._id)"
        />
        <div class="text-xs font-medium -space-y-0.5 px-1">
            <p class="truncate font-semibold">
                {{ props.playlist.name }}
            </p>
            <p class="truncate opacity-50">
                {{ props.playlist.curator }}
            </p>
        </div>
    </a>
</template>

<script setup>
    import { defineProps } from 'vue'
    import { coshaUpdateImage } from '/src/js/cosha'

    const props = defineProps({
        playlist: Object,
    })

    ref: image = undefined

    const updateImage = (id) => coshaUpdateImage(image)
</script>
