<template>
    <template v-if="type != 'icon'">
        <input ref="main" class="cmsInput" :value="displayValue" :placeholder="placeholder" :disabled="disabled"
            :maxlength="maxlength" :type="inputType" @input="onInput" @change="onChange" @focus="onFocus" @blur="onBlur"
            @keyup.enter="onEnter" v-bind="$attrs">
    </template>
    <template v-else>

        <div ref="main" class="cmsInput iconInputWrapper" v-bind="$attrs" @click="toggleDropdown">
            <i :class="displayValue"></i>
        </div>

        <!-- 使用 Teleport 渲染到 body，实现 select 下拉框效果 -->
        <Teleport to="body">
            <div v-if="isDropdownOpen" ref="dropdownRef" class="iconSelectBox" :style="dropdownStyle">
                <input type="text" v-model="searchQuery" placeholder="请输入图标类名，如：icon-database-line">
                <div ref="scrollContainer" class="scroll iconContent">
                    <!-- 虚拟滚动占位 -->
                    <div :style="{ height: totalHeight + 'px' }">
                        <div :style="{

                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            paddingTop: startIndex * 40 + 'px'
                        }">
                            <div :title="item" v-for="item in iconList.filter(item => item.includes(searchQuery))" :key="item" class="iconItem"
                                @click="selectIcon(item)">
                                <i :class="item"></i>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="iconCount">共 {{ filteredIcons.length }} 个图标</div>
            </div>
        </Teleport>

    </template>
</template>

<script setup>
import { ref, computed, onActivated, watch, onMounted, onUnmounted } from 'vue'
import iconList from './iconList.json'

const props = defineProps({
    modelValue: [String, Number, Date],

    placeholder: String,
    disabled: Boolean,
    maxlength: Number,

    /** 类型：text / time / datetime / date */
    type: {
        type: String,
        default: 'text'
    },

    /** 时间格式 */
    format: String
})

const emit = defineEmits([
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'enter'
])

const main = ref(null)
const dropdownRef = ref(null)
const scrollContainer = ref(null)
const searchQuery = ref('')
const isDropdownOpen = ref(false)

// 下拉框位置样式
const dropdownStyle = ref({ display: 'none' })

// 虚拟滚动配置
const ITEM_HEIGHT = 40 // 每个图标高度（含 gap）
const ITEMS_PER_ROW = 10 // 每行显示数量
const VISIBLE_HEIGHT = 500 // 可视区域高度
const totalIcons = computed(() => filteredIcons.value.length)
const totalHeight = computed(() => Math.ceil(totalIcons.value / ITEMS_PER_ROW) * ITEM_HEIGHT)

// 滚动状态
const startIndex = ref(0)
const visibleCount = computed(() => {
    return Math.ceil(VISIBLE_HEIGHT / ITEM_HEIGHT) * ITEMS_PER_ROW + ITEMS_PER_ROW
})

// 过滤后的图标列表
const filteredIcons = computed(() => {
    if (!searchQuery.value) return iconList
    return iconList.filter(icon => icon.includes(searchQuery.value))
})




// 选择图标
function selectIcon(icon) {
    emit('update:modelValue', icon)
    isDropdownOpen.value = false
}

// 搜索时重置滚动位置
watch(searchQuery, () => {
    startIndex.value = 0
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0
    }
    updateDropdownPosition()
})

// 切换下拉框显示
function toggleDropdown() {
    if (props.disabled) return
    isDropdownOpen.value = !isDropdownOpen.value
    if (isDropdownOpen.value) {
        setTimeout(() => {
            updateDropdownPosition()
        }, 0)
    }
}

// 更新下拉框位置
function updateDropdownPosition() {
    if (!main.value || !dropdownRef.value) return

    const rect = main.value.getBoundingClientRect()
    dropdownStyle.value = {
        zIndex: getMaxZIndex(),
        position: 'fixed',
        top: rect.bottom + window.scrollY + 'px',
        left: rect.left + window.scrollX + 'px',
        width: rect.width + 'px',
    }
}

// 点击外部关闭下拉框
function handleClickOutside(e) {
    if (!main.value?.contains(e.target) && !dropdownRef.value?.contains(e.target)) {
        isDropdownOpen.value = false
    }
}

// 窗口大小改变时更新位置
function handleResize() {
    if (isDropdownOpen.value) {
        updateDropdownPosition()
    }
}

// 滚动时更新位置
function handleScroll() {
    if (isDropdownOpen.value) {
        updateDropdownPosition()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll, true)
})
function getMaxZIndex() {
    let maxZIndex = 0; // 初始化最大zIndex为0
    const elements = document.querySelectorAll('*'); // 选择页面中的所有元素

    elements.forEach((element) => {
        const zIndex = window.getComputedStyle(element).zIndex; // 获取元素的z-index样式

        if (!isNaN(zIndex)) { // 检查z-index是否为有效数字
            maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10)); // 更新最大zIndex
        }
    });
    return maxZIndex + 1;
}
/** ✅ 是否时间类型 */
const isTimeType = computed(() => {
    return ['time', 'datetime', 'date', 'datetime-local'].includes(props.type)
})

/** ✅ 自动格式 */
const finalFormat = computed(() => {
    if (props.format) return props.format

    switch (props.type) {
        case 'date':
            return 'YYYY-MM-DD'
        case 'time':
            return 'HH:mm'
        case 'datetime':
            return 'YYYY-MM-DD HH:mm'
        default:
            return ''
    }
})

/** input 类型（浏览器 input 统一用 text） */
const inputType = computed(() => {
    return isTimeType.value ? 'text' : props.type
})

/** 时间格式化 */
function formatDate(value, format) {
    if (!value) return ''

    const date = new Date(value)
    if (isNaN(date.getTime())) return value

    const map = {
        YYYY: date.getFullYear(),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0')
    }

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, key => map[key])
}

/** 解析时间 */
function parseDate(value) {
    if (!value) return null
    const date = new Date(value.replace(/-/g, '/'))
    return isNaN(date.getTime()) ? null : date
}

/** 当前时间 */
function getNow() {
    return formatDate(new Date(), finalFormat.value)
}

/** 默认值逻辑 */
watch(
    () => props.modelValue,
    (val) => {
        if (isTimeType.value && !val) {
            emit('update:modelValue', getNow())
        }
    },
    { immediate: true }
)

/** 显示值 */
const displayValue = computed(() => {
    if (isTimeType.value && props.modelValue) {
        return formatDate(props.modelValue, finalFormat.value)
    }
    return props.modelValue ?? ''
})

/** 输入 */
function onInput(e) {
    let value = e.target.value

    if (isTimeType.value) {
        const date = parseDate(value)
        if (date) {
            value = formatDate(date, finalFormat.value)
        }
    }

    emit('update:modelValue', value)
    emit('input', value)
}

/** change */
function onChange(e) {
    emit('change', e.target.value)
}

/** focus */
function onFocus(e) {
    emit('focus', e)
}

/** blur */
function onBlur(e) {
    let value = e.target.value

    if (isTimeType.value) {
        const date = parseDate(value)
        if (date) {
            value = formatDate(date, finalFormat.value)
            emit('update:modelValue', value)
        }
    }

    emit('blur', e)
}

/** enter */
function onEnter(e) {
    emit('enter', e.target.value)
}

onActivated(() => {
    if (main.value && window.getComputedStyle(main.value).textAlign === "center") {
        main.value.style.textIndent = "unset"
    }
})
</script>

<style scoped>
.iconInputWrapper {
    cursor: pointer;
}

.iconItem {
    border-radius: 3px;
    width: 30px;
    text-align: center;
    height: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.2s;
}

.iconItem i {
    font-size: 20px;
}

.iconItem:hover {
    background-color: #eef1f5;
    scale: 1.1;
    color: #409eff;
}

.iconContent {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    height: 400px;
}

.iconCount {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid #eee;
}

.cmsInput {
    border: 1px solid #757575;
    background-color: rgba(235, 235, 235, 0.75);
    height: 30px;
    border-radius: 10px;
    outline: none;
    color: #666;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 0.2s;
    line-height: 30px;
    position: relative;
}

.iconSelectBox {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-height: 500px;
    color: #666;
}

.iconSelectBox input {
    line-height: 30px;
    height: 30px;
    margin-bottom: 10px;
    border: 1px solid #757575;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
}

.cmsInput:hover {
    border-color: #999;
}

.cmsInput:focus {
    border-color: #409eff;
    background-color: rgba(255, 255, 255, 0.9);
}

.cmsInput:disabled {
    border: 1px solid #cccccc;
    background-color: rgba(226, 226, 226, 0.75);
    cursor: not-allowed;
    color: #aaa;
}

.cmsInput::placeholder {
    color: #aaa;
}
</style>