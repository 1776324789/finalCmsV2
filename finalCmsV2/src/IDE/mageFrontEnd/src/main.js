import { createApp } from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import "@/assets/css/moonIcon.css"
import 'element-plus/dist/index.css'
import '@/assets/css/index.css'
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus)
app.use(Viewer)
app.mount('#app')