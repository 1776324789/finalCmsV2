<template>
    <div class="line">
        <div class="index " style="width: 25px;text-align: left;font-weight: 300;color: #666;margin-left: 5px;">{{ index
        }}</div>
        <div class="blockLine" style="font-weight: 350;display: flex;text-indent: 5px;flex: 1;">
            <div class="topMark" v-if="data.top">置顶</div>
            {{ data.title }}
        </div>
        <div class="index blockLine" style="width: 130px;position: relative;text-align: left;text-indent: 15px;">
            {{ data.id }}
            <div class="copyIcon">
                <span class="icon-file-copy-line"></span>
            </div>
        </div>
        <div class="index blockLine" style="width: 180px;">{{ data.date }}</div>
        <div class="index blockLine" style="width: 75px;">{{ data.clicks || 0 }}</div>
        <div class="index blockLine" style="width: 115px;display: flex;">
            <CmsSwitch :label="['已置顶', '未置顶']" @change="changeHandel" v-model="data.top"
                style="margin-left: 10px;margin-top: 5px;">
            </CmsSwitch>
        </div>
        <div class="index blockLine" style="width: 115px;display: flex;">
            <CmsSwitch :label="['已发布', '未发布']" @change="changeHandel" v-model="data.publish"
                style="margin-left: 10px;margin-top: 5px;">
            </CmsSwitch>
        </div>

        <div class="menuBlock">
            <div class="lineButton addButton">
                <span class="icon-search-eye-line"></span>
            </div>
            <div class="lineButton editButton" @click="editHandel">
                <span class="icon-edit-2-line"></span>
            </div>
            <div class="lineButton delButton" @click="showDelBlock = true">
                <span class="icon-delete-bin-6-line"></span>
            </div>
            <div class="confirmBlock" v-bind:class="{ showConfirmBlock: showDelBlock }">
                <div class="deleteConfirm" @click="deleteHandel(data.id)">
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
const emit = defineEmits(["edit", "change"]);



function deleteHandel(id) {
    emit("delete", id)
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
.checkBox {
    cursor: pointer;
    border: 1px solid #666;
    background-color: #ccc;
    width: 35px;
    height: 10px;
    border-radius: 5px;
    line-height: 26px;
    margin-top: 13px;
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






.copyIcon {
    position: absolute;
    right: 15px;
    top: 0px;
    color: #666;
    cursor: pointer;
}

.copyIcon:hover span {
    color: #999;
}

.copyIcon span {
    font-size: 17px;
}

.topMark {
    margin-top: 9px;
    width: 40px;
    text-align: center;
    height: 23px;
    font-size: 10px;
    font-weight: 300;
    line-height: 23px;
    text-indent: 0;
    color: #fff;
    background-color: #ff5353;
    border-radius: 15px;
    margin-left: -10px;
}

.confirmBlock {
    position: absolute;
    right: -175px;
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

.addButton {
    position: relative;
}


.addButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "预览";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.addButton:hover::before {
    width: 100px;
    color: #666;
}

.contentButton {
    position: relative;
}

.contentButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "查看内容";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 17px;
    right: 39px;
}

.contentButton:hover::before {
    width: 100px;
    color: #666;
}



.editButton {
    position: relative;
}


.editButton::before {
    pointer-events: none;
    transition: all 0.5s;
    width: 0;
    overflow: hidden;
    content: "编辑内容";
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
    content: "删除内容";
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

.openArrow {
    transform: rotate(90deg);
}

.closeButton {
    transition: all 0.25s;
    cursor: pointer;
    width: 30px;
    height: 30px;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin-top: 5px;
    margin-left: -15px;
    margin-right: 10px;
}

.closeButton span {
    font-size: 26px;
}

.closeButton:hover {
    color: #000;
    background-color: #fff;
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

.bigLine {
    padding-left: 25px;
    padding-right: 25px;
    border-radius: 25px;
    height: 50px;
    line-height: 50px;
    background-color: rgba(255, 255, 255, 0.8);
}

.childBlock {
    margin-left: 15px;
    border-left: 1px solid #ffffff77;
    padding-left: 15px;
    transition: all 0.25s;
}
</style>
