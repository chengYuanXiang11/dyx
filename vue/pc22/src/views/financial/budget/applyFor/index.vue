<template>
    <div class="app-container">
        <!-- 预算详情 -->
        <BudgetDetails v-model="BudgetDetailsShow"></BudgetDetails>
        <!-- 申请记录 -->
        <ApplicationRecord v-model="ApplicationRecordShow"></ApplicationRecord>
        <!-- 使用记录 -->
        <UsageRecord v-model="UsageRecordShow"></UsageRecord>
        <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="department" label="部门" width="180">
            </el-table-column>
            <el-table-column
                prop="totalAmount"
                label="预算总金额(元)"
                width="180"
            >
            </el-table-column>
            <el-table-column prop="availableAmount" label="当前可用金额(元)">
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-button
                        size="mini"
                        type="text"
                        @click="showNode('BudgetDetailsShow')"
                        >预算详情</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="showNode('ApplicationRecordShow')"
                        >申请记录</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="showNode('UsageRecordShow')"
                        >使用记录</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import BudgetDetails from "./components/BudgetDetails.vue";
import ApplicationRecord from "./components/ApplicationRecord.vue";
import UsageRecord from "./components/UsageRecord.vue";

export default {
    name: "To-do",
    data() {
        return {
            BudgetDetailsShow: false,
            ApplicationRecordShow: false,
            UsageRecordShow: false,
            tableData: [
                {
                    id: 1,
                    totalAmount: "150,000.00",
                    availableAmount: "150,000.00",
                    department: "堉古集团",
                    children: [
                        {
                            id: 11,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "运营中心",
                        },
                        {
                            id: 12,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "市场部",
                            children: [
                                {
                                    id: 121,
                                    totalAmount: "150,000.00",
                                    availableAmount: "150,000.00",
                                    department: "市场开发部",
                                    children: [
                                        {
                                            id: 1211,
                                            totalAmount: "150,000.00",
                                            availableAmount: "150,000.00",
                                            department: "市场战略部",
                                        },
                                        {
                                            id: 1212,
                                            totalAmount: "150,000.00",
                                            availableAmount: "150,000.00",
                                            department: "市场宣传部",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 11,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "客服部",
                        },
                        {
                            id: 11,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "财务部",
                        },
                        {
                            id: 11,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "行政部",
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        // 打开弹窗
        showNode(type) {
            console.log(this[type]);
            this[type] = true;
        },
    },
    components: {
        BudgetDetails,
        UsageRecord,
        ApplicationRecord,
    },
    created() {
        console.log(this.$route);
    },
};
</script>

<style scoped lang="scss"></style>
