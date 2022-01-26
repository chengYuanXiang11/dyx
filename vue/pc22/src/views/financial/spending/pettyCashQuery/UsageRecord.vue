<template>
    <!--使用记录
         -->
    <Yg-Drawer
        v-model="showValue"
        title="申请记录"
        @confirm="submitForm"
        @closed="closed"
        @cancel="cancel"
        @open="open"
        size="700px"
    >
        <el-table :data="tableData" style="width: 100%" class="yg-table">
            <el-table-column prop="date" label="日期"> </el-table-column>
            <el-table-column prop="applicationAmount" label="申请金额">
            </el-table-column>
            <el-table-column prop="availableBalance" label="可用余额">
            </el-table-column>
            <el-table-column prop="returnTime" label="归还时间">
            </el-table-column>
        </el-table>
    </Yg-Drawer>
</template>
<script>
export default {
    name: "UsageRecord",
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    date: "2020-01-02",
                    returnTime: "2020-01-02",
                    availableBalance: "2000",
                    applicationAmount: "3000",
                },
                {
                    id: 2,
                    date: "2020-01-02",
                    returnTime: "2020-01-02",
                    availableBalance: "2000",
                    applicationAmount: "3000",
                },
                {
                    id: 3,
                    date: "2020-01-02",
                    returnTime: "2020-01-02",
                    availableBalance: "2000",
                    applicationAmount: "3000",
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
