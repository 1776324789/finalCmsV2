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
            <div class="label require">目标路由</div>
            <CmsInput style="flex:1;" placeholder="请输入目标路由" v-model="form.target"></CmsInput>
        </div>
        <div class="line" style="margin-bottom: 20px;">
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
import { ref, watch } from 'vue'

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const form = ref({})

watch(() => props.data, (newVal) => {
    if (newVal && newVal.id) {
        form.value = { ...newVal }
    } else {
        form.value = { status: true }
    }
}, { immediate: true, deep: true })

defineExpose({
    value: form
})
</script>

<style scoped>
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
