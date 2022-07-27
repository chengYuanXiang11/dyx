<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column
                type="index"
                label="序号"
                width="50px"
                align="center"
            />
            <el-table-column label="流程名称" prop="flow_name" />
            <el-table-column label="流程字段" prop="code" />
            <el-table-column label="流程所属" prop="flow_gp_name" />
            <el-table-column label="是否启用流程" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="1"
                        :inactive-value="0"
                    >
                        <!-- @change="settingStatus($event, scope.row)" -->
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
import { getFlowGroup } from "@/request/api/system/form";

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
            getFlowGroup()
                .then((response) => {
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.results.forEach((value) => {
                        value.child_data.forEach((v) => {
                            this.tableData.push(v);
                        });
                    });
                })
                .finally((error) => {
                    this.loading = false;
                });
            console.log(this.tableData);
        },
        toPage(type, item) {
            console.log(item)
            this.$router.push(
                `/formDetails?type=${type}&code=${item.code}&id=${item.id}`
            );
        },
    },
};
</script>

<style lang="scss" scoped></style>
