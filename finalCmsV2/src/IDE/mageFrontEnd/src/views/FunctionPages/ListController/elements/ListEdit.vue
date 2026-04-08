<template>
    <div style="padding-top: 20px;padding-right: 30px;" v-if="value">
        <div class="lineBlock">
            <div class="line">
                <div class="tip" v-if="value.name?.length == 0">请输入内容</div>
                <div class="label require">栏目名称</div>
                <CmsInput style="width:250px;" type="text" placeholder="请输入内容" v-model="value.name"></CmsInput>
            </div>
            <div class="line">
                <div class="label ">英文名称</div>
                <CmsInput style="width:250px;" type="text" placeholder="请输入内容" v-model="value.enName"></CmsInput>
            </div>
        </div>
        <div class="lineBlock">
            <div class="line">
                <div class="label">发布</div>
                <CmsSwitch v-model="value.publish"></CmsSwitch>
            </div>
        </div>
        <div class="lineBlock">
            <div class="line">
                <div class="label">key</div>
                <CmsInput style="width:250px;" type="text" placeholder="请输入内容" disabled="true" v-model="value.id">
                </CmsInput>
            </div>
            <div class="line">
                <div class="label">序号</div>
                <CmsInput style="width:250px;" type="number" placeholder="请输入内容" v-model="value.index" step="5">
                </CmsInput>
            </div>
        </div>

        <div class="lineBlock">
            <div class="line">
                <div class="label">列表路径</div>
                <CmsInput style="width:250px;" type="text" placeholder="请输入内容" v-model="value.template"></CmsInput>
            </div>
            <div class="line">
                <div class="label">内容路径</div>
                <CmsInput style="width:250px;" type="text" placeholder="请输入内容" v-model="value.nodeTemplate">
                </CmsInput>
            </div>
        </div>
        <div class="line">
            <div class="label">描述</div>
            <CmsTextarea autosize="true" showCount="true" placeholder="请输入内容" style="width: 610px;"
                v-model="value.info">
            </CmsTextarea>
        </div>
        <div class="line">
            <div class="label">封面图</div>
            <ImageUpload v-model="value.cover"></ImageUpload>
        </div>
        <!-- <div class="line" style="flex-direction: column;">
            <div class="label">动态变量</div>
            <DynamicPropEdit></DynamicPropEdit>
        </div> -->
    </div>
</template>

<script setup>

import { ref, watch, nextTick } from 'vue'
import DynamicPropEdit from './DynamicPropEdit.vue';
import CmsTextarea from '@/components/baseElements/CmsTextarea.vue';
const value = ref({})

defineExpose({
    value
})
const props = defineProps({
    data: Object
})


watch(
    () => props.data,
    async (val) => {
        if (val == null) value.value = {}
        value.value = JSON.parse(JSON.stringify(val))
        await nextTick()
    },
    { immediate: true }
)


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
    min-height: 40px;
    padding-bottom: 30px;
    position: relative;
    gap: 15px;
    line-height: 32px;
    display: flex;
}

.tip {
    font-size: 13px;
    margin-left: 90px;
    font-weight: 350;
    color: #ff4e4e;
    position: absolute;
    top: 35px;
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