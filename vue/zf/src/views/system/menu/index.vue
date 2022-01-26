<template>
    <Table-page
        :page-num="search.pageNum"
        :searchForm="search.form"
        @search="handleSearch"
    >
        <el-table
            v-loading="loading"
            :data="menuList"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            height="100%"
            border
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
            <el-table-column prop="orderNum" label="排序" align="center" />
            <el-table-column
                prop="menuType"
                label="菜单类型"
                align="center"
                :formatter="menuTypeFormat"
            />
            <el-table-column
                prop="status"
                label="状态"
                align="center"
                :formatter="statusFormat"
            />
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
        <Dialog
            title="修改菜单"
            :visible.sync="open"
            @closed="reset"
            width="600px"
            append-to-body
            @confirm="submitForm"
            v-loading="dialogLoading"
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
        </Dialog>
    </Table-page>
</template>

<script>
import { getMenu, listMenu, updateMenu } from "@/request/api/system/menu";

export default {
    name: "Menu",
    data() {
        return {
            search: {
                pageNum: "all",
                form: [
                    {
                        name: "name",
                        label: "菜单名称",
                        type: "input",
                    },
                ],
            },
            // 查询参数
            queryParams: {},
            // 遮罩层
            loading: true,
            // 菜单表格树数据
            menuList: [],
            // 是否显示弹出层
            open: false,
            dialogLoading: false,
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
        // 搜索方法
        handleSearch(e) {
            this.queryParams = e;
            this.getList();
        },
        /** 查询菜单列表 */
        getList() {
            this.loading = true;
            listMenu(this.queryFormat(this.queryParams, this.search))
                .then((response) => {
                    this.menuList = this.handleTree(response.data, "id");
                })
                .finally((error) => {
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
        // 表单重置
        reset() {
            this.form = {};
            this.$refs["form"].resetFields();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            getMenu(row.id).then((response) => {
                this.form = response.data;
                this.open = true;
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true;
                    const cloneData = JSON.parse(JSON.stringify(this.form));
                    if (cloneData.parentId === 0) {
                        delete cloneData["parentId"];
                    }
                    updateMenu(cloneData)
                        .then((response) => {
                            this.$success("修改成功");
                            this.open = false;
                            this.getList();
                        })
                        .finally((error) => {
                            this.dialogLoading = false;
                        });
                }
            });
        },
    },
};
</script>
