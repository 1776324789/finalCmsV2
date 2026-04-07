<template>
    <div class="mainMenuBlock" v-bind:class="{ leftIn: show }">

        <div class="title">Final<br>CMS</div>
       
        <div style="flex:1;">
            <div class="menuBlock" v-for="item in systemStore.targetSite?.menu || []">
                <div class="menuButton" v-bind:class="{
                    'parentButton': item.children != null,
                    'parentSelected': (item.children != null && item.children.filter(children => children.target == target).length == 1),
                    'selected': '/' + item.target == router.currentRoute.value.path
                }" @click="handelMenuClick(item)">
                    <span :class="item.icon"></span>
                    <div class="name">
                        {{ item.name }}
                    </div>
                </div>
                <div class="childrenMenuBlock" v-bind:class="{ 'childrenMenuBlockOpen': item.open }"
                    :style="'height:' + (item.open ? (item.children.length * 70 + (item.children.length - 1) * 10) + 'px;' : 0 + 'px;')"
                    v-if="item.children != null">
                    <template v-for="children in item.children">
                        <div v-bind:class="{
                            'selected': children.target == target
                        }" class="menuButton" @click="handelMenuClick(children)">
                            <span :class="children.icon"></span>
                            <div class="name">{{ children.name }}</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="bottomButton" @click="logoutHandel">
            EXIT
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { useSystemStore } from '@/store/systemStore';
import { useRouter } from 'vue-router'
const router = useRouter()
const systemStore = useSystemStore()
const props = defineProps({ modelValue: Boolean })
const show = ref(true)
const emit = defineEmits(['logout', 'update:modelValue', 'change'])
const target = ref(null)
watch(
    () => props.modelValue,
    (val) => {
        show.value = val
    },
    { immediate: true } // 👈 初始化时也同步一次状态
)

function logoutHandel() {
    router.push('/')
    emit('update:modelValue', false)
    emit('logout')
}

onMounted(() => {
    systemStore.addEvent('setTargetSite', (target) => {
        if (target.menu[0]?.target)
            emit('change', target.menu[0]?.target)
    })
})

function handelMenuClick(menu) {
    if (menu.children != null) {
        systemStore.targetSite.menu.forEach(item => {
            if (item == menu) return
            if (item.children != null) item.open = false
        })
        menu.open = !menu.open
        return
    }
    target.value = menu.target
    localStorage.setItem(systemStore.targetSite.id + "_path", menu.target)
    emit('change', menu.target)
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



.parentButton {
    border: 1px solid#fff;
    margin-left: -1px;
    margin-top: -1px;
}






.title {
    margin-bottom: 20px;
    font-weight: 300px;
    text-align: center;
    color: #fff;
}

.childrenMenuBlock {
    transition: all 0.25s;
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
}


.childrenMenuBlockOpen {
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

/* .mainMenuBlock:hover {
    width: 170px;
} */

.mainMenuBlock:hover .menuButton .name {
    opacity: 1;
    padding-left: 20px;
    padding-right: 20px;
    width: auto;
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
    background-color: rgba(104, 104, 104, 0.693);
    left: 80px;
    top: 15px;
    width: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    word-break: keep-all;
    line-height: 40px;
    font-size: 13px;
    border-radius: 20px;
    color: #fff;
    position: absolute;
    backdrop-filter: blur(15px);
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
    animation: selectedAni 0.25s ease;
}

.parentSelected {
    animation: selectedAni 0.25s ease;
    background-color: rgba(255, 255, 255, 0.75);
}

.selected span {
    color: #000;
}

@keyframes selectedAni {
    0% {
        scale: 1;
    }

    50% {
        scale: 1.15;
    }

    100% {
        scale: 1;
    }
}
</style>