<template>
    <div @click="change" style="display: flex;line-height: 30px;">
        <div v-if="label != null"
            style="flex:1;text-align: center;font-size: 14px;margin-right: 10px;font-weight: 300;">
            {{ modelValue ? label[0] : label[1] }}
        </div>

        <div class="checkBox" style="margin-right: 15px;" v-bind:class="{ 'checkBoxChecked': modelValue }">
            <span v-bind:class="{ 'icon-checkbox-circle-fill': modelValue, 'icon-close-circle-fill': !modelValue }">
            </span>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    modelValue: Boolean,
    label: Array
})
const emit = defineEmits(['update:modelValue'])
const change = () => {
    emit('update:modelValue', !props.modelValue)
    emit('change', !props.modelValue)
}
</script>

<style scoped>
.checkBox {
    cursor: pointer;
    border: 1px solid #666;
    background-color: #ccc;
    width: 35px;
    height: 10px;
    border-radius: 5px;
    line-height: 26px;
    margin-top: 10px;
    display: flex;
    position: relative;
}

.checkBox:hover {
    opacity: 0.75;
}

.checkBox span {
    position: absolute;
    transition: all 0.25s;
    top: -7px;
    left: -5px;
    color: #666;
    font-size: 25px;
}

.checkBoxChecked span {
    transition: all 0.25s;
    left: 15px;
    color: #3b5f47;
}

.checkBoxChecked {
    background-color: #b4c9bb;
}
</style>
