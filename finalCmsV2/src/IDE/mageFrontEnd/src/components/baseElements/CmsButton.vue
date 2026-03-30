<template>
    <div class="baseButton" :class="{ 'disabled': disabled }" @click="handleClick">
        <div style="flex:1;"></div>
        <span v-if="icon" :class="icon" style="margin-right: 10px;font-size: 20px;"></span>
        <slot></slot>
        <div style="flex:1;"></div>
    </div>
</template>
<script setup>

const props = defineProps({
    icon: String,
    disabled: Boolean
})
const emit = defineEmits(['click'])
function handleClick() {
    if (props.disabled) return
    emit('click')
}
</script>
<style scoped>
.baseButton {
    border: 1px solid #000;
    border-radius: 20px;
    cursor: pointer;
    text-align: center;
    min-height: 30px;
    min-width: 100px;
    line-height: 30px;
    font-size: 14px;
    color: #000;
    display: flex;
}

.baseButton:hover {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.75);
}

.disabled {
    cursor: not-allowed;
    color: #8b8b8b;
    background-color: #f5f5f5;
    border: 1px solid #8b8b8b;
}

.disabled:hover {
    cursor: not-allowed;
    color: #8b8b8b;
    background-color: #f5f5f5;
    border: 1px solid #8b8b8b;
}
</style>