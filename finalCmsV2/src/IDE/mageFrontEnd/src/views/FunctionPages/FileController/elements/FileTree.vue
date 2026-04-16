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
                <TreeNode :onEditFullPath="onEditFullPath" @create="createHandel" @edit="edit" :node="data" />
            </template>
        </div>
    </div>
</template>

<script setup>
import TreeNode from './TreeNode.vue'
import { ref, onActivated, onMounted, onBeforeUnmount } from 'vue'
import { useSystemStore } from '@/store/systemStore'
import { getWebsiteFileList, createWebsiteFile } from '@/request/websiteFileManageApi.js'
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
    console.log(res)
    if (res.code === 200) {
        toast.success("创建成功", 3000)
        initFileList()
    }
}

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

<style scoped>
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