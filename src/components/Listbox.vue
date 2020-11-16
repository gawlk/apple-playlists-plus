<template>
    <Listbox
        as="div"
        class="space-y-1 sm:space-y-2"
        :modelValue="selectedValue"
        @update:modelValue="update"
        v-slot="{ open }"
    >
        <ListboxLabel v-if="label" class="block font-bold opacity-75">
            {{ label }}
        </ListboxLabel>
        <div :class="!removeRelativeClass && 'relative'">
            <ListboxButton
                :class="[roundedClasses ? roundedClasses : 'rounded-lg']"
                class="relative w-full bg-gray-800 flex items-center px-4 py-3 space-x-2 text-left focus:outline-none transition ease-in-out duration-300"
            >
                <span
                    v-if="icons"
                    class="flex items-center pointer-events-none opacity-50"
                    v-html="icons[elements.indexOf(selectedValue)]"
                />
                <span
                    class="block truncate font-medium flex-1"
                    :class="!selectedValue && 'text-gray-500'"
                    v-html="selectedValue || placeholder"
                />
                <span class="flex items-center pointer-events-none">
                    <svg
                        class="h-5 w-5 opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>
            </ListboxButton>

            <transition
                leave-active-class="transition ease-in duration-300"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="open"
                    class="absolute bottom-0 mb-13 w-full rounded-lg bg-gray-800"
                >
                    <ListboxOptions
                        static
                        class="max-h-60 rounded-md py-2 text-base leading-6 overflow-auto focus:outline-none"
                    >
                        <ListboxOption
                            v-for="element in elements"
                            :key="element"
                            :value="element"
                            v-slot="{ selected, active }"
                            class="focus:outline-none"
                        >
                            <div
                                :class="`${
                                    active ? 'bg-gray-700' : ''
                                } cursor-pointer select-none relative py-2 pl-11 pr-4`"
                            >
                                <span
                                    :class="`${
                                        selected ? 'font-bold' : 'font-medium'
                                    } block truncate`"
                                    v-html="element"
                                />
                                <span
                                    v-if="selected"
                                    :class="`${
                                        active ? '' : 'opacity-50'
                                    } absolute inset-y-0 left-0 flex items-center pl-4`"
                                >
                                    <svg
                                        class="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </ListboxOption>
                    </ListboxOptions>
                </div>
            </transition>
        </div>
    </Listbox>
</template>

<script setup="props, { emit }">
    import { ref, watchEffect } from 'vue'
    export {
        Listbox,
        ListboxLabel,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    } from '@headlessui/vue'

    export default {
        props: {
            elements: Array,
            icons: Array,
            label: String,
            removeRelativeClass: Boolean,
            selectedValue: String,
            roundedClasses: String,
            placeholder: String,
        },
    }

    export const update = (value) => {
        emit('select', value)
        emit('selectIndex', props.elements.indexOf(value))
    }
</script>
