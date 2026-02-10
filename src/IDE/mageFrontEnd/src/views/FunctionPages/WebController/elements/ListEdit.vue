<template>
    <div class="lineBlock">
        <div class="line">
            <div class="tip">请输入内容</div>
            <div class="label">栏目名称</div>
            <input type="text" v-model="editData.name">
        </div>
        <div class="line">
            <div class="tip">请输入内容</div>
            <div class="label">序列号</div>
            <input type="text" disabled="true" v-model="editData.id">
        </div>
    </div>
    <div class="lineBlock">
        <div class="line">
            <div class="tip">请输入内容</div>
            <div class="label">栏目名称</div>
            <input type="text" v-model="editData.name">
        </div>
        <div class="line">
            <div class="tip">请输入内容</div>
            <div class="label">序列号</div>
            <input type="text" disabled="true" v-model="editData.id">
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const editData = ref({})

const props = defineProps({
    data: Object
})

watch(
    () => props.data,
    (val) => {
        console.log(val);

        editData.value = val
    }
)

</script>

<style scoped>
.lineBlock {
    gap: 30px;
    display: flex;
}

.line {
    position: absolute;
    gap: 15px;
    line-height: 32px;
    display: flex;
}

.label {
    text-align: right;
    width: 75px;
    font-size: 16px;
    font-weight: 300;
}

input {
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, 0.5);
    height: 30px;
    border-radius: 5px;
    outline: none;
    text-indent: 10px;
    color: #666;
}

input:disabled {
    cursor: not-allowed;
}
</style>