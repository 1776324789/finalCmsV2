<template>
    <!-- :style="{ height: container?.parentNode.clientHeight + 'px' }" -->
    <div ref="container" style="display: flex;width: 90vw;height: calc(100vh - 290px);">
        <div style="padding-right: 30px;" v-if="value" class="scroll">
            <div class="lineBlock">
                <div class="line">
                    <div class="tip" v-if="value.title?.length == 0">请输入内容</div>
                    <div class="label require">栏目名称</div>
                    <CmsInput style="width:250px;" type="text" placeholder="请输入内容" v-model="value.title"></CmsInput>
                </div>
                <div class="line">
                    <div class="label">key</div>
                    <CmsInput style="width:250px;" type="text" placeholder="请输入内容" disabled="true" v-model="value.id">
                    </CmsInput>
                </div>
            </div>
            <div class="lineBlock">
                <div class="line">
                    <div class="label">阅读量</div>
                    <CmsInput style="width:250px;" type="number" placeholder="请输入内容" v-model="value.clicks" step="5">
                    </CmsInput>
                </div>
                <div class="line">
                    <div class="label">发布时间</div>
                    <CmsInput style="width:250px;" type="datetime-local" placeholder="请输入内容" v-model="value.date">
                    </CmsInput>
                </div>
            </div>
            <div class="lineBlock">
                <div class="line">
                    <div class="label">发布</div>
                    <CmsSwitch v-model="value.publish"></CmsSwitch>
                </div>
                <div class="line">
                    <div class="label">置顶</div>
                    <CmsSwitch v-model="value.top"></CmsSwitch>
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
            <div class="line">
                <div class="label">附件</div>
                <FileUpload v-model="value.file"></FileUpload>
            </div>
            <!-- <TinyMCEEditor></TinyMCEEditor> -->
            <!-- <div style="border: 1px solid #fff;">
            <QuillEditor style="width:80vw;min-height:500px;" @input="check" placeholder="请输入内容" v-model:content="content" ref="quill"
                theme="snow"></QuillEditor>
        </div> -->
            <!-- <div class="line" style="flex-direction: column;">
            <div class="label">动态变量</div>
            <DynamicPropEdit></DynamicPropEdit>
        </div> -->
        </div>
        <div style="flex:1;" class="scroll">
            <RichEditor v-model="value.content"></RichEditor>
        </div>
    </div>

</template>

<script setup>
import FileUpload from '@/components/baseElements/FileUpload.vue';

// import { QuillEditor } from '@vueup/vue-quill'
import { ref, watch, nextTick, onMounted } from 'vue'
import DynamicPropEdit from './DynamicPropEdit.vue';
import CmsTextarea from '@/components/baseElements/CmsTextarea.vue';
// import TinyMCEEditor from './TinyMCEEditor.vue';

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import RichEditor from '@/components/baseElements/RichEditor.vue';

const value = ref({})
const quill = ref(null)
const container = ref(null)

defineExpose({
    value
})

onMounted(() => {
    console.log(container.value.parentNode.clientHeight)
})

function check() {
    console.log(quill.value.getHTML());
}

const content = ref('<p>hello</p>')

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