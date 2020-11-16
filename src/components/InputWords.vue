<template>
    <div class="flex-1 relative">
        <input
            :value="input"
            @input="process($event.target.value)"
            placeholder="Write some words here"
            class="w-full bg-gray-800 rounded-lg xs:rounded-l-none px-4 py-3 font-medium focus:outline-none placeholder-gray-500"
        />
    </div>
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'

    import { getParams, setParam } from '/src/js/utils'

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
