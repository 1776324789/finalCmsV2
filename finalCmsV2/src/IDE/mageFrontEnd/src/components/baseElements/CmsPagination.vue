<template>
    <div class="pagination">
        <!-- 上一页 -->
        <button class="switchButton" :disabled="page <= 1" @click="changePage(page - 1)">
            上一页
        </button>

        <!-- 页码 -->
        <button class="numberButton" v-for="(p, index) in pages" :key="index" :class="{ active: p === page }"
            @click="changePage(p)" :disabled="p === '...'">
            {{ p }}
        </button>

        <!-- 下一页 -->
        <button class="switchButton" :disabled="page >= totalPages" @click="changePage(page + 1)">
            下一页
        </button>

        <!-- 每页条数 -->
        <select :value="count" @change="changeCount">
            <option v-for="c in pageSizes" :key="c" :value="c">
                {{ c }} / 页
            </option>
        </select>

        <!-- 信息 -->
        <span class="info">
            共 {{ total }} 条 / {{ totalPages }} 页
        </span>
    </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    page: Number,
    count: Number,
    total: Number,
    pageSizes: {
        type: Array,
        default: () => [10, 20, 50, 100]
    }
})

const emit = defineEmits(["update:page", "update:count"])

// 总页数
const totalPages = computed(() => {
    return Math.ceil(props.total / props.count) || 1
})

// 分页逻辑（核心）
const pages = computed(() => {
    const total = totalPages.value
    const current = props.page
    const max = 7

    // 少页数直接全显示
    if (total <= max + 2) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const result = []

    // 第一页
    result.push(1)

    let start = Math.max(2, current - Math.floor(max / 2))
    let end = Math.min(total - 1, current + Math.floor(max / 2))

    // 靠前
    if (current <= Math.ceil(max / 2)) {
        start = 2
        end = max
    }

    // 靠后
    if (current >= total - Math.ceil(max / 2)) {
        start = total - max + 1
        end = total - 1
    }

    // 左省略
    if (start > 2) {
        result.push("...")
    }

    // 中间页
    for (let i = start; i <= end; i++) {
        result.push(i)
    }

    // 右省略
    if (end < total - 1) {
        result.push("...")
    }

    // 最后一页
    result.push(total)

    return result
})

// 切换页
function changePage(p) {
    if (typeof p !== "number") return
    if (p < 1 || p > totalPages.value) return
    emit("update:page", p)
}

// 修改每页条数
function changeCount(e) {
    const newCount = Number(e.target.value)
    emit("update:count", newCount)
    emit("update:page", 1)
}
</script>

<style scoped>
.pagination {
    display: flex;
    gap: 15px;
    align-items: center;
}

button {
    transition: all 0.2s;
    cursor: pointer;
}

button.active {
    background: #409eff;
    color: #fff;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

select {
    border-radius: 15px;
    height: 30px;
    min-width: 30px;
    border: 1px solid #979797;
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    padding-left: 15px;
    padding-right: 10px;
}

.info {
    line-height: 30px;
    color: #fff;
    margin-left: 10px;
    font-size: 12px;
}

button:hover {
    border: 1px solid #cccccc;
}

.numberButton {
    border-radius: 15px;
    height: 30px;
    min-width: 30px;
    border: 1px solid #979797;
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    font-size: 14px;
    font-weight: 300;
}

.switchButton {
    border-radius: 15px;
    height: 30px;
    border: 1px solid #979797;
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    width: 75px;
}
</style>