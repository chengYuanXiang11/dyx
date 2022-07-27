<template>
    <div class="app-container">
        <div class="search-box">
            <el-form ref="queryForm" :model="query" :inline="true" label-width="85x">
                <el-form-item label="商户名称">
                    <el-input
                        v-model="query.storeName"
                        placeholder="请输入商户名称"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input
                        v-model="query.merchantName"
                        placeholder="请输入联系人"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input
                        v-model="query.mobile"
                        placeholder="请输入联系电话"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>

                <el-form-item label="租赁类型" v-show="isShow">
                    <el-select
                        v-model="query.leaseType"
                        placeholder="请选择状态"
                        clearable
                        size="small"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in searchTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商位号">
                    <el-input v-model="query.locationnumber" placeholder="请输入商位号"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-show="isShow">
                    <el-select
                        v-model="query.leaseStatus"
                        placeholder="请选择状态"
                        clearable
                        size="small"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in searchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="商户类型" v-show="isShow">
                    <el-select
                        v-model="query.merchantsType"
                        placeholder="请选择商户类型"
                        clearable
                        size="small"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in customerTypeList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="签约人" v-show="isShow">
                    <el-input
                        v-model="query.contractPerson"
                        placeholder="请输入签约人"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item> -->
                <el-form-item label="起止时间" v-show="isShow">
                    <el-date-picker
                        v-model="query.contractTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
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

        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="商位名称" prop="storeName">
                <template slot-scope="scope">{{ scope.row.merchant.storeName }}</template>
            </el-table-column>

            <el-table-column label="商位号" prop="locationNumber"></el-table-column>
            <el-table-column label="租赁类型" prop="leaseType" :formatter="typeFormatter" />
            <el-table-column label="位置" prop="location" />
            <el-table-column label="起止时间" show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.startTime }}~{{ scope.row.stopTime }}</template>
            </el-table-column>
            <el-table-column label="商户类型" prop="locationNumber">
                <template slot-scope="scope">{{ scope.row.merchant.merchantsType }}</template>
            </el-table-column>
            <el-table-column label="联系人">
                <template slot-scope="scope">{{ scope.row.merchant.merchantName }}</template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">{{ scope.row.merchant.mobile }}</template>
            </el-table-column>
            <!-- <el-table-column label="签约人" prop="contractPerson"></el-table-column> -->
            <el-table-column label="合同状态" prop="leaseStatus">
                <template slot-scope="scope">
                    <el-tag
                        :type="statusTagFormatter(scope.row.leaseStatus)"
                    >{{ statusFormatter(scope.row) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        :href="scope.row.contractFile + '?response-content-type=application/octet-stream'"
                        download
                        v-if="scope.row.contractFile != null"
                    >下载查看</el-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import {
    getList
} from "@/request/api/workbench/myContract/index";
export default {
    data() {
        return {
            // 高级
            isShow: false,
            showDrawer: false,
            drawerType: "",
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            query: {
                pageNum: 1,
                pages: 20,
                merchantName: "",
                mobile: "",
                leaseType: "",
                locationnumber: "",
                leaseStatus: "",
                storeName: "",
                contractTime: "",
                // contractPerson: "",
                merchantsType: ""
            },
            form: {},
            rules: {},

            searchList: [
                // { label: "审批中", value: 1 },
                // { label: "已拒绝", value: 2 },
                // { label: "已失效", value: 3 },
                // { label: "已通过", value: 4 },
                { label: "待开始", value: 5 },
                { label: "合约中", value: 6 },
                { label: "已到期", value: 7 }
            ],
            searchTypeList: [
                { label: "商铺", value: 1 },
                { label: "宿舍", value: 2 },
                { label: "仓库", value: 3 }
            ],
            customerTypeList: [],

        };
    },
    created() {
        this.getList();
        this.getDicts("customerType").then((response) => {
            this.customerTypeList = response.data;
        });
    },
    methods: {
        typeFormatter(row) {
            if (row.leaseType == 1) {
                return '商铺'
            } else if (row.leaseType == 2) {
                return '宿舍'
            } else if (row.leaseType == 3) {
                return '仓库'
            } else {
                return row.leaseType
            }
        },
        statusTagFormatter(val) {
            if (val == '1' || val == '6') {
                return 'warning'
            } else if (val == '2') {
                return 'danger'
            } else if (val == '3' || val == '7') {
                return 'info'
            } else if (val == '4' || val == '5') {
                return 'success'
            }
        },
        statusFormatter(row) {
            if (row.leaseStatus == 1) {
                return "审批中"
            } else if (row.leaseStatus == 2) {
                return "已拒绝"
            } else if (row.leaseStatus == 3) {
                return "已失效"
            } else if (row.leaseStatus == 4) {
                return "已通过"
            } else if (row.leaseStatus == 5) {
                return "待开始"
            } else if (row.leaseStatus == 6) {
                return "合约中"
            } else if (row.leaseStatus == 7) {
                return "已到期"
            } else {
                return row.leaseStatus
            }
        },
        getList(val) {
            let _this = this
            this.loading = false;
            getList(this.query).then((res) => {
                // console.log(res);
                _this.tableData = res.data.results
                _this.total = res.data.count
            }).catch((err) => {

            });

        },
        /** 搜索按钮操作 */
        handleQuery() {
            let _this = this
            let obj = JSON.parse(JSON.stringify(this.query))
            obj.pageNum = 1;
            if (obj.contractTime != "") {
                obj.contractTime = obj.contractTime.join()
            }
            getList(obj).then((res) => {
                _this.tableData = res.data.results
                _this.total = res.data.count
            }).catch((err) => {

            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.query.merchantName = ""
            this.query.mobile = ""
            this.query.leaseType = ""
            this.query.locationnumber = ""
            this.query.leaseStatus = ""
            this.query.storeName = ""
            this.query.contractTime = ""
            // this.query.contractPerson = ""
            this.query.merchantsType = ""

            this.handleQuery();
        },
        // 高级搜索展示隐藏
        searchShow() {
            this.isShow = !this.isShow;
            this.query.leaseStatus = ""
            this.query.merchantsType = ""
            // this.query.contractPerson = ""
            this.query.contractTime = ""
            this.query.leaseType = ""

        },

    },
};
</script>

<style scoped lang="scss">
.search-box {
    margin-top: 15px;
}
</style>


.search-box {
    margin-top: 15px;
}
