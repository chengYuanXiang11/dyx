<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="班次名称" prop="working_shift_name" />
            <el-table-column label="考勤时间" :formatter="formatTimeQuantum" />
            <el-table-column label="创建人" prop="creator_name" />
            <el-table-column label="最后更新时间" prop="update_datetime" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="operation('view', scope.row.id)"
                        >查看</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="operation('edit', scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="del(scope.row.working_shift_name, scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="paging.pageNum"
            :limit.sync="paging.pageSize"
            @pagination="getList"
        />
        <ShiftDialog v-model="showDialog" :id="dataId" :dialogType="dialogType" @complete="getList"></ShiftDialog>
    </div>
</template>

<script>
import { getList, delShift } from "@/request/api/personnel/checking/shift";
import ShiftDialog from "@/views/components/shiftDialog"
export default {
    name: "Shift",
    components:{
        ShiftDialog
    },
    data() {
        return {
            loading: true,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
            showDialog:false,
            dataId:null,
            dialogType:"add"
        };
    },
    created() {
        this.getList();
    },
    methods: {
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
        formatTime(start, end) {
            let sTime = start.split(":").slice(0, 2);
            let eTime = end.split(":").slice(0, 2);
            (sTime = sTime.join(":")), (eTime = eTime.join(":"));
            return `${sTime}~${eTime}`;
        },
        formatTimeQuantum(row) {
            let str = "";
            switch (row.working_count) {
                case 1:
                    str = this.formatTime(
                        row.first_working_time,
                        row.first_offduty_time
                    );
                    break;
                case 2:
                    str =
                        this.formatTime(
                            row.first_working_time,
                            row.first_offduty_time
                        ) +
                        ";" +
                        this.formatTime(
                            row.second_working_time,
                            row.second_offduty_time
                        );
                    break;
                case 3:
                    str =
                        this.formatTime(
                            row.first_working_time,
                            row.first_offduty_time
                        ) +
                        ";" +
                        this.formatTime(
                            row.second_working_time,
                            row.second_offduty_time
                        ) +
                        ";" +
                        this.formatTime(
                            row.third_working_time,
                            row.third_offduty_time
                        );
                    break;
                default:
                    break;
            }
            return str;
        },
        operation(type, id) {
            this.showDialog = true;
            this.dialogType = type;
            this.dataId = type == 'add' ? null : id;
        },
        del(name, id) {
            const self = this;
            self.$confirm(`是否删除名称为【${name}】的班次`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delShift(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                })
                .catch(() => {});
        },
    },
};
</script>

