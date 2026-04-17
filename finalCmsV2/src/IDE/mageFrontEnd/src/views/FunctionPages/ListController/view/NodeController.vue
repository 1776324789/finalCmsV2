<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                <span class="backIcon" @click="back">
                    <span style="font-size: 30px;line-height: 28px;" class="icon-arrow-drop-left-line">
                    </span>
                    站点栏目
                </span>
                &nbsp;&nbsp;\&nbsp;&nbsp;栏目内容&nbsp;&nbsp;\&nbsp;&nbsp;{{ targetList?.name }}
            </div>
            <CmsButton @click="createNode">创建内容</CmsButton>
        </div>
        <NodeTitle></NodeTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <Node @delete="deleteNode" @change="nodeChange" @edit="editHandel" :index="index + 1" :data="item"
                    v-if="index >= ((page - 1) * count) && index < (page * count)">
                </Node>
            </template>
            <div v-if="data.length == 0"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无内容
            </div>
        </div>
        <CmsPagination v-model:page="page" v-model:count="count" :total="data.length"></CmsPagination>
    </div>
    <Dialog :title="editTarget?.title" v-model="showEdit">
        <NodeEdit :data="editTarget" ref="nodeEdit"></NodeEdit>
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
import NodeEdit from './elements/NodeEdit.vue'
import NodeTitle from './elements/NodeTitle.vue'
import Node from './elements/Node.vue'
import { onActivated, ref } from 'vue';
import { getWebsiteList } from '@/request/websiteListApi'
import { getNodeContent, updateNode, createNode as createNodeApi, deleteNodeApi } from '@/request/websiteNodeApi'

import { useSystemStore } from '@/store/systemStore';
import { useRouter } from 'vue-router';
import CmsPagination from '@/components/baseElements/CmsPagination.vue';
const router = useRouter()
const systemStore = useSystemStore()
const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const targetList = ref(null)
const editTarget = ref(null)
const nodeEdit = ref(null)

function back() {
    router.back()
}

async function deleteNode(target) {
    const res = await deleteNodeApi({
        websiteId: systemStore.targetSite?.id,
        nodeId: target
    })
    if (res.code == 200) {
        toast.success("已删除")
        showEdit.value = false
        getWebsiteNodeData()
    } else {
        toast.danger("删除失败:" + res.message)
    }

}


async function createHandel() {
    const res = await createNodeApi({
        listId: router.currentRoute.value.query.id,
        websiteId: systemStore.targetSite?.id,
        node: nodeEdit.value.value
    })
    if (res.code == 200) {
        toast.success("已创建")
        showEdit.value = false
        getWebsiteNodeData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

async function editHandel(targetNode) {
    const res = await getNodeContent({
        nodeId: targetNode.id,
        websiteId: systemStore.targetSite?.id
    })

    if (res.code == 200 || res.code == 201) {
        const target = JSON.parse(JSON.stringify(targetNode))
        target.content = res.data
        editTarget.value = target
    }

    showEdit.value = true
}

function createNode() {
    editTarget.value = { publish: true, clicks: 0 }
    showEdit.value = true
}


async function saveHandel() {
    const value = nodeEdit.value.value
    value.clicks = value.clicks ? value.clicks * 1 : 0

    //更新节点数据
    const res = await updateNode({
        websiteId: systemStore.targetSite?.id,
        node: value
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        getWebsiteNodeData()
    } else {
        toast.danger("保存失败:" + res.message)
    }

}

async function nodeChange(targetNode) {
    const res = await updateNode({
        websiteId: systemStore.targetSite?.id,
        node: targetNode
    })
    if (res.code == 200) {
        toast.success("已保存")
        getWebsiteNodeData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}


async function getWebsiteNodeData() {
    if (systemStore.targetSite?.id == null) return setTimeout(() => {
        getWebsiteNodeData()
    }, 100);

    let res = await getWebsiteList({
        id: systemStore.targetSite?.id
    })

    const findList = (arr, id) => {
        let res = arr.find(item => item.id == id)

        if (res == null) {
            arr.forEach(item => {
                let re = findList(item.children || [], id)
                if (re != null) res = re
            })
        }
        return res
    }
    const list = findList(res, router.currentRoute.value.query.id)
    targetList.value = list
    data.value = list.nodes || []
}



onActivated(() => {
    getWebsiteNodeData()
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
