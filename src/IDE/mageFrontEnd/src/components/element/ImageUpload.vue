<template>
    <input ref="fileInputRef" type="file" accept="image/*" style="display: none" @change="handleFileChange" />
    <div v-if="!previewUrl" class="mainBlock" @click="triggerSelect">
        <span>+</span>
        <!-- 隐藏的文件选择器 -->
    </div>
    <div v-viewer>
        <img v-if="previewUrl" :src="previewUrl" class="preview" />
    </div>

    <div v-if="previewUrl">
        <div class="delButton" @click="clear">清除</div>
        <div class="reselect" @click="triggerSelect">重新选择</div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: Object
})



/** 原图（File / Blob） */
const originalImage = ref(null)

/** 压缩后的图片（Blob） */
const compressedImage = ref(null)

/** 预览用 */
const previewUrl = ref('')

const fileInputRef = ref(null)

watch(
    () => props.modelValue,
    (val) => {
        previewUrl.value = val?.previewUrl
    },
    { immediate: true } // 👈 初始化时也同步一次状态
)

/** 触发选择图片 */
function triggerSelect() {
    fileInputRef.value.click()
}
function clear() {
    fileInputRef.value.value = null
    originalImage.value = null
    compressedImage.value = null
    previewUrl.value = ''
}

/** 选择图片后处理 */
async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // 保存原图
    originalImage.value = file

    // 压缩图片
    compressedImage.value = await compressImage(file)

    // 生成预览
    previewUrl.value = URL.createObjectURL(file)

    // 你后面可以直接用：
    // originalImage.value
    // compressedImage.value
}

/** 图片压缩函数 */
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

            // 等比缩放
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
    border: 1px solid #000;
    height: 20px;
    font-size: 13px;
    font-weight: 350;
    line-height: 20px;
    color: #000;
}

.reselect:hover {
    background-color: #000;
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
    width: 100px;
    height: 100px;
    border: 3px solid #999;
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
    width: 106px;
    height: 106px;
    object-fit: cover;
}

.preview:hover {
    scale: 1.05;
}
</style>
