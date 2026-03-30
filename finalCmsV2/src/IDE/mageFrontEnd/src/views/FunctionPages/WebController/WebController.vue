<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;">
                站点内容\WebContent
            </div>
            <CmsButton @click="createList">创建栏目</CmsButton>
        </div>
        <ListTitle>栏目名称</ListTitle>
        <div class="contentBlock scroll">
            <template v-if="render">
                <List @edit="editHandel" v-for="item in data" :data="item" :key="item.id"></List>
            </template>
        </div>
    </div>
    <Dialog :title="editTarget?.name" v-model="showEdit">
        <ListEdit :data="editTarget" ref="listEdit"></ListEdit>
        <template #footer>
            <div style="display: flex;">
                <div style="flex:1;"></div>
                <CmsButton v-if="editTarget?.id == null" style="margin-right: 15px;" @click="createHandel">创建</CmsButton>
                <CmsButton v-else style="margin-right: 15px;" @click="saveHandel">保存</CmsButton>
                <CmsButton @click="showEdit = false">取消</CmsButton>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import { getWebsiteList } from '@/request/websiteListApi.js'
import { updateWebsiteList } from '@/request/websiteListApi'
import Dialog from '@/components/baseElements/Dialog.vue';
import List from './elements/List.vue';
import ListTitle from './elements/ListTitle.vue';
import { onActivated, ref } from 'vue';
import ListEdit from './elements/ListEdit.vue';
import { useSystemStore } from '@/store/systemStore';
const listEdit = ref(null)
const systemStore = useSystemStore()
const data = ref([])
const render = ref(true)
const showEdit = ref(false)
const editTarget = ref(null)

function createList() {
    editTarget.value = {}
    showEdit.value = true
}


function editHandel(e) {
    editTarget.value = e
    showEdit.value = true
}

async function saveHandel() {
    await updateWebsiteListData(listEdit.value.value)
    showEdit.value = false
}

async function getWebsiteListData() {
    if (systemStore.targetSite?.id == null) return setTimeout(() => {
        getWebsiteListData()
    }, 100);

    let res = await getWebsiteList({
        id: systemStore.targetSite?.id
    })
    data.value = res
}

async function updateWebsiteListData(target) {
    const updateTargetInList = (id, target, list) => {
        list.forEach(item => {
            if (item.id == id) {
                for (let key in target) {
                    item[key] = target[key]
                }
                return
            }
            item.children && updateTargetInList(id, target, item.children)
        })
    }
    updateTargetInList(target.id, target, data.value)
    return await updateWebsiteList({ data: target, targetWebsite: systemStore.targetSite.target })
}

onActivated(() => {
    getWebsiteListData()
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
