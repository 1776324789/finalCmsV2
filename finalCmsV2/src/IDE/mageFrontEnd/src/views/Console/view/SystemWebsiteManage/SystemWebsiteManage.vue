<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                站点管理
            </div>
            <CmsButton @click="createWebsite">创建站点</CmsButton>
        </div>
        <WebsiteTitle></WebsiteTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <WebsiteItem @delete="deleteWebsite" @change="websiteChange" @edit="editHandel" :index="index + 1"
                    :data="item" v-if="index >= ((page - 1) * count) && index < (page * count)">
                </WebsiteItem>
            </template>
            <div v-if="data.length == 0"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无站点
            </div>
        </div>
        <CmsPagination v-model:page="page" v-model:count="count" :total="data.length"></CmsPagination>
    </div>
    <Dialog :title="editTarget?.id ? '编辑站点' : '创建站点'" v-model="showEdit">
        <WebsiteEdit :data="editTarget" ref="websiteEdit"></WebsiteEdit>
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
import WebsiteEdit from './elements/WebsiteEdit.vue'
import WebsiteTitle from './elements/WebsiteTitle.vue'
import WebsiteItem from './elements/WebsiteItem.vue'
import { ref, onActivated } from 'vue';
import { getWebsiteList, createWebsite as createWebsiteApi, updateWebsite, deleteWebsite as deleteWebsiteApi } from '@/request/websiteManageApi'

const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const editTarget = ref(null)
const websiteEdit = ref(null)

async function deleteWebsite(target) {
    const res = await deleteWebsiteApi({
        id: target
    })
    if (res.code == 200) {
        toast.success("已删除")
        showEdit.value = false
        getWebsiteData()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}

async function createHandel() {
    const res = await createWebsiteApi({
        name: websiteEdit.value.value.name,
        target: websiteEdit.value.value.target
    })
    if (res.code == 200) {
        toast.success("已创建")
        showEdit.value = false
        getWebsiteData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

async function editHandel(targetWebsite) {
    editTarget.value = JSON.parse(JSON.stringify(targetWebsite))
    showEdit.value = true
}

async function createWebsite() {
    editTarget.value = {}
    showEdit.value = true
}

async function saveHandel() {
    const value = websiteEdit.value.value
    console.log(value)
    const res = await updateWebsite({
        id: value.id,
        name: value.name,
        target: value.target,
        status: value.status,
        defaultAdmin: value.defaultAdmin
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        getWebsiteData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function websiteChange(targetWebsite) {
    const res = await updateWebsite({
        id: targetWebsite.id,
        name: targetWebsite.name,
        target: targetWebsite.target,
        status: targetWebsite.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        getWebsiteData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function getWebsiteData() {
    let res = await getWebsiteList()
    if (res.code == 200) {
        data.value = res.data || []
    }
}

onActivated(() => {
    getWebsiteData()
})

</script>
<style scoped>
.backIcon {
    display: flex;
    cursor: pointer;
}

.backIcon:hover {
    opacity: 0.75;
    color: rgb(43, 43, 78);
    font-weight: 400;
}

.mainContent {
    padding: 25px;
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

.line {
    display: flex;
    align-items: center;
    gap: 15px;
}

.label {
    text-align: right;
    width: 100px;
    color: #666;
    font-size: 14px;
    font-weight: 350;
}

.label::after {
    content: ":";
    margin-right: -5px;
}

.error-text {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: -15px;
    margin-bottom: 15px;
    margin-left: 115px;
}
</style>
