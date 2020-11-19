<template>
    <div class="transform duration-200 ease-in-out hover:-translate-y-1">
        <button
            style="background-color: #e6424a; color: #ffe9eb"
            class="font-semibold px-4 py-1.5 rounded-lg flex items-center space-x-1.5 focus:outline-none focus:shadow-outline-none"
        >
            <slot></slot>
        </button>
    </div>
</template>
