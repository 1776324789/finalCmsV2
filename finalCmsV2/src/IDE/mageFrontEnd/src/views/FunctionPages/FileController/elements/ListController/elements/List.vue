<template>
    <div class="line" @dblclick="openHandel">
        <div class="closeButton" @click="openHandel" v-if="data.children != null && data.children.length > 0"
            :class="{ openArrow: open }">
            <span class="icon-arrow-drop-right-line"></span>
        </div>

        <div class="blockLine" ref="lineName" style="font-weight: 350;flex:1;">
            {{ data.name }}
        </div>
        <div class="index blockLine" style="width: 125px;">{{ data.id }}
            <div class="copyIcon" @click="copyId">
                <span class="icon-file-copy-line"></span>
            </div>
        </div>
        <div class="menuBlock">
            <div class="lineButton addButton" @click="createChild(data.id)">
                <span class="icon-add-fill"></span>
            </div>
            <div class="lineButton contentButton" @click="editNodeHandel(data.id)">
                <span class="icon-function-fill"></span>
            </div>
            <div class="lineButton editButton" @click="editHandel(data)">
                <span class="icon-edit-2-line"></span>
            </div>
        </div>
    </div>

    <div v-if="data.children != null && data.children.length > 0 && open" class="childBlock">
        <List @change="changeHandel" @editNode="editNodeHandel" @delete="deleteHandel" @createChildList="createChild"
            v-for="(item, index) in data.children" :key="item.id || index" :data="item" @edit="editHandel" />
    </div>
</template>

<script setup>
import List from "./List.vue";
import { ref, watch } from "vue";

const props = defineProps({
    data: Object
});
const showDelBlock = ref(false)
const emit = defineEmits(["onopen", "onclose", "edit", "openall", "createChildList", "delete", "editNode", "change"]);

const lineName = ref(null);
// const childBlock = ref(null);
const open = ref(false);
const childList = ref([]);

function createChild(id) {
    emit("createChildList", id)
}

function changeHandel() {
    emit("change", props.data);
}

function editNodeHandel(id) {
    emit("editNode", id)
}

function deleteHandel(id) {
    emit("delete", id)
    showDelBlock.value = false
}
// ✅ 复制方法（带兼容）
async function copyId() {
    const text = props.data?.id
    if (!text) return

    try {
        // ✅ 现代浏览器
        await navigator.clipboard.writeText(text)
        toast?.success?.("已复制 ID")
    } catch (err) {
        // ❗降级方案（兼容旧浏览器）
        const textarea = document.createElement("textarea")
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)

        toast?.success?.("已复制 ID")
    }
}

// watch(
//     () => props.search,
//     () => {
//         if (!childBlock.value) return;
//         childBlock.value.style.height = open.value
//             ? childBlock.value.scrollHeight + "px"
//             : "0px";
//     },
//     { immediate: true }
// );


/* ===== 单层展开 / 收起 ===== */
function openHandel() {
    // if (!childBlock.value) return;

    // if (open.value) {
    //     childBlock.value.style.height = "0px";
    //     emit("onclose", childBlock.value.scrollHeight);
    // } else {
    //     childBlock.value.style.height = childBlock.value.scrollHeight + "px";
    //     emit("onopen", childBlock.value.scrollHeight);
    // }

    open.value = !open.value;
}

/* ===== 子节点高度联动 ===== */
// function childOpen(height) {
//     childBlock.value.style.height =
//         childBlock.value.scrollHeight + height + "px";
//     emit("onopen", height);
// }

// function childClose(height) {
//     childBlock.value.style.height =
//         childBlock.value.scrollHeight - height + "px";
//     emit("onclose", height);
// }

function editHandel(e) {
    emit("edit", e);
}

</script>


<style scoped>
.copyIcon {
    position: absolute;
    right: 7px;
    top: 0px;
    color: #666;
    cursor: pointer;
}

.copyIcon:hover span {
    color: #999;
}

.copyIcon span {
    font-size: 17px;
}

.confirmBlock {
    position: absolute;
    right: -175px;
    border-radius: 20px;
    width: 170px;
    height: 38px;
    border: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    transition: all 0.3s;
}

.showConfirmBlock {
    right: 0px;
}

.deleteConfirm {
    cursor: pointer;
    flex: 1;
    text-align: center;
    background-color: #ff5353;
    height: 30px;
    margin-top: 5px;
    margin-left: 5px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    color: #fff;
}

.deleteConfirm:hover {
    opacity: 0.75;
}

.cancelButton {
    cursor: pointer;
    flex: 1;
    text-align: center;
    background-color: #838383;
    height: 30px;
    margin-left: 10px;
    margin-top: 5px;
    margin-right: 5px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    color: #fff;
}

.cancelButton:hover {
    opacity: 0.75;
}

.menuBlock {
    position: relative;
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
    text-indent: 15px;
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
    margin-left: 15px;
    border-left: 1px solid #ffffff77;
    padding-left: 15px;
    transition: all 0.25s;
}
</style>
