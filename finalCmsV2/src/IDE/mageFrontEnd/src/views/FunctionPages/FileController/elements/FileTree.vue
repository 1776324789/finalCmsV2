<template>
    <div class="file-tree" :style="{ width: width + 'px' }">
        <div class="titleBlock">
            <div style="flex:1; overflow: hidden;margin-right: 15px;">
                {{ onEditFullPath }}
            </div>

            <div class="fullScreenButton" @click="fullScreenHandel">
                <!-- ✅ 响应式切换 -->
                <span class="icon-fullscreen-line" v-if="!isFullscreen"></span>
                <span class="icon-fullscreen-exit-line" v-else></span>
            </div>
        </div>

        <div class="treeBlock scroll">
            <template v-if="data != null">
                <TreeNode @delete="deleteNode" @showBackup="showBackup" :onEditFullPath="onEditFullPath"
                    @create="createHandel" @edit="edit" :node="data" />
            </template>
        </div>
        <Dialog v-model="showBackupData" :title="backupFullpath">
            <div class="historyMain">
                <div class="historyList">
                    <div class="historyItemBlock" v-for="item in historyList" :key="item.path"
                        :class="{ 'active': item.path == targetHistory?.path }" @click="showBackContent(item)">
                        <div style="flex:1;"> {{ item.name.replace(`.${item.name.split(".").pop()}`, "") }}</div>
                        <span style="margin-right: 10px;font-size: 12px;font-weight: 300;color: #ccc;"> {{
                            formatTime(item.name.split(".").pop() * 1)
                            || '-' }}</span>
                    </div>
                </div>
                <div class="contentBlock scroll">
                    <Prism language="markup" v-if="showPrism">{{ targetHistory.content || "请选择文件" }}</Prism>
                </div>
            </div>

        </Dialog>
    </div>
</template>

<script setup>
import TreeNode from './TreeNode.vue'
import { ref, onActivated, onMounted, onBeforeUnmount } from 'vue'
import { useSystemStore } from '@/store/systemStore'
import { getWebsiteFileList, createWebsiteFile, getWebsiteFileHistoryList, getWebsiteFileHistoryContent, deleteWebsiteFile } from '@/request/websiteFileManageApi.js'

import Prism from 'vue-prism-component'

// 核心
import 'prismjs'

// 👉 主题（选一个）
import 'prismjs/themes/prism-dark.min.css'
// import 'prismjs/themes/prism-tomorrow.css'

// 👉 语言（按需引入，减少体积）
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup' // html
import 'prismjs/components/prism-json'


const props = defineProps({
    onEditFullPath: {
        type: String,
        default: ""
    }
})
const data = ref(null)
const width = ref(300)

const emit = defineEmits(["edit", "fullScreen"])
const systemStore = useSystemStore()

// ✅ 改成响应式
const isFullscreen = ref(false)

const backupFullpath = ref("")
const showBackupData = ref(false)
const historyList = ref([])

async function deleteNode(fullPath) {
    const res = await deleteWebsiteFile({
        id: systemStore.targetSite.id,
        targetPath: fullPath,
    })
    if (res.code == 200) {
        toast.success("删除成功", 3000)
        initFileList()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}


function formatTime(ts) {
    const d = new Date(ts)

    const pad = n => n.toString().padStart(2, '0')

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}  `
        + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
const showPrism = ref(false)
const targetHistory = ref(null)
async function showBackContent(target) {
    showPrism.value = false
    if (target.content == null) {
        const res = await getWebsiteFileHistoryContent({
            targetPath: target.path,
        })
        if (res.code == 200) {
            target.content = res.data
        }
    }

    targetHistory.value = target
    setTimeout(() => {
        showPrism.value = true
    }, 10)
}


async function showBackup(e) {
    const res = await getWebsiteFileHistoryList({
        id: systemStore.targetSite.id,
        targetPath: e.fullPath,
    })

    if (res.code == 200) {
        if (res.data.length == 0) {
            toast.tip("该文件没有备份记录")
        } else {
            backupFullpath.value = e.fullPath
            showBackupData.value = true
            historyList.value = res.data
        }
    }

}

// ✅ 同步 fullscreen 状态
function updateFullscreenState() {
    isFullscreen.value = !!document.fullscreenElement
}

// 创建文件
async function createHandel(data) {
    const res = await createWebsiteFile({
        id: systemStore.targetSite.id,
        type: data.type,
        targetPath: data.path + "\\" + data.name,
    })
    if (res.code === 200) {
        toast.success("创建成功", 3000)
        initFileList()
    }
}
defineExpose({
    initFileList
})
// 点击按钮
function fullScreenHandel() {
    emit("fullScreen")
}

// 生命周期
onMounted(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState)
    updateFullscreenState()
})

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState)
})

// 激活
onActivated(() => {
    initFileList()
})

// 点击文件
function edit(node) {
    emit("edit", node)
}

// 排序
function sortTree(node) {
    if (!node || !node.children) return node

    node.children.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1
        }
        return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    })

    node.children.forEach(child => sortTree(child))

    return node
}

// 获取文件
async function initFileList() {
    if (!systemStore?.targetSite?.id) {
        return setTimeout(initFileList, 100)
    }

    const res = await getWebsiteFileList({
        id: systemStore.targetSite.id,
    })

    if (res.code === 200) {
        data.value = sortTree(res.data)
    }
}
</script>
<style>
:not(pre)>code[class*=language-],
pre[class*=language-] {
    background: #111 !important;
}

pre[class*=language-] {
    padding: 0 !important;
    margin: 0 !important;
    overflow: auto !important;
    border: 0 solid #7a6651 !important;
    border-radius: 0 !important;
    box-shadow: 0px 0px 0 #000 inset !important;
}

.language-markup {
    height: 100%;
    margin: 0 !important;
}



.language-markup::-webkit-scrollbar {
    width: 3px;
    height: 5px;
}

.language-markup::-webkit-scrollbar-track {
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;

}

.language-markup::-webkit-scrollbar-thumb {
    background-color: #bababa;
    opacity: 0.5;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}
</style>
<style scoped>
.active {
    background-color: #444;
}

.historyMain {
    display: flex;
    height: 100%;
    width: 75vw;
    height: 75vh;
}

.historyItemBlock {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    color: #fff;
    text-indent: 10px;
    font-size: 13px;
    display: flex;
}

.historyItemBlock:hover {
    background-color: #444;
}

.historyList {
    background-color: #333;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
}

.contentBlock {
    padding: 15px;
    flex: 1;
    background-color: #111;
}

.titleBlock {
    color: #fff;
    display: flex;
    height: 35px;
    line-height: 35px;
    padding-left: 15px;
    font-weight: 300;
    border-bottom: 1px solid #ddd;
}

.fullScreenButton {
    width: 35px;
    text-align: center;
    cursor: pointer;
}

.fullScreenButton:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.treeBlock {
    flex: 1;
}

.file-tree {
    position: relative;
    height: 100%;
    background-color: #222;
    font-family: monospace;
    font-size: 14px;
    overflow: auto;
    display: flex;
    flex-direction: column;
}
</style>