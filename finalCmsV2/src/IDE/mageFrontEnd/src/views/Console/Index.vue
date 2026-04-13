<template>
    <div class="contentBlock" v-bind:class="{ show: show }">
        <div class="leftMenuBlock">
            <div class="title">FinalCMS Console</div>
            <div style="flex:1;">
                <SystemLeftMenu></SystemLeftMenu>
            </div>
            <CmsButton @click="exit">退出控制台</CmsButton>
        </div>
        <div style="display: flex;flex:1;flex-direction: column;">
            <RouterView v-slot="{ Component }">
                <KeepAlive>
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </div>
    </div>
</template>
<script setup>
import SystemLeftMenu from './components/SystemLeftMenu.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const emit = defineEmits(['update:modelValue'])
const show = ref(false)
const props = defineProps({ modelValue: Boolean })
watch(
    () => props.modelValue,
    (val) => {
        if (val)
            router.push("/" + localStorage.getItem("systemTargetMenu"))
        show.value = val
    }
)

function exit() {
    router.push("/")
    emit('update:modelValue', false)
    localStorage.setItem("showConsole", "false")
}
</script>
<style scoped>
.title {
    margin-top: 15px;
    font-size: 20px;
    font-weight: 300;
    margin-bottom: 15px;
    text-align: center;
}

.exitButton {
    border: 1px solid #6d6d6d;
    height: 35px;
    line-height: 35px;
    border-radius: 25px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.25s;
    background-color: #6d6d6d;
    color: #fff;
}

.exitButton:hover {
    background-color: #808080;
}

.leftMenuBlock {
    width: 200px;
    padding-right: 15px;
    border-right: 1px solid #fff;
    display: flex;
    flex-direction: column;
}

.contentBlock {
    overflow: hidden;
    display: flex;
    pointer-events: none;
    opacity: 0;
    transition: all 0.5s;
    position: fixed;
    width: 180px;
    height: 57px;
    left: calc((100vh - 800px) / 2 * (100vw / 100vh) + 321px);
    top: calc((100vh - 800px) / 2 + 1px);
    background-color: #ffffffcc;
    backdrop-filter: blur(20px);
    border-radius: 30px;
    border: 1px solid #fff;
}

.show {
    pointer-events: all;
    opacity: 1;
    left: 15px;
    top: 15px;
    padding: 25px;
    width: calc(100vw - 80px);
    height: calc(100vh - 80px);
}
</style>
