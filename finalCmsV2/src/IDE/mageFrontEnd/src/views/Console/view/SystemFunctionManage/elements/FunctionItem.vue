<template>
    <div class="line">
        <div class="index " style="width: 25px;text-align: left;font-weight: 300;color: #666;margin-left: 5px;">{{ index
            }}</div>

        <div class="blockLine" style="font-weight: 350;display: flex;text-indent: 5px;flex: 1;">
            {{ data.name }}
        </div>
        <div class="index blockLine" style="width: 120px;">
            <span :class="data.icon" style="font-size: 18px;"></span>
        </div>
        <div class="index blockLine" style="width: 350px;">{{ data.target }}</div>
        <div class="index blockLine" style="width: 115px;display: flex;">
            <CmsSwitch :label="['启用', '停用']" @change="changeHandel" v-model="data.status"
                style="margin-left: 10px;margin-top: 5px;">
            </CmsSwitch>
        </div>
        <div class="index blockLine" style="width: 180px;">{{ data.createTime }}</div>
        <div class="index blockLine" style="width: 120px;">{{ data.createBy }}</div>

        <div class="menuBlock">
            <div class="lineButton editButton" @click="editHandel">
                <span class="icon-edit-2-line"></span>
            </div>
            <div class="lineButton delButton" @click="showDelBlock = true">
                <span class="icon-delete-bin-6-line"></span>
            </div>
            <div class="confirmBlock" v-bind:class="{ showConfirmBlock: showDelBlock }">
                <div class="deleteConfirm" @click="deleteHandel">
                    确认删除
                </div>
                <div class="cancelButton" @click="showDelBlock = false">
                    取消
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    data: Object,
    index: Number
});
const showDelBlock = ref(false)
const emit = defineEmits(["edit", "change", "delete"]);

function deleteHandel() {
    emit("delete", props.data.id)
    showDelBlock.value = false
}

function changeHandel() {
    emit("change", props.data);
}

function editHandel() {
    emit("edit", props.data);
}
</script>

<style scoped>
.confirmBlock {
    position: absolute;
    right: -170px;
    border-radius: 20px;
    width: 170px;
    height: 38px;
    border: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    transition: all 0.3s;
}

.showConfirmBlock {
    right: 0px;
}

.deleteConfirm {
    cursor: pointer;
    flex: 1;
    text-align: center;
    background-color: #ff5353;
    height: 30px;
    margin-top: 5px;
    margin-left: 5px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    color: #fff;
}

.deleteConfirm:hover {
    opacity: 0.75;
}

.cancelButton {
    cursor: pointer;
    flex: 1;
    text-align: center;
    background-color: #838383;
    height: 30px;
    margin-left: 10px;
    margin-top: 5px;
    margin-right: 5px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    color: #fff;
}

.cancelButton:hover {
    opacity: 0.75;
}

.menuBlock {
    width: 90px;
    position: relative;
    margin-left: 15px;
    display: flex;
}

.lineButton {
    transition: all 0.25s;
    cursor: pointer;
    width: 30px;
    height: 30px;
    color: #666;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin-top: 5px;
    margin-right: 10px;
}

.lineButton:last-child {
    margin-right: 5px;
}

.lineButton:first-child {
    margin-left: 5px;
}

.lineButton span {
    font-size: 16px;
}

.lineButton:hover {
    color: #000;
    background-color: #fff;
}

.delButton {
    color: #ff4d4f;
}

.delButton:hover {
    color: #fff;
    background-color: #ff4d4f;
}

.editButton {
    position: relative;
}

.editButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "编辑功能";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.editButton:hover::before {
    width: 100px;
    color: #666;
}

.delButton {
    position: relative;
}

.delButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "删除功能";
    position: absolute;
    background-color: rgba(255, 97, 97, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.delButton:hover::before {
    width: 100px;
    color: #fff;
}

.blockLine {
    position: relative;
}

.index {
    font-size: 13px;
    font-weight: bold;
    color: #000;
    font-weight: 350;
    width: 70px;
    text-align: center;
}

.blockLine::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: calc(100% - 10px);
    margin-top: 5px;
    width: 2px;
    border-radius: 2px;
    background-color: #ffffffab;
}

.line {
    overflow: hidden;
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: rgba(255, 255, 255, 0.75);
    padding-left: 20px;
    border-radius: 20px;
    margin-bottom: 2px;
    font-size: 14px;
}

.line:hover {
    background-color: rgba(255, 255, 255, 0.6);
}
</style>
