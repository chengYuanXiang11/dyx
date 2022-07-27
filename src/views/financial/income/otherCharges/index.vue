<template>
    <div class="app-container">
        <div class="box">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="名称" prop="customerName" />
            <el-table-column label="费用类型" prop="customerName" />
            <el-table-column label="范围数量" prop="mobile" />
            <el-table-column label="收费周期" prop="mobile" />
            <el-table-column label="收费金额(元)" prop="mobile" />
            <el-table-column label="缴费方式" prop="mobile" />
            <el-table-column label="最近更新时间" prop="mobile" />
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
    </div>
</template>

<script>
import {
    getList,
    delRow,
} from "@/request/api/financial/income/electricity/index";
export default {
    data() {
        return {
            loading: false,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
        };
    },
    methods: {
        operation(type, id) {
            console.log(type, id);
            this.$router.push({
                path: `/otherChargesAdd/${type}`,
                query: {
                    type,
                    id
                }

            })
        },
        getList() {
            this.loading = false;
            /* getList(this.paging)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                }); */
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
    },
};
</script>

<style scoped lang="scss">
.box {
    margin-bottom: 15px;
}
</style>

