<template>
    <div class="line" v-bind:class="{ 'bigLine': data.child != null }">
        <div class="closeButton " v-if="data.child != null">
            <span class="icon-arrow-drop-up-line"></span>
        </div>
        {{ data.name }}
    </div>

    <div v-if="data.child != null" class="childBlock">
        <List v-for="item in data.child" :data="item"></List>
    </div>
</template>

<script setup>
import List from "@/components/element/List.vue"
import { ref } from "vue";
const props = defineProps({
    data: {
        type: Object,
        default: []
    }
});
const open = ref(false)
</script>

<style scoped>
.closeButton {
    cursor: pointer;
    width: 40px;
    height: 40px;
    color: #9c755e;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    margin-top: 5px;
    margin-left: -20px;
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
    padding-right: 20px;
    border-radius: 20px;
    margin-bottom: 10px;
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
}
</style>
