<template>
    <div style="padding: 20px;min-width: 500px;">
        <div style="margin-bottom: 15px;font-size: 14px;color: #666;">
            为角色 <span style="font-weight: 350;color: #000;">{{ role?.name }}</span> 分配功能权限
        </div>
        <div v-for="menu in menuList" :key="menu.id" class="premissionBox">
            <label style="display: flex;align-items: center;flex: 1;cursor: pointer;">
                <input type="checkbox" :value="menu.id" v-model="selectedMenuIds" />
                <span style="font-size: 20px;margin-right: 10px;" :class="menu.icon"></span>
                <span style="font-weight: 300;font-size: 14px;">{{ menu.name }}</span>
            </label>
            <span style="font-size: 12px;color: #999;">{{ menu.target }}</span>
        </div>
        <div v-if="menuList.length === 0" style="text-align: center;padding: 30px;color: #999;">
            暂无可分配的菜单
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getSystemMenuList } from '@/request/functionManageApi'
import { getRoleMenu } from '@/request/roleManageApi'

const props = defineProps({
    role: {
        type: Object,
        default: null
    }
})

const menuList = ref([])
const selectedMenuIds = ref([])

const getSelectedMenuIds = () => {
    return selectedMenuIds.value
}

const refreshRoleMenus = async () => {
    // 重新加载菜单列表
    await loadMenuList()
    // 重新加载角色权限
    if (props.role && props.role.id) {
        const res = await getRoleMenu({ roleId: props.role.id })
        if (res.code == 200) {
            selectedMenuIds.value = res.data || []
        }
    } else {
        selectedMenuIds.value = []
    }
}

defineExpose({
    getSelectedMenuIds,
    refreshRoleMenus
})

async function loadMenuList() {
    const res = await getSystemMenuList()
    if (res.code == 200) {
        menuList.value = res.data || []
    }
}

async function loadRoleMenus() {
    if (props.role && props.role.id) {
        const res = await getRoleMenu({ roleId: props.role.id })
        if (res.code == 200) {
            selectedMenuIds.value = res.data || []
        }
    } else {
        selectedMenuIds.value = []
    }
}

onMounted(() => {
    loadMenuList()
})

// 监听 role 变化，动态加载角色权限
watch(() => props.role, () => {
    loadRoleMenus()
}, { immediate: true })
</script>

<style scoped>
.premissionBox {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    margin-bottom: 5px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 15px;
    background-color: #fff;
}

.premissionBox input {
    margin-right: 15px;
    width: 20px;
    height: 20px;
}

.premissionBox:hover {
    background-color: #efefef;
}
</style>
