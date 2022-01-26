<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        @pagination="handlePagination"
        @search="handleSearch"
        :showLimit="4"
    >
        <!-- 按钮操作栏 -->
        <template slot="action-bar">
            <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd"
                v-hasPermi="['permission:post:post']"
                >新增</el-button
            >
            <el-button
                type="warning"
                icon="el-icon-download"
                @click="handleExport"
                v-hasPermi="['permission:post:export:get']"
                >导出</el-button
            >
        </template>
        <el-table v-loading="loading" :data="postList" border height="100%">
            <el-table-column label="岗位编号" align="center" prop="id" />
            <el-table-column label="岗位编码" align="center" prop="postCode" />
            <el-table-column label="岗位名称" align="center" prop="postName" />
            <el-table-column label="岗位排序" align="center" prop="postSort" />
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag
                        type="success"
                        effect="dark"
                        v-if="scope.row.status == '1'"
                        >正常</el-tag
                    >
                    <el-tag type="danger" effect="dark" v-else>停用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                prop="create_datetime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.create_datetime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                v-if="
                    hasPermi([
                        'permission:post:{id}:put',
                        'permission:post:{id}:delete',
                    ])
                "
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['permission:post:{id}:put']"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['permission:post:{id}:delete']"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加或修改岗位对话框 -->
        <Drawer
            :title="title"
            :visible.sync="open"
            width="500px"
            @close="resetForm"
            @confirm="submitForm"
            v-loading="drawerLoading"
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="岗位名称" prop="postName">
                    <el-input
                        v-model="form.postName"
                        placeholder="请输入岗位名称"
                    />
                </el-form-item>
                <el-form-item label="岗位编码" prop="postCode">
                    <el-input
                        v-model="form.postCode"
                        placeholder="请输入编码名称"
                    />
                </el-form-item>
                <el-form-item label="岗位顺序" prop="postSort">
                    <el-input-number
                        v-model="form.postSort"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>
                <el-form-item label="岗位状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">正常</el-radio>
                        <el-radio label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        placeholder="请输入内容"
                    />
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
</template>

<script>
import {
    listPost,
    getPost,
    delPost,
    addPost,
    updatePost,
    exportPost,
} from "@/request/api/organization/post";

export default {
    name: "Post",
    data() {
        return {
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                form: [
                    {
                        name: "postCode",
                        label: "岗位编码",
                        type: "input",
                    },
                    {
                        name: "postName",
                        label: "岗位名称",
                        type: "input",
                    },
                    {
                        name: "status",
                        label: "状态",
                        type: "select",
                        multiple: true,
                        options: [
                            {
                                label: "正常",
                                value: "1",
                            },
                            {
                                label: "停用",
                                value: "0",
                            },
                        ],
                    },
                ],
            },
            // 遮罩层
            loading: true,
            // 岗位表格数据
            postList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {},
            // 表单参数
            form: {
                postSort: 0,
                status: "1",
            },
            // 表单校验
            rules: {
                postName: [
                    {
                        required: true,
                        message: "岗位名称不能为空",
                        trigger: "blur",
                    },
                ],
                postCode: [
                    {
                        required: true,
                        message: "岗位编码不能为空",
                        trigger: "blur",
                    },
                ],
                postSort: [
                    {
                        required: true,
                        message: "岗位顺序不能为空",
                        trigger: "blur",
                    },
                ],
            },
            drawerLoading: false,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            listPost(this.queryFormat(this.queryParams, this.search))
                .then((response) => {
                    this.postList = response.data.results;
                    this.search.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // 分页方法
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        // 搜索方法
        handleSearch(e) {
            this.queryParams = e;
            this.search.pageNum = 1;
            this.getList();
        },
        // 表单重置
        resetForm() {
            this.form = {
                postSort: 0,
                status: "1",
            };
            this.$refs["form"].resetFields();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open = true;
            this.title = "添加岗位";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            getPost(row.id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改岗位";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.drawerLoading = true;
                    if (this.form.id != undefined) {
                        updatePost(this.form)
                            .then((response) => {
                                this.$success("修改成功");
                                this.open = false;
                                this.getList();
                            })
                            .finally((error) => {
                                this.drawerLoading = false;
                            });
                    } else {
                        addPost(this.form)
                            .then((response) => {
                                this.$success("新增成功");
                                this.open = false;
                                this.getList();
                            })
                            .finally((error) => {
                                this.drawerLoading = false;
                            });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.id || this.ids;
            this.$confirm(
                '是否确认删除岗位编号为"' + postIds + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return delPost(postIds);
                })
                .then(() => {
                    this.getList();
                    this.$success("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有岗位数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportPost(queryParams);
                })
                .then((response) => {
                    this.download(response.data.file_url, response.data.name);
                });
        },
    },
};
</script>
