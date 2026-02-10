<template>
    <template v-if="checkSearch(data)">
        <div class="line" @dblclick="openHandel">
            <div class="closeButton" @click="openHandel" v-if="data.child != null" :class="{ openArrow: open }">
                <span class="icon-arrow-drop-right-line"></span>
            </div>

            <div class="blockLine" ref="lineName" :style="`width:${370 - lineName?.offsetLeft + 'px'};`"
                style="font-weight: 350;">
                {{ data.name }}
            </div>

            <div class="index blockLine">{{ data.index }}</div>
            <div class="index blockLine">{{ data.listId.length }}</div>
            <div class="index blockLine">{{ data.nodeId.length }}</div>
            <div class="index blockLine" style="width: 125px;">{{ data.id }}</div>

            <div class="index blockLine" style="flex:1;text-align:left;text-indent:25px;">
                {{ data.template || "--" }}
            </div>

            <div class="index blockLine" style="flex:1;text-align:left;text-indent:25px;">
                {{ data.nodeTemplate || "--" }}
            </div>

            <div class="menuBlock">
                <div class="lineButton addButton">
                    <span class="icon-add-fill"></span>
                </div>
                <div class="lineButton contentButton">
                    <span class="icon-function-fill"></span>
                </div>
                <div class="lineButton editButton" @click="editHandel(data)">
                    <span class="icon-edit-2-line"></span>
                </div>
                <div class="lineButton delButton">
                    <span class="icon-delete-bin-6-line"></span>
                </div>
            </div>
        </div>

        <div v-if="data.child != null" class="childBlock scroll" ref="childBlock">
            <List v-for="(item, index) in data.child" :key="item.id || index" :data="item" :search="search"
                @edit="editHandel" @onopen="childOpen" @onclose="childClose" @openall="openAllHandel"
                :ref="el => (childList[index] = el)" />
        </div>
    </template>
</template>

<script setup>
import List from "./List.vue";
import { ref, watch, nextTick } from "vue";

const props = defineProps({
    data: Object,
    search: String
});

const emit = defineEmits(["onopen", "onclose", "edit", "openall"]);

const lineName = ref(null);
const childBlock = ref(null);
const open = ref(false);
const childList = ref([]);

/* ===== 暴露给父级 ===== */
defineExpose({ openAll, closeAll });

/* ===== 搜索联动 ===== */
watch(
    () => props.search,
    () => {
        if (!childBlock.value) return;
        childBlock.value.style.height = open.value
            ? childBlock.value.scrollHeight + "px"
            : "0px";
    },
    { immediate: true }
);

/* ===== 搜索过滤 ===== */
function checkSearch(data) {
    if (!props.search) return true;

    if (data.name.includes(props.search)) return true;

    const loop = list =>
        list.some(item =>
            item.name.includes(props.search) ||
            (item.child && loop(item.child))
        );

    return Array.isArray(data.child) && loop(data.child);
}

/* =========================================================
   ⭐⭐⭐ 核心：openAll（从最底层向上展开）
   ========================================================= */
async function openAll() {
    if (props.data.child != null)
        childList.value.forEach(item => {
            item.openAll()
        })
    else emit('openall')
}

/* ===== 子级触发 openAll ===== */
function openAllHandel() {
    open.value = true
    childBlock.value.style.transition = 'unset'
    childBlock.value.style.height = "0px";
    childBlock.value.style.height = childBlock.value.scrollHeight + "px";
    emit('openall')
    childBlock.value.style.transition = 'all 0.3s'
}

/* =========================================================
   ⭐⭐⭐ 核心：openAll（从最底层向上展开）
   ========================================================= */
async function closeAll() {
    if (props.data.child != null) {
        childList.value.forEach(item => {
            item.closeAll()
        })
        open.value = false
        childBlock.value.style.height = "0px";
    }
}

/* ===== 单层展开 / 收起 ===== */
function openHandel() {
    if (!childBlock.value) return;

    if (open.value) {
        childBlock.value.style.height = "0px";
        emit("onclose", childBlock.value.scrollHeight);
    } else {
        childBlock.value.style.height = childBlock.value.scrollHeight + "px";
        emit("onopen", childBlock.value.scrollHeight);
    }

    open.value = !open.value;
}

/* ===== 子节点高度联动 ===== */
function childOpen(height) {
    childBlock.value.style.height =
        childBlock.value.scrollHeight + height + "px";
    emit("onopen", height);
}

function childClose(height) {
    childBlock.value.style.height =
        childBlock.value.scrollHeight - height + "px";
    emit("onclose", height);
}

function editHandel(e) {
    emit("edit", e);
}
</script>


<style scoped>
.menuBlock {
    margin-left: 15px;
    display: flex;
}

.lineButton {
    transition: all 0.25s;
    cursor: pointer;
    width: 30px;
    height: 30px;
    color: #666;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin-top: 5px;
    margin-right: 10px;
}

.lineButton:last-child {
    margin-right: 5px;
}

.lineButton:first-child {
    margin-left: 5px;
}

.lineButton span {
    font-size: 16px;
}

.lineButton:hover {
    color: #000;
    background-color: #fff;
}

.delButton {
    color: #ff4d4f;
}

.delButton:hover {
    color: #fff;
    background-color: #ff4d4f;
}

.addButton {
    position: relative;
}


.addButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "添加子列表";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.addButton:hover::before {
    width: 100px;
    color: #666;
}

.contentButton {
    position: relative;
}

.contentButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "查看内容";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.contentButton:hover::before {
    width: 100px;
    color: #666;
}



.editButton {
    position: relative;
}


.editButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "编辑栏目";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.editButton:hover::before {
    width: 100px;
    color: #666;
}


.delButton {
    position: relative;
}


.delButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "删除栏目";
    position: absolute;
    background-color: rgba(255, 97, 97, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.delButton:hover::before {
    width: 100px;
    color: #fff;
}




.blockLine {
    position: relative;
}

.index {
    font-size: 13px;
    font-weight: bold;
    color: #000;
    font-weight: 350;
    width: 70px;
    text-align: center;
}

.blockLine::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: calc(100% - 10px);
    margin-top: 5px;
    width: 2px;
    border-radius: 2px;
    background-color: #ffffffab;
}

.openArrow {
    transform: rotate(90deg);
}

.closeButton {
    transition: all 0.25s;
    cursor: pointer;
    width: 30px;
    height: 30px;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin-top: 5px;
    margin-left: -15px;
    margin-right: 10px;
}

.closeButton span {
    font-size: 26px;
}

.closeButton:hover {
    color: #000;
    background-color: #fff;
}

.line {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: rgba(255, 255, 255, 0.75);
    padding-left: 20px;
    border-radius: 20px;
    margin-bottom: 2px;
    font-size: 14px;
}

.line:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.bigLine {
    padding-left: 25px;
    padding-right: 25px;
    border-radius: 25px;
    height: 50px;
    line-height: 50px;
    background-color: rgba(255, 255, 255, 0.8);
}

.childBlock {
    height: 0;
    overflow-y: auto;
    margin-left: 15px;
    border-left: 1px solid #ffffff77;
    padding-left: 15px;
    transition: all 0.25s;
}
</style>
