<template>
    <div style="padding: 20px;min-width: 500px;">
        <div style="margin-bottom: 15px;font-size: 14px;color: #666;">
            为角色 <span style="font-weight: 350;color: #000;">{{ role?.name }}</span> 分配功能权限
        </div>
        <div v-for="m in menu" :key="menu.id" class="premissionBox">
            <label style="display: flex;align-items: center;flex: 1;cursor: pointer;">
                <input type="checkbox" :value="m.id" v-model="role.menuIds" @change="handleChange(m, $event)" />
                <span style="font-size: 20px;margin-right: 10px;" :class="m.icon"></span>
                <span style="font-weight: 300;font-size: 14px;">{{ m.name }}</span>
            </label>
            <span style="font-size: 12px;color: #999;">{{ m.target }}</span>
        </div>
        <div v-if="menu.length === 0" style="text-align: center;padding: 30px;color: #999;">
            暂无可分配的菜单
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'


const props = defineProps({
    role: {
        type: Object,
        default: { menuIds: [] }
    },
    menu: {
        type: Array,
        default: null
    }
})

const handleChange = (m, e) => {
    if (m.parentId != null && e.target.checked && !props.role.menuIds.includes(m.parentId)) {
        props.role.menuIds.push(m.parentId)
    }
    if (m.parentId != null && !e.target.checked && props.role.menuIds.includes(m.parentId)) {
        const children = props.menu.filter(target => target.parentId == m.parentId).map(item => item.id)
        if (props.role.menuIds.filter(id => children.includes(id)).length === 0) {
            props.role.menuIds = props.role.menuIds.filter(id => id != m.parentId)
        }
    }


    if (!e.target.checked && m.target == null) {
        const children = props.menu.filter(target => target.parentId == m.id).map(item => item.id)
        props.role.menuIds = props.role.menuIds.filter(id => !children.includes(id))
    } else {
        const children = props.menu.filter(target => target.parentId == m.id).map(item => item.id)
        props.role.menuIds = [...props.role.menuIds, ...children]
        props.role.menuIds = [...new Set(props.role.menuIds)]
    }

}


const getSelectedMenuIds = () => {
    return props.role.menuIds
}

defineExpose({
    getSelectedMenuIds
})
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
