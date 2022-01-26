<template>
    <div class="app-container">
        <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="getList"
            v-loading="loading"
        >
            <el-tab-pane label="待我审批" name="pending">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-table :data="todoList" border class="yg-table">
                            <el-table-column
                                label="流程名称"
                                align="center"
                                prop="examine_name"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.user_name }}提交的{{
                                        scope.row.examine_name
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="申请人"
                                align="center"
                                prop="user_name"
                            />
                            <el-table-column
                                label="申请时间"
                                align="center"
                                prop="create_datetime"
                            />
                            <el-table-column
                                label="操作"
                                align="center"
                                width="160"
                                class-name="small-padding fixed-width"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="
                                            handleUpdate(
                                                1,
                                                scope.row.examine_id,
                                                scope.row.examine_instance_id,
                                                scope.row.id
                                            )
                                        "
                                        >查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row></el-tab-pane
            >
            <el-tab-pane label="抄送我的" name="cc-mme">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-table :data="todoList" border class="yg-table">
                            <el-table-column
                                label="流程名称"
                                align="center"
                                prop="examine_name"
                            />
                            <el-table-column
                                label="申请人"
                                align="center"
                                prop="creator_name"
                            />
                            <el-table-column
                                label="申请时间"
                                align="center"
                                prop="create_datetime"
                            />
                            <el-table-column
                                label="审批状态"
                                align="center"
                                prop="name"
                            />
                            <el-table-column
                                label="操作"
                                align="center"
                                width="160"
                                class-name="small-padding fixed-width"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="handleUpdate(scope.row)"
                                        >查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row></el-tab-pane
            >
            <el-tab-pane label="我的申请" name="apply">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-table :data="todoList" border class="yg-table">
                            <el-table-column
                                label="流程名称"
                                align="center"
                                prop="title"
                            />
                            <el-table-column
                                label="申请时间"
                                align="center"
                                prop="create_datetime"
                            />
                            <el-table-column
                                label="当前节点"
                                align="center"
                                prop="name"
                            >
                                <template slot-scope="scope">
                                    <el-link
                                        type="primary"
                                        :underline="false"
                                        @click="viewCurrent(scope.row)"
                                        >查看当前节点
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="审批状态"
                                align="center"
                                prop="node_name"
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        type="success"
                                        v-if="scope.row.node_name == '已通过'"
                                        >已通过</el-tag
                                    >
                                    <el-tag
                                        type="danger"
                                        v-else-if="
                                            scope.row.node_name == '已拒绝'
                                        "
                                        >已拒绝</el-tag
                                    >
                                    <el-tag v-else type="warning"
                                        >审批中</el-tag
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="160"
                                class-name="small-padding fixed-width"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="
                                            handleUpdate(
                                                0,
                                                scope.row.examine_id,
                                                scope.row.id
                                            )
                                        "
                                        >查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="审批完成" name="completed">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-table :data="todoList" border class="yg-table">
                            <el-table-column
                                label="流程名称"
                                align="center"
                                prop="examine_name"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.user_name }}提交的{{
                                        scope.row.examine_name
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="申请人"
                                align="center"
                                prop="user_name"
                            />
                            <el-table-column
                                label="申请时间"
                                align="center"
                                prop="create_datetime"
                            />
                            <el-table-column label="审批状态" align="center">
                                <template slot-scope="scope">
                                    <el-tag
                                        type="success"
                                        v-if="scope.row.result == 2"
                                        >已通过</el-tag
                                    >
                                    <el-tag
                                        type="danger"
                                        v-else-if="scope.row.result == 3"
                                        >已拒绝</el-tag
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="160"
                                class-name="small-padding fixed-width"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="
                                            handleUpdate(
                                                0,
                                                scope.row.examine_id,
                                                scope.row.examine_instance_id
                                            )
                                        "
                                        >查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row></el-tab-pane
            >
        </el-tabs>
        <Nodedetails v-model="nodeShow" :node_id="node_id"></Nodedetails>
        <pagination
            v-show="total > 0"
            :total="total"
            :page-sizes="[10, 20, 50]"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import {
    needToBe,
    myGetStatusPage,
    copyMe,
} from "@/request/api/system/flow.js";
import Nodedetails from "../../personnel/processMonitor/Nodedetails.vue";
export default {
    name: "Myprocess",
    data() {
        return {
            total: 100,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            loading: false,
            // 表单数据
            todoList: [],
            // tabs 的 状态
            activeName: "pending",
            // 节点情况右侧弹窗
            nodeShow: false,
            // 当前节点id
            node_id: 0,
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    components: {
        Nodedetails,
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            switch (this.activeName) {
                case "pending":
                    this.needToBe("0");
                    break;
                case "cc-mme":
                    this.copyMe();
                    break;
                case "apply":
                    this.myGetStatusPage();
                    break;
                case "completed":
                    this.needToBe("2,3");
                    break;
            }
        },
        // 获取审批
        needToBe(activeName) {
            needToBe(activeName, this.queryParams).then((res) => {
                this.todoList = res.data.results;
                this.total = res.data.count;

            }) .finally((error) => {
                    this.loading = false;
                });
        },
        // 获取我的申请
        myGetStatusPage() {
            myGetStatusPage(this.queryParams).then((res) => {
                this.todoList = res.data.results;
                this.total = res.data.count;
            }).finally((error) => {
                    this.loading = false;
                });
        },
        // 获取抄送
        copyMe() {
            copyMe(this.queryParams).then((res) => {
                this.todoList = res.data.results;
                this.total = res.data.count;

            }).finally((error) => {
                    this.loading = false;
                });
        },
        // 查看当前流程节点
        viewCurrent(val) {
            this.node_id = val.id;
            this.nodeShow = true;
        },
        //调整到流程详情
        handleUpdate(type = 0, examine_id, examine_instance_id, id) {
            if (type === 0) {
                this.$router.push({
                    path: `/ApplyDetails?examine_id=${examine_id}&examine_instance_id=${examine_instance_id}`,
                });
            } else {
                this.$router.push({
                    path: `/ApplyDetails?type=1&examine_id=${examine_id}&examine_instance_id=${examine_instance_id}&id=${id}`,
                });
            }
        },
    },
};
</script>
