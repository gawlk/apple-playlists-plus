<template>
    <div class="flex-1 flex space-x-1">
        <Listbox
            :elements="genres?.data.map((x) => x.name).sort() || []"
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

<script setup>
    import { onMounted, defineEmit } from 'vue'

    import { fetchGQL, getParams, setParam } from '/src/js/utils'

    import ButtonReset from '../buttons/ButtonReset.vue'
    import Listbox from '../listboxes/Listbox.vue'

    const emit = defineEmit()

    ref: selectedValue = ''

    ref: genres

    const select = (value) => {
        if (!value || selectedValue === value) {
            selectedValue = ''
            emit('reset')
        } else {
            selectedValue = value
            emit('update', { value })
        }
    }

    onMounted(async () => {
        genres = (
            await fetchGQL(`
                {
                    allGenres(_size: 100000) {
                        data {
                            name
                        }
                    }
                }
            `)
        ).data.allGenres

        window.addEventListener('popstate', () => {
            const value = getParams().value

            selectedValue = value || ''
        })
    })
</script>
