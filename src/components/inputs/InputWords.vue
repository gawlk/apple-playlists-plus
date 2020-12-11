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

<script setup>
    import { onMounted, defineEmit } from 'vue'

    import { getParams, setParam } from '/src/js/utils'

    import ButtonReset from '../buttons/ButtonReset.vue'
    import Input from './Input.vue'

    const emit = defineEmit()

    ref: input = getParams().value || ''

    const process = (value) => {
        input = value
        value ? emit('update', { value }) : emit('reset')
    }

    onMounted(() => {
        window.addEventListener('popstate', () => {
            input = getParams().value || ''
        })
    })
</script>
