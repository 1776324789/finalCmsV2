<template>
    <div style="padding-top: 20px;padding-right: 30px;">
        <div class="lineBlock">
            <div class="line">
                <div class="tip">请输入内容</div>
                <div class="label require">栏目名称</div>
                <input type="text" placeholder="请输入内容" v-model="editData.name">
            </div>
            <div class="line">
                <div class="tip">请输入内容</div>
                <div class="label require">英文名称</div>
                <input type="text" placeholder="请输入内容" v-model="editData.enName">
            </div>
        </div>
        <div class="lineBlock">
            <div class="line">
                <div class="label">序列号</div>
                <input type="text" placeholder="请输入内容" disabled="true" v-model="editData.id">
            </div>
            <div class="line">
                <div class="label">序号</div>
                <input type="number" placeholder="请输入内容" v-model="editData.index" step="5">
            </div>
        </div>

        <div class="lineBlock">
            <div class="line">
                <div class="tip">列表页面路径</div>
                <div class="label">列表路径</div>
                <input type="text" placeholder="请输入内容" v-model="editData.template">
            </div>
            <div class="line">
                <div class="tip">请输入内容</div>
                <div class="label">内容路径</div>
                <input type="text" placeholder="请输入内容" v-model="editData.nodeTemplate">
            </div>
        </div>
        <div class="line">
            <div class="label">描述</div>
            <textarea ref="textareaRef" placeholder="请输入内容" style="width: 610px;" v-model="editData.info"
                @input="autoResize"></textarea>
        </div>
        <div class="line">
            <div class="label">封面图</div>
            <ImageUpload></ImageUpload>
        </div>
        <div class="line" style="flex-direction: column;">
            <div class="label">动态变量</div>
            <DynamicPropEdit></DynamicPropEdit>
        </div>
    </div>
    <!-- {{ editData }} -->
</template>

<script setup>
import ImageUpload from '@/components/element/ImageUpload.vue';
import { ref, watch, nextTick } from 'vue'
import DynamicPropEdit from './DynamicPropEdit.vue';
const textareaRef = ref(null)
const editData = ref({})

const props = defineProps({
    data: Object
})

watch(
    () => props.data,
    async (val) => {
        if (val == null) val = {}
        editData.value = val
        await nextTick()
        autoResize()
    },
    { immediate: true }
)

/** 自动调整高度 */
function autoResize() {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}
</script>

<style scoped>
textarea {
    resize: none;
    border-radius: 5px;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: rgba(255, 255, 255, 0.75);
    color: #666;
    min-width: 184px;
}

textarea::placeholder {
    color: #aaa;
}

.require {
    position: relative;
}

.require::before {
    left: 0px;
    color: red;
    font-size: 20px;
    position: absolute;
    content: "*";
}

.lineBlock {
    gap: 30px;
    display: flex;
}

.line {
    min-height: 40px;
    padding-bottom: 30px;
    position: relative;
    gap: 15px;
    line-height: 32px;
    display: flex;
}

.tip {
    font-size: 13px;
    margin-left: 90px;
    font-weight: 350;
    color: #ff4e4e;
    position: absolute;
    top: 35px;
}

.label {
    text-align: right;
    width: 75px;
    font-size: 16px;
    font-weight: 350;
}

.label::after {
    content: ":";
    margin-right: -5px;
}

input {
    min-width: 250px;
    border: 1px solid #ddd;
    background-color: rgba(255, 255, 255, 0.75);
    height: 30px;
    border-radius: 5px;
    outline: none;
    text-indent: 10px;
    color: #666;
}

input:disabled {
    background-color: rgba(255, 255, 255, 0.25);
    cursor: not-allowed;
    color: #999;
}

input::placeholder {
    color: #aaa;
}
</style>