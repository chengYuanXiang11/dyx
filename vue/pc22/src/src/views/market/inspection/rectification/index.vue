<template>
    <div class="app-container">
        <div>
            <el-form ref="queryForm" :model="paging" :inline="true" label-width="85x">
                <el-form-item label="巡查时间" prop="update_datetime">
                    <el-date-picker
                        v-model="paging.update_datetime"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="创建人" prop="store_name">
                    <el-input
                        v-model="paging.store_name"
                        placeholder="请输入创建人"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>
                <el-form-item label="整改人" prop="store_name">
                    <el-input
                        v-model="paging.store_name"
                        placeholder="请输入整改人"
                        clearable
                        size="small"
                        style="width: 240px"
                    />
                </el-form-item>

                <el-form-item label="状态" prop="pass_state">
                    <el-select
                        v-model="paging.pass_state"
                        placeholder="请选择验收状态"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery"
                    >搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
       
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="巡查时间" prop="servicesTypeName" />
            <el-table-column label="负责人" prop="servicesNum"></el-table-column>
            <el-table-column label="整改人" prop="servicesNum"></el-table-column>
            <el-table-column label="状态" prop="servicesNum"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="result('view',scope.row.id)">查看</el-button>
                    <el-button size="mini" type="text" @click="result('result',scope.row.id)">完成</el-button>
                    <!-- <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button> -->
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
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    delOfficeAddress
} from "@/request/api/market/inspection/rectification";
export default {
    data() {
        return {
            options: [
                { label: "月巡查", value: 1 },
                { label: "年度巡查", value: 2 },
            ],
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [
                { id: 1, servicesTypeName: "月巡查", servicesNum: "整改中" }
            ],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,

        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 完成、查看
        result(type,id){
            this.$router.push({
                path: `/complete/${type}`,
                query: {
                    id: id,
                    type:type
                }
            })
        },
       
        getDatas(e) {
            let _this = this
            this.showDialog = false;
            this.datas = e;
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.paging.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        getList() {
            this.loading = false;

            //   this.loading = true;
            //   getList(this.paging)
            //     .then((response) => {
            //       this.tableData = response.data.results;
            //       this.total = response.data.count;
            //     })
            //     .finally((error) => {
            //       this.loading = false;
            //     });
        },
        getInfo() {
            const self = this,
                loading = this.$load();
            getInfo(this.itemId)
                .then((response) => {
                    self.form = response.data;
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        operation(type, id) {
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        
        del(id) {
            const self = this;
            self
                .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    delOfficeAddress(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>

