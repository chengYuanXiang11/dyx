// 维修任务
<template>
    <div class="app-container">
        <div class="tabs-box">
            <el-radio-group v-model="query.repair_status" @change="tabsTodo">
                <el-radio-button
                    :label="m.val"
                    v-for="(m, i) in tabsList"
                    :key="i"
                    >{{ m.name }}</el-radio-button
                >
            </el-radio-group>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="报修单号" prop="ticketcode" />
            <el-table-column label="报修类别" prop="repair_type" />
            <el-table-column label="报修地址" prop="address" />
            <el-table-column label="报修内容" prop="content" />
            <el-table-column label="商铺名称" prop="shop_manage" />
            <el-table-column label="报修时间" prop="create_datetime" />
            <el-table-column label="预约时间" prop="pre_time" />
            <el-table-column
                label="完成时间"
                prop="finish_time"
                v-if="query.repair_status == 2"
            />
            <el-table-column label="维修人" prop="repairer" />
            <el-table-column label="报修人" prop="proposer" />
            <el-table-column label="联系电话" prop="proposer_phone" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="detailsTo(scope.row.id, 1)"
                        >查看</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="detailsTo(scope.row.id, 2)"
                        v-if="scope.row.repair_status == '1'"
                        >完成</el-button
                    >
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
import { getList } from "@/request/api/market/malfunctionRepair/maintenanceTask";
export default {
    data() {
        return {
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            query: {
                pageNum: 1,
                pageSize: 20,
                repair_status: 1, //默认待完成
            },
            tabsList: [
                { val: 1, name: "待完成" },
                { val: 2, name: "已完成" },
            ],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            getList(this.query)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // 切换
        /**
         * @param repair_status 维修状态("1"：待完成，"2":已完成)
         */
        tabsTodo() {
            this.query.pageNum = 1;
            this.getList();
        },
        // 查看和完成
        /**
         * @param v
         * @param num 1 查看 2 完成
         */
        detailsTo(id, num) {
            this.$router.push({
                path: `/repairsOrderDetails/${
                    num == "1" ? "view" : "wancheng"
                }`,
                query: {
                    id
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.tabs-box {
    margin-bottom: 20px;
}
</style>
