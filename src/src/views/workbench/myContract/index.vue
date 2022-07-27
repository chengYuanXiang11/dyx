<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="联系人" prop="roleName">
                <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入联系人名称"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="联系电话" prop="roleKey">
                <el-input
                    v-model="queryParams.roleKey"
                    placeholder="请输入联系电话"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="租赁类型" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="角色状态"
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
            <el-form-item label="商位号" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="角色状态"
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
            <el-form-item label="状态" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="角色状态"
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
            @selection-change="handleSelectionChange"
            border
        >
            <el-table-column label="商位号" prop="id" width="120" />
            <el-table-column
                label="租赁类型"
                prop="roleName"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="位置"
                prop="roleKey"
                :show-overflow-tooltip="true"
            />
            <el-table-column label="起止时间" prop="roleSort" width="100" />
            <el-table-column label="月数" align="center" width="100">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-value="1"
                        inactive-value="0"
                        disabled
                        @change="handleStatusChange(scope.row)"
                    />
                </template>
            </el-table-column>
            <el-table-column
                label="联系人"
                align="center"
                prop="create_datetime"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.create_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="联系电话"
                align="center"
                prop="create_datetime"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.create_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="create_datetime">
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
                        >查看合同{{scope}}</el-button
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
    name: "Mycontract",
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

