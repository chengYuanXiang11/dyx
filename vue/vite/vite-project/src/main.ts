import { createApp } from 'vue'
import App from './App.vue'
import BaSelect from './components/BaSelect.vue'

const app = createApp(App);
app.component('BaSelect',BaSelect)
app.mount('#app')