<template>
    <div class="dynamicPropEdit">
        <!-- 表头 -->
        <div class="titleBlock">
            <div class="col comment">注释</div>
            <div class="col prop">变量名 (prop)</div>
            <div class="col value">值</div>
            <div class="col action">操作</div>
        </div>

        <!-- 行 -->
        <div v-for="(item, index) in list" :key="index" class="row">
            <input class="col comment" v-model="item.comment" placeholder="请输入内容" @input="emitChange" />
            <input class="col prop" v-model="item.prop" placeholder="请输入内容" @input="emitChange" />
            <input class="col value" v-model="item.value" placeholder="请输入内容" @input="emitChange" />
            <div class="col action">
                <span class="del" @click="remove(index)">删除</span>
            </div>
        </div>

        <!-- 操作 -->
        <div class="footer" @click="add">
            <span class="add">+ 添加变量</span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

/**
 * v-model 绑定
 */
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue'])

/**
 * 内部编辑用列表
 * [{ prop, comment, value }]
 */
const list = ref([])

/**
 * 外部 -> 内部（回显）
 */
watch(
    () => props.modelValue,
    (val) => {
        list.value = Object.entries(val || {}).map(([prop, data]) => ({
            prop,
            comment: data.comment ?? '',
            value: data.value ?? ''
        }))
        if (list.value.length === 0) {
            list.value.push({ prop: '', comment: '', value: '' })
        }
    },
    { immediate: true, deep: true }
)

/**
 * 内部 -> 外部
 */
function emitChange() {
    const result = {}
    list.value.forEach(item => {
        if (!item.prop) return
        result[item.prop] = {
            comment: item.comment,
            value: item.value
        }
    })
    emit('update:modelValue', result)
}

/** 新增 */
function add() {
    list.value.push({ prop: '', comment: '', value: '' })
}

/** 删除 */
function remove(index) {
    list.value.splice(index, 1)
    emitChange()
}
</script>

<style scoped>
.dynamicPropEdit {
    font-size: 13px;
    margin-left: 25px;
}

/* 表头 & 行 */
.titleBlock,
.row {
    display: flex;
    align-items: center;
}

.row input {
    margin-left: 5px;
    margin-right: 10px;
    border: 1px solid #ddd;
    background-color: rgba(255, 255, 255, 0.75);
    height: 35px;
    border-radius: 5px;
    outline: none;
    color: #666;
    outline: none;
    text-align: center;
}

.row input::placeholder {
    color: #aaa;
}

.titleBlock {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    font-weight: 400;
    margin-bottom: 6px;
    text-align: center;
}

.row {
    margin-bottom: 6px;
}

/* 列 */
.col {
    padding: 4px 6px;
    box-sizing: border-box;
    border-right: 1px solid #fff;
}

.col:last-child {
    border-right: none;
}

.comment {
    width: 30%;
}

.prop {
    width: 30%;
}

.value {
    width: 30%;
}

.action {
    width: 10%;
    text-align: center;
}


/* 操作 */
.del {
    color: #ff4d4f;
    cursor: pointer;
}
.del:hover{
    opacity: 0.75;
}
.add {
    cursor: pointer;
}

.footer {
    border: 1px solid #000;
    border-radius: 20px;
    cursor: pointer;
    text-align: center;
    margin-top: 8px;
    margin-left: 20%;
    margin-right: 20%;
    color: #000;
}

.footer:hover {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.75);
}
</style>
