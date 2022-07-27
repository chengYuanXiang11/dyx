<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        @pagination="handlePagination"
    >
        <template slot="action-bar">
            <el-button type="primary" @click="toPage('add')">新增</el-button>
        </template>
        <el-table :data="tableData" border height="100%">
            <el-table-column prop="date" label="版本号" width="200"></el-table-column>
            <el-table-column prop="name" label="是否强制更新" width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.name"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="更新内容"></el-table-column>
            <el-table-column prop="address" label="更新时间" width="200"></el-table-column>
            <el-table-column label="操作" width="180">
                <template>
                    <el-button type="text" @click="delRow()">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <Drawer
            :visible.sync="visible"
            v-loading="loading"
            element-loading-text="拼命加载中"
            title="新建"
            :before-close="beforeClose"
            @confirm="confirm"
        >
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="版本号">
                    <el-input v-model="form.one"></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-date-picker v-model="form.two" type="datetime" placeholder="请选择时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="强制更新">
                    <el-switch v-model="form.three"></el-switch>
                </el-form-item>
                <el-form-item label="更新内容">
                    <el-input type="textarea" :rows="4" v-model="form.four"></el-input>
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
</template>

<script>
export default {
    data() {
        return {
            search: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
                isOpen: false,
            },
            tableData: [
                { id: 1, date: 123, name: true }
            ],
            visible: false,
            loading: false,
            form: {
                three: true
            }
        };
    },
    computed: {

    },
    methods: {
        // 分页方法
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        getList() {

        },
        toPage() {
            this.visible = true
        },
        delRow() {
            let _this = this
            this.$confirm("删除后,将影响更新", "确定删除吗?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(res => {
                _this.$success('操作成功')
            }).catch(_ => { })
        },
        beforeClose(done) {
            this.$confirm("是否关闭?", "关闭抽屉回调", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$message(`关闭弹窗！`);
                    done();
                })
                .catch(() => {
                    this.$message(`已取消关闭`);
                });
        },
        confirm() {
            let self = this;
            self.loading = true;
            self.$message(`触发确定按钮方法`);
            setTimeout(() => {
                self.loading = false;
                self.visible = false;
                self.$message(`操作成功！`);
            }, 3000);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
