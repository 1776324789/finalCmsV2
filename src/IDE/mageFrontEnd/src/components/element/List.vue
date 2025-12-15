<template>
  <div class="line">
    <div class="closeButton " @click="openHandel" v-if="data.child != null" :class="{ 'openArrow': open }">
      <span class="icon-arrow-drop-right-line "></span>
    </div>
    <div class="blockLine" ref="lineName" style="font-weight: 300;">
      {{ data.name }}
    </div>
    <div class="index blockLine">{{ data.index }}</div>
    <div class="index blockLine">{{ data.listId.length }}</div>
    <div class="index blockLine">{{ data.nodeId.length }}</div>
    <div class="index blockLine" style="width: 125px;">{{ data.id }}</div>
    <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">
      {{ data.template || "--" }}
    </div>
    <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">
      {{ data.nodeTemplate || "--" }}
    </div>
    <div class="menuBlock">
      <div class="lineButton addButton">
        <span class="icon-add-fill "></span>
      </div>
      <div class="lineButton contentButton">
        <span class="icon-function-fill "></span>
      </div>
      <div class="lineButton editButton">
        <span class="icon-edit-2-line "></span>
      </div>
      <div class="lineButton delButton">
        <span class="icon-delete-bin-6-line "></span>
      </div>
    </div>
  </div>
  <div v-if="data.child != null" class="childBlock scroll" ref="childBlock">
    <List v-for="item in data.child" :data="item" @open="childOpen" @close="childClose"></List>
  </div>
</template>

<script setup>
import List from "@/components/element/List.vue";
import { ref, onMounted } from "vue";
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});

const childBlock = ref(null);
const open = ref(false);
const emit = defineEmits(["open", "close"]);
const lineName = ref(null);
function openHandel() {
  if (open.value) {
    childBlock.value.style.height = 0;
    emit("close", childBlock.value.scrollHeight);
  } else {
    childBlock.value.style.height = childBlock.value.scrollHeight + "px";
    emit("open", childBlock.value.scrollHeight);
  }
  open.value = !open.value;
}

function childClose(height) {
  childBlock.value.style.height = childBlock.value.scrollHeight - height + "px";
  emit("close", height);
}

function childOpen(height) {
  childBlock.value.style.height = childBlock.value.scrollHeight + height + "px";
  emit("open", height);
}

onMounted(() => {
  lineName.value.style.width = 550 - lineName.value.offsetLeft + "px"

});
</script>

<style scoped>
.menuBlock {
  display: flex;
}

.lineButton {
  transition: all 0.25s;
  cursor: pointer;
  width: 34px;
  height: 34px;
  color: #9c755e;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  text-align: center;
  line-height: 34px;
  margin-top: 3px;
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
  color: #fff;
  background-color: #9c755e;
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
  content: "添加子列表";
  position: absolute;
  background-color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  margin-top: 2px;
  border-radius: 17px;
  right: 39px;
}

.addButton:hover::before {
  width: 100px;
  color: #815840;
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
  background-color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  margin-top: 2px;
  border-radius: 17px;
  right: 39px;
}

.contentButton:hover::before {
  width: 100px;
  color: #815840;
}



.editButton {
  position: relative;
}


.editButton::before {
  pointer-events: none;
  transition: all 0.5s;
  width: 0;
  overflow: hidden;
  content: "编辑栏目";
  position: absolute;
  background-color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  margin-top: 2px;
  border-radius: 17px;
  right: 39px;
}

.editButton:hover::before {
  width: 100px;
  color: #815840;
}


.delButton {
  position: relative;
}


.delButton::before {
  pointer-events: none;
  transition: all 0.5s;
  width: 0;
  overflow: hidden;
  content: "删除栏目";
  position: absolute;
  background-color: #ff7b7b;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  margin-top: 2px;
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
  color: #815840;
  font-weight: 300;
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
  color: #9c755e;
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
  color: #fff;
  background-color: #9c755e;
}

.line {
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
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
  height: 0;
  overflow-y: auto;
  margin-left: 25px;
  transition: all 0.25s;
}
</style>
