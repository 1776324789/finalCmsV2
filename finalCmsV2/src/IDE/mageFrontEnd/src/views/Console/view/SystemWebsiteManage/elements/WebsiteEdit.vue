<template>
    <div ref="container" style="display: flex;">
        <div style="padding-right: 30px;" v-if="value" class="scroll">
            <div class="lineBlock">
                <div class="line">
                    <div class="label require">站点名称</div>
                    <CmsInput style="width:250px;" type="text" placeholder="请输入站点名称" v-model="value.name"></CmsInput>
                </div>
            </div>
            <div class="lineBlock">
                <div class="line">
                    <div class="label require">站点标识</div>
                    <CmsInput style="width:250px;" type="text" placeholder="请输入站点标识（英文）" v-model="value.target"
                        :disabled="value.id != null"></CmsInput>
                </div>
            </div>
            <div class="lineBlock">
                <div class="line">
                    <div class="label require">管理员</div>
                    <div style="font-size: 14px;color: #666;" v-if="value?.defaultAdmin">{{userList.find(item =>
                        item.id == value?.defaultAdmin)?.username
                        || '-'}}</div>
                    <CmsButton style="width:150px;" @click="showDialog = true">{{ data?.defaultAdmin ? '重新分配' :
                        '分配默认管理员' }}</CmsButton>
                </div>
            </div>
            <div class="lineBlock" v-if="value.id">
                <div class="line">
                    <div class="label">启用</div>
                    <CmsSwitch v-model="value.status"></CmsSwitch>
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
    <Dialog title="分配管理员" v-model="showDialog" width="500px">
        <div @click="changeDefaultAdmin(item)" class="selectBox" v-bind:class="{ 'select': targetAdminId == item.id }"
            v-for="item in userList" :key="item.id" style="margin-bottom: 10px;">
            {{ item.username }}
        </div>
        <template #footer>
            <div style="display: flex;gap:15px;">
                <CmsButton type="primary" @click="showDialog = false">取消</CmsButton>
                <CmsButton type="primary" @click="confirmDefaultAdmin">确认</CmsButton>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { getUserList } from '@/request/userManageApi'

const value = ref({})
const showDialog = ref(false)
const userList = ref([])
const targetAdminId = ref("")
const props = defineProps({
    data: Object
})

function changeDefaultAdmin(item) {
    targetAdminId.value = item.id
}

function confirmDefaultAdmin() {
    value.value.defaultAdmin = targetAdminId.value
    showDialog.value = false
}
// 暴露方法给父组件
defineExpose({
    value
})

watch(
    () => props.data,
    async (val) => {

        if (val == null) value.value = {}
        else value.value = JSON.parse(JSON.stringify(val))
        targetAdminId.value = val?.defaultAdmin || ""
        loadUserList()
        await nextTick()
    },
    { immediate: true }
)


async function loadUserList() {
    const res = await getUserList()
    if (res.code == 200) {
        userList.value = res.data.filter(u => u.status)
    }
}


</script>

<style scoped>
.selectBox {
    border: 1px solid #ddd;
    height: 30px;
    padding: 5px;
    line-height: 30px;
    border-radius: 5px;
    text-indent: 10px;
    cursor: pointer;
    color: #666;
    background-color: #ffffff31;
}

.selectBox:hover {
    border-color: #55aaff;
    background-color: #eef1f5;
}

.select {
    border-color: #55aaff;
    background-color: #eef1f5;
}


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
