<template>
    <div class="main" ref="main" :style="{ height: main?.parentNode.clientHeight + 'px' }">
        <div :id="editorId" style="display: flex;flex-direction: column;height: 100%;">
            <div :id="editorTool"></div>
            <div style="flex:1;border-radius: 15px;" class="scroll">
                <div :id="editorContent"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { uploadImage } from '@/request/file'

/** ✅ v-model 定义 */
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const editorId = ref((Date.now() + Math.floor(Math.random() * 10000)).toString(36))
const editorTool = ref((Date.now() + Math.floor(Math.random() * 10000)).toString(36))
const editorContent = ref((Date.now() + Math.floor(Math.random() * 10000)).toString(36))

const main = ref(null)
const editorRef = ref(null) // ✅ 保存 editor 实例

const progress = ref(0)

onMounted(() => {
    initRichEditor()
})

function initRichEditor() {
    if (document.getElementById(editorId.value) == null) {
        return setTimeout(initRichEditor, 100)
    }

    const { createEditor, createToolbar } = window.wangEditor

    const editorConfig = {
        placeholder: '请输入内容',
        html: props.modelValue, // ✅ 初始化内容
        onChange(editor) {
            const html = editor.getHtml()
            emit('update:modelValue', html) // ✅ 输出 HTML
        },
        MENU_CONF: {}
    }

    editorConfig.MENU_CONF['uploadImage'] = {
        async customUpload(file, insertFn) {
            const res = await upload(file)
            if (res.code == 200) {
                insertFn(res.data.url, res.data.filename, res.data.url)
            }
        },
    }

    const editor = createEditor({
        selector: "#" + editorContent.value,
        html: props.modelValue,
        config: editorConfig,
        mode: 'default',
    })

    editorRef.value = editor

    createToolbar({
        editor,
        selector: "#" + editorTool.value,
        mode: 'default',
    })
}

/** ✅ 监听外部变化 -> 同步编辑器 */
watch(
    () => props.modelValue,
    (val) => {
        if (editorRef.value) {
            const currentHtml = editorRef.value.getHtml()
            if (val !== currentHtml) {
                editorRef.value.setHtml(val || '')
            }
        }
    }
)

/** 上传 */
async function upload(file) {
    const formData = new FormData()
    formData.append('file', file)

    progress.value = 0

    const res = await uploadImage(formData, {
        onUploadProgress: (e) => {
            if (e.total) {
                progress.value = Math.round((e.loaded / e.total) * 100)
            }
        }
    })
    return res
}
</script>

<style scoped>
.main {}
</style>

<style>
.w-e-text-container .w-e-scroll {
    min-height: 500px !important;
}

.w-e-bar-item:last-child {
    display: none;
}

.w-e-toolbar {
    border-radius: 15px;
    margin-bottom: 10px;
    border: 1px solid #999;
    background-color: unset !important;
}

.w-e-text-container {
    border-radius: 15px;
}
</style>