<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <div class="head-container">
                    <el-input
                        v-model="deptName"
                        placeholder="请输入部门名称"
                        clearable
                        size="small"
                        prefix-icon="el-icon-search"
                        style="margin-bottom: 20px"
                    />
                </div>
                <div class="head-container">
                    <el-tree
                        ref="tree"
                        :data="deptOptions"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        default-expand-all
                    />
                </div>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
                <el-form
                    ref="queryForm"
                    :model="queryParams"
                    :inline="true"
                    label-width="68px"
                >
                    <el-form-item label="公司名称" prop="username">
                        <el-input
                            v-model="queryParams.username"
                            placeholder="请输入公司名称"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="负责人" prop="mobile">
                        <el-input
                            v-model="queryParams.mobile"
                            placeholder="请输入负责人"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input
                            v-model="queryParams.mobile"
                            placeholder="请输入手机"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="账号" prop="mobile">
                        <el-input
                            v-model="queryParams.mobile"
                            placeholder="请输入账号"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="状态" prop="is_active">
                        <el-select
                            v-model="queryParams.is_active"
                            placeholder="用户状态"
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

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            >新增
                        </el-button>
                    </el-col>
                </el-row>

                <el-table
                    v-loading="loading"
                    :data="tableData"
                >
                    <el-table-column
                        label="头像"
                        align="center"
                        prop="id"
                    />
                    <el-table-column
                        label="公司名称"
                        align="center"
                        prop="username"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="用户昵称"
                        align="center"
                        prop="name"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="账号"
                        align="center"
                        prop="dept.deptName"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="负责人"
                        align="center"
                        prop="dept.role"
                        :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                        label="手机"
                        align="center"
                        prop="mobile"
                        width="120"
                    />
                    <el-table-column
                        label="开通时间"
                        align="center"
                        prop="create_datetime"
                    >
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center"
                        prop="status"
                    >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="160"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                v-hasPermi="['permission:user:{id}:put']"
                                size="mini"
                                type="text"
                                >查看
                            </el-button>
                            <el-button
                                v-hasPermi="['permission:user:{id}:put']"
                                size="mini"
                                type="text"
                                >编辑
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
    </div>
</template>

<script>
export default {
    name: "Subsidiary",
    data() {
        return {
            deptOptions: [
                {
                    label: "一级 1",
                    children: [
                        {
                            label: "二级 1-1",
                            children: [
                                {
                                    label: "三级 1-1-1",
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "一级 2",
                    children: [
                        {
                            label: "二级 2-1",
                            children: [
                                {
                                    label: "三级 2-1-1",
                                },
                            ],
                        },
                        {
                            label: "二级 2-2",
                            children: [
                                {
                                    label: "三级 2-2-1",
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "一级 3",
                    children: [
                        {
                            label: "二级 3-1",
                            children: [
                                {
                                    label: "三级 3-1-1",
                                },
                            ],
                        },
                        {
                            label: "二级 3-2",
                            children: [
                                {
                                    label: "三级 3-2-1",
                                },
                            ],
                        },
                    ],
                },
            ],
            defaultProps: {
                children: "children",
                label: "label",
            },
            deptName:'',
            queryParams:{},
            statusOptions:[],
            loading:false,
            tableData:[],
            total:100
        };
    },
    methods: {
        handleQuery(){

        },
        resetQuery(){},
        handleAdd(){
            this.$router.push("/organization/subsidiaryAdd")
        }
    },
    created() {
    },
};
</script>

<style scoped lang="scss">
</style>

