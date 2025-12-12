<template>
    <div class="line">
        <div class="labelName blockLine">栏目名称</div>
        <div class="index blockLine">序号</div>
        <div class="index blockLine">子列表</div>
        <div class="index blockLine">内容</div>
        <div class="index blockLine" style="width: 125px;">序列号</div>
        <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">模板路径</div>
        <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">内容路径 </div>
        <div class="index" style="width: 155px;">操作 </div>
    </div>
</template>
<style scoped>
.line {
    background-color: rgba(255, 209, 172, 0.541);
    display: flex;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
    margin-bottom: 10px;
    font-size: 14px;
}

.labelName {
    font-size: 13px;
    font-weight: 300;
    color: #815840;
    width: 300px;
}

.blockLine {
    position: relative;
}

.index {
    font-size: 13px;
    font-weight: 300;
    color: #815840;
    width: 70px;
    text-align: center;
}

.blockLine::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: calc(100% - 10px);
    margin-top: 5px;
    width: 2px;
    border-radius: 2px;
    background-color: #ffffffab;
}
</style>