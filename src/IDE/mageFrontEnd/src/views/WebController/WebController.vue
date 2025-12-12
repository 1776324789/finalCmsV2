<template>
    <div class="mainContent scroll">
        <List v-for="item in data" :data="item"></List>
    </div>

</template>
<script setup>
import List from '@/components/element/List.vue';
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

}
</style>
