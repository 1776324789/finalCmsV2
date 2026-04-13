<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                角色管理
            </div>
            <CmsButton @click="createRole">创建角色</CmsButton>
        </div>
        <RoleTitle></RoleTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <RoleItem @delete="deleteRole" @change="roleChange" @edit="editHandel"
                    @permission="openPermissionDialog" :index="index + 1" :data="item"
                    v-if="index >= ((page - 1) * count) && index < (page * count)">
                </RoleItem>
            </template>
            <div v-if="data.length == 0"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无角色
            </div>
        </div>
        <CmsPagination v-model:page="page" v-model:count="count" :total="data.length"></CmsPagination>
    </div>
    <Dialog :title="editTarget?.id ? '编辑角色' : '创建角色'" v-model="showEdit">
        <RoleEdit :data="editTarget" ref="roleEdit"></RoleEdit>
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
    <Dialog title="分配权限" v-model="showPermissionDialog" width="600px">
        <RolePermission :role="currentRole" ref="rolePermission" />
        <template #footer>
            <div style="display: flex;">
                <div style="flex:1;"></div>
                <CmsButton style="margin-right: 15px;" @click="savePermission">保存</CmsButton>
                <CmsButton @click="showPermissionDialog = false">取消</CmsButton>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import RoleEdit from './elements/RoleEdit.vue'
import RoleTitle from './elements/RoleTitle.vue'
import RoleItem from './elements/RoleItem.vue'
import RolePermission from './elements/RolePermission.vue'
import { ref, onActivated, nextTick } from 'vue';
import { getRoleList, createRole as createRoleApi, updateRole, deleteRole as deleteRoleApi, saveRoleMenu, getRoleMenu } from '@/request/roleManageApi'
import { useSystemStore } from '@/store/systemStore';

const systemStore = useSystemStore()
const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const editTarget = ref(null)
const roleEdit = ref(null)
const showPermissionDialog = ref(false)
const currentRole = ref(null)
const rolePermission = ref(null)

async function deleteRole(target) {
    const res = await deleteRoleApi({
        id: target
    })
    if (res.code == 200) {
        toast.success("已删除")
        getRoleData()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}

async function createHandel() {
    const res = await createRoleApi({
        name: roleEdit.value.value.name,
        description: roleEdit.value.value.description,
        status: roleEdit.value.value.status
    })
    if (res.code == 200) {
        toast.success("已创建")
        showEdit.value = false
        getRoleData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

async function editHandel(targetRole) {
    editTarget.value = JSON.parse(JSON.stringify(targetRole))
    showEdit.value = true
}

function createRole() {
    editTarget.value = { status: true }
    showEdit.value = true
}

async function saveHandel() {
    const value = roleEdit.value.value

    const res = await updateRole({
        id: value.id,
        name: value.name,
        description: value.description,
        status: value.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        getRoleData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function roleChange(targetRole) {
    const res = await updateRole({
        id: targetRole.id,
        status: targetRole.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        getRoleData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function openPermissionDialog(role) {
    currentRole.value = role
    await nextTick()
    showPermissionDialog.value = true
    // 弹窗打开后刷新权限列表
    await nextTick()
    if (rolePermission.value) {
        rolePermission.value.refreshRoleMenus()
    }
}

async function savePermission() {
    const menuIds = rolePermission.value.getSelectedMenuIds()
    const res = await saveRoleMenu({
        roleId: currentRole.value.id,
        menuIds: menuIds
    })
    if (res.code == 200) {
        toast.success("权限已保存")
        showPermissionDialog.value = false
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function getRoleData() {
    let res = await getRoleList()
    if (res.code == 200) {
        data.value = res.data || []
    }
}

onActivated(() => {
    getRoleData()
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
