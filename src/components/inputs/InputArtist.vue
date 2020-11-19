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

<script setup="props, { emit }">
    import { onMounted, ref } from 'vue'

    import { createClient } from '/src/js/clients'
    import { getParams, setParam } from '/src/js/utils'

    export { default as ButtonReset } from '../buttons/ButtonReset.vue'
    export { default as ListboxOptions } from '../listboxes/ListboxOptions.vue'
    export { default as Input } from './Input.vue'

    const client = createClient()

    export const input = ref('')

    export const artists = ref([])

    const queue = []

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

            const result = await client.executeQuery({
                query,
            })

            if (queue[queue.length - 1] === query) {
                artists.value = result.data.findArtistsByPhrase.data
            }

            queue.shift()
        } else {
            artists.value = []
            emit('reset')
        }
    }
</script>
