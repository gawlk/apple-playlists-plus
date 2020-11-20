<template>
    <div class="flex-1 flex space-x-1">
        <Listbox
            :elements="data?.allGenres?.data.map((x) => x.name).sort() || []"
            :selectedValue="selectedValue"
            @select="select"
            defaultEmpty
            placeholder="Select a genre"
            roundedClasses="rounded-l-lg sm:rounded-l-none"
            class="flex-1"
        />
        <ButtonReset @click="select()" />
    </div>
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'
    import { useQuery } from 'villus'

    import { getParams, setParam } from '/src/js/utils'

    export { default as ButtonReset } from '../buttons/ButtonReset.vue'
    export { default as Listbox } from '../listboxes/Listbox.vue'

    export const selectedValue = ref('')

    export const select = (value) => {
        if (!value || selectedValue.value === value) {
            selectedValue.value = ''
            emit('reset')
        } else {
            selectedValue.value = value
            emit('update', { value })
        }
    }

    export const { data } = useQuery({
        query: `
            {
                allGenres(_size: 100000) {
                    data {
                        name
                    }
                }
            }
        `,
    })

    onMounted(() => {
        window.addEventListener('popstate', () => {
            const value = getParams().value

            selectedValue.value = value || ''
        })
    })
</script>
