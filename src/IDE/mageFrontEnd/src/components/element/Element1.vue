<template>
    <div>
        <el-table border :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180" align="center" />
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="address" label="地址" />

            <!-- 自定义操作列 -->
            <el-table-column label="操作" width="150" align="center">
                <template #default="scope">
                    <!-- 把 scope.row 传出去 -->
                    <slot name="operation" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const tableData = ref([
    {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
    },
    {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
    },
    {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
    },
    {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
    }
]);
</script>
