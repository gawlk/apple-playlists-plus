<template>
    <div class="flex-1 relative flex space-x-1">
        <input
            :value="input"
            @input="process($event.target.value)"
            placeholder="Write some words here"
            class="w-full bg-gray-800 rounded-l-lg sm:rounded-l-none px-4 py-3 font-medium focus:outline-none placeholder-gray-500"
        />
        <ButtonReset @click="process('')" />
    </div>
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'

    import { getParams, setParam } from '/src/js/utils'

    export { default as ButtonReset } from './ButtonReset.vue'

    export const input = ref(getParams().value || '')

    export const process = (value) => {
        input.value = value
        value ? emit('update', { value }) : emit('reset')
    }

    onMounted(() => {
        window.addEventListener('popstate', () => {
            const value = getParams().value

            input.value = value || ''
        })
    })
</script>
