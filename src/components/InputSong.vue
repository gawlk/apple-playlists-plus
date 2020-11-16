<template>
    <div class="flex-1 relative flex space-x-1">
        <div class="w-full">
            <input
                :value="input"
                @input="process($event.target.value)"
                placeholder="Write the name of a song here"
                class="w-full bg-gray-800 rounded-l-lg sm:rounded-l-none px-4 py-3 font-medium focus:outline-none placeholder-gray-500"
            />
            <ListboxOptions
                :elements="songs.map((x) => songToValue(x))"
                :open="songs.length > 0"
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

    export const songs = ref([])

    export const songToValue = (song) =>
        `${song.name} - Artist(s): ${song.artists.data
            .map((y) => y.name)
            .join(', ')}`

    const getNameByID = async (id) => {
        if (id) {
            let result = await client.executeQuery({
                query: `
                    {
                        findSongByID(
                            id: "${id}"
                        ) {
                            name
                            artists {
                                data {
                                    name
                                }
                            }
                        }
                    }
                `,
            })

            if (result?.data?.findSongByID) {
                return songToValue(result.data.findSongByID)
            } else {
                return ''
            }
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
        const song = songs.value[index]
        input.value = songToValue(song)
        emit('update', { value: song._id })
        songs.value = []
    }

    export const process = async (value) => {
        input.value = value

        if (value) {
            let result = await client.executeQuery({
                query: `
                    {
                        findSongsByPhrase(
                            phrase: "${value}",
                            _size: 100000,
                        ) {
                            data {
                                _id
                                name
                                artists {
                                    data {
                                        name
                                    }
                                }
                            }
                        }
                    }
                `,
            })

            songs.value = result.data.findSongsByPhrase.data
        } else {
            songs.value = []

            emit('reset')
        }
    }
</script>
