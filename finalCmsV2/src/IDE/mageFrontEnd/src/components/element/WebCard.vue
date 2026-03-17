<template>
    <div class="webCard" @click="toIndexHandel" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"
        ref="cardRef" :style="cardStyle">
        <div class="title">{{ data.name }}</div>
        <div class="titleEn">website</div>
        <div class="link">zhaosheng.jxuspt.com</div>
        <div class="dot" :style="dotStyle"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/store'
const cardRef = ref(null)
const dataStore = useDataStore()
const emit = defineEmits(['toindex'])
// dot 的位置
const dotX = ref(200)
const dotY = ref(300)

// 卡片旋转角度
const rotateX = ref(0)
const rotateY = ref(0)
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
})

function toIndexHandel() {
    dataStore.targetSite = props.data
    emit('toindex')
}
document.addEventListener('wheel', (e) => {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    cardRef.value.style.opacity = 1 - (Math.abs(document.body.clientWidth / 2 - (rect.x + cardRef.value.clientWidth / 2)) / (document.body.clientWidth / 2))

    let scale = 1 - (Math.abs(document.body.clientWidth / 2 - (rect.x + cardRef.value.clientWidth / 2)) / (document.body.clientWidth / 2))
    if (scale < 0.25) scale = 0.25
    cardRef.value.style.scale = scale * 1.1
    cardRef.value.style.marginLeft = ((1 - scale) * -120) + 'px'
})

onMounted(() => {
    const rect = cardRef.value.getBoundingClientRect()
    cardRef.value.style.opacity = 1 - (Math.abs(document.body.clientWidth / 2 - (rect.x + cardRef.value.clientWidth / 2)) / (document.body.clientWidth / 2))
    let scale = 1 - (Math.abs(document.body.clientWidth / 2 - (rect.x + cardRef.value.clientWidth / 2)) / (document.body.clientWidth / 2))
    if (scale < 0.25) scale = 0.25
    cardRef.value.style.scale = scale * 1.1
    cardRef.value.style.marginLeft = ((1 - scale) * -120) + 'px'
})

function handleMouseMove(e) {
    const rect = cardRef.value.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    dotX.value = x
    dotY.value = y

    // 👉 计算中心点
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // 👉 映射旋转角度（数值可调，越大越夸张）
    rotateY.value = (x - centerX) / centerX * 16
    rotateX.value = -(y - centerY) / centerY * 16
}

function handleMouseLeave() {
    dotX.value = 300
    dotY.value = 400
    rotateX.value = 0
    rotateY.value = 0
}

// 光斑
const dotStyle = computed(() => ({
    transform: `translate(${dotX.value - 100}px, ${dotY.value - 100}px)`
}))

// 卡片 3D 变换
const cardStyle = computed(() => ({
    height: (cardRef.value?.getBoundingClientRect().x) || 500 + 'px',
    transform: `
        rotateX(${rotateX.value / 2}deg)
        rotateY(${rotateY.value / 2}deg)
    `
}))
</script>

<style scoped>
.titleEn {
    font-weight: 200;
}

.icon {
    font-size: 35px;
    font-weight: 100;
}

.link {
    position: absolute;
    bottom: 25px;
    font-weight: 200;
}

.title {
    display: flex;
    font-size: 30px;
    font-weight: 350;
}

.webCard {
    transition: background 0.5s;
    cursor: pointer;
    position: relative;
    width: 350px;
    height: 500px;
    flex-shrink: 0;
    padding: 25px;
    float: left;
    color: #fff;
    border-radius: 30px;
    border: 1px solid #fff;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(50px);
    /* 👇 关键 */
    transform-style: preserve-3d;
}

.webCard:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* 光斑 */
.dot {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    background: rgba(255, 255, 255, 0.9);
    /* transition: transform 0.3s; */
}
</style>
