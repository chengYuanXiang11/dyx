<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        @pagination="handlePagination"
        @search="handleSearch"
        :showLimit="3"
    >
        <template slot="action-bar">
            <el-radio-group v-model="radio1" @change="radioChange">
                <el-radio-button label="1">按商位</el-radio-button>
                <el-radio-button label="2">按商户</el-radio-button>
            </el-radio-group>
        </template>

        <el-table v-loading="loading" :data="tableData" class="yg-table" border height="100%">
            <el-table-column key="1" label="商位号" prop="storeName" v-if="radio1 == 1" />
            <el-table-column key="2" label="水表编码" prop="merchantName" v-if="radio1 == 1" />
            <el-table-column key="3" label="水表状态" prop="mobile" v-if="radio1 == 1" />
            <el-table-column key="4" label="商户名称" prop="mobile" />
            <el-table-column key="5" label="经营品种" prop="mobile" v-if="radio1 == 2" />
            <el-table-column key="6" label="商户姓名" prop="mobile" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="listTo(scope.row.id, 'quotient')"
                        v-if="radio1 == 1"
                    >查看</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="listTo(scope.row.id, 'merchant')"
                        v-if="radio1 == 2"
                    >查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Table-page>
</template>

<script>
import {
    getList,
} from "@/request/api/lot/electricPower/electricityRecord";
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
                ],
            },
            radio1: "1",
            // 高级
            isShow: false,
            showDrawer: false,
            drawerType: "",
            loading: false,
            btnLoading: false,
            total: 0,
            tableData: [{ id: 1, mobile: 666 }],
            query: {
                pageNum: 1,
                pageSize: 20,
            },
            form: {},
            rules: {},

        };
    },
    created() {
        // this.getList(this.radio1);
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
        radioChange(val) {
            // this.getList(val)
        },
        // 按申请-查看
        listTo(id, type) {
            this.$router.push({
                path: `/waterPage/${type}`,
                query: {
                    id,
                    type
                }
            })
        },
        getList(val) {
            let _this = this
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

    },
};
</script>

<style scoped lang="scss">
.yg-table {
    margin-top: 20px;
}
</style>

