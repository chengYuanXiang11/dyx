<template>
    <div class="app-container">
        <el-button type="primary" @click="jumpAdd">新建</el-button>
        <el-button type="primary" @click="leadingIn">导入</el-button>
        <el-button type="primary">导出</el-button>

        <PaymentInfor
            v-model="paymentInforShow"
            :type="activeName"
            :paymentInforData="paymentInforData"
        ></PaymentInfor>

        <!-- 付款申请 -->
        {{ activeName }}
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待付款" name="stay"> </el-tab-pane>
            <el-tab-pane label="已付款" name="already"> </el-tab-pane>
        </el-tabs>
        <el-table :data="tableData" style="width: 100%" class="yg-table">
            <el-table-column prop="applicant" label="申请人" width="180">
            </el-table-column>
            <el-table-column prop="paymentType" label="付款类型" width="180">
            </el-table-column>
            <el-table-column prop="payee" label="收款人"> </el-table-column>
            <el-table-column
                prop="applicationAmount"
                label="申请金额(元)"
                v-if="activeName === 'already'"
            >
            </el-table-column>
            <el-table-column prop="expectedTime" label="期望付款时间">
            </el-table-column>
            <el-table-column prop="applicationTime" label="申请时间">
            </el-table-column>
            <el-table-column
                prop="expectedTime"
                label="实际付款时间"
                v-if="activeName === 'already'"
            >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="see"
                        >查看</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="viewBill(scope.row)"
                        >付款信息</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
// 记账
import PaymentInfor from "./components/PaymentInfor.vue";
export default {
    name: "Payment",
    data() {
        return {
            activeName: "stay",
            paymentInforShow: false,
            paymentInforData: {},
            tableData: [
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
            ],
        };
    },
    components: {
        PaymentInfor,
    },
    methods: {
        // 发请求
        getList() {},
        // 查看账单
        viewBill(data) {
            this.paymentInforShow = true;
            this.paymentInforData = data;
        },
        // 切换标签页
        handleClick() {
            this.getList();
        },
        jumpAdd() {
            this.$router.push({ path: "/paymentAdd" });
        },
        leadingIn() {
            this.$router.push({ path: "/paymentLeadingIn" });
        },
        see() {
            this.$router.push({
                path: "/ApplyFor?flow_name=付款申请&code=payment&id=16&type=see",
            });
        },
    },
    created() {
        console.log(this.$route);
    },
};
</script>

<style scoped lang="scss"></style>
