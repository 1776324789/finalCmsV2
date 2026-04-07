<template>
    <input ref="fileInputRef" type="file" accept="image/*" style="display: none" @change="handleFileChange" />

    <!-- 选择区域 -->
    <div v-if="!previewUrl" class="mainBlock" @click="triggerSelect">
        <span>+</span>
    </div>

    <!-- 预览 -->
    <div v-viewer>
        <img v-if="previewUrl" :src="previewUrl" class="preview" />
    </div>

    <!-- 上传进度 -->
    <div v-if="uploading" class="progress">
        上传中 {{ progress }}%
    </div>

    <!-- 操作 -->
    <div v-if="previewUrl">
        <div class="delButton" @click="clear">清除</div>
        <div class="reselect" @click="triggerSelect">重新选择</div>
    </div>
</template>

<script setup>
import { uploadImage } from '@/request/file'
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const originalImage = ref(null)
const compressedImage = ref(null)
const previewUrl = ref('')
const fileInputRef = ref(null)

const uploading = ref(false)
const progress = ref(0)

/** 同步外部值 */
watch(
    () => props.modelValue,
    (val) => {
        previewUrl.value = val?.url || ''
    },
    { immediate: true }
)

/** 触发选择 */
function triggerSelect() {
    fileInputRef.value.click()
}

/** 清除 */
function clear() {
    fileInputRef.value.value = null
    originalImage.value = null
    compressedImage.value = null
    previewUrl.value = ''
    progress.value = 0
    uploading.value = false

    emit('update:modelValue', null)
}

/** 上传 */
async function upload() {
    const formData = new FormData()
    formData.append('file', originalImage.value)
    // 为cover文件添加正确的文件名和扩展名
    const originalExt = originalImage.value.name.split('.').pop()
    const coverName = `cover_${Date.now()}.${originalExt}`
    formData.append('cover', compressedImage.value, coverName)

    uploading.value = true
    progress.value = 0

    try {
        const res = await uploadImage(formData, {
            onUploadProgress: (e) => {
                if (e.total) {
                    progress.value = Math.round((e.loaded / e.total) * 100)
                }
            }
        })
        console.log(res)
        uploading.value = false

        if (res.code === 200) {
            emit('update:modelValue', res.data)
        } else {
        }
    } catch (err) {
        uploading.value = false
        console.error(err)
    }
}

/** 选择文件 */
async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    originalImage.value = file
    compressedImage.value = await compressImage(file)

    previewUrl.value = URL.createObjectURL(file)

    // 自动上传
    upload()
}

/** 压缩图片 */
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.src = e.target.result
        }

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            let { width, height } = img

            if (width > maxWidth) {
                height = (maxWidth / width) * height
                width = maxWidth
            }

            canvas.width = width
            canvas.height = height

            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    resolve(blob)
                },
                'image/jpeg',
                quality
            )
        }

        reader.readAsDataURL(file)
    })
}
</script>

<style scoped>
.reselect {
    cursor: pointer;
    margin-top: 10px;
    text-align: center;
    padding: 4px 25px;
    border-radius: 10px;
    border: 1px solid #333;
    height: 20px;
    font-size: 13px;
    font-weight: 350;
    line-height: 20px;
    color: #333;
}

.reselect:hover {
    background-color: #333;
    color: #fff;
}

.delButton {
    color: #ff2e2e;
    cursor: pointer;
    margin-top: 35px;
    text-align: center;
    padding: 4px 25px;
    border-radius: 10px;
    border: 1px solid #ff2e2e;
    height: 20px;
    font-size: 13px;
    font-weight: 350;
    line-height: 20px;
}

.delButton:hover {
    background-color: #ff2e2e;
    color: #fff;
}

.mainBlock {
    width: 104px;
    height: 104px;
    border: 1px solid #999;
    border-radius: 5px;
    cursor: pointer;
    color: #999;
    font-size: 50px;
    line-height: 95px;
    text-align: center;
    overflow: hidden;
}

.mainBlock:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.preview {
    transition: all 0.3s;
    cursor: pointer;
    border-radius: 3px;
    width: 97px;
    height: 97px;
    object-fit: cover;
}
</style>