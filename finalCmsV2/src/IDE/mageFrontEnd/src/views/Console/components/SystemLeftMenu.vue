<template>
    <template v-for="menu, index in systemStore.userFunctionData.systemMenu" :key="menu.id">
        <div class="menuBlock" v-bind:class="{ 'select': targetMenu == menu.target }" @click="handleClick(menu)">
            <div style="width: 25px;"></div>
            <div style="margin-right: 15px;">
                <span :class="menu.icon"></span>
            </div>
            <div>
                {{ menu.name }}
            </div>
        </div>
    </template>
</template>
<script setup>
import { useSystemStore } from '@/store/systemStore'
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
const systemStore = useSystemStore()
const router = useRouter()
const targetMenu = ref("")

onActivated(() => {
    targetMenu.value = localStorage.getItem("systemTargetMenu") || "/systemDataAnalysis"
    router.push(targetMenu.value)
})

function handleClick(menu) {
    targetMenu.value = menu.target
    localStorage.setItem("systemTargetMenu", menu.target)
    router.push(menu.target)

}
</script>
<style scoped>
.menuBlock {
    height: 50px;
    line-height: 50px;
    display: flex;
    border-radius: 25px;
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.25s;
    background-color: #fff;
}

.menuBlock span {
    font-size: 20px;
    color: #666;
}

.menuBlock:hover {
    background-color: #ffffffaf;
}

.select {
    color: #fff;
    background-color: #494949af;
}

.select span {
    color: #fff;
}

.select:hover {
    color: #e9e9e9;
    background-color: #646464af;
}
</style>