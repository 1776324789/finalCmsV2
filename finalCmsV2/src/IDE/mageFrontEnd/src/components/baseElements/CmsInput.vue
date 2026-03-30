<template>
    <input ref="main" class="cmsInput" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
        :maxlength="maxlength" :type="type" @input="onInput" @change="onChange" @focus="onFocus" @blur="onBlur"
        @keyup.enter="onEnter" v-bind="$attrs">
</template>

<script setup>
import { onActivated, ref } from 'vue'

const props = defineProps({
    modelValue: [String, Number],

    placeholder: String,
    disabled: Boolean,
    maxlength: Number,
    type: {
        type: String,
        default: 'text'
    }
})

const main = ref(null)

const emit = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'enter'
])

onActivated(() => {
    if (window.getComputedStyle(main.value).textAlign == "center") {
        main.value.style.textIndent = "unset"
    }
})

function onInput(e) {
    const value = e.target.value
    emit('update:modelValue', value)
    emit('input', value)
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

function onEnter(e) {
    emit('enter', e.target.value)
}
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

/* hover */
.cmsInput:hover {
    border-color: #999;
}

/* focus */
.cmsInput:focus {
    border-color: #409eff;
    background-color: rgba(255, 255, 255, 0.9);
}

/* disabled */
.cmsInput:disabled {
    border: 1px solid #cccccc;
    background-color: rgba(226, 226, 226, 0.75);
    cursor: not-allowed;
    color: #aaa;
}

/* placeholder */
.cmsInput::placeholder {
    color: #aaa;
}
</style>