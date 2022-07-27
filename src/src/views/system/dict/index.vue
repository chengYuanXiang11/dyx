<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="showDictDialog">新建</el-button>
        </div>
        <el-table
            v-loading="loading"
            :data="tableData"
            class="yg-table"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column label="参数名称" prop="listName" />
            <el-table-column label="编码" prop="listCode" align="center" />
            <el-table-column label="排序" prop="orderNum" align="center" />
            <el-table-column label="创建时间" prop="create_datetime" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope" v-if="scope.row.parentId != 0">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <Yg-Drawer
            v-model="dictDialog"
            :title="`${dictId == '' ? '新建' : '编辑'}字典`"
            @confirm="confirmForm"
            @closed="close"
            @cancel="close"
            :confirmLoading="confirmLoading"
        >
            <el-form
                ref="dictForm"
                :model="dictForm"
                label-width="100px"
                :rules="dictRules"
            >
                <el-form-item label="上级参数" prop="parentId">
                    <el-select
                        placeholder="请选择上级参数"
                        v-model="dictForm.parentId"
                    >
                        <el-option
                            v-for="(o, index) in dictOption"
                            :key="index"
                            :label="o.listName"
                            :value="o.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数名称" prop="listName">
                    <el-input
                        v-model="dictForm.listName"
                        placeholder="请输入参数名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="参数编码" prop="listCode">
                    <el-input
                        v-model="dictForm.listCode"
                        placeholder="请输入参数编码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number
                        v-model="dictForm.orderNum"
                        controls-position="right"
                    ></el-input-number>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getList,
    addDict,
    delDict,
    getDictOption,
    editDict,
} from "@/request/api/system/dict";

export default {
    name: "Parameter",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 角色表格数据
            tableData: [],
            dictDialog: false,
            dictForm: {},
            confirmLoading: false,
            dictOption: [],
            dictId: "",
            dictRules: {
                listName: [
                    {
                        required: true,
                        message: "请输入参数名称",
                        trigger: "blur",
                    },
                ],
                listCode: [
                    {
                        required: true,
                        message: "请输入参数编码",
                        trigger: "blur",
                    },
                ],
                orderNum: [
                    {
                        required: true,
                        message: "请输入排序",
                        trigger: "blur",
                    },
                ],
                parentId: [
                    {
                        required: true,
                        message: "请选择上级参数",
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
        getList() {
            this.loading = true;
            getList()
                .then((res) => {
                    this.tableData = this.handleTree(res.data, "id");
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        confirmForm() {
            this.$refs["dictForm"].validate((valid) => {
                if (valid) {
                    this.confirmLoading = true;
                    if (this.dictId == "") {
                        addDict(this.dictForm)
                            .then((res) => {
                                this.close();
                                this.$toast("新增字典成功！");
                                this.getList();
                            })
                            .finally((error) => {
                                this.confirmLoading = false;
                            });
                    } else {
                        editDict(this.dictForm,this.dictId)
                            .then((res) => {
                                this.close();
                                this.$toast("编辑字典成功！");
                                this.getList();
                            })
                            .finally((error) => {
                                this.confirmLoading = false;
                            });
                    }
                }
            });
        },
        handleDelete(row) {
            this.$confirm(`是否删除名称为【${row.listName}】的数据?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delDict(row.id).then((res) => {
                    this.$toast("删除成功！");
                    this.getList();
                });
            });
        },
        close() {
            this.dictForm = {};
            this.dictId = "";
            this.resetForm("dictForm");
            this.dictDialog = false;
        },
        showDictDialog() {
            getDictOption({
                pageNum:'all'
            }).then((res) => {
                this.dictOption = res.data;
                this.dictDialog = true;
            });
        },
        handleUpdate(row) {
            this.dictId = row.id;
            this.dictForm = {
                parentId: row.parentId,
                listName: row.listName,
                listCode: row.listCode,
                orderNum: row.orderNum,
            };
            this.showDictDialog();
        },
    },
};
</script>
