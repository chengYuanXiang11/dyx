<template>
    <div class="app-container">
        <div>
            <el-form
                v-show="showSearch"
                ref="queryForm"
                :model="paging"
                :inline="true"
                label-width="85x"
            >
                <el-form-item label="商户名称" prop="store_name">
                    <el-input
                        v-model="paging.store_name"
                        placeholder="请输入商户名称"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>
                <el-form-item label="提交时间" prop="update_datetime">
                    <el-date-picker
                        v-model="paging.update_datetime"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="审核状态" prop="judge_state">
                    <el-select
                        v-model="paging.judge_state"
                        placeholder="请选择审核状态"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in judgeStateList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="验收状态" prop="pass_state">
                    <el-select
                        v-model="paging.pass_state"
                        placeholder="请选择验收状态"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in passStateList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.id"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery"
                    >搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="商户名称" prop="store_name" show-overflow-tooltip />
            <el-table-column label="装修位置" prop="location" show-overflow-tooltip></el-table-column>
            <el-table-column label="装修项目" prop="decoration_type"></el-table-column>
            <el-table-column label="合计金额(元)" prop="count_price"></el-table-column>
            <el-table-column label="审核状态" prop="judge_state">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.judge_state == 1" type="warning">未提交</el-tag>
                    <el-tag v-else type="danger">已拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="验收状态" prop="pass_state" :formatter="passFormatter"></el-table-column>
            <el-table-column label="提交时间" prop="update_datetime"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="details(scope.row.id)">查看</el-button>
                    <el-button size="mini" type="text" @click="acceptance(scope.row.id)">验收</el-button>
                    <!-- <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button> -->
                    <!-- <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button> -->
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
                <el-form-item label="规格" prop="repairer">
                    <el-input v-model="form.repairer" placeholder="请输入规格"></el-input>
                </el-form-item>
                <el-form-item label="价格(元)" prop="repairer">
                    <el-input v-model="form.repairer" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="装修后是否可退回" prop="repairer">
                    <el-radio-group v-model="valueMark" size="mini">
                        <el-radio-button label="1">可退回</el-radio-button>
                        <el-radio-button label="2">不可退回</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="repairer">
                    <el-input rows="4" v-model="form.repairer" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>

        <!-- 验收弹窗 -->
        <el-dialog title="验收项目" :visible.sync="dialogTableVisible" :before-close="dialogClose">
            <el-table :data="gridData" border>
                <el-table-column property="date" label="项目名称" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column property="name" label="规格" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column property="address" label="价格(元)" show-overflow-tooltip></el-table-column>
                <el-table-column property="address" label="是否可退款" show-overflow-tooltip></el-table-column>
                <el-table-column property="address" label="是否合格">
                    <template slot-scope="scope">
                        <el-radio-group
                            :fill="scope.row.mark == 1 ? '#52C41A' : scope.row.mark == 2 ? '#FF4D4F' : '#fff'"
                            v-model="scope.row.mark"
                            size="small"
                        >
                            <el-radio-button label="1" style="background:#52C41A">合 格</el-radio-button>
                            <el-radio-button label="2" style="background:#FF4D4F">不合格</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAcceptance">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getList,
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    delOfficeAddress,
} from "@/request/api/market/decorate/mgmt";
export default {
    data() {
        return {
            // 显示搜索条件
            showSearch: true,
            dialogTableVisible: false,
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                mark: '2'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                mark: '1'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                mark: '1'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                mark: '1'
            }],
            valueMark: "1",
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
                store_name: "",
                update_datetime: "",
                judge_state: "",
                pass_state: ""
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {

            },
            judgeStateList: [
                { label: "未提交", id: "1" },
                { label: "已拒绝", id: "2" },
            ],
            passStateList: [
                { label: "未验收", id: "1" },
                { label: "已验收", id: "2" },
            ],
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入类别名称",
                        trigger: "blur",
                    },
                ],
                repairer: [
                    {
                        required: true,
                        message: "请输入负责人",
                        trigger: "change",
                    },
                ],
            },
            customerTypeList: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        details(id) {
            this.$router.push({ path: '/decorationView/view', query: { id: id } })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.paging.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 打开验收弹窗
        acceptance(id) {
            this.dialogTableVisible = true
        },
        // 关闭验收弹窗
        dialogClose() {
            this.dialogTableVisible = false
        },
        // 验收确定
        saveAcceptance() {
            this.dialogTableVisible = false
            console.log(this.gridData);
        },
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

        passFormatter(row) {
            let list = ['', '未验收', '已验收']
            return list[row.pass_state]
        }
    },
};
</script>

<style lang="scss" scoped>
.el-select {
    width: 100%;
}

.el-table {
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: rgb(82, 196, 26);
        border-color: rgb(82, 196, 26);
        box-shadow: 0px 0 0 0 #048790;
    }

    ::v-deep .el-radio-button .el-radio-button__inner {
        border-radius: 0 !important;
    }
}
</style>

