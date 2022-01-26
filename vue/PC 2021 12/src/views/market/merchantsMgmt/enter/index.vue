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
            <el-radio-group v-model="radio1" @change="radioChange">
                <el-radio-button label="1">按申请</el-radio-button>
                <el-radio-button label="2">按商位</el-radio-button>
            </el-radio-group>
        </template>
        <el-table v-loading="loading" :data="tableData" border height="100%">
            <el-table-column
                key="locationNumber"
                label="租赁商位"
                prop="locationNumber"
                v-if="radio1 == 2"
            />
            <el-table-column
                key="leaseType"
                label="商位类型"
                prop="leaseType"
                :formatter="typeFormatter"
                v-if="radio1 == 2"
            />
            <el-table-column key="storeName" label="商户名称" prop="storeName" />
            <el-table-column key="merchantName" label="姓名" prop="merchantName" />
            <el-table-column key="mobile" label="手机号" prop="mobile" />
            <el-table-column key="saleCategory" label="经营品种" prop="saleCategory">
                <template slot-scope="scope">{{ scope.row.saleCategory.join() }}</template>
            </el-table-column>
            <el-table-column key="leasingManager" label="招商经理" prop="leasingManager" />
            <el-table-column
                key="contractPerson"
                label="签约人"
                prop="contractPerson"
                v-if="radio1 == 2"
            />
            <el-table-column key="applyTime" label="申请时间" prop="applyTime" />
            <el-table-column
                key="contractTime"
                label="签约时间"
                prop="contractTime"
                v-if="radio1 == 2"
            />
            <el-table-column key="leaseStatus" label="状态" prop="leaseStatus">
                <template slot-scope="scope">
                    <el-tag
                        :type="statusTagFormatter(scope.row.leaseStatus)"
                    >{{ statusFormatter(scope.row) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="listTo(scope.row.merchantId)"
                        v-if="radio1 == 1"
                    >查看</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="edit(scope.row.id, 'enterView')"
                        v-if="radio1 == 2"
                    >查看</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="edit(scope.row.id, 'enterUpload')"
                        v-if="radio1 == 2 && scope.row.leaseStatus == 4"
                    >签约</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Table-page>
</template>

<script>
import {
    getList,
    getListTwo
} from "@/request/api/market/merchantsMgmt/enter";
export default {
    data() {
        return {
            // 查询参数
            queryParams: {},
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                form: [
                    {
                        name: "storeName",
                        label: "商户名称",
                        type: "input",
                    },
                    {
                        name: "merchantName",
                        label: "姓名",
                        type: "input",
                    },
                    {
                        name: "mobile",
                        label: "电话",
                        type: "input",
                    },
                    {
                        name: "leasingManager",
                        label: "招商经理",
                        type: "input",
                    },
                    {
                        name: "leaseStatus",
                        label: "状态",
                        type: "select",
                        options: [
                            { label: "审批中", value: 1 },
                            { label: "已拒绝", value: 2 },
                            { label: "已失效", value: 3 },
                            { label: "已通过", value: 4 },
                            { label: "待开始", value: 5 },
                            { label: "合约中", value: 6 },
                            { label: "已到期", value: 7 }
                        ],
                    },
                ],
            },

            radio1: "1",
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
                pageSize: 20,

                locationNumber: "",

                storeName: "",
                merchantName: "",
                mobile: "",
                leasingManager: "",
                leaseStatus: "",
                leaseType: "",
                applyTime: "",
                contractTime: "",
                contractPerson: ""
            },
            form: {},
            rules: {},
            searchList: [
                { label: "审批中", value: 1 },
                { label: "已拒绝", value: 2 },
                { label: "已失效", value: 3 },
                { label: "已通过", value: 4 },
                { label: "待开始", value: 5 },
                { label: "合约中", value: 6 },
                { label: "已到期", value: 7 }
            ],
            searchTypeList: [
                { label: "商铺", value: 1 },
                { label: "宿舍", value: 2 },
                { label: "仓库", value: 3 }
            ]

        };
    },
    created() {
        this.getList(this.radio1);
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
        typeFormatter(row) {
            if (row.leaseType == "1") {
                return "商铺"
            } else if (row.leaseType == "2") {
                return "宿舍"
            } else if (row.leaseType == "3") {
                return "仓库"
            } else {
                return row.leaseType
            }
        },
        radioChange(val) {
            let radio1 = [
                {
                    name: "storeName",
                    label: "商户名称",
                    type: "input",
                },
                {
                    name: "merchantName",
                    label: "姓名",
                    type: "input",
                },
                {
                    name: "mobile",
                    label: "电话",
                    type: "input",
                },
                {
                    name: "leasingManager",
                    label: "招商经理",
                    type: "input",
                },
                {
                    name: "leaseStatus",
                    label: "状态",
                    type: "select",
                    options: [
                        { label: "审批中", value: 1 },
                        { label: "已拒绝", value: 2 },
                        { label: "已失效", value: 3 },
                        { label: "已通过", value: 4 },
                        { label: "待开始", value: 5 },
                        { label: "合约中", value: 6 },
                        { label: "已到期", value: 7 }
                    ],
                },
            ]
            let radio2 = [
                {
                    name: "locationNumber",
                    label: "租赁商位",
                    type: "input",
                },
                {
                    name: "merchantName",
                    label: "姓名",
                    type: "input",
                },
                {
                    name: "leaseStatus",
                    label: "状态",
                    type: "select",
                    options: [
                        { label: "审批中", value: 1 },
                        { label: "已拒绝", value: 2 },
                        { label: "已失效", value: 3 },
                        { label: "已通过", value: 4 },
                        { label: "待开始", value: 5 },
                        { label: "合约中", value: 6 },
                        { label: "已到期", value: 7 }
                    ],
                },
                {
                    name: "storeName",
                    label: "商户名称",
                    type: "input",
                },
                {
                    name: "mobile",
                    label: "电话",
                    type: "input",
                },
                {
                    name: "leaseType",
                    label: "商户类型",
                    type: "select",
                    options: [
                        { label: "商铺", value: 1 },
                        { label: "宿舍", value: 2 },
                        { label: "仓库", value: 3 }
                    ]
                },
                {
                    name: "applyTime",
                    label: "申请时间",
                    type: "daterange",
                },
                {
                    name: "contractTime",
                    label: "签约时间",
                    type: "daterange",
                },
                {
                    name: "contractPerson",
                    label: "签约人",
                    type: "input",
                },
                {
                    name: "leasingManager",
                    label: "招商经理",
                    type: "input",
                },

            ]
            if (val == 1) {
                this.search.form = radio1
            } else {
                this.search.form = radio2
            }
            this.getList(val)
        },
        // 按申请-查看
        listTo(id) {
            this.$router.push({
                path: '/recordList',
                query: {
                    id
                }
            })
        },
        edit(id, type) {
            this.$router.push({
                path: `/leaseManageView/${type}`,
                query: { id, type }
            })

        },
        getList(val) {
            let _this = this
            this.loading = false;
            this.loading = true;
            if (val == 1) {
                getList(this.queryFormat(this.queryParams, this.search))
                    .then((response) => {
                        _this.tableData = response.data.rows;
                        _this.search.total = response.data.total;
                    })
                    .finally((error) => {
                        _this.loading = false;
                    });
            } else {
                getListTwo(this.queryFormat(this.queryParams, this.search))
                    .then((response) => {
                        _this.tableData = response.data.rows;
                        _this.search.total = response.data.total;
                    })
                    .finally((error) => {
                        _this.loading = false;
                    });
            }

        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.query.pageNum = 1;
            this.getList(this.radio1);
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.resetFun()
            this.handleQuery();
        },
        // 高级搜索展示隐藏
        searchShow() {
            this.isShow = !this.isShow;
            this.resetFun()
        },
        resetFun() {
            this.query.storeName = ""
            this.query.mobile = ""
            this.query.leaseType = ""
            this.query.applyTime = ""
            this.query.contractTime = ""
            this.query.contractPerson = ""
            this.query.leasingManager = ""
        }
    },
};
</script>

<style scoped lang="scss">
.search-box {
    margin-top: 15px;
}
</style>

