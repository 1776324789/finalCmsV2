<template>
    <div class="mainContent" v-if="nodeTarget == null">

        <div style="margin-bottom: 15px;font-weight: 350;font-size: 18px;display: flex;margin-top: 25px;">
            <div style="flex:1;"> {{ systemStore?.targetSite?.name }}</div>
            <CmsButton @click="createList">
                创建栏目
            </CmsButton>
        </div>
        <ListTitle></ListTitle>
        <div class="contentBlock scroll">
            <template v-if="render">
                <List @change="changeHandel" @editNode="editNodeHandel" @delete="deleteHandel"
                    @createChildList="createList" @edit="editHandel" v-for="item in data" :data="item" :key="item.id">
                </List>

            </template>
        </div>
    </div>
    <template v-if="nodeTarget != null">
        <NodeController @change="nodeChangeHandel" ref="nodeController" @back="backHandel" :id="nodeTarget">
        </NodeController>
    </template>
    <Dialog :title="editTarget?.name" v-model="showEdit">
        <ListEdit :data="editTarget" ref="listEdit"></ListEdit>
        <template #footer>
            <div style="display: flex;">
                <div style="flex:1;"></div>
                <CmsButton v-if="editTarget?.id == null" style="margin-right: 15px;" @click="createHandel">创建
                </CmsButton>
                <CmsButton v-else style="margin-right: 15px;" @click="saveHandel">保存</CmsButton>
                <CmsButton @click="showEdit = false">取消</CmsButton>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import { updateWebsiteList, createWebsiteList, deleteWebsiteList, getWebsiteList } from '@/request/websiteListApi'
import List from './elements/List.vue';
import ListTitle from './elements/ListTitle.vue';
import { onActivated, ref } from 'vue';
import ListEdit from './elements/ListEdit.vue';
import { useSystemStore } from '@/store/systemStore';
import NodeController from './view/NodeController.vue';
import { nextTick } from 'vue';

const listEdit = ref(null)
const systemStore = useSystemStore()
const data = ref([])
const render = ref(true)
const showEdit = ref(false)
const editTarget = ref(null)
const nodeController = ref(null)

const nodeTarget = ref(null)
const emit = defineEmits(['change'])

function nodeChangeHandel(e) {
    emit("change", e)
}

function backHandel() {
    nodeTarget.value = null
}

function createList(parentId) {
    editTarget.value = {
        parentId: parentId
    }
    showEdit.value = true
}

function editNodeHandel(id) {
    nodeTarget.value = id
    nextTick(() => {
        nodeController.value.getWebsiteNodeData()
    })
}

async function deleteHandel(id) {
    const res = await deleteWebsiteList({ id: id, websiteId: systemStore.targetSite.id })
    if (res.code == 200) {
        getWebsiteListData()
        toast.success("已删除")
        emit("change")
    } else {
        toast.danger("删除失败:" + res.message)
    }
}


async function createHandel() {
    let res = await createWebsiteList({ data: listEdit.value.value, websiteId: systemStore.targetSite.id })
    if (res.code == 200) {
        getWebsiteListData()
        toast.success("已创建")
        showEdit.value = false
        emit("change")
    } else {
        toast.danger("创建失败:" + res.message)
    }
}


function editHandel(e) {
    editTarget.value = e
    showEdit.value = true
}

async function changeHandel(e) {
    let res = await updateWebsiteList({ data: e, websiteId: systemStore.targetSite.id })
    if (res.code == 200) {
        getWebsiteListData()
        toast.success("已保存")
        emit("change")
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function saveHandel() {
    const target = listEdit.value.value
    let res = await updateWebsiteList({ data: target, websiteId: systemStore.targetSite.id })
    if (res.code == 200) {
        getWebsiteListData()
        toast.success("已保存")
        showEdit.value = false
        emit("change")
    } else {
        toast.danger("保存失败:" + res.message)
    }
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

defineExpose({
    getWebsiteListData
})



</script>
<style scoped>
.web {
    cursor: pointer;
    display: flex;
    margin-left: 15px;
    margin-top: 2px;
}

.web:hover {
    color: #144e85c7;
}

.webName {
    font-size: 16px;
    font-weight: 300;
}

.webTarget {
    font-size: 16px;
    font-weight: 300;
}

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
