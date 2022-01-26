<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        @search="handleQuery"
        @pagination="handlePagination"
        @reset="handleReset"
    >
        <template slot="action-bar">
            <div class="box">
                <el-button type="primary">一键拉闸</el-button>
                <el-button type="primary">一键合闸</el-button>
            </div>
        </template>
        <el-table v-loading="loading" :data="tableData" border height="100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="设备名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="商户名称" prop="code" show-overflow-tooltip />
            <el-table-column label="商位编码" prop="type" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在区域" prop="failureTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在建筑" prop="repairTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在楼层" prop="person" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="statue" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="CompleteRepair(scope.row.id)">拉闸</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Table-page>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            goods: [],
            showSearch: true,
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [
                {
                    failureTime: "2016-05-02",
                    repairTime: "2016-05-02",
                    statue: "待修复",
                    name: "北一门",
                    type: "摄像头",
                    person: "张三",
                    code: "E6551SC15",
                },
            ],
            tableHeader: [],
            search: {
                total: 10,
                pageNum: 1,
                pageSize: 20,
                form: [
                    {
                        name: "faultType",
                        label: "商户名称",
                        type: "select",
                    },
                    {
                        name: "faultCode",
                        label: "商位编码",
                        type: "input",
                    },
                    {
                        name: "faultName",
                        label: "设备名称",
                        type: "input",
                    },
                    {
                        name: "faultCode",
                        label: "状态",
                        type: "select",
                    },
                ],
            },
            queryParams: {},
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                goods: [],
                confim: "",
            },
            rules: {
                rulesName: [
                    { required: true, message: "请输入规则名称", trigger: "blur" },
                ],
                goods: [{ required: true, message: "请选择商品", trigger: "change" }],
            },
            servicesCost: [],
            messageList: [],
        };
    },

    created() {
        this.getList();
    },
    methods: {
        CompleteRepair(id) {
            this.$confirm("是否停用当前设备?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                // delRow(id).then((res) => {
                this.$success("修改成功！");
                //   self.getList();
                // });
            });
        },
        // 分页
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.search.pageSize = e.pageSize;
            this.getList();
        },
        handleReset(e) {
            this.queryParams = e;
            this.search.pageNum = 1;
            this.getList();
        },
        /** 搜索按钮操作 */
        handleQuery(e) {
            this.queryParams = e;
            this.search.pageNum = 1;
            this.getList();
        },
        getList() {
            this.loading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>

