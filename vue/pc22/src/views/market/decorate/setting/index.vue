<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="项目名称" prop="name" show-overflow-tooltip />
            <el-table-column label="规格" prop="type" show-overflow-tooltip></el-table-column>
            <el-table-column label="价格(元)" prop="price"></el-table-column>
            <el-table-column label="是否可退款" prop="allow_payback" :formatter="allowFormatter">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.allow_payback == 1 ? 'success' : 'danger'"
                    >{{ scope.row.allow_payback == 1 ? '允许' : '不允许' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="paging.pageNum"
            :limit.sync="paging.pageSize"
            @pagination="getList"
        />
        <Yg-Drawer
            v-model="showDrawer"
            :title="drawerType == 'add' ? '新建' : '编辑'"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
        >
            <el-form ref="form" :model="form" label-width="135px" :rules="rules">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="规格" prop="type">
                    <el-input v-model="form.type" placeholder="请输入规格"></el-input>
                </el-form-item>
                <el-form-item label="价格(元)" prop="price">
                    <el-input v-model="form.price" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="装修后是否可退回" prop="allow_payback">
                    <el-radio-group v-model="allow_payback" size="mini">
                        <el-radio-button label="1">可退回</el-radio-button>
                        <el-radio-button label="2">不可退回</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input
                        type="textarea"
                        rows="4"
                        v-model="form.description"
                        placeholder="请输入备注"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getList,
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    delOfficeAddress,
} from "@/request/api/market/decorate/setting";
export default {
    data() {
        return {
            valueMark: "1",
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                allow_payback: ""
            },
            allow_payback: "1",
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入项目名称",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请输入规格",
                        trigger: "blur",
                    },
                ],
                price: [
                    {
                        required: true,
                        message: "请输入价格",
                        trigger: "blur",
                    },
                ],
            },
            allow_paybackList: ['', '允许', '不允许']
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            getList(this.paging)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        getInfo() {
            const self = this,
                loading = this.$load();
            getInfo(this.itemId)
                .then((response) => {
                    self.allow_payback = response.data.allow_payback
                    self.form = response.data;
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        operation(type, id) {
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        drawerClosed() {
            this.showDrawer = false;
            (this.form = {
                name: "",
                repairer: "",
            }),
                this.resetForm("form");
        },
        del(id) {
            const self = this;
            self
                .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    delOfficeAddress(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                });
        },
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    self.form.allow_payback = self.allow_payback
                    if (self.drawerType == "add") {
                        addOfficeAddress(self.form)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        updateOfficeAddress(self.form, self.itemId)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("编辑成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                } else {
                    self.$toastError("请将表单填写完整");
                }
            });
        },
        allowFormatter(row) {
            return this.allow_paybackList[row.allow_payback]
        }
    },
};
</script>

<style lang="scss" scoped>
.el-select {
    width: 100%;
}
.el-table {
    ::v-deep .el-tag {
        width: 59px;
        text-align: center;
    }
}
</style>

