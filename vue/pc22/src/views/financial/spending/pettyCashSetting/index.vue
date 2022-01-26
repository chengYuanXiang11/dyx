<template>
    <div class="app-container">
        <!-- 备用金设置 -->
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
                <template slot-scope="scope">
                    <el-input
                        v-model="scope.row.availableAmount"
                        v-if="scope.row.input"
                    ></el-input>
                    <span v-else>{{ scope.row.availableAmount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        v-if="scope.row.input"
                        @click="preservation(scope.row)"
                        >保存</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        v-else
                        @click="setUp(scope.row)"
                        >设置</el-button
                    >
                    <el-button size="mini" type="text" @click="usageRecords">记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 使用记录 -->
        <UsageRecord v-model="usageRecordShow"></UsageRecord>
    </div>
</template>

<script>
import UsageRecord from "./UsageRecord.vue";
export default {
    name: "To-do",
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    totalAmount: "150,000.00",
                    availableAmount: "150,000.00",
                    department: "堉古集团",
                    input: false,
                    children: [
                        {
                            id: 11,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "运营中心",
                            input: false,
                        },
                        {
                            id: 12,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "市场部",
                            input: false,

                            children: [
                                {
                                    id: 121,
                                    totalAmount: "150,000.00",
                                    availableAmount: "150,000.00",
                                    department: "市场开发部",
                                    input: false,

                                    children: [
                                        {
                                            id: 1211,
                                            totalAmount: "150,000.00",
                                            availableAmount: "150,000.00",
                                            department: "市场战略部",
                                            input: false,
                                        },
                                        {
                                            id: 1212,
                                            totalAmount: "150,000.00",
                                            availableAmount: "150,000.00",
                                            department: "市场宣传部",
                                            input: false,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 13,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "客服部",
                            input: false,
                        },
                        {
                            id: 14,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "财务部",
                            input: false,
                        },
                        {
                            id: 15,
                            totalAmount: "150,000.00",
                            availableAmount: "150,000.00",
                            department: "行政部",
                            input: false,
                        },
                    ],
                },
            ],
            usageRecordShow:false
        };
    },
    components: { UsageRecord },
    methods: {
        // 保存
        preservation(data) {
            data.input = false;
        },
        // 设置
        setUp(index) {
            // console.log(index)
            // 打开输入框
            index.input = true;
        },
        // 打开记录
        usageRecords(){
            this.usageRecordShow = true
        }
    },
    created() {
        console.log(this.$route);
    },
};
</script>

<style scoped lang="scss"></style>
