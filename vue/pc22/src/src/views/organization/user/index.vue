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
                        :filter-node-method="filterNode"
                        default-expand-all
                        @node-click="handleNodeClick"
                    />
                </div>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
                <el-form
                    v-show="showSearch"
                    ref="queryForm"
                    :model="queryParams"
                    :inline="true"
                    label-width="68px"
                >
                    <el-form-item label="用户名称" prop="username">
                        <el-input
                            v-model="queryParams.username"
                            placeholder="请输入用户名称"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input
                            v-model="queryParams.mobile"
                            placeholder="请输入手机号码"
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
                    <el-form-item v-if="false" label="创建时间">
                        <el-date-picker
                            v-model="dateRange"
                            size="small"
                            style="width: 240px"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
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

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            v-hasPermi="['permission:user:post']"
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-hasPermi="['permission:user:{id}:put']"
                            type="success"
                            plain
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            >修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-hasPermi="['permission:user:{id}:delete']"
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            >删除
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-hasPermi="['permission:user:import:post']"
                            type="info"
                            plain
                            icon="el-icon-upload2"
                            size="mini"
                            @click="handleImport"
                            >导入
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-hasPermi="['permission:user:export:get']"
                            type="warning"
                            plain
                            icon="el-icon-download"
                            size="mini"
                            @click="handleExport"
                            >导出
                        </el-button>
                    </el-col>
                </el-row>

                <el-table
                    v-loading="loading"
                    :data="userList"
                    @selection-change="handleSelectionChange"
                    class="yg-table"
                >
                    <el-table-column
                        type="selection"
                        width="50"
                        align="center"
                    />
                    <el-table-column
                        label="工号"
                        align="center"
                        prop="job_number"
                    />
                    <el-table-column
                        label="姓名"
                        align="center"
                        prop="username"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        key="deptName"
                        label="部门"
                        align="center"
                        prop="dept.deptName"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="职务"
                        align="center"
                        prop="username"
                    />
                    <el-table-column
                        label="手机"
                        align="center"
                        prop="mobile"
                        width="120"
                    />
                    <el-table-column
                        label="用工性质"
                        align="center"
                        prop="workNature"
                    />
                    <el-table-column
                        key="is_active"
                        label="状态"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.is_active"
                                disabled
                                @change="handleStatusChange(scope.row)"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                        align="center"
                        prop="create_datetime"
                        width="160"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                parseTime(scope.row.create_datetime)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="
                            hasPermi([
                                'permission:user:{id}:put',
                                'permission:user:{id}:delete',
                                'permission:user:resetpwd:put',
                            ])
                        "
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
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                >修改
                            </el-button>
                            <el-button
                                v-if="scope.row.id !== 1"
                                v-hasPermi="['permission:user:{id}:delete']"
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                >删除
                            </el-button>
                            <el-button
                                v-hasPermi="['permission:user:resetpwd:put']"
                                size="mini"
                                type="text"
                                icon="el-icon-key"
                                @click="handleResetPwd(scope.row)"
                                >重置
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

        <!-- 添加或修改参数配置对话框 -->
        <Yg-Drawer
            v-model="open"
            :title="title"
            @confirm="submitForm"
            @closed="cancel"
            @cancel="cancel"
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名称" prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="请输入用户名称"
                    />
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input
                        v-model="form.mobile"
                        placeholder="请输入手机号码"
                        maxlength="11"
                    />
                </el-form-item>
                <el-form-item
                    v-if="form.id == undefined"
                    label="用户密码"
                    prop="password"
                >
                    <el-input
                        v-model="form.password"
                        placeholder="请输入用户密码"
                        type="password"
                    />
                </el-form-item>
                <el-form-item label="工号" prop="job_number">
                    <el-input
                        v-model="form.job_number"
                        placeholder="请输入工号"
                    />
                </el-form-item>
                <el-form-item label="归属部门" prop="dept">
                    <treeselect
                        v-model="form.dept"
                        :options="deptOptions"
                        :show-count="true"
                        placeholder="请选择归属部门"
                    />
                </el-form-item>
                <el-form-item label="职务" prop="post">
                    <el-select
                        v-model="form.post"
                        multiple
                        placeholder="请选择职务"
                        class="multi-select"
                        popper-class="multi-select-popper"
                    >
                        <el-option
                            v-for="item in postOptions"
                            :key="item.id"
                            :label="item.postName"
                            :value="item.id"
                            :disabled="item.status == 0"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select
                        v-model="form.role"
                        multiple
                        placeholder="请选择角色"
                        class="multi-select"
                        popper-class="multi-select-popper"
                    >
                        <el-option
                            v-for="item in roleOptions"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                            :disabled="item.status == 0"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="用工性质" prop="workNature">
                    <el-select
                        v-model="form.workNature"
                        placeholder="请选择用工性质"
                    >
                        <el-option
                            v-for="item in laborType"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选择">
                        <el-option label="男" value="0" />
                        <el-option label="女" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="is_active">
                    <el-radio-group v-model="form.is_active">
                        <el-radio
                            v-for="dict in statusOptions"
                            :key="dict.dictValue"
                            :label="dict.dictValue"
                            >{{ dict.dictLabel }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="证件类型" prop="documentType">
                    <el-radio-group v-model="form.documentType">
                        <el-radio label="1">身份证</el-radio>
                        <el-radio label="2">护照</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="证件号码" prop="documentNum">
                    <el-input
                        v-model="form.documentNum"
                        placeholder="请输入证件号码"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>

        <!-- 用户导入对话框 -->
        <el-dialog
            :title="upload.title"
            :visible.sync="upload.open"
            width="400px"
            append-to-body
        >
            <el-upload
                ref="upload"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                    <el-checkbox v-model="upload.updateSupport" />
                    是否更新已经存在的用户数据
                    <el-link
                        type="info"
                        style="font-size: 12px"
                        @click="importTemplate"
                        >下载模板</el-link
                    >
                </div>
                <div slot="tip" class="el-upload__tip" style="color: red">
                    提示：仅允许导入“xls”或“xlsx”格式文件！
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm"
                    >确 定</el-button
                >
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    addUser,
    changeUserStatus,
    delUser,
    exportUser,
    getUser,
    importsUser,
    importTemplate,
    listUser,
    resetUserPwd,
    updateUser,
} from "@/request/api/organization/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/request/api/organization/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "User",
    components: { Treeselect },
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
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 部门树选项
            deptOptions: undefined,
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            laborType: [],
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [
                { dictLabel: "正常", dictValue: "1" },
                { dictLabel: "停用", dictValue: "0" },
            ],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label",
            },
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/system/savefile/",
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                username: undefined,
                mobile: undefined,
                is_active: undefined,
                dept: undefined,
            },
            // 表单校验
            rules: {
                username: [
                    {
                        required: true,
                        message: "用户名称不能为空",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "用户密码不能为空",
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "手机号不能为空",
                        trigger: "blur",
                    },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur",
                    },
                ],
                job_number: [
                    {
                        required: true,
                        message: "请输入工号",
                        trigger: "blur",
                    },
                ],
                is_active: [
                    {
                        required: true,
                        message: "请选择用户状态",
                        trigger: "change",
                    },
                ],
                gender: [
                    {
                        required: true,
                        message: "请选择用户性别",
                        trigger: "change",
                    },
                ],
                workNature: [
                    {
                        required: true,
                        message: "请选择用工性质",
                        trigger: "change",
                    },
                ],
                dept: [
                    {
                        required: true,
                        message: "请选择归属部门",
                        trigger: "change",
                    },
                ],
                post: [
                    {
                        required: true,
                        message: "请选择职务",
                        trigger: "change",
                    },
                ],
                documentType: [
                    {
                        required: true,
                        message: "请选择证件类型",
                        trigger: "change",
                    },
                ],
                documentNum: [
                    {
                        required: true,
                        message: "请输入证件号码",
                        trigger: "blur",
                    },
                    {
                        validator: (rule, value, callback) => {
                            let idCard =
                                /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
                            let passport =
                                /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/;
                            let type = this.form.documentType;
                            if (value != "" && value) {
                                if (type == "1") {
                                    if (!idCard.test(value)) {
                                        callback(
                                            new Error("请输入正确的身份证号码")
                                        );
                                    } else {
                                        callback();
                                    }
                                } else {
                                    if (!passport.test(value)) {
                                        callback(
                                            new Error("请输入正确的护照号码")
                                        );
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        },
    },
    created() {
        this.getList();
        this.getTreeselect();
        this.getDicts("usingLaborType").then((response) => {
            this.laborType = response.data;
        });
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
                (response) => {
                    this.userList = response.data.results;
                    this.total = response.data.count;
                    this.loading = false;
                }
            );
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect().then((response) => {
							console.log(response.data)
                this.deptOptions = this.handleTree(response.data, "id");
				console.log(this.deptOptions)
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.dept = data.id;
            this.getList();
        },
        // 用户状态修改
        handleStatusChange(row) {
            const text = row.is_active === true ? "启用" : "停用";
            this.$confirm(
                '确认要"' + text + '""' + row.username + '"用户吗?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return changeUserStatus(row.id, row.is_active);
                })
                .then(() => {
                    this.$toast(text + "成功");
                })
                .catch(function () {
                    row.is_active = row.is_active === false;
                });
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
                dept: undefined,
                username: undefined,
                password: undefined,
                mobile: undefined,
                gender: undefined,
                is_active: "0",
                documentType: "1",
                documentNum: undefined,
                workNature: undefined,
                post: [],
                role: [],
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.queryParams.dept = "";
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            getUser().then((response) => {
                this.postOptions = response.data.posts;
                this.roleOptions = response.data.roles;
                this.open = true;
                this.title = "添加用户";
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            const id = row.id || this.ids;
            getUser(id).then((response) => {
                const data = response.data.data;
                data.is_active = data.is_active ? "1" : "0";
                data.dept = data.deptId;
                data.workNature = Number(data.workNature);
                data["post"] = response.data.postIds;
                data["role"] = response.data.roleIds;
                this.form = data;
                this.postOptions = response.data.posts;
                this.roleOptions = response.data.roles;
                this.open = true;
                this.title = "修改用户";
                this.form.password = "";
            });
        },
        /** 重置密码按钮操作 */
        handleResetPwd(row) {
            this.$prompt('请输入"' + row.username + '"的新密码', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(({ value }) => {
                    resetUserPwd(row.id, value).then((response) => {
                        this.$toast("修改成功，新密码是：" + value);
                    });
                })
                .catch(() => {});
        },
        /** 提交按钮 */
        submitForm: function () {
            // console.log(this.form)
            this.$refs["form"].validate((valid,error) => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateUser(this.form).then((response) => {
                            this.$toast("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addUser(this.form).then((response) => {
                            this.$toast("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
                else{
                    this.$toastError("表单输入有误！")
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = row.id || this.ids,self = this;
            self.$confirm(
                '是否确认删除用户"' + row.username + '"的账号?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).then(function () {
                delUser(userIds).then(() => {
                    self.getList();
                    self.$toast("删除成功");
                });
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有用户数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportUser(queryParams);
                })
                .then((response) => {
                    this.download(response.data.file_url, response.data.name);
                });
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "用户导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            importTemplate().then((response) => {
                this.download(response.data.file_url, response.data.name);
            });
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            // 是否更新已经存在的用户数据
            importsUser({
                file_url: response.data.file_url,
                updateSupport: this.upload.updateSupport,
            }).then((response) => {
                this.$alert("导入成功！", "导入结果", {
                    dangerouslyUseHTMLString: true,
                });
                this.getList();
            });
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
    },
};
</script>
<style lang="scss" scoped>
.yg-table {
    margin-top: 20px;
}
</style>