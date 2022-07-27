<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        @pagination="handlePagination"
    >
        <template slot="action-bar">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </template>

        <el-table v-loading="loading" :data="tableData" border height="100%">
            <el-table-column label="名称" prop="rentName" />
            <el-table-column label="范围数量" prop="scopeNum" />
            <el-table-column label="缴费方式" prop="paymentMethod" />
            <el-table-column label="保证金金额(元)" prop="earnestMoney" />
            <el-table-column label="最近更新时间" prop="update_datetime" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Table-page>
</template>

<script>
import {
    getList, delRow
} from "@/request/api/financial/income/rent/index";
export default {
    // name: "Rent",
    data() {
        return {
            // 查询参数
            queryParams: {
            },
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
            btnLoading: false,
            total: 0,
            tableData: [],
        };
    },
    methods: {
        // 分页方法
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        operation(type, id) {
            console.log(type, id);
            this.$router.push({
                path: `/addEdit/${type}`,
                query: {
                    type,
                    id
                }

            })
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
        del(id) {
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delRow(id).then((res) => {
                    self.$toast("删除成功！");
                    self.getList();
                });
            });
        },
    },
    created() {
        this.getList()
    },
};
</script>

<style scoped lang="scss">
.box {
    margin-bottom: 15px;
}
</style>

