<template>
    <div class="app-container">
        <div>
            <el-button type="primary" @click="listTo">新建</el-button>
        </div>
        <div class="search-box">
            <el-form ref="queryForm" :model="query" :inline="true" label-width="85x">
                <el-form-item label="退租商位" prop="locationNumber">
                    <el-input
                        v-model="query.locationNumber"
                        placeholder="请输入退租商位"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="商户名称">
                    <el-input
                        v-model="query.storeName"
                        placeholder="请输入商户名称"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input
                        v-model="query.mobile"
                        placeholder="请输入联系电话"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="throwLeaseStatus">
                    <el-select
                        v-model="query.throwLeaseStatus"
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
    <el-form-item label="姓名" v-show="isShow">
                    <el-input
                        v-model="query.merchantName"
                        placeholder="请输入姓名"
                        clearable
                        size="small"
                        style="width: 200px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="申请时间" v-show="isShow">
                    <el-date-picker
                        v-model="query.create_datetime"
                        type="date"
                        placeholder="请选择申请时间"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="经手人" v-show="isShow">
                    <el-input v-model="managersName" disabled>
                        <el-button type="primary" slot="append" @click="selectUsers">选择人员</el-button>
                    </el-input>
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
            <el-table-column label="退租商位" prop="locationNumber" />
            <el-table-column label="商户名称" prop="storeName" />
            <el-table-column label="姓名" prop="merchantName" />
            <el-table-column label="联系电话" prop="mobile" />
            <el-table-column label="经手人" prop="managers" />
            <el-table-column label="申请时间" prop="create_datetime" />
            <el-table-column label="状态" prop="throwLeaseStatus">
                <template slot-scope="scope">
                    <el-tag
                        :type="statusTagFormatter(scope.row.throwLeaseStatus)"
                    >{{ statusFormatter(scope.row.throwLeaseStatus) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="viewTo(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getList"
        />

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
    getList
} from "@/request/api/market/merchantsMgmt/throwAlease";
export default {
    data() {
        return {
            showDialog: false,
            datas: {},
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

                locationNumber: "",
                storeName: "",
                mobile: "",
                throwLeaseStatus: "",
                create_datetime: "",
                managers: "",
                merchantName:""
            },
            form: {},
            rules: {},
            searchList: [
                { label: "审批中", value: 1 },
                { label: "已拒绝", value: 2 },
                { label: "已通过", value: 3 },
            ],
            searchTypeList: [
                { label: "商铺", value: 1 },
                { label: "宿舍", value: 2 },
                { label: "仓库", value: 3 }
            ],
            managersName: ""

        };
    },
    created() {
        this.getList();
    },
    methods: {
        selectUsers() {
            this.showDialog = true;
        },
        getDatas(e, close) {
            close();
            console.log(e);
            this.query.managers = e.user_id
            this.managersName = e.user_name
        },
        statusTagFormatter(val) {
            if (val == '1') {
                return 'warning'
            } else if (val == '2') {
                return 'danger'
            } else if (val == '3') {
                return 'success'
            } else {
                return val
            }
        },
        statusFormatter(row) {
            if (row == 1) {
                return "审批中"
            } else if (row == 2) {
                return "已拒绝"
            } else if (row == 3) {
                return "已通过"
            } else {
                return row
            }
        },
        // 添加
        listTo() {
            this.$router.push({
                path: `/throwAleaseAdd`
            })
        },
        // 查看
        viewTo(id) {
            this.$router.push({
                path: '/throwAleaseView',
                query: {
                    id
                }
            })
        },
        getList(val) {
            let _this = this
            this.loading = true;
            getList(this.query).then((res) => {
                _this.loading = false;
                _this.tableData = res.data.results
                _this.total = res.data.count
            }).catch((err) => {

            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.query.pageNum = 1;
            this.getList();
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
            this.query.create_datetime = ""
            this.query.managers = ""
            this.managersName = ""
            this.query.merchantName = ""
        }
    },
};
</script>

<style scoped lang="scss">
.search-box {
    margin-top: 15px;
}
</style>

