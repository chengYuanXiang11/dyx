<template>
    <div class="app-container">
        <div v-if="radio1 == '我的客户'">
            <div>
                <el-form ref="queryForm" :model="paging" :inline="true" label-width="85x">
                    <el-form-item label="客户姓名" prop="customerName">
                        <el-input
                            v-model="paging.customerName"
                            placeholder="请输入客户姓名"
                            clearable
                            size="small"
                            style="width: 200px"
                        />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="mobile">
                        <el-input
                            v-model="paging.mobile"
                            placeholder="请输入联系电话"
                            clearable
                            size="small"
                            style="width: 200px"
                        />
                    </el-form-item>
                    <el-form-item label="客户分类" prop="customerClassify">
                        <el-select
                            v-model="paging.customerClassify"
                            placeholder="请选择客户分类"
                            clearable
                            size="small"
                            style="width: 200px"
                        >
                            <el-option
                                v-for="dict in customerClassifyList"
                                :key="dict.id"
                                :label="dict.label"
                                :value="dict.label"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户类型" prop="customerType">
                        <el-select
                            v-model="paging.customerType"
                            placeholder="请选择客户类型"
                            clearable
                            size="small"
                            style="width: 200px"
                        >
                            <el-option
                                v-for="dict in customerTypeList"
                                :key="dict.id"
                                :label="dict.label"
                                :value="dict.label"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户来源" prop="customerSource">
                        <el-select
                            v-model="paging.customerSource"
                            placeholder="请选择客户来源"
                            clearable
                            size="small"
                            style="width: 200px"
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
                            @click="handleQuery('queryForm')"
                        >搜索</el-button>
                        <el-button
                            icon="el-icon-refresh"
                            size="mini"
                            @click="resetQuery('queryForm')"
                        >重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn">
                <el-button type="primary" @click="operation">新建</el-button>
            </div>
        </div>
        <div v-else>
            <el-form ref="queryFormTwo" :model="pagingTwo" :inline="true" label-width="85x">
                <el-form-item label="商户名称" prop="storeName">
                    <el-input
                        v-model="pagingTwo.storeName"
                        placeholder="请输入商户名称"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>
                <el-form-item label="联系人" prop="merchantName">
                    <el-input
                        v-model="pagingTwo.merchantName"
                        placeholder="请输入联系人"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input
                        v-model="pagingTwo.mobile"
                        placeholder="请输入联系电话"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select
                        v-model="pagingTwo.status"
                        placeholder="请选择状态"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in statusList"
                            :key="dict.id"
                            :label="dict.label"
                            :value="dict.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="拟经营品种" prop="saleCategory">
                    <el-select
                        multiple
                        v-model="pagingTwo.saleCategory"
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
                <el-form-item label="商户类型" prop="customerType">
                    <el-select
                        v-model="pagingTwo.merchantsType"
                        placeholder="请选择商户类型"
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

                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery('queryFormTwo')"
                    >搜索</el-button>
                    <el-button
                        icon="el-icon-refresh"
                        size="mini"
                        @click="resetQuery('queryFormTwo')"
                    >重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-radio-group v-model="radio1" @change="radioChange">
            <el-radio-button label="我的客户"></el-radio-button>
            <el-radio-button label="我的商户"></el-radio-button>
        </el-radio-group>

        <div class="table-box">
            <template v-if="radio1 == '我的客户'">
                <my-customer ref="customer" :searchQuery.sync="paging"></my-customer>
            </template>
            <template v-else>
                <my-merchant ref="merchant" :searchParams.sync="pagingTwo"></my-merchant>
            </template>
        </div>
    </div>
</template>

<script>
import myCustomer from "@/views/workbench/myCustomer/customer/index"
import myMerchant from "@/views/workbench/myCustomer/Merchant/index"
export default {
    data() {
        return {
            radio1: "我的客户",
            paging: {
                customerName: "",
                mobile: "",
                customerClassify: "",
                customerType: "",
                customerSource: "",
            },
            pagingTwo: {
                storeName: "",
                status: "",
                saleCategory: "",
                customerType: "",
                merchantName: "",
                mobile: "",
            },
            customerTypeList: [],
            customerSourceList: [],
            customerClassifyList: [],
            saleCategoryList: [],
            statusList: [
                {
                    id: "1",
                    label: "未认证"
                },
                {
                    id: "2",
                    label: "未生效"
                },
                {
                    id: "3",
                    label: "合约中"
                },
                {
                    id: "4",
                    label: "已到期"
                },
            ],
        };
    },
    components: {
        myCustomer,
        myMerchant
    },
    created() {
        this.getDicts("customerType").then((response) => {
            this.customerTypeList = response.data;
        });
        this.getDicts("customerSource").then((response) => {
            this.customerSourceList = response.data;
        });
        this.getDicts("customerClassification").then((response) => {
            this.customerClassifyList = response.data;
        });
        this.getDicts("businessCategory").then((response) => {
            this.saleCategoryList = response.data;
        });
    },
    methods: {
        radioChange(val) {
            // console.log(val);
            this.$set(this.paging, 'customerName', '')
            this.$set(this.paging, 'mobile', '')
            this.$set(this.paging, 'customerClassify', '')
            this.$set(this.paging, 'customerType', '')
            this.$set(this.paging, 'customerSource', '')

            this.$set(this.pagingTwo, 'storeName', '')
            this.$set(this.pagingTwo, 'status', '')
            this.$set(this.pagingTwo, 'saleCategory', '')
            this.$set(this.pagingTwo, 'customerType', '')
            this.$set(this.pagingTwo, 'merchantName', '')
            this.$set(this.pagingTwo, 'mobile', '')
        },

        /**
         * @description 我的客户
         */
        // 我的客户打开添加弹窗
        operation() {
            this.$refs.customer.operation()
        },
        /** 搜索按钮操作 */
        handleQuery(val) {
            if (val == 'queryFormTwo') {
                this.$refs.merchant.paging.pageNum = 1
                this.$refs.merchant.getList()
            } else {
                this.$refs.customer.paging.pageNum = 1
                this.$refs.customer.getList()
            }
        },
        /** 重置按钮操作 */
        resetQuery(val) {
            this.resetForm(val)
            this.handleQuery(val);
        },
    },
};
</script>

<style lang="scss" scoped>
.btn {
    margin-bottom: 19px;
}
</style>
