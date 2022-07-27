<template>
    <!-- 待办事项 -->
    <div class="app-container">
        <el-tabs v-model="activeName" type="card" @tab-click="getList">
            <el-tab-pane label="待办事项" name="todo">
                <el-row :gutter="18">
                    <!--用户数据-->
                    <el-col :span="24">
                        <el-table
                            v-loading="loading"
                            :data="todoList"
                            class="yg-table"
                        >
                            <el-table-column
                                label="时间id(后续删除)"
                                align="center"
                                prop="id"
                            />

                            <el-table-column
                                label="发起人(后续删除)"
                                align="center"
                                prop="user_name"
                            />
                            <el-table-column
                                label="待办类型"
                                align="center"
                                prop="examine_name"
                            />
                            <el-table-column
                                label="发起时间"
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
                                        @click="handleUpdate(scope.row)"
                                        >查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row></el-tab-pane
            >
            <el-tab-pane label="已办事项" name="have-done">
                <el-row :gutter="20">
                    <!--用户数据-->
                    <el-col :span="24">
                        <el-table
                            v-loading="loading"
                            :data="todoList"
                            class="yg-table"
                        >
                             <el-table-column
                                label="时间id(后续删除)"
                                align="center"
                                prop="id"
                            />

                            <el-table-column
                                label="发起人(后续删除)"
                                align="center"
                                prop="user_name"
                            />
                            <el-table-column
                                label="事项类型"
                                align="center"
                                prop="examine_name"
                            />
                            <el-table-column
                                label="发起时间"
                                align="center"
                                prop="create_datetime"
                            />
                                <el-table-column
                                label="操作时间"
                                align="center"
                                prop="update_datetime"
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
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <!-- //分页 -->
        <pagination
            class="pagination"
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
            :pageSizes="[10, 20, 50]"
        />
    </div>
</template>

<script>
import { needToBe } from "@/request/api/system/flow.js";

export default {
    name: "Todo",
    data() {
        return {
            total: 100,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            loading: true,
            todoList: [],
            activeName: "todo",
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            let result = this.activeName === "todo" ? 0 : '2,3';
            needToBe(result, this.queryParams).then((res) => {
                this.todoList = res.data.results;
                this.total = res.data.count;
            }).finally((error) => {
                    this.loading = false;
                });
        },
        handleUpdate(v) {
            this.$router.push({
                // examine_id代表当前事件id              代表事件类型的id(比如：请假为6)
                path: `/ApplyDetails?type=${
                    this.activeName === "todo" ? 1 : 0
                }&examine_id=${v.examine_id}&examine_instance_id=${
                    v.examine_instance_id
                }&id=${v.id}`,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.app-container {
    margin-bottom: 50px;
}
.pagination {
    position: fixed;
    bottom: 10px;
    right: 20px;
}
//修改card选项卡默认样式
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #fff;
}
::v-deep .el-tabs--card > .el-tabs__header {
    border: none;
    margin: 0px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
    background-color: #f6f6f6;
    border-bottom-color: #dfe4ed;
    border: 1px solid #dfe4ed;
    margin-right: 2px;
}
</style>
