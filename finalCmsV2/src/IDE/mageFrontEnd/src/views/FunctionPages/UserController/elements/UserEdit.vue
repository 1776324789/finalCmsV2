<template>
    <div ref="container" style="display: flex;">
        <div style="padding-right: 30px;" v-if="value" class="scroll">
            <div class="lineBlock">
                <div class="line">
                    <div class="label require">用户名</div>
                    <CmsInput disabled style="width:250px;" type="text" placeholder="请输入用户名" v-model="value.username"></CmsInput>
                </div>
            </div>
            <div class="lineBlock">
                <div class="line">
                    <div class="label">角色</div>
                    <div style="display: flex;flex-wrap: wrap;gap: 10px;">
                        <label v-for="role in roleList" :key="role.id"
                            style="display: flex;align-items: center;cursor: pointer;">
                            <input type="checkbox" :value="role.id" v-model="selectedRoleIds"
                                style="margin-right: 5px;width: 16px;height: 16px;cursor: pointer;" />
                            <span style="font-size: 14px;color: #333;">{{ role.name }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="lineBlock" v-if="value.id">
                <div class="line">
                    <div class="label">创建时间</div>
                    <CmsInput style="width:250px;" type="text" disabled="true" v-model="value.createTime"></CmsInput>
                </div>
            </div>
            <div class="lineBlock" v-if="value.id">
                <div class="line">
                    <div class="label">创建人</div>
                    <CmsInput style="width:250px;" type="text" disabled="true" v-model="value.createBy"></CmsInput>
                </div>
            </div>
            <div class="lineBlock" v-if="value.id">
                <div class="line">
                    <div class="label">更新时间</div>
                    <CmsInput style="width:250px;" type="text" disabled="true" v-model="value.updateTime"></CmsInput>
                </div>
            </div>
            <div class="lineBlock" v-if="value.id">
                <div class="line">
                    <div class="label">更新人</div>
                    <CmsInput style="width:250px;" type="text" disabled="true" v-model="value.updateBy"></CmsInput>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { getWebsiteRoleListApi, getUserWebsiteRolesApi } from '@/request/websiteRoleUserApi'
import { useSystemStore } from '@/store/systemStore'
const systemStore = useSystemStore()

const value = ref({})
const roleList = ref([])
const selectedRoleIds = ref([])

const props = defineProps({
    data: Object
})



async function loadRoles() {
    if (!systemStore.targetSite?.id) return setTimeout(() => loadRoles(), 100)
    const res = await getWebsiteRoleListApi({
        websiteId: systemStore.targetSite.id
    })

    if (res.code == 200) {
        roleList.value = res.data || []
    }
}

// 刷新角色列表
const refreshRoles = async () => {
    await loadRoles()
    await loadUserRoles()
}

async function loadUserRoles() {
    if (value.value.id) {
        const res = await getUserWebsiteRolesApi({ userId: value.value.id, websiteId: systemStore.targetSite.id })
        console.log(res);

        if (res.code == 200) {
            const roles = res.data || []
            selectedRoleIds.value = roles.map(r => r.roleId)
        } else {
            selectedRoleIds.value = []
        }
    } else {
        selectedRoleIds.value = []
    }
}

// 暴露方法给父组件
defineExpose({
    value,
    selectedRoleIds,
    refreshRoles
})

watch(
    () => props.data,
    async (val) => {
        if (val == null) value.value = { status: true }
        else value.value = JSON.parse(JSON.stringify(val))
        await nextTick()
        // 刷新角色列表和用户角色
        await loadRoles()
        await loadUserRoles()
    },
    { immediate: true }
)

onMounted(() => {
    loadRoles()
})
</script>

<style scoped>
textarea {
    resize: none;
    border-radius: 5px;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: rgba(255, 255, 255, 0.75);
    color: #666;
    min-width: 184px;
}

textarea::placeholder {
    color: #aaa;
}

.require {
    position: relative;
}

.require::before {
    left: 0px;
    color: red;
    font-size: 20px;
    position: absolute;
    content: "*";
}

.lineBlock {
    gap: 30px;
    display: flex;
}

.line {
    padding-bottom: 30px;
    position: relative;
    gap: 15px;
    line-height: 32px;
    display: flex;
}

.label {
    text-align: right;
    width: 75px;
    color: #666;
    font-size: 14px;
    font-weight: 350;
}

.label::after {
    content: ":";
    margin-right: -5px;
}
</style>
