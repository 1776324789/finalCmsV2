import { createApp } from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import "@/assets/css/moonIcon.css"
import 'element-plus/dist/index.css'
import '@/assets/css/index.css'
import router from './router'
import CmsInput from '@/components/baseElements/CmsInput.vue'
import CmsTextarea from '@/components/baseElements/CmsTextarea.vue'
import CmsButton from '@/components/baseElements/CmsButton.vue';
import ImageUpload from '@/components/baseElements/ImageUpload.vue';


const app = createApp(App);
const pinia = createPinia();

app.component('CmsTextarea', CmsTextarea)
app.component('CmsInput', CmsInput)
app.component('CmsButton', CmsButton)
app.component('ImageUpload', ImageUpload)
app.use(router)
app.use(pinia);
app.use(ElementPlus)
app.use(Viewer)
app.mount('#app')
