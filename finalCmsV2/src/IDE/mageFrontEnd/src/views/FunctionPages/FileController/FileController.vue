<template>
    <div class="main" ref="main">
        <FileTree :onEditFullPath="targetFile?.fullPath" @edit="edit" @fullScreen="fullScreenHandel"></FileTree>

        <div class="contentBlock">

            <div :style="{ display: targetFile != null ? 'block' : 'none' }" ref="editorRef" class="editor"></div>
            <div :style="{ display: targetFile == null ? 'block' : 'none' }" class="emptyTipBlock">
                请选择文件
            </div>
        </div>

        <div class="listControllerPreviewBlock" :style="{ right: showListController ? '0' : '-540px' }">
            <div class="openArrowBlock" @click="showListControllerHandel">
                <span class="icon-arrow-drop-left-line" v-if="!showListController"></span>
                <span class="icon-arrow-drop-right-line" v-else></span>
            </div>

            <ListController ref="listController"></ListController>
        </div>
    </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import FileTree from './elements/FileTree.vue'
import ListController from './elements/ListController/ListController.vue'
import { getWebsiteFileEditContent, saveWebsiteFile } from '@/request/websiteFileManageApi.js'
import { useSystemStore } from '@/store/systemStore'

const systemStore = useSystemStore()

const showListController = ref(false)
const listController = ref(null)
const main = ref(null)

const editorRef = ref(null)
let editor = null

const targetFile = ref(null)
let isSettingValue = false

const langMap = {
    '.js': 'javascript',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.node': 'html'
}

// ✅ 获取语言
function getLanguage(filename) {
    const index = filename.lastIndexOf('.')
    if (index === -1) return 'plaintext'
    return langMap[filename.substring(index)] || 'plaintext'
}

// ✅ 全屏切换
function fullScreenHandel() {
    if (!document.fullscreenElement) {
        main.value.requestFullscreen()
    } else {
        document.exitFullscreen()
    }

    // 🔥 双保险重新布局
    setTimeout(relayoutEditor, 100)
}

// ✅ 控制右侧面板
function showListControllerHandel() {
    showListController.value = !showListController.value
    if (showListController.value) {
        nextTick(() => {
            listController.value.getWebsiteListData()
        })
    }
}

// ✅ 初始化
onMounted(() => {
    initEditor()
    initKeyListener()

    window.addEventListener('resize', relayoutEditor)
    document.addEventListener('fullscreenchange', relayoutEditor)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('resize', relayoutEditor)
    document.removeEventListener('fullscreenchange', relayoutEditor)
})

// ✅ 初始化编辑器
function initEditor() {
    if (!editorRef.value) {
        return setTimeout(initEditor, 100)
    }

    editor = monaco.editor.create(editorRef.value, {
        value: '',
        language: 'plaintext',
        theme: 'vs-dark',
        automaticLayout: false // ❗关闭自动，改为手动控制（更稳定）
    })

    editor.onDidChangeModelContent(() => {
        if (isSettingValue) return
        if (!targetFile.value) return

        const current = editor.getValue()

        targetFile.value.content = current
        targetFile.value.state =
            current === targetFile.value.originalContent
                ? 'saved'
                : 'changed'
    })
}

// ✅ 手动布局（核心修复）
function relayoutEditor() {
    if (!editor) return

    requestAnimationFrame(() => {
        try {
            editor.layout()
        } catch (e) {
            console.warn('layout error', e)
        }
    })
}

// ✅ Ctrl + S
function initKeyListener() {
    window.addEventListener('keydown', handleKeydown)
}

function handleKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveFile()
    }
}

// ✅ 保存
async function saveFile() {
    if (!targetFile.value) return

    const content = editor.getValue()

    const res = await saveWebsiteFile({
        target: targetFile.value.fullPath,
        id: systemStore?.targetSite?.id,
        content
    })

    if (res.code === 200) {
        toast.success("保存成功")
        targetFile.value.originalContent = content
        targetFile.value.state = 'saved'
    } else {
        toast.error(res.message)
    }
}

// ✅ 点击文件
async function edit(node) {
    if (node.type !== 'file') return

    targetFile.value = node

    if (node.content != null) {
        setEditorContent(node.content, node.language)
        return
    }

    const res = await getWebsiteFileEditContent({
        target: node.fullPath,
        id: systemStore?.targetSite?.id
    })

    if (res.code === 200) {
        const content = res.data || ''
        const language = getLanguage(node.name)

        node.content = content
        node.originalContent = content
        node.language = language
        node.state = 'saved'

        setEditorContent(content, language)
    } else {
        toast.error(res.message)
    }
}

// ✅ 设置内容
function setEditorContent(content, language) {
    isSettingValue = true

    editor.setValue(content)
    monaco.editor.setModelLanguage(editor.getModel(), language)

    isSettingValue = false

    // 🔥 关键：每次切换文件也重新布局
    setTimeout(relayoutEditor, 0)
}
</script>

<style scoped>
.emptyTipBlock {
    text-align: center;
    line-height: 300px;
    color: #fff;
    background-color: #121212;
    flex: 1;
    height: 100%;
}

.main {
    flex: 1;
    overflow: hidden;
    border-radius: 25px;
    margin: -25px;
    display: flex;
    position: relative;
}

/* 🔥 防止被挤压的关键 */
.contentBlock {
    flex: 1;
    min-width: 0;
    height: 100%;
}

.editor {
    height: 100%;
}

/* 右侧面板 */
.listControllerPreviewBlock {
    transition: all 0.3s ease-in-out;
    width: 500px;
    position: absolute;
    padding: 10px 20px;
    background-color: #b9b9b9a2;
    height: calc(100% - 20px);
    z-index: 100;
    border-radius: 25px;
    backdrop-filter: blur(10px);
}

.openArrowBlock {
    position: absolute;
    height: 100px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: -21px;
    background-color: #b9b9b9a2;
    border: 1px solid #efefef;
    border-right: none;
    border-radius: 15px 0 0 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.openArrowBlock span {
    font-size: 25px;
    color: #fff;
}
</style>