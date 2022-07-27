<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="考勤组名称">
                <el-input
                    v-model="queryParams.attendance_group_name"
                    placeholder="请输入考勤组名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="创建人">
                <el-input
                    v-model="queryParams.creator"
                    placeholder="请输入创建人"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="考勤组名称" prop="attendance_group_name" />
            <el-table-column label="人数" prop="personCount" />
            <el-table-column label="类型" :formatter="formatType" />
            <el-table-column label="考勤时间" prop="" />
            <el-table-column label="创建人" prop="creator" />
            <el-table-column label="最后更新时间" prop="update_datetime" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.attendance_type == 2"
                        size="mini"
                        type="text"
                        @click="operation('scheduling', scope.row.id)"
                        >排班</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="operation('edit', scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button size="mini" type="text" @click="del(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import {
    getList,
    removeCheckingGroup,
} from "@/request/api/personnel/checking/checkingGroup";
export default {
    name: "Checkinggroup",
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                attendance_group_name: "",
                creator: "",
            },
            loading: false,
            tableData: [],
            total: 0,
        };
    },
    methods: {
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 20,
            };
            this.handleQuery();
        },
        operation(type, id) {
            if(type === 'scheduling'){
                 this.$router.push({ path: '/scheduling', query: { id: id } })
                 return
            }
            this.$router.push(
                type == "add"
                    ? "/checkingGroup-operation/add"
                    : `/checkingGroup-operation/edit?id=${id}`
            );
        },
        getList() {
            this.loading = true;
            getList(this.queryParams)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        formatType(e) {
            switch (e.attendance_type) {
                case 1:
                    return "固定班制";

                case 2:
                    return "排班制";
            }
        },
        del(row) {
            this.$confirm(`是否删除名称为【${row.attendance_group_name}】的考勤组?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    removeCheckingGroup(row.id).then(res => {
                        this.$toast("删除成功");
                        this.getList();
                    })
                })
                .catch(() => {
                });
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
</style>

