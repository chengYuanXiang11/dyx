<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="单号" prop="orderNum" show-overflow-tooltip />
            <el-table-column label="评分" prop="orderScore" show-overflow-tooltip></el-table-column>
            <el-table-column label="打赏金额(元)" prop="rewardFee"></el-table-column>
            <el-table-column label="评语" prop="orderEvaluate"></el-table-column>
          
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="details(scope.row.id)">查看订单</el-button>
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
} from "@/request/api/market/merchantServices/serviceEvaluation";
export default {
    data() {
        return {
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
        };
    },
    created() {
        this.getList();
    },
    methods: {
        details(id) {
            this.$router.push({ path: '/serviceOrder', query: { id: id } })
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
    },
};
</script>

<style lang="scss" scoped>
</style>

