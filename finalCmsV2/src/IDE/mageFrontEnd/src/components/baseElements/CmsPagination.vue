<template>
    <div class="pagination">
        <!-- 上一页 -->
        <button :disabled="page <= 1" @click="changePage(page - 1)">
            上一页
        </button>

        <!-- 页码 -->
        <button v-for="p in pages" :key="p" :class="{ active: p === page }" @click="changePage(p)">
            {{ p }}
        </button>

        <!-- 下一页 -->
        <button :disabled="page >= totalPages" @click="changePage(page + 1)">
            下一页
        </button>

        <!-- 每页条数选择 -->
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

// 页码列表
const pages = computed(() => {
    const arr = []
    for (let i = 1; i <= totalPages.value; i++) {
        arr.push(i)
    }
    return arr
})

// 切换页
function changePage(p) {
    if (p < 1 || p > totalPages.value) return
    emit("update:page", p)
}

// 修改每页条数
function changeCount(e) {
    const newCount = Number(e.target.value)
    emit("update:count", newCount)

    // 重置页码（避免越界）
    emit("update:page", 1)
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

button {
    padding: 4px 10px;
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
    padding: 4px;
}

.info {
    margin-left: 10px;
    font-size: 12px;
    color: #666;
}
</style>