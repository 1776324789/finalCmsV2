<template>
    <div class="menuButton " v-bind:class="{ 'selected': selected }">
        <span class="icon-folder-lock-fill"></span>
        <div class="name">统计数据</div>
    </div>
</template>
<script setup>

const props = defineProps({
    selected: {
        type: Boolean,
        default: false
    }
});
</script>
<style scoped>
.selected {
    background-color: #e6a05f;
    color: #fff;
}

.name {
    opacity: 0;
    overflow: hidden;
    height: 40px;
    transition: all 0.3s;
    background-color: #fff;
    left: 80px;
    top: 15px;
    width: 0;
    word-break: keep-all;
    line-height: 40px;
    font-size: 13px;
    border-radius: 20px;
    color: #666;
    position: absolute;
}

.menuButton {
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    width: 70px;
    height: 70px;
    position: relative;
    line-height: 70px;
}

.menuButton span {
    font-size: 20px;
    color: #9c755e;
}

.menuButton:hover {
    background-color: #fff4eb;
}

.menuButton:hover .name {
    opacity: 1;
    padding-left: 20px;
    padding-right: 20px;
    width: auto;
}

.selected:hover {
    background-color: #e6a05f;
    color: #fff;
}
</style>