<template>
    <transition
        leave-active-class="transition ease-in duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="open"
            :class="classes"
            class="absolute bottom-0 mb-13 w-full rounded-lg bg-gray-800"
        >
            <div
                class="max-h-60 rounded-md py-2 text-base leading-6 overflow-auto focus:outline-none"
            >
                <button
                    v-for="(element, index) in elements"
                    :key="`${index}-${element}`"
                    :value="element"
                    @click="select(element, index)"
                    class="focus:outline-none focus:shadow-outline-none w-full text-left hover:bg-gray-600"
                >
                    <div class="select-none relative px-4 py-2">
                        <span class="block truncate" v-html="element" />
                    </div>
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup="props, { emit }">
    import { ref } from 'vue'

    export default {
        props: {
            elements: Array,
            open: Boolean,
            classes: String,
        },
    }

    export const select = (element, index) => {
        emit('select', element)
        emit('selectIndex', index)
    }
</script>
