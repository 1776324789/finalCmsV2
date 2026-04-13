<template>
    <div style="padding: 20px;min-width: 450px;">
        <div class="line" style="margin-bottom: 20px;">
            <div class="label require">名称</div>
            <CmsInput style="flex:1;" placeholder="请输入菜单名称" v-model="form.name"></CmsInput>
        </div>
        <div class="line" style="margin-bottom: 20px;">
            <div class="label require">图标</div>
            <CmsInput style="flex:1;" placeholder="请输入图标类名，如：icon-database-line" v-model="form.icon"></CmsInput>
        </div>
        <div class="line" style="margin-bottom: 20px;">
            <div class="label">目标路由</div>
            <CmsInput @input="checkTarget" style="flex:1;" placeholder="不填写则作为容器菜单（可作为父级）" v-model="form.target">
            </CmsInput>
        </div>
        <div class="line" style="margin-bottom: 20px;">
            <div class="label">父级菜单</div>
            <select class="select" :disabled="!form.target" v-model="form.parentId" placeholder="请选择父级菜单">
                <option value="">--</option>
                <option v-for="menu in parentMenus" :key="menu.id" :value="menu.id">
                    {{ menu.name }}
                </option>
            </select>
        </div>
        <div class="line" style="margin-bottom: 20px;" v-if="form.id">
            <div class="label">状态</div>
            <CmsSwitch v-model="form.status"></CmsSwitch>
        </div>
        <div v-if="form.createTime" class="line" style="margin-bottom: 20px;">
            <div class="label">创建时间</div>
            <div style="color: #999;font-size: 14px;">{{ form.createTime }}</div>
        </div>
        <div v-if="form.createBy" class="line" style="margin-bottom: 20px;">
            <div class="label">创建人</div>
            <div style="color: #999;font-size: 14px;">{{ form.createBy }}</div>
        </div>
        <div v-if="form.updateTime" class="line" style="margin-bottom: 20px;">
            <div class="label">更新时间</div>
            <div style="color: #999;font-size: 14px;">{{ form.updateTime }}</div>
        </div>
        <div v-if="form.updateBy" class="line" style="margin-bottom: 20px;">
            <div class="label">更新人</div>
            <div style="color: #999;font-size: 14px;">{{ form.updateBy }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getWebsiteMenuList } from '@/request/websiteMenuManageApi'
const form = ref({})
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const parentMenus = ref([])  // 可作为父级的菜单（没有 target 的容器菜单）

// 加载可作为父级的菜单列表
async function loadParentMenus() {
    const res = await getWebsiteMenuList()
    if (res.code == 200) {
        // 只显示没有 target 的菜单作为父级选项
        parentMenus.value = (res.data || []).filter(m => !m.target)
    }
}

function checkTarget() {
    if (!form.value.target) {
        form.value.parentId = null
    }
}

// 监听 data 变化
watch(() => props.data, (newVal) => {
    console.log(newVal);

    loadParentMenus()
    if (newVal && newVal.id) {
        form.value = { ...newVal }
    } else {
        form.value = { status: true }
    }
}, { immediate: true, deep: true })

// 监听 websiteId 变化，重新加载菜单
watch(() => props.websiteId, () => {
    loadParentMenus()
}, { immediate: true })

onMounted(() => {
    loadParentMenus()
})

defineExpose({
    value: form
})
</script>

<style scoped>
.select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #757575;
    background-color: rgba(235, 235, 235, 0.75);
    height: 33px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
}
.select:disabled {
    background-color: #d1d1d1;
    cursor: not-allowed;
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

.label.require::before {
    content: "*";
    color: #ff4d4f;
    margin-right: 4px;
}
</style>
