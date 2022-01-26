<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column type="index" label="序号" width="50px" align="center"/>
            <el-table-column label="流程名称" prop="name" />
            <el-table-column label="流程名称" prop="ticket_sn_prefix" />
            <el-table-column label="流程类型" prop="type.name" />
            <el-table-column label="是否启用流程" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        @change="settingStatus($event, scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="toPage('view', scope.row)"
                        >查看</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="toPage('edit', scope.row)"
                        >编辑</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getList } from "@/request/api/system/form";

export default {
    name: "FormList",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 角色表格数据
            tableData: [],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            getList()
                .then((response) => {
                    this.tableData = response.data;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        toPage(type,item){
            this.$router.push(`/formDetails?type=${type}&&code=${item.ticket_sn_prefix}`)
        }
    },
};
</script>

<style lang="scss" scoped>
</style>