<template>
    <div class="mainContent">
        <div style="margin-bottom: 25px;font-weight: 350;font-size: 18px;display: flex;">
            <div style="flex:1;display: flex;line-height: 25px;">
                用户管理
            </div>
            <CmsButton @click="createUser">创建用户</CmsButton>
        </div>
        <UserTitle></UserTitle>
        <div class="contentBlock scroll">
            <template v-for="item, index in data" :key="item.id">
                <UserItem @delete="deleteUser" @change="userChange" @edit="editHandel" :index="index + 1" :data="item"
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
        <UserEdit :data="editTarget" ref="userEdit" @openPasswordDialog="openPasswordDialog"></UserEdit>
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
    <Dialog title="修改密码" v-model="showPasswordDialog">
        <div style="padding: 20px;min-width: 400px;">
            <div class="line" style="margin-bottom: 20px;">
                <div class="label require">原密码</div>
                <CmsInput style="flex:1;" type="password" placeholder="请输入原密码" v-model="passwordForm.oldPassword"
                    @input="clearError('oldPassword')"></CmsInput>
            </div>
            <div class="error-text" v-if="passwordErrors.oldPassword">{{ passwordErrors.oldPassword }}</div>
            <div class="line" style="margin-bottom: 20px;">
                <div class="label require">新密码</div>
                <CmsInput style="flex:1;" type="password" placeholder="请输入新密码" v-model="passwordForm.newPassword"
                    @input="clearError('newPassword')"></CmsInput>
            </div>
            <div class="error-text" v-if="passwordErrors.newPassword">{{ passwordErrors.newPassword }}</div>
            <div class="line" style="margin-bottom: 20px;">
                <div class="label require">确认新密码</div>
                <CmsInput style="flex:1;" type="password" placeholder="请再次输入新密码" v-model="passwordForm.confirmPassword"
                    @input="clearError('confirmPassword')"></CmsInput>
            </div>
            <div class="error-text" v-if="passwordErrors.confirmPassword">{{ passwordErrors.confirmPassword }}</div>
        </div>
        <template #footer>
            <div style="display: flex;">
                <div style="flex:1;"></div>
                <CmsButton style="margin-right: 15px;" @click="changePasswordHandel">确认修改</CmsButton>
                <CmsButton @click="showPasswordDialog = false">取消</CmsButton>
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import UserEdit from './elements/UserEdit.vue'
import UserTitle from './elements/UserTitle.vue'
import UserItem from './elements/UserItem.vue'
import { ref, onActivated } from 'vue';
import { getUserList, createUser as createUserApi, updateUser, deleteUser as deleteUserApi, changePassword } from '@/request/userManageApi'
import { saveUserRoles } from '@/request/roleManageApi'
import { useSystemStore } from '@/store/systemStore';

const systemStore = useSystemStore()
const data = ref([])
const page = ref(1)
const count = ref(10)
const showEdit = ref(false)
const editTarget = ref(null)
const userEdit = ref(null)
const showPasswordDialog = ref(false)
const passwordForm = ref({})
const passwordErrors = ref({})

function clearError(field) {
    passwordErrors.value[field] = ''
}

async function deleteUser(target) {
    const res = await deleteUserApi({
        id: target
    })
    if (res.code == 200) {
        toast.success("已删除")
        showEdit.value = false
        getUserData()
    } else {
        toast.danger("删除失败:" + res.message)
    }
}

async function createHandel() {
    const res = await createUserApi({
        username: userEdit.value.value.username,
        password: userEdit.value.value.password
    })
    if (res.code == 200) {
        toast.success("已创建")
        // 保存用户角色关系
        if (userEdit.value.selectedRoleIds && userEdit.value.selectedRoleIds.length > 0) {
            await saveUserRoles({
                userId: res.data.id,
                roleIds: userEdit.value.selectedRoleIds
            })
        }
        showEdit.value = false
        getUserData()
    } else {
        toast.danger("创建失败:" + res.message)
    }
}

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

async function createUser() {
    editTarget.value = { publish: true }
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

    const res = await updateUser({
        id: value.id,
        username: value.username,
        status: value.status
    })
    if (res.code == 200) {
        // 保存用户角色关系
        await saveUserRoles({
            userId: value.id,
            roleIds: userEdit.value.selectedRoleIds
        })
        toast.success("已保存")
        showEdit.value = false
        getUserData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

async function userChange(targetUser) {
    const res = await updateUser({
        id: targetUser.id,
        status: targetUser.status
    })
    if (res.code == 200) {
        toast.success("已保存")
        getUserData()
    } else {
        toast.danger("保存失败:" + res.message)
    }
}

function openPasswordDialog(user) {
    showEdit.value = false
    passwordForm.value = {
        userId: user.id,
        username: user.username
    }
    showPasswordDialog.value = true
}

async function changePasswordHandel() {
    // 清空错误
    passwordErrors.value = {}

    // 验证原密码
    if (!passwordForm.value.oldPassword) {
        passwordErrors.value.oldPassword = '请输入原密码'
        return
    }

    // 验证新密码
    if (!passwordForm.value.newPassword) {
        passwordErrors.value.newPassword = '请输入新密码'
        return
    }

    // 验证确认密码
    if (!passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = '请确认新密码'
        return
    }

    // 验证两次密码是否一致
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = '两次输入的新密码不一致'
        toast.danger('两次输入的新密码不一致')
        return
    }

    // 验证新密码是否与原密码相同
    if (passwordForm.value.oldPassword === passwordForm.value.newPassword) {
        passwordErrors.value.newPassword = '新密码不能与原密码相同'
        toast.danger('新密码不能与原密码相同')
        return
    }

    const res = await changePassword({
        userId: passwordForm.value.userId,
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
    })

    if (res.code == 200) {
        toast.success('已修改')
        showPasswordDialog.value = false
        passwordForm.value = {}
        passwordErrors.value = {}
    } else {
        // 原密码错误时，在输入框下方显示错误
        if (res.message.includes('原密码')) {
            passwordErrors.value.oldPassword = res.message
        }
        toast.danger(res.message)
    }
}

async function getUserData() {
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
