<template>
    <div class="main" ref="main">
        <FileTree ref="fileTree" :onEditFullPath="targetFile?.fullPath" @edit="edit" @fullScreen="fullScreenHandel">
        </FileTree>

        <div class="contentBlock scroll">
            <div v-show="targetFile != null" ref="editorRef" class="editor"></div>

            <div v-show="targetFile == null" class="emptyTipBlock">
                请选择文件
            </div>
        </div>

        <div class="listControllerPreviewBlock" :style="{ right: showListController ? '0' : '-540px' }">
            <div class="openArrowBlock" @click="showListControllerHandel">
                <span class="icon-arrow-drop-left-line" v-if="!showListController"></span>
                <span class="icon-arrow-drop-right-line" v-else></span>
            </div>

            <ListController @change="listChangeHandel" ref="listController"></ListController>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import FileTree from './elements/FileTree.vue'
import ListController from './elements/ListController/ListController.vue'
import { getWebsiteFileEditContent, saveWebsiteFile } from '@/request/websiteFileManageApi.js'
import { useSystemStore } from '@/store/systemStore'

// ✅ CodeMirror
import { EditorView, keymap } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { defaultKeymap } from "@codemirror/commands"
import { oneDark } from "@codemirror/theme-one-dark"

// ✅ 自动提示（核心）
import { autocompletion, startCompletion } from "@codemirror/autocomplete"

// 语言
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"

const systemStore = useSystemStore()

const showListController = ref(false)
const listController = ref(null)
const main = ref(null)
const fileTree = ref(null)

const editorRef = ref(null)
let editor = null

const targetFile = ref(null)
let isSettingValue = false

// ✅ 语言映射（增强JS）
const langMap = {
    '.js': () => javascript({ typescript: true }), // 🔥 提升智能提示
    '.json': json,
    '.html': html,
    '.css': css,
    '.node': html
}

function listChangeHandel() {
    fileTree.value.initFileList()
}

// ✅ 获取语言扩展
function getLanguageExt(filename) {
    const index = filename.lastIndexOf('.')
    if (index === -1) return []
    const ext = filename.substring(index)
    return langMap[ext] ? [langMap[ext]()] : []
}

// ✅ 公共扩展（不会被覆盖）
function getBaseExtensions() {
    return [
        keymap.of([
            ...defaultKeymap,
            {
                key: "Ctrl-Space",
                run: startCompletion // 🔥 手动触发提示
            }
        ]),
        oneDark,
        autocompletion({
            activateOnTyping: true // 🔥 输入自动触发
        })
    ]
}

// ✅ 初始化
onMounted(() => {
    initEditor()
    initKeyListener()
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})

// ✅ 初始化编辑器
function initEditor() {
    editor = new EditorView({
        state: EditorState.create({
            doc: '',
            extensions: getBaseExtensions()
        }),
        parent: editorRef.value
    })

    // 监听变化
    const originalDispatch = editor.dispatch
    editor.dispatch = (tr) => {
        originalDispatch.call(editor, tr)

        if (isSettingValue) return
        if (!targetFile.value) return

        if (tr.docChanged) {
            const current = editor.state.doc.toString()

            targetFile.value.content = current
            targetFile.value.state =
                current === targetFile.value.originalContent
                    ? 'saved'
                    : 'changed'
        }
    }
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

    const content = editor.state.doc.toString()

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
        setEditorContent(node.content, node.name)
        return
    }

    const res = await getWebsiteFileEditContent({
        target: node.fullPath,
        id: systemStore?.targetSite?.id
    })

    if (res.code === 200) {
        const content = res.data || ''

        node.content = content
        node.originalContent = content
        node.state = 'saved'

        setEditorContent(content, node.name)
    } else {
        toast.error(res.message)
    }
}

// ✅ 设置内容（关键修复点）
function setEditorContent(content, filename) {
    isSettingValue = true

    editor.setState(EditorState.create({
        doc: content,
        extensions: [
            ...getBaseExtensions(), // ✅ 不再丢失自动提示
            ...getLanguageExt(filename)
        ]
    }))

    isSettingValue = false
}

// ✅ UI控制
function fullScreenHandel() {
    if (!document.fullscreenElement) {
        main.value.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function showListControllerHandel() {
    showListController.value = !showListController.value
    if (showListController.value) {
        nextTick(() => {
            listController.value.getWebsiteListData()
        })
    }
}
</script>
<style>
.cm-editor {
    height: 100% !important;
}


.cm-editor {
    overflow-y: auto;
}

.cm-editor ::-webkit-scrollbar {
    width: 3px;
    height: 5px;
}

.cm-editor ::-webkit-scrollbar-track {
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;

}

.cm-editor ::-webkit-scrollbar-thumb {
    background-color: #bababa;
    opacity: 0.5;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}
</style>
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

.contentBlock {
    flex: 1;
    min-width: 0;
    height: 100%;
}

.editor {
    height: 100%;
}

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