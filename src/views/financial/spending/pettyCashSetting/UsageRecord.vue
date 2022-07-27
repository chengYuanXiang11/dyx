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
            <el-table-column prop="date" label="日期" >
            </el-table-column>
            <el-table-column prop="applicant" label="说明" >
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
                    applicant: "王磊  归还  2000元",
                },
                {
                    id: 2,
                    date: "2020-01-02",
                    applicant: "王磊  报销  住宿  2000元",
                },
                {
                    id: 3,
                    date: "2020-01-02",
                    applicant: "赵磊  将可用金额2000元 改 为1000元",
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
