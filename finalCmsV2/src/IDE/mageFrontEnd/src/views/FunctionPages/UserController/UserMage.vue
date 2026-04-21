<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                用户管理
            </div>
        </div>
        <UserTitle></UserTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <UserItem @edit="editHandel" :index="index + 1" :data="item"
                    v-if="index >= ((page - 1) * count) && index < (page * count)">
                </UserItem>
            </template>
            <div v-if="data.length == 0"
                style="text-align: center;line-height: 100px;font-size: 16px;font-weight: 300;">
                暂无用户
            </div>
        </div>
        <CmsPagination v-model:page="page" v-model:count="count" :total="data.length"></CmsPagination>
    </div>
    <Dialog :title="editTarget?.id ? '编辑用户' : '创建用户'" v-model="showEdit">
        <UserEdit :data="editTarget" ref="userEdit"></UserEdit>
        <template #footer>
            <div style="display: flex;">
                <div style="flex:1;"></div>
                <CmsButton style="margin-right: 15px;" @click="saveHandel">保存</CmsButton>
                <CmsButton @click="showEdit = false">取消</CmsButton>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import UserEdit from './elements/UserEdit.vue'
import UserTitle from './elements/UserTitle.vue'
import UserItem from './elements/UserItem.vue'
import { ref, onActivated } from 'vue';
import { getUserList } from '@/request/userManageApi'
import { useSystemStore } from '@/store/systemStore';
import { saveUserWebsiteRolesApi } from '@/request/websiteRoleUserApi'

const systemStore = useSystemStore()
const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const editTarget = ref(null)
const userEdit = ref(null)

async function editHandel(targetUser) {
    editTarget.value = JSON.parse(JSON.stringify(targetUser))
    showEdit.value = true
    // 等待弹窗打开和组件渲染完成后刷新角色列表
    setTimeout(() => {
        if (userEdit.value && userEdit.value.refreshRoles) {
            userEdit.value.refreshRoles()
        }
    }, 100)
}


async function saveHandel() {
    const value = userEdit.value.value

    // 保存用户角色关系
    const res = await saveUserWebsiteRolesApi({
        userId: value.id,
        roleIds: userEdit.value.selectedRoleIds,
        websiteId: systemStore.targetSite?.id
    })
    if (res.code == 200) {
        toast.success("已保存")
        showEdit.value = false
        getUserData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}


async function getUserData() {
    if (!systemStore.targetSite?.id) return setTimeout(() => getUserData(), 100)
    let res = await getUserList()
    if (res.code == 200) {
        data.value = res.data || []
    }
}

onActivated(() => {
    getUserData()
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
    width: 100%;
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
