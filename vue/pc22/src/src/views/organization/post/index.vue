<template>
    <div class="app-container">
        <el-form
            v-show="showSearch"
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="68px"
        >
            <el-form-item label="职务编码" prop="postCode">
                <el-input
                    v-model="queryParams.postCode"
                    placeholder="请输入职务编码"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="职务名称" prop="postName">
                <el-input
                    v-model="queryParams.postName"
                    placeholder="请输入职务名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="职务状态"
                    clearable
                    size="small"
                >
                    <el-option label="正常" value="1" />
                    <el-option label="停用" value="0" />
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
                    v-hasPermi="['permission:post:post']"
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['permission:post:{id}:put']"
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    >修改</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['permission:post:{id}:delete']"
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['permission:post:export:get']"
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    >导出</el-button
                >
            </el-col>
        </el-row>

        <el-table
            v-loading="loading"
            :data="postList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" align="center" prop="id" />
            <el-table-column label="职务名称" align="center" prop="postName" />
            <el-table-column label="职务编码" align="center" prop="postCode" />
            <el-table-column label="职务排序" align="center" prop="postSort" />
            <el-table-column
                label="状态"
                align="center"
                prop="status"
                :formatter="statusFormat"
            />
            <el-table-column
                label="创建时间"
                align="center"
                prop="create_datetime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.create_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="
                    hasPermi([
                        'permission:post:{id}:put',
                        'permission:post:{id}:delete',
                    ])
                "
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['permission:post:{id}:put']"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        v-hasPermi="['permission:post:{id}:delete']"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
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

        <!-- 添加或修改职务对话框 -->
        <Yg-Drawer
            v-model="open"
            :title="title"
            @confirm="submitForm"
            @closed="cancel"
            @cancel="cancel"
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="职务名称" prop="postName">
                    <el-input
                        v-model="form.postName"
                        placeholder="请输入职务名称"
                    />
                </el-form-item>
                <el-form-item label="职务编码" prop="postCode">
                    <el-input
                        v-model="form.postCode"
                        placeholder="请输入编码名称"
                    />
                </el-form-item>
                <el-form-item label="职务顺序" prop="postSort">
                    <el-input-number
                        v-model="form.postSort"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>
                <el-form-item label="职务状态" prop="status">
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
        </Yg-Drawer>
    </div>
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
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 职务表格数据
            postList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                postCode: undefined,
                postName: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                postName: [
                    {
                        required: true,
                        message: "职务名称不能为空",
                        trigger: "blur",
                    },
                ],
                postCode: [
                    {
                        required: true,
                        message: "职务编码不能为空",
                        trigger: "blur",
                    },
                ],
                postSort: [
                    {
                        required: true,
                        message: "职务顺序不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询职务列表 */
        getList() {
            this.loading = true;
            listPost(this.queryParams).then((response) => {
                this.postList = response.data.results;
                this.total = response.data.count;
                this.loading = false;
            });
        },
        // 职务状态字典翻译
        statusFormat(row, column) {
            return row.status == "1" ? "正常" : "停用";
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                postCode: undefined,
                postName: undefined,
                postSort: 0,
                status: "1",
                remark: undefined,
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加职务";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getPost(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改职务";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updatePost(this.form).then((response) => {
                            this.$toast("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addPost(this.form).then((response) => {
                            this.$toast("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.id || this.ids;
            this.$confirm(
                '是否确认删除职务编号为"' + postIds + '"的数据项?',
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
                    this.$toast("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有职务数据项?", "警告", {
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
