<template>
    <div ref="targetElement">
        <slot></slot>
    </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, ref } from 'vue'
const scrollTopBeforeLeave = ref(0) // 离开前的滚动位置
const active = ref(false)
const targetElement = ref(null)
active.value = true

const props = defineProps({
    target: {
        type: String,
        default: "default",
    }
})

// 定义 emit 方法
const emit = defineEmits(['more']);

onMounted(() => {
    if (props.target == "window") {
        targetElement.value = window
    }
    // 添加一个事件监听器，监听页面滚动事件
    targetElement.value.addEventListener('scroll', () => {
        if (!active.value) return;
        if (targetElement.value == null) return
        let scroll = targetElement.value.scrollY || targetElement.value.scrollTop
        if (scroll != 0)
            scrollTopBeforeLeave.value = scroll; // 记录离开前的滚动位置
        const { scrollTop, scrollHeight, clientHeight } = targetElement.value;
        // 当页面滚动到底部差100px时
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            emit('more')
        }
    });
})

onActivated(() => {
    if (scrollTopBeforeLeave.value > 0) {
        setTimeout(() => {
            targetElement.value.scrollTo(0, scrollTopBeforeLeave.value); // 恢复滚动位置   
        }, 50);
    }
    active.value = true
})

onDeactivated(() => {
    active.value = false
})


</script>
