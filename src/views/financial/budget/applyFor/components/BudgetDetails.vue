<template>
    <!--预算详情
         -->
    <Yg-Drawer
        v-model="showValue"
        title="预算详情"
        @confirm="submitForm"
        @closed="closed"
        @cancel="cancel"
        @open="open"
        size="700px"
    >
        <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            class="yg-table"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="name" label="预算项目" >
            </el-table-column>
            <el-table-column prop="totalApplication" label="申请总额" >
            </el-table-column>
            <el-table-column prop="availAbleAmount" label="可用金额">
            </el-table-column>
        </el-table>
    </Yg-Drawer>
</template>
<script>
export default {
    name: "BudgetDetails",
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    totalApplication: "120.000.0",
                    name: "办公经费",
                    availAbleAmount: "100.000.0",
                },
                {
                    id: 2,
                    totalApplication: "120.000.0",
                    name: "招待费",
                    availAbleAmount: "100.000.0",
                },
                {
                    id: 3,
                    totalApplication: "120.000.0",
                    name: "差旅费",
                    availAbleAmount: "100.000.0",
                    children: [
                        {
                            id: 31,
                            totalApplication: "120.000.0",
                            name: "餐饮费",
                            availAbleAmount: "100.000.0",
                        },
                        {
                            id: 32,
                            totalApplication: "120.000.0",
                            name: "住宿费",
                            availAbleAmount: "100.000.0",
                        },
                        {
                            id: 33,
                            totalApplication: "120.000.0",
                            name: "预算交通费",
                            availAbleAmount: "100.000.0",
                        },
                    ],
                },
            ],
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        showValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        open() {
            this.$toast("打开事件");
        },
        submitForm() {
            this.$toast("提交事件");
        },

        closed() {
            this.$toast("关闭事件");
        },
        cancel() {
            this.$toast("取消事件");
        },
    },
};
</script>
