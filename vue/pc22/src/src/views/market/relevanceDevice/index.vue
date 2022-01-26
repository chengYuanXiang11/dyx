<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="商铺" name="shop">
                <el-row :gutter="20">
                    <!--用户数据-->
                    <el-col :span="24">
                        <el-table v-loading="loading" :data="todoList" border>
                            <el-table-column
                                key="id"
                                label="商位编码"
                                align="center"
                                prop="id"
                            />
                            <el-table-column
                                key="username"
                                label="当前商户"
                                align="center"
                                prop="username"
                            />
                            <el-table-column
                                key="name"
                                label="设备数量(个)"
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
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="handleUpdate(scope.row)"
                                        >关联设备
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="queryParams.pageNum"
                            :limit.sync="queryParams.pageSize"
                            @pagination="getList"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="仓库" name="store">
                <el-row :gutter="20">
                    <!--用户数据-->
                    <el-col :span="24">
                        <el-table v-loading="loading" :data="todoList" border>
                            <el-table-column
                                label="事项类型"
                                align="center"
                                prop="id"
                            />
                            <el-table-column
                                label="发起人"
                                align="center"
                                prop="username"
                            />
                            <el-table-column
                                label="发起时间"
                                align="center"
                                prop="name"
                            />
                            <el-table-column
                                label="操作时间"
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
                        <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="queryParams.pageNum"
                            :limit.sync="queryParams.pageSize"
                            @pagination="getList"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="宿舍" name="dorm">
                <el-row :gutter="20">
                    <!--用户数据-->
                    <el-col :span="24">
                        <el-table v-loading="loading" :data="todoList" border>
                            <el-table-column
                                key="id"
                                label="待办类型"
                                align="center"
                                prop="id"
                            />
                            <el-table-column
                                key="username"
                                label="发起人"
                                align="center"
                                prop="username"
                            />
                            <el-table-column
                                key="name"
                                label="发起时间"
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
                        <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="queryParams.pageNum"
                            :limit.sync="queryParams.pageSize"
                            @pagination="getList"
                        />
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
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
            activeName: "shop",
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = false;

        },
    },
};
</script>
