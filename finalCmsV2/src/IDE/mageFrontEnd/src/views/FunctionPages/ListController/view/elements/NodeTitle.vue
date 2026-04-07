<template>
    <div class="line">
        <div class="index " style="width: 25px;text-align: left;font-weight: 300;color: #666;;">uid</div>
        <div class="labelName blockLine" style="flex:1;text-indent: 10px;">栏目名称</div>
        <div class="index blockLine" style="width: 130px;">key</div>
        <div class="index blockLine" style="width: 180px;">发布时间</div>
        <div class="index blockLine" style="width: 75px;">阅读</div>
        <div class="index blockLine" style="width: 115px;">置顶</div>
        <div class="index blockLine" style="width: 115px;">发布</div>
        <div class="index" style="width: 120px;">操作 </div>
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