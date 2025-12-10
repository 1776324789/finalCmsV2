import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import "@/assets/css/moonIcon.css"
import 'element-plus/dist/index.css'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus)
app.use(router)
app.mount('#app')