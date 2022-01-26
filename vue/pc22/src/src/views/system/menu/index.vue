<template>
    <div class="app-container">
        <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
        >
            <el-form-item label="菜单名称" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入菜单名称"
                    clearable
                    size="small"
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
        <el-table
            v-loading="loading"
            :data="menuList"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            class="yg-table"
        >
            <el-table-column
                prop="name"
                label="菜单名称"
                :show-overflow-tooltip="true"
                width="160"
            />
            <el-table-column
                prop="icon"
                label="图标"
                align="center"
                width="100"
            >
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.icon || ''" />
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" width="60" />
            <el-table-column
                prop="menuType"
                label="菜单类型"
                :formatter="menuTypeFormat"
                width="80"
            />
            <el-table-column
                prop="perms"
                label="权限标识"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                prop="component_path"
                label="组件路径"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                prop="status"
                label="状态"
                :formatter="statusFormat"
                width="80"
            />
            <el-table-column
                label="更新时间"
                align="center"
                prop="update_datetime"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.update_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                prop="create_datetime"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.create_datetime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="
                    hasPermi([
                        'permission:menus:{id}:put',
                        'permission:menus:post',
                        'permission:menus:{id}:delete',
                    ])
                "
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['permission:menus:{id}:put']"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        >修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog
            title="修改菜单"
            :visible.sync="open"
            width="600px"
            append-to-body
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item
                    :label="form.menuType == '2' ? '菜单名称' : '按钮名称'"
                    prop="name"
                >
                    <el-input
                        v-model="form.name"
                        placeholder="请输入菜单名称"
                    />
                </el-form-item>
                <el-form-item label="显示排序" prop="orderNum">
                    <el-input-number
                        v-model="form.orderNum"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    addMenu,
    delMenu,
    getMenu,
    listMenu,
    updateMenu,
} from "@/request/api/organization/menu";

export default {
    name: "Menu",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 菜单表格树数据
            menuList: [],
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: "all",
                status:'1'
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                orderNum: [
                    {
                        required: true,
                        message: "菜单顺序不能为空",
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
        /** 查询菜单列表 */
        getList() {
            this.loading = true;
            listMenu(this.queryParams).then((response) => {
                this.menuList = this.handleTree(response.data, "id");
                this.loading = false;
            });
        },
        // 菜单状态字典翻译
        statusFormat(row, column) {
            switch (row.status) {
                case "0":
                    return "停用";
                case "1":
                    return "正常";
                default:
                    break;
            }
        },
        // 菜单类型 字典翻译
        menuTypeFormat(row, column) {
            switch (row.menuType) {
                case "0":
                    return "目录";
                case "1":
                    return "菜单";
                case "2":
                    return "按钮";
                default:
                    break;
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            getMenu(row.id).then((response) => {
                this.form = response.data;
                this.open = true;
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    const cloneData = JSON.parse(JSON.stringify(this.form));
                    if (cloneData.parentId === 0) {
                        delete cloneData["parentId"];
                    }
                    updateMenu(cloneData).then((response) => {
                        this.$toast("修改成功");
                        this.open = false;
                        this.getList();
                    });
                }
            });
        }
    },
};
</script>
