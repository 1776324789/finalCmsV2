<template>
    <input ref="fileInputRef" type="file" style="display: none" @change="handleFileChange" />
    <!-- 选择按钮 -->
    <div v-if="!fileInfo" class="mainBlock" @click="triggerSelect">
        <span>上传附件</span>
    </div>

    <!-- 文件展示 -->
    <div v-if="fileInfo" class="fileBox">
        <div>
            <div class="fileName">{{ fileInfo.filename }}</div>
            <div class="fileSize">{{ formatSize(fileInfo.size) }}</div>
        </div>

    </div>
    <div style="display: flex;flex-direction: column;">
        <div style="flex:1;"></div>
        <div class="actions" v-if="fileInfo">
            <a :href="fileInfo.url" target="_blank" class="download">下载</a>
            <span @click="triggerSelect" class="select">重新选择</span>
            <span @click="clear" class="delete">删除</span>
        </div>
    </div>
    <!-- 进度 -->
    <div v-if="uploading" class="progress">
        上传中 {{ progress }}%
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { uploadFile } from '@/request/file'

const props = defineProps({
    modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const fileInputRef = ref(null)

const fileInfo = ref(null)
const uploading = ref(false)
const progress = ref(0)

/** 同步外部值 */
watch(
    () => props.modelValue,
    (val) => {
        fileInfo.value = val || null
    },
    { immediate: true }
)

/** 选择文件 */
function triggerSelect() {
    fileInputRef.value.click()
}

/** 清除 */
function clear() {
    fileInputRef.value.value = null
    fileInfo.value = null
    progress.value = 0
    uploading.value = false

    emit('update:modelValue', null)
}

/** 上传 */
async function upload(file) {
    const formData = new FormData()
    formData.append('file', file)

    uploading.value = true
    progress.value = 0

    try {
        const res = await uploadFile(formData, {
            onUploadProgress: (e) => {
                if (e.total) {
                    progress.value = Math.round((e.loaded / e.total) * 100)
                }
            }
        })

        uploading.value = false

        if (res.code === 200) {
            fileInfo.value = res.data
            emit('update:modelValue', res.data)
        }
    } catch (err) {
        uploading.value = false
        console.error(err)
    }
}

/** 文件选择 */
function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    upload(file)
}

/** 文件大小格式化 */
function formatSize(size) {
    if (!size) return '0B'
    if (size < 1024) return size + 'B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB'
    return (size / 1024 / 1024).toFixed(1) + 'MB'
}
</script>

<style scoped>
.download {
    display: block;
    border: 1px solid #409eff;
    width: 75px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    text-decoration: none;
    color: #409eff;
}

.download:hover {
    background-color: #409eff;
    color: #fff;
}

.delete {
    cursor: pointer;
    display: block;
    border: 1px solid #ff4949;
    width: 75px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    text-decoration: none;
    color: #ff4949;
}

.delete:hover {
    background-color: #ff4949;
    color: #fff;
}

.select {
    cursor: pointer;
    display: block;
    border: 1px solid #333;
    width: 75px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    text-decoration: none;
    color: #333;
}

.select:hover {
    background-color: #333;
    color: #fff;
}



.mainBlock {
    width: 120px;
    height: 40px;
    border: 1px solid #999;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    color: #999;
    font-size: 14px;
}

.mainBlock:hover {
    border: 1px solid #333;
    color: #333;
}

.fileBox {
    border: 1px solid #999;
    padding: 10px;
    border-radius: 6px;
    width: 250px;
}

.fileName {
    font-size: 14px;
    font-weight: 300;
    word-break: break-all;
}

.fileSize {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.actions {
    margin-top: 8px;
    display: flex;
    gap: 10px;
    font-size: 12px;
}


.progress {
    margin-top: 5px;
    font-size: 12px;
}
</style>