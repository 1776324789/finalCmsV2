<template>
    <div class="mainBlock scroll" :style="`pointer-events:${show ? 'auto' : 'none'};`">
        <LeftMenu @change="handelMenuChange" @logout="logoutHandel" v-model="show"></LeftMenu>
        <div class="contentBlock scroll"
            v-bind:class="{ rightIn: show, change1: (change != 0 && change % 2 == 1), change2: (change != 0 && change % 2 == 0) }">
            <DataAnalysis v-if="target == 'dataAnalysis'"></DataAnalysis>
            <WebController v-if="target == 'webController'"></WebController>
        </div>
    </div>
</template>
<script setup>
import WebController from '../FunctionPages/WebController/WebController.vue';
import { watch, ref } from 'vue'
import { useDataStore } from '@/store';
import DataAnalysis from '../FunctionPages/DataAnalysis/DataAnalysis.vue';
import LeftMenu from './element/LeftMenu.vue';
const change = ref(0)
const props = defineProps({ modelValue: Boolean })
const show = ref(true)
const target = ref(0)
const emit = defineEmits(['logout', 'update:modelValue'])
watch(
    () => props.modelValue,
    (val) => {
        show.value = val
    },
    { immediate: true } // 👈 初始化时也同步一次状态
)

function logoutHandel() {
    emit('update:modelValue', false)
    emit('logout')
}



function handelMenuChange(menu) {
    change.value += 0.5
    setTimeout(() => {
        change.value += 0.5
    });
    setTimeout(() => {
        target.value = menu
    }, 175);
}
</script>
<style scoped>
.change1 {
    animation: changeAni 0.35s ease;
}

.change2 {
    animation: changeAni 0.35s ease;
}

@keyframes changeAni {
    0% {
        scale: 1;
        opacity: 1;
    }

    50% {
        scale: 0.95;
        opacity: 0.5;
    }

    100% {
        scale: 1;
        opacity: 1;
    }
}

.bottomButton {
    border: 1px solid #fff;
    color: #fff;
    text-align: center;
    height: 40px;
    border-radius: 20px;
    line-height: 40px;
    width: 70px;
    font-size: 16px;
    font-weight: 350;
    cursor: pointer;
}

.bottomButton:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

img {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    scale: 1.1;
}

.parentButton {
    border: 1px solid#fff;
    margin-left: -1px;
    margin-top: -1px;
}

.contentBlock {
    transition: all 0.5s;
    padding: 50px;
    border: 1px solid #fff;
    backdrop-filter: blur(150px);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50px;
    flex: 1;
    margin: 25px;
    margin-left: 5px;
    display: flex;
    scale: 0;
    opacity: 0;
    transform: translateX(calc(100vw - 300px));
}

.rightIn {
    scale: 1;
    opacity: 1;
    transform: translateX(0);
}



.title {
    margin-bottom: 20px;
    font-weight: 300px;
    text-align: center;
    color: #fff;
}

.childMenuBlock {
    transition: all 0.25s;
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
}

.childMenuBlock:hover span {
    color: #000;
}

.childMenuBlockOpen {
    margin-top: 10px;
    overflow: unset;
}

.mainMenuBlock {
    z-index: 10;
    transition: 0.5s all;
    width: 70px;
    margin: 40px;
    display: flex;
    flex-direction: column;
    transform: translateX(-20vw);
}

.leftIn {
    transform: translateX(0px);
}



.menuBlock {
    margin-bottom: 25px;
    padding: 3px;
    background-color: rgba(255, 255, 255, 0.25);
    width: 70px;
    border-radius: 37px;
}

.mainBlock {
    transition: 0.5s;
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    display: flex;
    left: 0;
    top: 0;
}




.name {
    z-index: 100;
    opacity: 0;
    overflow: hidden;
    height: 40px;
    transition: all 0.25s;
    background-color: rgba(255, 255, 255, 0.25);
    left: 80px;
    top: 15px;
    width: 0;
    word-break: keep-all;
    line-height: 40px;
    font-size: 13px;
    border-radius: 20px;
    color: #fff;
    position: absolute;
    backdrop-filter: blur(5px);
}

.menuButton {
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    width: 70px;
    height: 70px;
    position: relative;
    line-height: 70px;
}

.menuButton span {
    font-size: 20px;
    color: #fff;
}

.menuButton:hover span {
    color: #000;
}

.menuButton:hover {
    background-color: #ebf1ff;
}

.menuButton:hover .name {
    opacity: 1;
    padding-left: 20px;
    padding-right: 20px;
    width: auto;
}

.selected:hover {
    background-color: #fff;
    color: #000;
}

.selected {
    transition: all 0.25s;
    background-color: #fff;
}

.selected span {
    color: #000;
}
</style>