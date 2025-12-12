<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 300;font-size: 18px;">站点内容\WebContent</div>
        <!-- <div class="bar">
            <span class="icon-lock-line inputIcon"></span>
            <input class="input" placeholder="请输入密码" type="text" />
        </div> -->
        <ListTitle>栏目名称</ListTitle>
        <div class="contentBlock scroll">
            <List v-for="item in data" :data="item"></List>
        </div>
    </div>

</template>
<script setup>
import List from '@/components/element/List.vue';
import ListTitle from '@/components/element/ListTitle.vue';
import { onMounted, ref } from 'vue';
const data = ref([])
onMounted(() => {
    let parents = []
    let temp = []
    let tempMap = new Map()
    webData.forEach(item => {
        let tempData = JSON.parse(item)
        tempMap.set(tempData.id, tempData)
        temp.push(tempData)
        if (tempData.parentId == null) parents.push(tempData)
    })
    temp.forEach(item => {
        if (item.parentId != null) {
            if (tempMap.get(item.parentId).child == null)
                tempMap.get(item.parentId).child = [item]
            else tempMap.get(item.parentId).child.push(item)
        }
    })
    data.value = parents
})

</script>
<style scoped>
.mainContent {
    padding: 50px;
    background-color: #ffffffc5;
    border-radius: 50px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.contentBlock {
    flex: 1;
}


.input {
    font-size: 18px;
    font-weight: 300;
    color: #000;
    flex: 1;
    text-indent: 60px;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: rgba(255, 255, 255, 0.35);
}

.input:hover {
    background-color: rgba(255, 255, 255, 0.45);
}

.bar {
    display: flex;
    margin-left: 60px;
    margin-right: 60px;
    margin-top: 10px;
}

.inputIcon {
    z-index: 100;
    background-color: #fff;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    margin-top: 5px;
    margin-right: -45px;
    margin-left: 5px;
    display: block;
}
</style>
