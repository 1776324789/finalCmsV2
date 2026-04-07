<template>
    <input ref="main" class="cmsInput" :value="displayValue" :placeholder="placeholder" :disabled="disabled"
        :maxlength="maxlength" :type="inputType" @input="onInput" @change="onChange" @focus="onFocus" @blur="onBlur"
        @keyup.enter="onEnter" v-bind="$attrs">
</template>

<script setup>
import { ref, computed, onActivated, watch } from 'vue'

const props = defineProps({
    modelValue: [String, Number, Date],

    placeholder: String,
    disabled: Boolean,
    maxlength: Number,

    /** 类型：text / time / datetime / date */
    type: {
        type: String,
        default: 'text'
    },

    /** 时间格式 */
    format: String
})

const emit = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'enter'
])

const main = ref(null)

/** ✅ 是否时间类型 */
const isTimeType = computed(() => {
    return ['time', 'datetime', 'date', 'datetime-local'].includes(props.type)
})

/** ✅ 自动格式 */
const finalFormat = computed(() => {
    if (props.format) return props.format

    switch (props.type) {
        case 'date':
            return 'YYYY-MM-DD'
        case 'time':
            return 'HH:mm'
        case 'datetime':
            return 'YYYY-MM-DD HH:mm'
        default:
            return ''
    }
})

/** input 类型（浏览器 input 统一用 text） */
const inputType = computed(() => {
    return isTimeType.value ? 'text' : props.type
})

/** 时间格式化 */
function formatDate(value, format) {
    if (!value) return ''

    const date = new Date(value)
    if (isNaN(date.getTime())) return value

    const map = {
        YYYY: date.getFullYear(),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0')
    }

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, key => map[key])
}

/** 解析时间 */
function parseDate(value) {
    if (!value) return null
    const date = new Date(value.replace(/-/g, '/'))
    return isNaN(date.getTime()) ? null : date
}

/** 当前时间 */
function getNow() {
    return formatDate(new Date(), finalFormat.value)
}

/** 默认值逻辑 */
watch(
    () => props.modelValue,
    (val) => {
        if (isTimeType.value && !val) {
            emit('update:modelValue', getNow())
        }
    },
    { immediate: true }
)

/** 显示值 */
const displayValue = computed(() => {
    if (isTimeType.value && props.modelValue) {
        return formatDate(props.modelValue, finalFormat.value)
    }
    return props.modelValue ?? ''
})

/** 输入 */
function onInput(e) {
    let value = e.target.value

    if (isTimeType.value) {
        const date = parseDate(value)
        if (date) {
            value = formatDate(date, finalFormat.value)
        }
    }

    emit('update:modelValue', value)
    emit('input', value)
}

/** change */
function onChange(e) {
    emit('change', e.target.value)
}

/** focus */
function onFocus(e) {
    emit('focus', e)
}

/** blur */
function onBlur(e) {
    let value = e.target.value

    if (isTimeType.value) {
        const date = parseDate(value)
        if (date) {
            value = formatDate(date, finalFormat.value)
            emit('update:modelValue', value)
        }
    }

    emit('blur', e)
}

/** enter */
function onEnter(e) {
    emit('enter', e.target.value)
}

onActivated(() => {
    if (main.value && window.getComputedStyle(main.value).textAlign === "center") {
        main.value.style.textIndent = "unset"
    }
})
</script>

<style scoped>
.cmsInput {
    border: 1px solid #757575;
    background-color: rgba(235, 235, 235, 0.75);
    height: 30px;
    border-radius: 10px;
    outline: none;
    color: #666;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 0.2s;
}

.cmsInput:hover {
    border-color: #999;
}

.cmsInput:focus {
    border-color: #409eff;
    background-color: rgba(255, 255, 255, 0.9);
}

.cmsInput:disabled {
    border: 1px solid #cccccc;
    background-color: rgba(226, 226, 226, 0.75);
    cursor: not-allowed;
    color: #aaa;
}

.cmsInput::placeholder {
    color: #aaa;
}
</style>