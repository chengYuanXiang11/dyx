<template>
    <div class="table-apply">
        <!--  -->
            <!-- 流程列表 -->
            <div>
                <el-button class="add-apply" @click="newApply">新建</el-button>
            </div>
            <el-table
                :data="resDate"
                style="width: 100%"
                v-loading="loding"
                border
                max-height="716"
            >
                <el-table-column
                    :label="title.label"
                    width="180"
                    v-for="(title, index) in formTitle"
                    :key="index"
                >
                    <template slot="header">
                        {{ title.label
                        }}{{ title.label.includes("时长") ? "(小时)" : "" }}
                    </template>
                    <template slot-scope="scope">
                        {{ tableData[scope.$index][title.prop] }}
                    </template>
                </el-table-column>
                <el-table-column label="申请时间" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.create_datetime }}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.node_name === '已通过'"
                            >已通过</el-tag
                        >
                        <el-tag
                            type="danger"
                            v-else-if="scope.row.node_name === '已拒绝'"
                            >已拒绝</el-tag
                        >
                        <el-tag type="warning" v-else>审批中</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.row.id, scope.row)"
                            >查看</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <!-- //分页 -->
            <pagination
                class="pagination"
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                :pageSizes="[10, 20, 50]"
                @pagination="getList"
            />
            <!--  -->
        <!-- < -->
    </div>
</template>

<script>
import { getTableList } from "@/request/api/system/flow.js";

export default {
    name: "Apply",

    data() {
        return {
            //所有数据
            resDate: [],
            //表单数据
            tableData: [],
            loding: true,
            code: this.$route.query.code,
            total: 100,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
        };
    },
    computed: {
        formTitle() {
            switch (this.code) {
                case "leave":
                    return [
                        {
                            prop: "leaveTime",
                            label: "开始时间",
                        },
                        {
                            prop: "leaveEndTime",
                            label: "结束时间",
                        },
                        {
                            prop: "leaveDuration",
                            label: "请假时长",
                        },
                    ];
                case "makeup":
                    return [
                        {
                            prop: "clockinTime",
                            label: "原打卡时间",
                        },
                        {
                            prop: "makeupTime",
                            label: "补卡时间",
                        },
                    ];
                case "overtime":
                    return [
                        {
                            prop: "overtimeDuration",
                            label: "加班时长",
                        },
                        {
                            prop: "overtimeTime",
                            label: "开始时间",
                        },
                        {
                            prop: "overtimeEndTime",
                            label: "结束时间",
                        },

                        {
                            prop: "issueType",
                            label: "发放方式",
                        },
                    ];
                case "goout":
                    return [
                        {
                            prop: "gooutDuration",
                            label: "外出时长",
                        },
                        {
                            prop: "gooutTime",
                            label: "开始时间",
                        },
                        {
                            prop: "gooutEndTime",
                            label: "结束时间",
                        },
                    ];
                case "goout":
                    return [
                        {
                            prop: "gooutDuration",
                            label: "外出时长",
                        },
                        {
                            prop: "gooutTime",
                            label: "开始时间",
                        },
                        {
                            prop: "gooutEndTime",
                            label: "结束时间",
                        },
                    ];
                default:
                    break;
            }
        },
        formValues() {
            return function (i) {
                console.log(i);
                return i;
            };
        },
    },
    created() {
        // 修改面包屑
        this.getList()
    },
    activated(){
        this.getList()
    },
    methods: {
        getList() {
            getTableList(this.$route.query.id,
            this.queryParams.pageNum,
             this.queryParams.pageSize
            ).then((res) => {
                this.resDate = res.data.results;
                this.total = res.data.count
                this.resDate.forEach((v) => {
                    this.tableData.push(JSON.parse(v.flow_var));
                });
            }).finally((error) => {
                     this.loding = false;
                });
            if (this.$route.query.flow_name !== undefined) {
                this.$route.meta.title = this.$route.query.flow_name;
            }
        },
        newApply() {

            this.$router.push({
                path: `/ApplyFor?flow_name=${this.$route.query.name}&code=${this.$route.query.code}&id=${this.$route.query.id}`,
            });
        },
        handleEdit(index, row) {
            this.$router.push({
                path: `/ApplyDetails?examine_id=${this.$route.query.id}&examine_instance_id=${index}`,
            });
            console.log(index, row);
        },

    },
};
</script>

<style scoped lang="scss">
.table-apply {
    // width: 1184px;
    // height: 716px;
    background: #ffffff;
    border-radius: 2px;
    display: flex;
    flex-flow: column nowrap;
    border: none;
    padding: 16px 24px;
    .add-apply {
        margin-bottom: 20px;
        background-color: #048790;
        color: #fff;
        border-color: #048790;
    }
    //表头背景
    ::v-deep .el-table th.el-table__cell {
        background-color: #fafafa;
    }
    // td/th右侧边框去除
    ::v-deep .el-table--border .el-table__cell {
        border-right: none;
    }
}
</style>
