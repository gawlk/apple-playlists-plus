<template>
    <div class="flex-1 relative flex space-x-1">
        <div class="w-full">
            <Input
                :value="input"
                @input="process($event.target.value)"
                placeholder="Write the name of an artist here"
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

<script setup>
    import { onMounted, defineEmit } from 'vue'

    import { fetchGQL, getParams, setParam } from '/src/js/utils'

    import ButtonReset from '../buttons/ButtonReset.vue'
    import ListboxOptions from '../listboxes/ListboxOptions.vue'
    import Input from './Input.vue'

    const emit = defineEmit()

    const queue = []

    ref: input = ''

    ref: artists = []

    const getNameByID = async (id) => {
        if (id) {
            let result = await fetchGQL(`
                {
                    findArtistByID(
                        id: "${id}"
                    ) {
                        name
                    }
                }
            `)
            return result?.data?.findArtistByID?.name || ''
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
        input = artists[index].name
        emit('update', { value: artists[index]._id })
        artists = []
    }

    const process = async (value) => {
        input = value

        if (value) {
            const query = `
                {
                    findArtistsByPhrase(
                        phrase: "${value}",
                        _size: 100,
                    ) {
                        data {
                            _id
                            name
                        }
                    }
                }
            `

            queue.push(query)

            const result = await fetchGQL(query)

            if (queue[queue.length - 1] === query) {
                artists = result.data.findArtistsByPhrase.data
            }

            queue.shift()
        } else {
            artists = []
            emit('reset')
        }
    }
</script>
