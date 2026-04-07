<template>
    <div class="tinymce-wrapper">
        <Editor v-model="content" :init="initConfig" api-key="0m2qc3bl2lulorqw4hgnn2ui6fdbvrh8u846wqkugsemfnl9" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@tinymce/tinymce-vue'

// 编辑器内容
const content = ref('<p>开始编辑...</p>')

// 模拟上传（替换成你自己的接口）
const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    // TODO: 替换为你的后端接口
    // const res = await axios.post('/api/upload', formData)
    // return res.data.url

    // 本地预览
    return URL.createObjectURL(file)
}

const initConfig = {
    height: 1000,
    menubar: true,
    tinymceScriptSrc: '/tinymce/tinymce.min.js',
    plugins: [
        'image',
        'media',
        'table',
        'lists',
        'link',
        'code'
    ],

    toolbar:
        'undo redo | formatselect | bold italic underline | \
     alignleft aligncenter alignright | \
     bullist numlist | image media link | code',

    // 图片上传
    images_upload_handler: async (blobInfo, success, failure) => {
        try {
            const file = blobInfo.blob()
            const url = await uploadFile(file)
            success(url)
        } catch (e) {
            failure('图片上传失败')
        }
    },

    // 视频上传（通过 media 插件）
    file_picker_types: 'image media',
    file_picker_callback: async (callback, value, meta) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')

        if (meta.filetype === 'image') {
            input.setAttribute('accept', 'image/*')
        }
        if (meta.filetype === 'media') {
            input.setAttribute('accept', 'video/*')
        }

        input.onchange = async () => {
            const file = input.files[0]
            const url = await uploadFile(file)

            callback(url, {
                title: file.name
            })
        }

        input.click()
    }
}
</script>

<style scoped>
.tinymce-wrapper {
    border: 1px solid #ccc;
}
</style>
