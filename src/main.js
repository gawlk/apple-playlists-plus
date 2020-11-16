import { createApp } from 'vue'

import { coshaInit } from './js/cosha'

coshaInit()

import 'tailwindcss/tailwind.css'

import App from './App.vue'

createApp(App).mount('#app')
