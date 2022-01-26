<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="角色名称" prop="roleName">
                <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="roleList" border>
            <el-table-column label="流程名称" prop="roleName" width="120" />
            <el-table-column
                label="申请人"
                prop="remark"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="申请时间"
                prop="status"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="当前节点"
                prop="status"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="滞留时长"
                prop="status"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="审批状态"
                prop="status"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button size="mini" type="text">查看</el-button>
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
    </div>
</template>

<script>
export default {
    name: "Processmonitor",
    data() {
        return {
            // 遮罩层
            loading: false,
            // 总条数
            total: 0,
            // 角色表格数据
            roleList: [{}],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                roleName: undefined,
                roleKey: undefined,
                status: undefined,
            },
        };
    },
    methods: {
        getList(){

        },
        handleQuery(){

        },
        resetQuery(){

        }
    },
};
</script>

<style scoped lang="scss">
</style>

