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
                <el-form-item label="客户姓名" prop="customerName">
                    <el-input
                        v-model="paging.customerName"
                        placeholder="请输入客户姓名"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input
                        v-model="paging.mobile"
                        placeholder="请输入联系电话"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="客户分类" prop="customerClassify">
                    <el-select
                        v-model="paging.customerClassify"
                        placeholder="请选择客户分类"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in customerClassifyList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="招商经理" prop="leasingManager">
                    <el-select
                        v-model="paging.leasingManager"
                        placeholder="请选择招商经理"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in leasingManagerList"
                            :key="dict.id"
                            :label="dict.username"
                            :value="dict.username"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="客户类型" prop="customerType" v-show="isShow">
                    <el-select
                        v-model="paging.customerType"
                        placeholder="请选择客户类型"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in customerTypeList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="拟经营品种" prop="saleCategory" v-show="isShow">
                    <el-select
                        multiple
                        v-model="paging.saleCategory"
                        placeholder="请选择拟经营品种"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in saleCategoryList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="客户来源" prop="customerSource" v-show="isShow">
                    <el-select
                        v-model="paging.customerSource"
                        placeholder="请选择客户来源"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in customerSourceList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.label"
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
                    <el-button
                        type="primary"
                        :icon="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        size="mini"
                        @click="searchShow"
                    >{{ isShow ? "收起" : "高级" }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="客户姓名" prop="customerName" />
            <el-table-column label="联系电话" prop="mobile" />
            <el-table-column label="客户类型" prop="customerType" :formatter="formatCustomerType" />
            <el-table-column label="拟经营品种" prop="saleCategory" :formatter="formatSaleCategory" />
            <el-table-column
                label="客户分类"
                prop="customerClassify"
                :formatter="formatCustomerClassify"
            ></el-table-column>
            <el-table-column label="客户来源" prop="customerSource" :formatter="formatCustomerSource"></el-table-column>
            <el-table-column
                label="招商经理"
                prop="leasingManager"
                :formatter="formatterLeasingManager"
            ></el-table-column>
            <el-table-column label="最后沟通时间" prop="lastCommunicateTime"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="communicate('communicate', scope.row.id)"
                    >沟通</el-button>
                    <el-button size="mini" type="text" @click="merchant(scope.row.id)">商户管理</el-button>
                    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
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
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="招商经理" prop="leasingManager">
                    <el-input
                        ref="leasingManager"
                        readonly
                        v-model="form.leasingManager"
                        placeholder="请选择招商经理"
                    >
                        <template slot="append">
                            <el-button type="primary" @click="showDialog = true" size="mini">
                                {{
                                    Object.keys(datas).length > 0 ? "替换人员" : "选择人员"
                                }}
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="客户姓名" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="客户类型" prop="customerType">
                    <el-radio-group v-model="form.customerType">
                        <el-radio
                            v-for="m in customerTypeList"
                            :key="m.id"
                            :label="m.id"
                        >{{ m.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="拟经营品种" prop="saleCategory">
                    <el-select
                        v-model="form.saleCategory"
                        placeholder="请选择拟经营品种"
                        multiple
                        clearable
                    >
                        <el-option
                            v-for="m in saleCategoryList"
                            :key="m.id"
                            :label="m.label"
                            :value="m.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户来源" prop="customerSource">
                    <el-radio-group v-model="form.customerSource">
                        <el-radio
                            v-for="m in customerSourceList"
                            :key="m.id"
                            :label="m.id"
                        >{{ m.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="客户分类" prop="customerClassify">
                    <el-radio-group v-model="form.customerClassify">
                        <el-radio
                            v-for="m in customerClassifyList"
                            :key="m.id"
                            :label="m.id"
                        >{{ m.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </Yg-Drawer>

        <!-- 沟通 -->
        <Yg-Drawer
            v-model="showDrawerCommunicate"
            title="沟通记录"
            @confirm="confirmFormCommunicate"
            @closed="drawerClosedCommunicate"
            @cancel="drawerClosedCommunicate"
            :confirmLoading="btnLoadingCommunicate"
        >
            <div class="form-box">
                <div>
                    <div v-for="m in communicateList" :key="m.id" class="box">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="card-title">{{ m.theme }}</span>
                            </div>
                            <div class="content-box">
                                <div class="content-text">{{ m.content }}</div>
                                <div class="content-des">
                                    <span class="text-one">{{ m.name }}</span>
                                    <span class="text-Two">{{ m.time }}</span>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div>
                    <el-form
                        ref="formCommunicate"
                        :model="formCommunicate"
                        label-width="120px"
                        :rules="rulesCommunicate"
                    >
                        <el-form-item label="沟通主题" prop="theme">
                            <el-input v-model="formCommunicate.theme" placeholder="请输入沟通主题"></el-input>
                        </el-form-item>
                        <el-form-item label="沟通时间" prop="time">
                            <el-date-picker
                                v-model="formCommunicate.time"
                                type="datetime"
                                placeholder="选择日期时间"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="沟通内容" prop="content">
                            <el-input
                                type="textarea"
                                rows="4"
                                v-model="formCommunicate.content"
                                placeholder="请输入沟通内容"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </Yg-Drawer>

        <SelectUsersDialog
            :visible.sync="showDialog"
            :data="datas"
            model="user"
            :multiple="false"
            placeholder="请选择人员"
            @confirm="getDatas"
        ></SelectUsersDialog>
    </div>
</template>

<script>
import {
    getList,
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    delOfficeAddress,
    getUserList,
} from "@/request/api/market/merchantsMgmt/chinaMerchants";
export default {
    data() {
        return {
            showDialog: false,
            datas: {},
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
                customerName: "",
                mobile: "",
                customerClassify: "",
                leasingManager: "",
                customerType: "",
                saleCategory: [],
                customerSource: "",
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                leasingManager: "",
                customerType: ""
            },
            rules: {
                leasingManager: [
                    {
                        required: true,
                        message: "请输入招商经理",
                        trigger: "blur",
                    },
                ],
                customerName: [
                    {
                        required: true,
                        message: "请输入客户姓名",
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入联系电话",
                        trigger: "blur",
                    },
                ],
                customerType: [
                    {
                        required: true,
                        message: "请输入客户类型",
                        trigger: "blur",
                    },
                ],
                customerSource: [
                    {
                        required: true,
                        message: "请输入客户来源",
                        trigger: "blur",
                    },
                ],
                customerClassify: [
                    {
                        required: true,
                        message: "请输入客户分类",
                        trigger: "blur",
                    },
                ],
            },
            customerTypeList: [],
            saleCategoryList: [],
            customerSourceList: [],
            customerClassifyList: [],
            leasingManagerList: [],
            // 显示搜索条件
            showSearch: true,
            // 高级
            isShow: false,
            showDrawerCommunicate: false,
            formCommunicate: {
                theme: "",
                time: "",
                content: "",
            },
            rulesCommunicate: {
                theme: [
                    {
                        required: true,
                        message: "请输入招商经理",
                        trigger: "blur",
                    },
                ],
                time: [
                    {
                        required: true,
                        message: "请输入招商经理",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "请输入招商经理",
                        trigger: "blur",
                    },
                ],
            },
            btnLoadingCommunicate: false,
            communicateList: [
                // {
                //     id: "1",
                //     theme: "价格问题",
                //     time: "2020-1-9 10:15:31",
                //     content: "本次和刘先生沟通了价格问题，由原来的单价67.8元沟通到65.5元",
                //     name: "王二百"
                // },
            ],
        };
    },
    created() {
        this.getList();
        this.getLeasingManager() //获取招商经理数据
        this.getDicts("customerType").then((response) => {
            this.customerTypeList = response.data;
        });
        this.getDicts("businessCategory").then((response) => {
            this.saleCategoryList = response.data;
        });
        this.getDicts("customerSource").then((response) => {
            this.customerSourceList = response.data;
        });
        this.getDicts("customerClassification").then((response) => {
            this.customerClassifyList = response.data;
        });
    },
    methods: {
        getDatas(e) {
            this.showDialog = false;
            this.datas = e;
            //   this.$set(this.form,'leasingManager',e.user_name)
            this.$refs.leasingManager.$emit('input', e.user_name)
            this.$refs.form.clearValidate('leasingManager')
        },
        // 商户管理
        merchant(id) {
            this.$router.push({
                path: `/merchantManagement`,
                query: {
                    id: id,
                },
            });
        },
        // 打开沟通弹窗
        communicate(type, id) {
            this.showDrawerCommunicate = true;
            this.drawerType = type;
            this.itemId = id;
            this.getInfo();
        },
        //沟通弹窗确定按钮
        confirmFormCommunicate() {
            const _this = this;
            _this.$refs["formCommunicate"].validate((valid) => {
                if (valid) {
                    _this.btnLoadingCommunicate = true;
                    let datas = { communicate: _this.formCommunicate };
                    updateOfficeAddress(datas, _this.itemId)
                        .then((res) => {
                            _this.showDrawerCommunicate = false;
                            _this.$toast("操作成功！");
                            _this.getList();
                        })
                        .finally((error) => {
                            _this.btnLoadingCommunicate = false;
                        });
                }
            });
        },
        //沟通弹窗取消按钮
        drawerClosedCommunicate() {
            this.showDrawerCommunicate = false;

            this.resetForm("formCommunicate");
        },
        // 高级搜索展示隐藏
        searchShow() {
            this.isShow = !this.isShow;
            this.paging.customerType = "";
            this.paging.saleCategory = "";
            this.paging.customerSource = "";
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
        // 获取招商经理数据
        getLeasingManager() {
            let _this = this
            getUserList().then(res => {
                console.log(res);
                _this.leasingManagerList = res.data.results
            })
        },
        getList() {
            this.loading = true;
            // console.log(this.paging);
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
                    if (self.drawerType == "edit") {
                        // 编辑获取单条数据
                        let values = response.data.saleCategory.map((item) => {
                            return item.id;
                        });
                        let res = self.filterObj(response.data, [
                            "id",
                            "customerName",
                            "mobile",
                        ]);
                        if (response.data.customerType != null) {
                            res.customerType = response.data.customerType.id;
                        }
                        if (response.data.customerSource != null) {
                            res.customerSource = response.data.customerSource.id;
                        }
                        if (response.data.customerClassify != null) {
                            res.customerClassify = response.data.customerClassify.id;
                        }
                        res.leasingManager = response.data.leasingManager.username;
                        self.datas.user_id = response.data.leasingManager.id;
                        self.datas.user_name = response.data.leasingManager.username;

                        res.saleCategory = values;
                        self.form = res;
                    } else if (self.drawerType == "communicate") {
                        // 沟通获取单条数据
                        if (response.data.communicate != null) {
                            self.communicateList = JSON.parse(
                                response.data.communicate
                            ).reverse();
                        }
                    }
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
            if (type == 'add') {
                this.$set(this.form, 'customerType', this.customerTypeList[0].id)
                this.$set(this.form, 'customerSource', this.customerSourceList[0].id)
                this.$set(this.form, 'customerClassify', this.customerClassifyList[0].id)
            }
            type == "edit" && this.getInfo();
        },
        drawerClosed() {
            this.showDrawer = false;
            (this.form = {
                postcode: "",
                phone: "",
                fax: "",
            }),
                this.resetForm("form");
                this.datas = {}
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
                    self.form.leasingManager = self.datas.user_id
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
        formatCustomerType(row) {
            if (row.customerType != null) {
                return row.customerType.listName;
            }
        },
        formatSaleCategory(row) {
            let values = row.saleCategory.map((item) => {
                return item.listName;
            });
            return values.join(",");
        },
        formatCustomerClassify(row) {
            if (row.customerClassify != null) {
                return row.customerClassify.listName;
            }
        },
        formatCustomerSource(row) {
            if (row.customerSource != null) {
                return row.customerSource.listName;
            }
        },
        formatterLeasingManager(row) {
            if (row.leasingManager != null) {
                return row.leasingManager.username;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.form-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    > div {
        width: 100%;
    }
    > div:nth-child(1) {
        height: 60%;
        border-bottom: 1px solid #ccc;
        overflow-y: auto;
    }
    > div:nth-child(2) {
        height: 40%;
        box-sizing: border-box;
        padding-top: 20px;
    }

    .box {
        margin-bottom: 20px;
        box-sizing: border-box;
        margin-right: 10px;
    }

    .box-card {
        .card-title {
            font-size: 16px;
            font-weight: bold;
        }

        .content-box {
            .content-text {
                font-size: 16px;
            }
            .content-des {
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 14px;
                color: #898686;
                .text-one {
                    margin-right: 14px;
                }
            }
        }

        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both;
        }
    }
}
</style>