<template>
    <!--申请记录
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
            <el-table-column prop="name" label="申请名称" width="180">
            </el-table-column>
            <el-table-column
                prop="totalApplication"
                label="申请金额"
                width="180"
            >
            </el-table-column>
            <el-table-column prop="availAbleAmount" label="可用余额">
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间"> </el-table-column>
            <el-table-column prop="applicant" label="申请人"> </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status"
                        >正常</el-tag
                    >
                    <el-tag type="danger" v-else>失效</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-button size="mini" type="text">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Yg-Drawer>
</template>
<script>
export default {
    name: "ApplicationRecord",
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    totalApplication: "+2000",
                    name: "2021年公司预算",
                    availAbleAmount: "2000",
                    startTime: "2021-01-02",
                    endTime: "2021-12-01",
                    applicant: "申请人1",
                    status: true,
                },
                {
                    id: 2,
                    totalApplication: "+2000",

                    name: "招待费",
                    availAbleAmount: "2000",
                    startTime: "2021-01-02",
                    endTime: "2021-12-01",
                    applicant: "申请人2",
                    status: false,
                },
                {
                    id: 3,
                    totalApplication: "-2000",
                    name: "预算调整",
                    availAbleAmount: "2000",
                    startTime: "2021-01-02",
                    endTime: "2021-12-01",
                    applicant: "申请人3",
                    status: false,
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
