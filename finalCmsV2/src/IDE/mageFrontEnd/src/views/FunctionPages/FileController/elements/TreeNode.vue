<template>
    <div class="tree-node " v-if="!(node.fullPath.split('\\').length == 2 && node.fullPath.split('\\')[1] == 'data')">
        <div class="node-label" :class="{ 'edit': onEditFullPath == node.fullPath }" @click="toggle">
            <div style="flex:1;display: flex;">
                <span v-if="node.type === 'directory'" style="margin-right: 3px;">
                    {{ isOpen ? '📂' : '📁' }}
                </span>
                <span v-else style="margin-right: 3px;">📄</span>
                {{ node.name }}
                <span v-if="node.fullPath.split('\\').length == 2 && node.fullPath.split('\\')[1] == 'data'"
                    class="icon-error-warning-line fileWarn"></span>
            </div>
            <div v-if="node.state == 'changed'" class="changeMark"></div>
            <div class="addButton" v-if="node.type === 'directory'">
                <span class="icon-menu-fill"></span>
                <div class="addChildBlock" v-if="createType == null">
                    <div @click.stop="addChild('file')">添加文件</div>
                    <div @click.stop="addChild('directory')">添加文件夹</div>
                    <div @click.stop="deleteNode(node.fullPath)"
                        v-if="node.fullPath.split('\\').length > 1 && !(node.fullPath.split('\\')[1] == 'CmsComponent'&&node.fullPath.split('\\').length==2)">删除
                    </div>
                </div>
            </div>
            <div class="addButton" v-if="node.type === 'file'">
                <span class="icon-menu-fill"></span>
                <div class="addChildBlock" v-if="createType == null">
                    <div @click.stop="showBackup(node.fullPath)">查看备份</div>
                    <div @click.stop="createBackup">创建备份</div>
                    <div @click.stop="deleteNode(node.fullPath)">删除</div>
                </div>
            </div>
        </div>

        <div v-if="isOpen && node.children" class="children">
            <input @focus="onFocus" v-model="createName" @blur="onBlur" v-if="createType != null" ref="createInput"
                class="inputBlock" placeholder="请输入名称" />
            <TreeNode @delete="deleteNode" @showBackup="childShowBackup" :onEditFullPath="onEditFullPath"
                @create="createHandel" @edit="edit" v-for="(child, index) in node.children" :key="index"
                :node="child" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'
import { nextTick } from 'vue'
import { createWebsiteFileHistory } from '@/request/websiteFileManageApi'
import { useSystemStore } from '@/store/systemStore'

const systemStore = useSystemStore()

const editFile = ["txt", "html", "js", "css", "json", "node"]
const props = defineProps({
    node: Object,
    onEditFullPath: {
        type: String,
        default: ""
    }
})

const createInput = ref(null)
const createName = ref("")
const emit = defineEmits(["edit", "create", "showBackup", "delete"])
const isOpen = ref(localStorage.getItem(props.node.fullPath) === 'true')
const createType = ref(null)
function deleteNode(fullPath) {
    emit("delete", fullPath)
}

function childShowBackup(e) {
    emit("showBackup", e)
}

function showBackup(fullPath) {
    emit("showBackup", {
        fullPath: fullPath,
        handel: (e) => {

        }
    })
}

function addChild(type) {
    createType.value = type
    isOpen.value = true
    localStorage.setItem(props.node.fullPath, isOpen.value)
    nextTick(() => {
        createInput.value.focus()
    })
}

async function createBackup() {
    const res = await createWebsiteFileHistory({
        targetPath: props.node.fullPath,
        id: systemStore.targetSite.id,
    })
    if (res.code == 200) {
        toast.success("已创建备份")
        createType.value = "file"
        setTimeout(() => {
            createType.value = null
        }, 100);
    } else {
        toast.danger("创建备份失败:" + res.message)
    }
}

function onFocus() {
    createName.value = ""
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            createTargetHandel()
            createType.value = null
        }
    })
}

function onBlur() {
    createType.value = null
}

function createHandel(e) {
    emit("create", e)
}

function createTargetHandel() {
    if (createType.value == "file") {
        if (editFile.includes(createName.value.split(".")[1])) {
            emit("create", {
                path: props.node.fullPath,
                name: createName.value,
                type: createType.value
            })
        } else {
            toast.danger("仅可创建：txt、html、js、css、json、node", 3000)
        }
    } else {
        emit("create", {
            path: props.node.fullPath,
            name: createName.value,
            type: createType.value
        })
    }
}
function toggle() {
    if (props.node.type === 'directory') {
        isOpen.value = !isOpen.value
        localStorage.setItem(props.node.fullPath, isOpen.value)
    } else if (editFile.includes(props.node.name.split(".")[1])) {
        emit("edit", props.node)
    }
}
function edit(node) {
    emit("edit", node)
}
</script>

<style scoped>
.changeMark {
    width: 10px;
    height: 10px;
    background-color: #55aaff;
    border-radius: 50%;
    margin-left: 5px;
    margin-right: 15px;
    margin-top: 7px;
}

.inputBlock {
    margin-left: 15px;
    width: calc(100% - 35px);
    font-size: 12px;
    border: none;
    height: 20px;
    color: #fff;
    text-indent: 5px;
    background-color: #444;
}

.addButton {
    width: 30px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.addButton:hover {
    color: #55aaff;
    background-color: #353535;
}

.addButton:hover .addChildBlock {
    display: block;
}

.addChildBlock {
    display: none;
    color: #fff;
    position: absolute;
    width: 75px;
    right: 25px;
    padding: 5px;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    top: 0px;
    z-index: 100;
    background-color: #444;
}

.addChildBlock div {
    text-indent: 10px;
}

.addChildBlock div:hover {
    background-color: #555;
    color: #55aaff;
}

.tree-node {
    padding-left: 10px;
}

.fileWarn {
    margin-top: 1px;
    margin-left: 5px;
    font-size: 14px;
    position: relative;
}



.node-label {
    color: #fff;
    height: 25px;
    line-height: 25px;
    display: flex;
    cursor: pointer;
    user-select: none;
    font-size: 13px;
    font-weight: 300;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.node-label:hover {
    background-color: #333;
}

.children {
    padding-left: 16px;
    border-left: 1px solid #ddd;
}

.edit {
    background-color: #353535;
    color: #55aaff;
}
</style>