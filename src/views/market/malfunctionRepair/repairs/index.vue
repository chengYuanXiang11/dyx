// 故障报修
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
            <el-table-column key="1" label="报修单号" prop="ticketcode" />
            <el-table-column key="2" label="报修类别" prop="repair_type" />
            <el-table-column key="3" label="报修地址" prop="address" />
            <el-table-column key="4" label="报修内容" prop="content" />
            <el-table-column key="5" label="下单时间" prop="create_datetime" />
            <el-table-column key="6" label="预约时间" prop="pre_time" />
            <el-table-column key="7" label="商户名称" prop="shop_manage" />
            <el-table-column
                label="预计上门时间"
                prop="pre_order_time"
                key="8"
                v-if="query.repair_status != 1"
            />
            <el-table-column
                label="完成时间"
                prop="finish_time"
                key="9"
                v-if="query.repair_status == 3"
            />
            <el-table-column
                label="维修人"
                prop="repairer"
                key="10"
                v-if="query.repair_status == 2"
            />
            <el-table-column label="报修人" prop="proposer" key="11"/>
            <el-table-column label="联系电话" prop="proposer_phone" key="12"/>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        v-if="query.repair_status == 1"
                        @click="personTo(scope.row.id)"
                        >安排人员</el-button
                    >
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
                        v-if="query.repair_status == 1"
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
        <Yg-Drawer
            v-model="showDrawer"
            title="安排人员"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
        >
            <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item label="预约时间" prop="pre_time">
                    <el-input
                        v-model="form.pre_time"
                        placeholder="请输入类别名称"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="预计上门时间" prop="pre_order_time">
                    <el-date-picker
                        v-model="form.pre_order_time"
                        type="datetime"
                        placeholder="选择日期时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="维修人" prop="repairer">
                    <el-input
                        v-model="form.repairer"
                        placeholder="请输入维修人"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getList,
    arrangePersonnel,
    getInfo,
} from "@/request/api/market/malfunctionRepair/repairs";
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
                repair_status: 1, //默认待分配
            },
            tabsList: [
                { val: 1, name: "待分配" },
                { val: 2, name: "已分配" },
                { val: 3, name: "已完成" },
            ],
            showDrawer: false,
            itemId: undefined,
            form: {},
            rules: {},
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
        // 切换
        /**
         * @param repair_status 维修状态("1"：待完成，"2":已完成)
         */
        tabsTodo() {
            this.query.pageNum = 1;
            this.getList();
        },
        // 打开侧边弹窗
        personTo(id) {
            this.itemId = id;
            this.showDrawer = true;
            this.getInfo();
        },
        // 关闭侧边弹窗
        drawerClosed() {
            this.showDrawer = false;
            (this.form = {
                name: "",
                repairer: "",
            }),
                this.resetForm("form");
        },
        // 点击侧边弹窗确定按钮
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    arrangePersonnel(self.form, self.itemId)
                        .then((res) => {
                            self.showDrawer = false;
                            self.$toast("操作成功！");
                            self.getList();
                        })
                        .finally((error) => {
                            self.btnLoading = false;
                        });
                } else {
                    self.$toastError("请将表单填写完整");
                }
            });
        },

        // 查看和完成
        /**
         * @param v
         * @param num 1 查看 2 完成
         */
        detailsTo(id, num) {
            this.$router.push({
                path: `/repairsDetails/${num == "1" ? "view" : "wancheng"}`,
                query: {
                    id: id,
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

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100%;
}
</style>
