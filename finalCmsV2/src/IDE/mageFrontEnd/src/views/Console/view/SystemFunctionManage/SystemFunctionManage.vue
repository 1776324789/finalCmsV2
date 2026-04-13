<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                功能管理
            </div>
            <CmsButton @click="createFunction">创建功能</CmsButton>
        </div>
        <FunctionTitle></FunctionTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <FunctionItem @delete="deleteFunction" @change="functionChange" @edit="editHandel" :index="index + 1"
                    :data="item" v-if="index >= ((page - 1) * count) && index < (page * count)">
                </FunctionItem>
            </template>
            <div v-if="data.length == 0"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无功能
            </div>
        </div>
        <CmsPagination v-model:page="page" v-model:count="count" :total="data.length"></CmsPagination>
    </div>
    <Dialog :title="editTarget?.id ? '编辑功能' : '创建功能'" v-model="showEdit">
        <FunctionEdit :data="editTarget" ref="functionEdit"></FunctionEdit>
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
import FunctionEdit from './elements/FunctionEdit.vue'
import FunctionTitle from './elements/FunctionTitle.vue'
import FunctionItem from './elements/FunctionItem.vue'
import { ref, onActivated } from 'vue';
import { getSystemMenuList, createSystemMenu, updateSystemMenu, deleteSystemMenu } from '@/request/functionManageApi'
import { useSystemStore } from '@/store/systemStore';

const systemStore = useSystemStore()
const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const editTarget = ref(null)
const functionEdit = ref(null)

async function deleteFunction(target) {
    const res = await deleteSystemMenu({
        id: target
    })
    if (res.code == 200) {
        toast.success("已删除")
        getFunctionData()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}

async function createHandel() {
    const res = await createSystemMenu({
        name: functionEdit.value.value.name,
        icon: functionEdit.value.value.icon,
        target: functionEdit.value.value.target,
        status: functionEdit.value.value.status
    })
    if (res.code == 200) {
        toast.success("已创建")
        showEdit.value = false
        getFunctionData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

async function editHandel(targetFunction) {
    editTarget.value = JSON.parse(JSON.stringify(targetFunction))
    showEdit.value = true
}

function createFunction() {
    editTarget.value = { status: true }
    showEdit.value = true
}

async function saveHandel() {
    const value = functionEdit.value.value

    const res = await updateSystemMenu({
        id: value.id,
        name: value.name,
        icon: value.icon,
        target: value.target,
        status: value.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        getFunctionData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function functionChange(targetFunction) {
    const res = await updateSystemMenu({
        id: targetFunction.id,
        status: targetFunction.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        getFunctionData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function getFunctionData() {
    let res = await getSystemMenuList()
    if (res.code == 200) {
        data.value = res.data || []
    }
}

onActivated(() => {
    getFunctionData()
})

</script>
<style scoped>
.mainContent {
    padding: 25px;
    display: flex;
    flex-direction: column;
}

.contentBlock {
    flex: 1;
}
</style>
