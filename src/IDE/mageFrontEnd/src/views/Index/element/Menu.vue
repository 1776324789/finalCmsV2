<template>
    <img class="img" src="@/assets/imgs/index-bgc.jpg" alt=""></img>
    <div class="mainBlock scroll">

        <div class="mainMenuBlock">
            <div class="title">Final<br>CMS</div>
            <div style="flex:1;">
                <div class="menuBlock" v-for="item in data">
                    <div class="menuButton"
                        v-bind:class="{ 'selected': item == chose, 'parentButton': item.child != null }"
                        @click="handelMenuClick(item)">
                        <span class="icon-folder-lock-fill"></span>
                        <div class="name">
                            {{ item.name }}</div>
                    </div>
                    <div class="childMenuBlock" v-bind:class="{ 'childMenuBlockOpen': item.open }"
                        :style="'height:' + (item.open ? (item.child.length * 70 + (item.child.length - 1) * 10) + 'px;' : 0 + 'px;')"
                        v-if="item.child != null">
                        <div class="menuButton" v-for="child in item.child"
                            v-bind:class="{ 'selected': child == chose }" @click="handelMenuClick(child)">
                            <span class="icon-folder-lock-fill"></span>
                            <div class="name">
                                {{ child.name }}</div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="menuBlock">
                <menu-button></menu-button>
            </div>
        </div>
        <div class="contentBlock scroll">
            <slot></slot>
        </div>
    </div>

</template>
<script setup>
import { ref } from 'vue';
import MenuButton from './MenuButton.vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const data = ref([
    {
        name: "数据统计",
        url: 'webController'
    },
    { name: "栏目管理" },
    {
        name: "后台管理",
        open: false,
        child: [
            { name: "用户管理" },
            { name: "角色管理" },
            { name: "功能管理" }]
    },
    {
        name: "站点管理",
        open: false,
        child: [
            { name: "数据传输" },
            { name: "文件管理" }]
    }
])
const chose = ref(null)


function handelMenuClick(menu) {
    if (menu.child != null) {
        data.value.forEach(item => {
            if (item == menu) return
            if (item.child != null) item.open = false
        })
        menu.open = !menu.open
        return
    }
    chose.value = menu
    router.push("/" + menu.url)
}
</script>
<style scoped>
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
    border: 1px solid#e6a05f;
    margin-left: -1px;
    margin-top: -1px;
}

.contentBlock {
    border-radius: 50px;
    flex: 1;
    margin: 30px;
    display: flex;
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

.childMenuBlockOpen {
    margin-top: 10px;
    overflow: unset;
}

.mainMenuBlock {
    width: 70px;
    margin: 40px;
    display: flex;
    flex-direction: column;
}

.menuBlock {
    margin-bottom: 25px;
    padding: 3px;
    background-color: #fff;
    width: 70px;
    border-radius: 37px;
}

.mainBlock {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    display: flex;
    left: 0;
    top: 0;
    backdrop-filter: blur(100px);
}




.name {
    z-index: 100;
    opacity: 0;
    overflow: hidden;
    height: 40px;
    transition: all 0.25s;
    background-color: #ffffffd8;
    left: 80px;
    top: 15px;
    width: 0;
    word-break: keep-all;
    line-height: 40px;
    font-size: 13px;
    border-radius: 20px;
    color: #666;
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
    color: #9c755e;
}

.menuButton:hover {
    background-color: #fff4eb;
}

.menuButton:hover .name {
    opacity: 1;
    padding-left: 20px;
    padding-right: 20px;
    width: auto;
}

.selected:hover {
    background-color: #e6a05f;
    color: #fff;
}

.selected {
    transition: all 0.25s;
    background-color: #e6a05f;
}

.selected span {
    color: #fff;
}
</style>