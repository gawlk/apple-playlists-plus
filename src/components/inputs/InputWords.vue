<template>
    <div class="flex-1 relative flex space-x-1">
        <Input
            :value="input"
            @input="process($event.target.value)"
            placeholder="Write some words here"
        />
        <ButtonReset @click="process('')" />
    </div>
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'

    import { getParams, setParam } from '/src/js/utils'

    export { default as ButtonReset } from '../buttons/ButtonReset.vue'
    export { default as Input } from './Input.vue'

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
