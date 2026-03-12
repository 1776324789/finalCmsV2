<template>
    <div class="line">
        <div class="labelName blockLine">栏目名称</div>
        <div class="index blockLine">序号</div>
        <div class="index blockLine">子列表</div>
        <div class="index blockLine">内容</div>
        <div class="index blockLine" style="width: 125px;">序列号</div>
        <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">列表页面路径</div>
        <div class="index blockLine" style="flex:1;text-align: left;text-indent: 25px;">内容页面路径 </div>
        <div class="index" style="width: 155px;">操作 </div>
    </div>
</template>
<style scoped>
.line {
    background-color: #fff;
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
    font-weight: 350;
    color: #000;
    width: 300px;
}

.blockLine {
    position: relative;
}

.index {
    font-size: 13px;
    font-weight: 350;
    color: #000;
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
    background-color: #c0c0c0ab;
}
</style>