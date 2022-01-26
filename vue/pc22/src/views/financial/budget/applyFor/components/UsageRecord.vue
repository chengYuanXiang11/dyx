<template>
    <!--使用记录
         -->
    <Yg-Drawer
        v-model="showValue"
        title="使用记录"
        @confirm="submitForm"
        @closed="closed"
        @cancel="cancel"
        @open="open"
        size="700px"
    >
        <el-table :data="tableData" style="width: 100%" class="yg-table">
            <el-table-column prop="date" label="日期" >
            </el-table-column>
            <el-table-column prop="explain" label="说明">
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
                    date: "2016-05-02",
                    explain: "吴磊  付款  2021公司预算   XXX  2000元",
                },
                {
                    date: "2016-05-04",
                    explain: "王磊  报销  2021公司预算   住宿  2000元",
                },
                {
                    date: "2016-05-01",
                    explain: "赵磊  报销  2021公司预算   餐饮  2000元",
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
