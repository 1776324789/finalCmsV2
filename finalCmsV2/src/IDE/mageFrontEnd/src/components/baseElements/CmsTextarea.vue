<template>
    <div class="textareaWrapper">
        <textarea ref="textareaRef" class="cmsTextarea scroll" :value="modelValue" :placeholder="placeholder"
            :disabled="disabled" :maxlength="maxlength" :rows="rows" @input="onInput" @change="onChange"
            @focus="onFocus" @blur="onBlur" v-bind="$attrs"></textarea>

        <!-- 字数统计 -->
        <div class="count" v-if="showCount">
            {{ modelValue?.length || 0 }}
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const textareaRef = ref()

const props = defineProps({
    modelValue: String,
    placeholder: String,
    disabled: Boolean,
    maxlength: Number,
    rows: {
        type: Number,
        default: 3
    },
    autosize: Boolean, // 自动高度
    showCount: Boolean // 字数统计
})

const emit = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur'
])

function onInput(e) {
    const value = e.target.value
    emit('update:modelValue', value)
    emit('input', value)

    if (props.autosize) resize()
}

function onChange(e) {
    emit('change', e.target.value)
}

function onFocus(e) {
    emit('focus', e)
}

function onBlur(e) {
    emit('blur', e)
}

/* 自动高度 */
function resize() {
    const el = textareaRef.value
    if (!el) return

    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

/* 外部修改时同步高度 */
watch(
    () => props.modelValue,
    () => {
        if (props.autosize) {
            nextTick(resize)
        }
    },
    { immediate: true }
)
</script>

<style scoped>
.textareaWrapper {
    position: relative;
    width: 100%;
}

.cmsTextarea {
    width: 100%;
    min-width: 250px;
    border: 1px solid #757575;
    background-color: rgba(235, 235, 235, 0.75);
    border-radius: 10px;
    outline: none;
    padding: 18px 10px;
    padding-left: 25px;
    padding-right: 25px;
    color: #666;
    resize: none;
    transition: all 0.2s;
    line-height: 1.5;
}

.scroll {
    user-select: none;
    overflow-y: auto;
}

.scroll::-webkit-scrollbar {
    width: 3px;
    height: 0px;

}

.scroll::-webkit-scrollbar-track {
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;

}

.scroll::-webkit-scrollbar-thumb {
    background-color: #bababa;
    opacity: 0.5;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}

/* hover */
.cmsTextarea:hover {
    border-color: #999;
}

/* focus */
.cmsTextarea:focus {
    border-color: #409eff;
    background-color: rgba(255, 255, 255, 0.9);
}

/* disabled */
.cmsTextarea:disabled {
    border: 1px solid #cccccc;
    background-color: rgba(226, 226, 226, 0.75);
    cursor: not-allowed;
    color: #aaa;
}

/* placeholder */
.cmsTextarea::placeholder {
    color: #aaa;
}

/* 字数统计 */
.count {
    position: absolute;
    right: -40px;
    bottom: 10px;
    font-size: 12px;
    color: #999;
}
</style>