<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                站点功能管理
            </div>
            <CmsButton @click="createMenu">创建菜单</CmsButton>
        </div>
        <WebsiteMenuTitle></WebsiteMenuTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <WebsiteMenuItem @delete="deleteMenu" @change="menuChange" @edit="editHandel" :index="index + 1"
                    :data="item">
                </WebsiteMenuItem>
            </template>
            <div v-if="data.length == 0 && selectedWebsiteId"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无菜单
            </div>
        </div>
    </div>
    <Dialog :title="editTarget?.id ? '编辑菜单' : '创建菜单'" v-model="showEdit">
        <WebsiteMenuEdit :data="editTarget" :websiteId="selectedWebsiteId" ref="menuEdit"></WebsiteMenuEdit>
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
import WebsiteMenuEdit from './elements/WebsiteMenuEdit.vue'
import WebsiteMenuTitle from './elements/WebsiteMenuTitle.vue'
import WebsiteMenuItem from './elements/WebsiteMenuItem.vue'
import { ref, onActivated } from 'vue';
import { getWebsiteMenuList, createWebsiteMenu as createMenuApi, updateWebsiteMenu, deleteWebsiteMenu as deleteMenuApi } from '@/request/websiteMenuManageApi'

const data = ref([])
const selectedWebsiteId = ref('')
const showEdit = ref(false)
const menuEdit = ref(null)
const editTarget = ref({})



async function loadMenuData() {
    const res = await getWebsiteMenuList()
    if (res.code == 200) {
        data.value = res.data
    }
}

async function deleteMenu(target) {
    const res = await deleteMenuApi(target)
    if (res.code == 200) {
        toast.success("已删除")
        showEdit.value = false
        loadMenuData()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}

async function createHandel() {
    const res = await createMenuApi({
        name: menuEdit.value.value.name,
        icon: menuEdit.value.value.icon,
        target: menuEdit.value.value.target,
        parentId: menuEdit.value.value.parentId,
        status: menuEdit.value.value.status
    })
    if (res.code == 200) {
        toast.success("已创建")
        showEdit.value = false
        loadMenuData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

async function editHandel(targetMenu) {
    editTarget.value = JSON.parse(JSON.stringify(targetMenu))
    showEdit.value = true
}

async function createMenu() {
    editTarget.value = { status: true }
    showEdit.value = true
}

async function saveHandel() {
    const value = menuEdit.value.value

    const res = await updateWebsiteMenu({
        id: value.id,
        name: value.name,
        icon: value.icon,
        target: value.target,
        parentId: value.parentId,
        status: value.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        loadMenuData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function menuChange(targetMenu) {
    const res = await updateWebsiteMenu({
        id: targetMenu.id,
        status: targetMenu.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        loadMenuData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

onActivated(() => {
    loadMenuData()
})

</script>
<style scoped>
.select {
    margin-left: 15px;
    width: 150px;
    display: flex;
    margin-top: -3px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #757575;
    background-color: rgba(235, 235, 235, 0.75);
    height: 33px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.mainContent {
    padding: 25px;
    display: flex;
    flex-direction: column;
}

.contentBlock {
    flex: 1;
}
</style>
