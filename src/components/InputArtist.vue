<template>
    <div class="flex-1 relative flex space-x-1">
        <div class="w-full">
            <input
                :value="input"
                @input="process($event.target.value)"
                placeholder="Write the name of an artist here"
                class="w-full bg-gray-800 rounded-l-lg sm:rounded-l-none px-4 py-3 font-medium focus:outline-none placeholder-gray-500"
            />
            <ListboxOptions
                :elements="artists.map((x) => x.name)"
                :open="artists.length > 0"
                @selectIndex="select"
                class="w-48"
            />
        </div>
        <ButtonReset @click="process('')" />
    </div>
</template>

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'

    import { createClient } from '/src/js/clients'
    import { getParams, setParam } from '/src/js/utils'

    export { default as ButtonReset } from './ButtonReset.vue'
    export { default as ListboxOptions } from './ListboxOptions.vue'

    const client = createClient()

    export const input = ref('')

    export const artists = ref([])

    const getNameByID = async (id) => {
        if (id) {
            let result = await client.executeQuery({
                query: `
                    {
                        findArtistByID(
                            id: "${id}"
                        ) {
                            name
                        }
                    }
                `,
            })
            return result?.data?.findArtistByID?.name || ''
        } else {
            return ''
        }
    }

    onMounted(async () => {
        input.value = await getNameByID(getParams().value)

        window.addEventListener('popstate', async () => {
            input.value = await getNameByID(getParams().value)
        })
    })

    export const select = (index) => {
        input.value = artists.value[index].name
        emit('update', { value: artists.value[index]._id })
        artists.value = []
    }

    export const process = async (value) => {
        input.value = value

        if (value) {
            let result = await client.executeQuery({
                query: `
                    {
                        findArtistsByPhrase(
                            phrase: "${value}",
                            _size: 100000,
                        ) {
                            data {
                                _id
                                name
                            }
                        }
                    }
                `,
            })

            artists.value = result.data.findArtistsByPhrase.data
        } else {
            artists.value = []
            emit('reset')
        }
    }
</script>
