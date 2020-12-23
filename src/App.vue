<template>
    <div
        class="max-w-5xl w-full min-h-screen mx-auto px-4 pt-12 pb-16 space-y-16 sm:space-y-24"
    >
        <Header />

        <main class="space-y-16">
            <div class="space-y-2">
                <div class="w-full sm:flex space-y-1 sm:space-y-0 sm:space-x-1">
                    <Listbox
                        :elements="options.map((x) => x.name)"
                        :icons="options.map((x) => x.icon)"
                        :selectedValue="options[selectedIndex].name"
                        @selectIndex="select"
                        roundedClasses="rounded-lg sm:rounded-r-none"
                        class="w-full sm:w-48"
                    />
                    <InputArtist
                        v-if="selectedIndex === 0"
                        @update="process"
                        @reset="reset"
                    />
                    <InputGenres
                        v-if="selectedIndex === 1"
                        @update="process"
                        @reset="reset"
                    />
                    <InputSong
                        v-if="selectedIndex === 2"
                        @update="process"
                        @reset="reset"
                    />
                    <InputWords
                        v-if="selectedIndex === 3"
                        @update="process"
                        @reset="reset"
                    />
                </div>
                <p class="text-xs font-medium opacity-50 px-1">
                    Database (updates daily):
                    {{ counterArtists || '?' }}
                    artists ·
                    {{ counterGenres || '?' }}
                    genres ·
                    {{ counterPlaylists || '?' }}
                    playlists
                    <!-- playlists ·
                    {{ counterSongs || '?' }}
                    songs -->
                </p>
            </div>
            <div v-if="playlists" class="space-y-16">
                <div
                    class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-3"
                >
                    <Card
                        v-for="playlist in playlists"
                        :key="playlist._id"
                        :playlist="playlist"
                    />
                </div>
                <div class="flex justify-between">
                    <Button v-if="cursorBefore" @click="fetchBefore">
                        <svg
                            class="h-5 w-5 opacity-75"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"
                            />
                        </svg>
                        <span>Previous</span>
                    </Button>
                    <div v-else />
                    <Button v-if="cursorAfter" @click="fetchAfter">
                        <span>Next</span>
                        <svg
                            class="h-5 w-5 opacity-75"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </main>

        <Footer v-if="playlists" />

        <Spinner v-else class="p-16" />
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'

    import { fetchGQL, getParams, setParam } from '/src/js/utils'

    import Button from '/src/components/buttons/Button.vue'
    import Card from '/src/components/Card.vue'
    import Footer from '/src/components/Footer.vue'
    import Header from '/src/components/Header.vue'
    import InputArtist from '/src/components/inputs/InputArtist.vue'
    import InputGenres from '/src/components/inputs/InputGenres.vue'
    import InputSong from '/src/components/inputs/InputSong.vue'
    import InputWords from '/src/components/inputs/InputWords.vue'
    import Listbox from '/src/components/listboxes/Listbox.vue'
    import Spinner from '/src/components/Spinner.vue'

    const queue = []

    ref: cursorBefore = null

    ref: cursorAfter = null

    ref: selectedIndex = 0

    ref: playlists

    ref: counterArtists

    ref: counterGenres

    ref: counterPlaylists

    // ref: counterSongs

    const select = (index) => {
        const { mode } = getParams()

        if (Number(mode) !== index) {
            setParam('mode', index)
            selectedIndex = index
            fetchPlaylists()
        }
    }

    const fetchPlaylists = async () => {
        const { cursor, mode, value } = getParams()

        let queryName = 'allPlaylists'
        let queryHead = `${queryName}(`

        if (mode && value) {
            switch (options[Number(mode)].name?.toLowerCase()) {
                case 'artist':
                    queryName = 'findPlaylistsByArtist'
                    queryHead = `${queryName}(id: "${value}",`
                    break
                case 'genres':
                    queryName = 'findPlaylistsByGenres'
                    queryHead = `${queryName}(genres: ["${value}"],`
                    break
                case 'song':
                    queryName = 'findPlaylistsBySong'
                    queryHead = `${queryName}(id: "${value}",`
                    break
                case 'words':
                    queryName = 'findPlaylistsByWords'
                    queryHead = `${queryName}(words: [${value
                        .split(' ')
                        .map((x) => '"' + x + '"')}],`
                    break
            }
        }

        playlists = null

        const query = `
            {
                ${queryHead}
                    _size: 30,
                    _cursor: ${cursor ? '"' + cursor + '"' : null}
                ) {
                    before
                    data {
                        _id
                        name
                        url
                        artwork
                        curator
                    }
                    after
                }
            }
        `

        queue.push(query)

        let result = await fetchGQL(query)

        if (result && result.data) {
            result = result.data[queryName]

            if (queue[queue.length - 1] === query) {
                cursorBefore = result.before
                playlists = result.data
                cursorAfter = result.after
            }

            queue.shift()
        } else {
            console.error(result)
        }
    }

    const fetchBefore = () => {
        setParam('cursor', cursorBefore)

        window.scrollTo({ top: 0, behavior: 'smooth' })

        fetchPlaylists()
    }

    const fetchAfter = () => {
        setParam('cursor', cursorAfter)

        window.scrollTo({ top: 0, behavior: 'smooth' })

        fetchPlaylists()
    }

    const process = (value) => {
        setParam('value', value.value)

        fetchPlaylists()
    }

    const reset = () => {
        setParam('value')

        fetchPlaylists()
    }

    onMounted(async () => {
        getParams().mode || setParam('mode', 0, true)

        selectedIndex = Number(getParams().mode)

        fetchPlaylists()

        window.addEventListener('popstate', () => {
            selectedIndex = Number(getParams().mode) || 0

            fetchPlaylists()
        })

        counterArtists = (await fetchGQL(`{ countArtists }`))?.data.countArtists

        counterGenres = (await fetchGQL(`{ countGenres }`))?.data.countGenres

        counterPlaylists = (await fetchGQL(`{ countPlaylists }`))?.data
            .countPlaylists

        // counterSongs = (await fetchGQL(`{ countSongs }`))?.data.countSongs
    })

    const options = [
        {
            name: 'Artist',
            icon: `
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            `,
        },
        {
            name: 'Genres',
            icon: `
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
            </svg>
            `,
        },
        {
            name: 'Song',
            icon: `<svg class="h-5 w-5"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            `,
        },
        {
            name: 'Words',
            icon: `
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            `,
        },
    ]
</script>
