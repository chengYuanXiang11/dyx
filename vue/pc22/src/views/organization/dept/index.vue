<template>
    <Table-page :page-num="search.pageNum">
        <template slot="action-bar">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
                >新增</el-button
            >
        </template>
        <el-table
            v-loading="loading"
            :data="deptList"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            height="100%"
            border
        >
            <el-table-column prop="deptName" label="部门名称" />
            <el-table-column prop="deptCode" label="编码" />
            <el-table-column prop="userCount" label="在职人数" align="center" />
            <el-table-column prop="ownerName" label="负责人" />
            <el-table-column
                prop="orderNum"
                label="排序"
                width="200"
                align="center"
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
                        'permission:dept:{id}:put',
                        'permission:dept:post',
                        'permission:dept:{id}:delete',
                    ])
                "
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['permission:dept:{id}:put']"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        v-hasPermi="['permission:dept:post']"
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAdd(scope.row)"
                        >新增</el-button
                    >
                    <el-button
                        v-if="scope.row.parentId !== 0"
                        v-hasPermi="['permission:dept:{id}:delete']"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <Drawer
            :visible.sync="deptDialog"
            :title="dialogType == 'add' ? '新建部门' : '编辑部门'"
            @confirm="confirmForm"
            @closed="formClosed"
            v-loading="drawerLoading"
        >
            <el-form
                ref="deptForm"
                :model="deptForm"
                label-width="100px"
                :rules="deptRules"
            >
                <el-form-item label="部门名称" prop="deptName">
                    <el-input
                        v-model="deptForm.deptName"
                        placeholder="请输入部门名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="部门编码" prop="deptCode">
                    <el-input
                        v-model="deptForm.deptCode"
                        placeholder="请输入部门编码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="部门负责人">
                    <select-users
                        v-model="deptHead"
                        type="user"
                        :multiple="false"
                        placeholder="请选择部门负责人"
                    ></select-users>
                </el-form-item>
                <el-form-item
                    label="上级部门"
                    prop="parentId"
                    v-if="deptForm.id != 1"
                >
                    <div class="dept-tree">
                        <DeptTree
                            v-model="deptForm.parentId"
                            placeholder="请选择上级部门"
                            :show-count="true"
                        ></DeptTree>
                        <div class="prompt">
                            <i class="el-icon-warning"></i>
                            注：部门移动时，下级部门将一起移动
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number
                        v-model="deptForm.orderNum"
                        controls-position="right"
                        :min="0"
                        placeholder="请输入排序"
                    ></el-input-number>
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
</template>

<script>
import {
    listDept,
    addDept,
    deptDetails,
    updateDept,
    delDept,
} from "@/request/api/organization/dept";
import DeptTree from "@/components/DeptTree";
export default {
    name: "Organizationdept",
    components: {
        DeptTree,
    },
    data() {
        return {
            search: {
                pageNum: "all",
            },
            deptList: [],
            loading: false,
            deptDialog: false,
            dialogType: "add",
            deptForm: {},
            deptRules: {
                deptName: [
                    {
                        required: true,
                        message: "请输入部门名称",
                        trigger: "blur",
                    },
                ],
                deptCode: [
                    {
                        required: true,
                        message: "请输入部门编码",
                        trigger: "blur",
                    },
                ],
                parentId: [
                    {
                        required: true,
                        message: "请选择上级部门",
                        trigger: "change",
                    },
                ],
                orderNum: [
                    {
                        required: true,
                        message: "请输入部门排序",
                        trigger: "blur",
                    },
                ],
            },
            promoterVisible: true,
            drawerLoading: false,
            deptHead: {},
        };
    },
    methods: {
        getList() {
            this.loading = true;
            listDept()
                .then((res) => {
                    this.deptList = this.handleTree(res.data, "id");
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        confirmForm() {
            const self = this;
            self.$refs["deptForm"].validate((valid) => {
                if (valid) {
                    self.drawerLoading = true;
                    self.deptForm.owner = self.deptHead.user_id;
                    if (self.dialogType == "add") {
                        addDept(self.deptForm)
                            .then((res) => {
                                self.$success("新增成功！");
                                self.getList();
                                self.deptDialog = false;
                            })
                            .finally((error) => {
                                self.drawerLoading = false;
                            });
                    } else {
                        if (self.deptForm.parentId === 0) {
                            delete self.deptForm["parentId"];
                        }
                        updateDept(self.deptForm)
                            .then((res) => {
                                self.$success("修改成功！");
                                self.getList();
                                self.deptDialog = false;
                            })
                            .finally((error) => {
                                self.drawerLoading = false;
                            });
                    }
                }
            });
        },
        formClosed() {
            this.deptForm = {};
            this.deptHead = {};
            this.$refs["deptForm"].resetFields();
        },
        handleAdd(row) {
            row ? (this.deptForm.parentId = row.id) : undefined;
            this.deptDialog = true;
            this.dialogType = "add";
        },
        handleUpdate(row) {
            deptDetails(row.id).then((res) => {
                this.dialogType = "edit";
                this.deptDialog = true;
                this.deptForm = this.filterObj(res.data, [
                    "id",
                    "deptName",
                    "deptCode",
                    "orderNum",
                    "parentId",
                ]);
                if (res.data.ownerName && res.data.owner) {
                    this.deptHead = {
                        user_id: res.data.owner,
                        user_name: res.data.ownerName,
                    };
                }
            });
        },
        handleDelete(row) {
            this.$confirm(`是否删除【${row.deptName}】部门?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delDept(row.id).then((res) => {
                        this.$success("删除成功");
                        this.getList();
                    });
                })
                .catch(() => {});
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
.tabs-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.dept-tree {
    .prompt {
        font-size: 12px;
        color: #e6a23c;
    }
}
.company {
    height: 100%;
    li {
        display: flex;
        padding: 15px 0;
        span {
            width: 120px;
            text-align: center;
            font-size: 16px;
        }
        p {
            margin: 0;
            border-bottom: solid 1px #ddd;
            flex: 1;
        }
    }
}
</style>

