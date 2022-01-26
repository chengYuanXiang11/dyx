<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        label-widht="100px"
        @pagination="handlePagination"
        @search="handleSearch"
        :showLimit="3"
    >
        <template slot="action-bar">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建</el-button>
        </template>
        <el-table v-loading="loading" :data="tableData" border height="100%">
            <el-table-column label="客户姓名" prop="customerName" />
            <el-table-column label="联系电话" prop="mobile" />
            <el-table-column label="商户性质" prop="customerType" :formatter="formatCustomerType" />
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
                        @click="getInfo(scope.row.id, 'communicate')"
                    >沟通</el-button>
                    <el-button size="mini" type="text" @click="merchant(scope.row.id)">商户管理</el-button>
                    <el-button size="mini" type="text" @click="getInfo(scope.row.id, 'edit')">编辑</el-button>
                    <!-- <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <Drawer
            :visible.sync="showDrawer"
            :title="drawerType == 'add' ? '新建' : '编辑'"
            @confirm="confirmForm"
            @closed="drawerClosed"
            v-loading="btnLoading"
        >
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="招商经理" prop="leasingManager">
                    <!-- <span v-show="false">{{ leasingManager }}</span> -->
                    <el-input v-model="leasingManager" v-show="false"></el-input>
                    <SelectUsers v-model="datas" type="user" :multiple="false" placeholder="请选择人员"></SelectUsers>
                </el-form-item>
                <el-form-item label="客户姓名" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="商户性质" prop="customerType">
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
        </Drawer>

        <!-- 沟通 -->
        <Drawer
            :visible.sync="showDrawerCommunicate"
            title="沟通记录"
            @confirm="confirmFormCommunicate"
            @closed="drawerClosedCommunicate"
            v-loading="btnLoadingCommunicate"
        >
            <div
                class="form-box"
                v-loading="commLoading"
                element-loading-text="正在加载中,请稍后..."
                element-loading-spinner="el-icon-loading"
            >
                <div class="scroll-content">
                    <div v-for="m in communicateList" :key="m.id" class="box">
                        <div class="box-card">
                            <div class="clearfix">
                                <!-- slot="header" -->
                                <span class="card-title">{{ m.theme }}</span>
                            </div>
                            <div class="content-box">
                                <div class="content-text">{{ m.content }}</div>
                                <div class="content-des">
                                    <span class="text-one">{{ m.name }}</span>
                                    <span class="text-Two">
                                        {{
                                            m.time | datefilter
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
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
        </Drawer>
    </Table-page>
</template>

<script>
import moment from "moment";
import { isPhone } from "@/utils/isValid";
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
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                form: [
                    {
                        name: "customerName",
                        label: "客户姓名",
                        type: "input",
                    },
                    {
                        name: "mobile",
                        label: "联系电话",
                        type: "input",
                    },
                    {
                        name: "customerClassify",
                        label: "客户分类",
                        type: "dict",
                        code: "customerClassification",
                    },
                    {
                        name: "leasingManager",
                        label: "招商经理",
                        type: "select",

                    },
                    {
                        name: "customerType",
                        label: "商户性质",
                        type: "dict",
                        code: "customerType",
                    },
                    {
                        name: "saleCategory",
                        label: "拟经营品种",
                        type: "dict",
                        code: "businessCategory",
                    },
                    {
                        name: "customerSource",
                        label: "客户来源",
                        type: "dict",
                        code: "customerSource",
                    },
                ],
            },

            commLoading: false,
            showDialog: false,
            datas: {},
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],

            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                leasingManager: "",
                customerType: "",
            },
            rules: {
                leasingManager: [
                    {
                        required: true,
                        message: "请选择招商经理",
                        trigger: "change",
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
                        // message: "请输入联系电话",
                        validator: isPhone,
                        trigger: "blur",
                    },
                ],
                customerType: [
                    {
                        required: true,
                        message: "请输入商户性质",
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
                        message: "请输入沟通主题",
                        trigger: "blur",
                    },
                ],
                time: [
                    {
                        required: true,
                        message: "请输入沟通时间",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "请输入沟通内容",
                        trigger: "blur",
                    },
                ],
            },
            btnLoadingCommunicate: false,
            communicateList: [],
            // 查询参数
            queryParams: {},
        };
    },
    filters: {
        datefilter(value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        },
    },
    computed: {
        leasingManager() {
            if (Object.keys(this.datas).length > 0) {
                return this.form.leasingManager = this.datas.user_id
            } else {
                return this.form.leasingManager = ""
            }
        }
    },
    created() {
        let _this = this;
        this.getList();
        this.$nextTick(function () {
            _this.getLeasingManager(); //获取招商经理数据
        });
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
        // communicate(type, id) {
        //     this.showDrawerCommunicate = true;
        //     this.drawerType = type;
        //     this.itemId = id;
        //     this.getInfo();
        // },
        //沟通弹窗确定按钮
        confirmFormCommunicate() {
            const _this = this;
            _this.$refs["formCommunicate"].validate((valid) => {
                if (valid) {
                    _this.btnLoadingCommunicate = true;
                    _this.commLoading = true;
                    let datas = { communicate: _this.formCommunicate };
                    updateOfficeAddress(datas, _this.itemId)
                        .then((res) => {
                            // _this.showDrawerCommunicate = false;
                            _this.$refs.formCommunicate.resetFields();
                            _this.$success("操作成功！");
                            _this.getInfo(_this.itemId, 'communicate');

                            _this.getList();
                        })
                        .finally((error) => {
                            _this.btnLoadingCommunicate = false;
                            _this.commLoading = false;
                        });
                }
            });
        },
        //沟通弹窗取消按钮
        drawerClosedCommunicate() {
            this.showDrawerCommunicate = false;
            this.$refs.formCommunicate.resetFields();
            // this.getList();
        },

        // 获取招商经理数据
        getLeasingManager() {
            let _this = this;
            getUserList().then((res) => {
                // console.log(res);
                // _this.leasingManagerList = res.data.results;
                res.data.results.forEach(e => {
                    _this.leasingManagerList.push({ label: e.username, value: e.username })
                });

                _this.search.form[3].options = _this.leasingManagerList;
            });
        },
        getList() {
            this.loading = true;

            getList(this.queryFormat(this.queryParams, this.search))
                .then((response) => {
                    this.tableData = response.data.results;
                    this.search.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        getInfo(id, type) {
            const self = this
            this.loading = true;
            this.itemId = id;
            this.drawerType = type;
            getInfo(id)
                .then((response) => {
                    if (type == "edit") {
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
                            res.customerSource =
                                response.data.customerSource.id;
                        }
                        if (response.data.customerClassify != null) {
                            res.customerClassify =
                                response.data.customerClassify.id;
                        }
                        res.leasingManager = response.data.leasingManager.username;
                        self.datas = {
                            user_id: response.data.leasingManager.id,
                            user_name: response.data.leasingManager.username
                        }
                        res.saleCategory = values;
                        self.form = res;
                        this.showDrawer = true;
                    } else if (type == "communicate") {
                        // 沟通获取单条数据
                        if (response.data.communicate != null) {
                            self.communicateList = JSON.parse(
                                response.data.communicate
                            ).reverse();
                        }
                        this.showDrawerCommunicate = true;
                    }
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        self.loading = false;
                    });
                });
        },
        handleAdd() {
            this.showDrawer = true;
            this.drawerType = "add";
            let data = {
                customerType: this.customerTypeList[0].id,
                customerSource: this.customerSourceList[0].id,
                customerClassify: this.customerClassifyList[0].id
            }
            this.form = Object.assign({}, this.form, data)
        },
        drawerClosed() {
            this.$refs.form.resetFields();
            this.showDrawer = false;
            this.form = {};
            this.datas = {};
        },
        del(id) {
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delOfficeAddress(id).then((res) => {
                    self.$success("删除成功！");
                    self.getList();
                });
            });
        },
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    self.form.leasingManager = self.datas.user_id;
                    if (self.drawerType == "add") {
                        addOfficeAddress(self.form)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$success("新增成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        updateOfficeAddress(self.form, self.itemId)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$success("编辑成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                } else {
                    self.$error("请将表单填写完整");
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
::v-deep .el-radio,
.el-radio__input {
    line-height: 36px;
}
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

    .scroll-content::-webkit-scrollbar {
        width: 4px;
    }
    .scroll-content::-webkit-scrollbar-thumb {
        background: rgba(217, 217, 220, 1);
        border-radius: 20px;
    }

    .box {
        margin-bottom: 20px;
        box-sizing: border-box;
        margin-right: 10px;

        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding-bottom: 10px;
    }

    .box-card {
        ::v-deep .el-card__header {
            padding: 8px 20px;
        }
        .card-title {
            font-size: 14px;
            color: #010621;
            font-weight: bold;
        }

        .content-box {
            .content-text {
                font-size: 14px;
                color: #010621;
            }
            .content-des {
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 14px;
                color: rgba(1, 6, 33, 0.45);
                .text-one {
                    margin-right: 14px;
                }
            }
        }

        .clearfix {
            height: 50px;
            line-height: 50px;
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