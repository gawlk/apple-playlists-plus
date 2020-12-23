import { createApp } from 'vue'

import { coshaInit } from './js/cosha'

import 'tailwindcss/tailwind.css'

import App from './App.vue'

coshaInit()

createApp(App).mount('#app')
