<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="商户名称" prop="roleName">
                <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入客户姓名"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="联系人" prop="roleKey">
                <el-input
                    v-model="queryParams.roleKey"
                    placeholder="请输入客户手机号"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="联系电话" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="客户分类"
                    clearable
                    size="small"
                    style="width: 240px"
                >
                    <el-option
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="招商经理" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="客户来源"
                    clearable
                    size="small"
                    style="width: 240px"
                >
                    <el-option
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                </el-select>
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
        <el-table
            v-loading="loading"
            :data="roleList"
            border
        >
            <el-table-column label="商户名称" prop="id" width="120" />
            <el-table-column
                label="商户名称"
                prop="roleName"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="商户类型"
                prop="roleKey"
                :show-overflow-tooltip="true"
            />
            <el-table-column label="联系电话" prop="roleSort" width="100" />
            <el-table-column label="招商经理" align="center" width="100"></el-table-column>
            <el-table-column
                label="状态"
                align="center"
                prop="create_datetime"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.create_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        >查看{{scope}}</el-button
                    >
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        >编辑{{scope}}</el-button
                    >
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        >缴费管理{{scope}}</el-button
                    >
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
import { listRole } from "@/request/api/organization/role";

export default {
    name: "Mymerchants",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 角色表格数据
            roleList: [],
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
    created() {
        this.getList();
    },
    methods: {
        /** 查询角色列表 */
        getList() {
            this.loading = true;
            listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
                (response) => {
                    this.roleList = response.data.results;
                    this.total = response.data.count;
                    this.loading = false;
                }
            );
        },
    },
};
</script>

