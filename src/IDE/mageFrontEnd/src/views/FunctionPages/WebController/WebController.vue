<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            站点内容\WebContent
            <div class="searchBlock">搜索名称<input @input="searchInputHandel" v-model="search" placeholder="请输入栏目名称"
                    type="text"></div>
        </div>
        <ListTitle>栏目名称</ListTitle>
        <div class="contentBlock scroll">
            <template v-if="render">
                <List :ref="el => listRefs[index] = el" :search="search" @edit="editHandel" v-for="item, index in data"
                    :data="item" :key="item"></List>
            </template>
        </div>
    </div>
    <Dialog :title="editTarget?.name" v-model="showEdit">
        <ListEdit :data="editTarget"></ListEdit>
    </Dialog>
</template>
<script setup>
import Dialog from '@/components/element/Dialog.vue';
import List from './elements/List.vue';
import ListTitle from './elements/ListTitle.vue';
import { nextTick, onMounted, ref } from 'vue';
import ListEdit from './elements/ListEdit.vue';
const search = ref("")
const data = ref([])
const render = ref(true)
const showEdit = ref(false)
const editTarget = ref(null)
const listRefs = ref([])
function editHandel(e) {
    editTarget.value = e
    showEdit.value = true
}

function searchInputHandel() {
    if (search.value.length > 0) {
        render.value = false
        nextTick(() => {
            render.value = true
            nextTick(() => {
                listRefs.value.forEach(item => {
                    nextTick(async () => {
                        await item.openAll()
                    })
                })
            })
        })
    } else {
        listRefs.value.forEach(item => {
            item.closeAll()
        })
    }

}

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
    console.log(JSON.stringify(data.value).length);

})

</script>
<style scoped>
.searchBlock {
    display: flex;
    margin-left: 30px;
    font-size: 16px;
    line-height: 30px;
    height: 30px;
}

.searchBlock input {
    height: 28px;
    border: none;
    border-radius: 15px;
    margin-left: 15px;
    text-indent: 10px;
    outline: none;
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(15px);
    font-weight: 350;
}

.mainContent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.contentBlock {
    flex: 1;
}


.input {
    font-size: 18px;
    font-weight: 350;
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
