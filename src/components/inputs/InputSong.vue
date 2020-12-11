<template>
    <div class="flex-1 relative flex space-x-1">
        <div class="w-full">
            <Input
                :value="input"
                @input="process($event.target.value)"
                placeholder="Write the name of a song here"
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

<script setup>
    import { onMounted, defineEmit } from 'vue'

    import { fetchGQL, getParams, setParam } from '/src/js/utils'

    import ButtonReset from '../buttons/ButtonReset.vue'
    import ListboxOptions from '../listboxes/ListboxOptions.vue'
    import Input from './Input.vue'

    const emit = defineEmit()

    const queue = []

    ref: input = ''

    ref: songs = []

    const songToValue = (song) =>
        `${song.name} - Artist(s): ${song.artists.data
            .map((y) => y.name)
            .join(', ')}`

    const getNameByID = async (id) => {
        if (id) {
            let result = await fetchGQL(`
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
            `)

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
        input = await getNameByID(getParams().value)

        window.addEventListener('popstate', async () => {
            input = await getNameByID(getParams().value)
        })
    })

    const select = (index) => {
        const song = songs[index]
        input = songToValue(song)
        emit('update', { value: song._id })
        songs = []
    }

    const process = async (value) => {
        input = value

        if (value) {
            const query = `
                {
                    findSongsByPhrase(
                        phrase: "${value}",
                        _size: 100,
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
            `

            queue.push(query)

            const result = await fetchGQL(query)

            if (queue[queue.length - 1] === query) {
                songs = result.data.findSongsByPhrase.data
            }

            queue.shift()
        } else {
            songs = []

            emit('reset')
        }
    }
</script>
