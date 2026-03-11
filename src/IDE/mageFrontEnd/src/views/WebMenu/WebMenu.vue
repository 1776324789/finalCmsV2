<template>
    <div class="BaseTopTitle" v-bind:class="{ leftIn: showWebMenu }">
        Web
        <span style="line-height: 50px;margin-left: -10px;margin-right: -10px;">|</span>
        全部站点
    </div>
    <div class="cardList" ref="cardListRef" @wheel.prevent="handleWheel">
        <div style=" width: calc(50vw - 200px);height: 400px;flex-shrink: 0;" class="number">共4个站点</div>
        <template v-for="web in dataStore.website" :key="item">
            <WebCard @toindex="toIndex" :data="web" />
        </template>
        <div style=" width: calc(50vw - 200px);height: 400px;flex-shrink: 0;"></div>
    </div>
    <div class="LogoutBlock" @click="showLogoutTip = true" v-bind:class="{ leftIn: showWebMenu }"><span
            class="icon-arrow-left-line"></span> Logout
        <div class="logoutTip" v-if="showLogoutTip" @click.stop>
            <div class="tip"> 确认退出登录?</div>
            <div class="logOutMenu">
                <div @click="showLogoutTip = false">取消</div>
                <div @click="logoutHandel">确认</div>
            </div>
        </div>
    </div>
    <Menu @logout="menuLogoutHandel" v-model="showIndex"></Menu>
</template>
<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useDataStore } from '@/store'
import WebCard from '@/components/element/WebCard.vue'
import Menu from '@/views/Index/Menu.vue'
const dataStore = useDataStore()
const showIndex = ref(false)
const showWebMenu = ref(false)
const cardListRef = ref(null)
const emit = defineEmits(['logout'])
const props = defineProps({ modelValue: Boolean })
const showLogoutTip = ref(false)
watch(
    () => props.modelValue,
    (val) => {
        if (val) {
            show()
        } else {
            close()
        }
    },
    { immediate: true } // 👈 初始化时也同步一次状态
)
function menuLogoutHandel() {
    show()
}
function toIndex() {
    close()
    setTimeout(() => {
        showIndex.value = true
    }, 200);
}

function logoutHandel() {
    showLogoutTip.value = false
    window.sessionStorage.removeItem("token")
    emit('logout')
}
// 横向滚动速度
let velocity = 0
let rafId = null

function handleWheel(e) {
    e.preventDefault()
    // 叠加速度，而不是直接滚
    velocity += e.deltaY * 0.06
}

function animate() {
    const el = cardListRef.value
    if (!el) return

    // 应用滚动
    el.scrollLeft += velocity

    // 摩擦衰减（越小越丝滑）
    velocity *= 0.85

    // 停止条件
    if (Math.abs(velocity) < 0.1) {
        velocity = 0
        rafId = null
        return
    }

    rafId = requestAnimationFrame(animate)
}

function show() {
    if (!cardListRef.value) return
    showWebMenu.value = true
    //触发卡片渲染，不能删除
    cardListRef.value.style.marginLeft = '0'
    let init = setInterval(() => {
        let event = new Event("wheel")
        document.dispatchEvent(event)
    })

    setTimeout(() => {
        clearInterval(init)
    }, 1000);
}

function close() {
    if (!cardListRef.value) return
    showWebMenu.value = false
    //触发卡片渲染，不能删除
    cardListRef.value.style.marginLeft = '100vw'
    let init = setInterval(() => {
        velocity -= 5
        let event = new Event("wheel")
        document.dispatchEvent(event)
    })

    setTimeout(() => {
        clearInterval(init)
    }, 1000);
}


onMounted(() => {

    const el = cardListRef.value
    if (!el) return

    el.addEventListener('wheel', handleWheel, { passive: false })

    // 启动动画循环
    const loop = () => {
        if (!rafId && velocity !== 0) {
            rafId = requestAnimationFrame(animate)
        }
        let event = new Event("wheel")
        document.dispatchEvent(event)
        requestAnimationFrame(loop)
    }
    loop()
})

onUnmounted(() => {
    cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.logoutTip {
    background-color: rgba(255, 255, 255, 0.15);
    position: absolute;
    backdrop-filter: blur(15px);
    padding: 10px 25px;
    border: 1px solid #fff;
    bottom: calc(100%);
    border-radius: 15px;
    display: flex;
    width: 150px;
    flex-direction: column;
    animation: 0.2s showTip linear forwards;
}

@keyframes showTip {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.logoutTip .tip {
    font-size: 14px;
}

.logoutTip .logOutMenu {
    display: flex;
    gap: 20px;
}

.logoutTip .logOutMenu div {
    font-size: 14px;
    flex: 1;
    text-align: center;
    border-radius: 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #fff;
    cursor: pointer;
}

.logoutTip .logOutMenu div:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.number {
    font-size: 30px;
    color: #fff;
    font-weight: 350;
    line-height: 500px;
    text-indent: 30vw;
}

.LogoutBlock {
    transition: all 0.5s;
    cursor: pointer;
    height: 55px;
    position: fixed;
    font-size: 20px;
    color: #fff;
    font-weight: 350;
    display: flex;
    left: -330px;
    bottom: calc((100vh - 800px) / 2);
    line-height: 55px;
    /* animation: 0.5s moveIn ease; */
}

.LogoutBlock span {
    margin-right: 15px;
    line-height: 60px;
}

.cardList {
    transition: 0.75s all;
    position: absolute;
    left: 0;
    right: 0;
    /* 👈 关键 */
    bottom: -200px;
    height: 900px;
    padding: 30px 40px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    margin-left: 100vw;
}




.cardList::-webkit-scrollbar {
    display: none;
    /* Chrome */
}

.BaseTopTitle {
    transition: all 0.5s;
    display: flex;
    position: fixed;
    color: #fff;
    font-weight: 350;
    font-size: 25px;
    border: 1px solid #fff;
    height: 55px;
    border-radius: 55px;
    line-height: 55px;
    width: 300px;
    text-indent: 25px;
    left: -330px;
    /* left: calc((100vh - 800px) / 2 * (100vw / 100vh)); */
    top: calc((100vh - 800px) / 2);
    backdrop-filter: blur(15px);

}

.leftIn {
    left: calc((100vh - 800px) / 2 * (100vw / 100vh));
}
</style>
