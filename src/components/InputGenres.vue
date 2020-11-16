<template>
    <Listbox
        :elements="data?.allGenres?.data.map((x) => x.name).sort() || []"
        :selectedValue="selectedValue"
        @select="select"
        defaultEmpty
        placeholder="Select a genre"
        roundedClasses="rounded-lg xs:rounded-l-none"
        class="flex-1"
    />
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'
    import { useQuery } from 'villus'

    import { getParams, setParam } from '/src/js/utils'

    export { default as Listbox } from '/src/components/Listbox.vue'

    export const selectedValue = ref('')

    export const select = (value) => {
        if (selectedValue.value === value) {
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
                        _id
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
