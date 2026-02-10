<template>
    <Teleport to="body">
        <div class="dialog" v-bind:class="{ show: show, close: !show }" :style="`z-index:${getMaxZIndex() + 1};`">
            <div class="titleBlock">
                <div class="title">{{ title }}</div>
                <div class="closeButton" @click="close()">
                    <span class="icon-close-line"></span>
                </div>
            </div>
            <div class="contentBlock scroll">
                <slot></slot>
            </div>
        </div>
        <div @click="close" class="cover" v-bind:class="{ showCover: show }" :style="`z-index:${getMaxZIndex()};`">
        </div>
    </Teleport>
</template>
<script setup>
import { ref, watch } from 'vue'

const show = ref(false)
const props = defineProps({
    modelValue: Boolean,
    title: String
})

const emit = defineEmits(['close', 'show', 'update:modelValue'])

function close() {
    emit('update:modelValue', false)
    emit('close')
}

watch(
    () => props.modelValue,
    (val) => {
        show.value = val
        if (show.value) emit('show')
    },
    { immediate: true } // 👈 初始化时也同步一次状态
)

function getMaxZIndex() {
    let maxZIndex = 0; // 初始化最大zIndex为0
    const elements = document.querySelectorAll('*'); // 选择页面中的所有元素

    elements.forEach((element) => {
        const zIndex = window.getComputedStyle(element).zIndex; // 获取元素的z-index样式

        if (!isNaN(zIndex)) { // 检查z-index是否为有效数字
            maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10)); // 更新最大zIndex
        }
    });
    return maxZIndex + 1;
}

</script>
<style scoped>
.cover {
    transition: all 0.5s;
    pointer-events: none;
    transition: 0.3s all;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
}

.showCover {
    pointer-events: auto;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.25);
}

.contentBlock {
    flex: 1;
}

.dialog {
    min-height: 300px;
    position: fixed;
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    padding: 25px;
    max-height: 80vh;
    max-width: 90vw;
    border-radius: 25px;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(25px);
    border: 1px solid #fff;
}

.show {
    opacity: 1;
    bottom: 50%;
    right: 50%;
    scale: 1;
    transform: translate(50%, 50%);
}

.close {
    opacity: 0;
    scale: 0;
    right: -20%;
    bottom: -30%;
}

.titleBlock {
    margin-top: -10px;
    display: flex;
    height: 50px;
    line-height: 50px;
}

.title {
    flex: 1;
    min-width: 300px;
}

.closeButton {
    text-align: center;
    width: 30px;
    line-height: 50px;
    cursor: pointer;
}

.closeButton:hover span {

    color: #666;
    font-size: 30px;
}

.closeButton span {
    transition: all 0.3s;
    cursor: pointer;
    font-size: 25px;
    font-weight: 350;
}
</style>