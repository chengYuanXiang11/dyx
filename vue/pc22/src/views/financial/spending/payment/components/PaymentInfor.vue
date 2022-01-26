<template>
    <!--记账信息
         -->
    <Yg-Drawer
        v-model="showValue"
        title="记账"
        @confirm="submitForm"
        @closed="closed"
        @cancel="cancel"
        @open="open"
        size="700px"
        :showFooter="type === 'stay'"
    >
        <el-form
            ref="paymentInforData"
            :model="paymentInforData"
            label-suffix=" :"
            label-width="80px"
        >
            <el-form-item label="申请金额">
                {{ paymentInforData.applicationAmount }}
            </el-form-item>
            <el-form-item label="付款金额">
                <el-input
                    v-model="paymentInforData.paymentAmount"
                    :disabled="type !== 'stay'"
                ></el-input>
            </el-form-item>
            <el-form-item label="收款账户">
                <template>
                    <el-descriptions class="margin-top" :column="1">
                        <el-descriptions-item label="收款人(单位)"
                            >吴磊</el-descriptions-item
                        >
                        <el-descriptions-item label="手机号"
                            >兴业银行</el-descriptions-item
                        >
                        <el-descriptions-item label="银行账户"
                            >6215581116003569874</el-descriptions-item
                        >
                    </el-descriptions>
                </template>
            </el-form-item>
            <el-form-item label="付款账户">
                <span v-if="paymentAccount.length === 0">
                    请先在【银行账户】功能中设置付款账户
                </span>
                <el-radio-group v-model="paymentInforData.paymentAccount">
                    <el-radio
                        :disabled="type !== 'stay'"
                        v-for="city in paymentAccount"
                        :label="city.id"
                        :key="city.id"
                        :value="city"
                        >{{ city.label }}
                        {{ city.name }}
                        {{ city.account }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    :disabled="type !== 'stay'"
                    v-model="paymentInforData.remarks"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                ></el-input>
            </el-form-item>
        </el-form>
    </Yg-Drawer>
</template>
<script>
// 银行账户申请api
// import { } from '@/request/api/financial/bankAccount/bankAccount.js'
export default {
    name: "ApplicationRecord",
    data() {
        return {
            // 银行账户信息
            paymentAccount: [
                {
                    id: "1",
                    label: "银行账户",
                    name: "兴业银行",
                    account: "6215581116003569874",
                },
                {
                    id: "2",

                    label: "银行账户",
                    name: "兴业银行",
                    account: "6215581116003569874",
                },
                {
                    id: "3",

                    label: "银行账户",
                    name: "兴业银行",
                    account: "6215581116003569874",
                },
            ],
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        // 判断待付款还是已付款
        type: {
            type: String,
            default: "stay",
        },
        paymentInforData: {
            type: Object,
            default: () => {
                // applicant: "王小虎",
                // paymentType: "付款类型1",
                // payee: "李爱莲",
                // applicationAmount: "103,131,132.0",
                // expectedTime: "2020-01-05",
                // applicationTime: "2020-01-05 10:15:10",
                // actualTime: "2020-01-05",
                // collectionAccount: "",
                // paymentAccount: {
                //     id: "1",
                //     label: "银行账户",
                //     name: "兴业银行",
                //     account: "6215581116003569874",
                // },
                // remarks: "23",
                // paymentAmount: "1",
            },
        },
    },
    computed: {
        showValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        onSubmit() {
            console.log("submit!");
        },
        open() {
            this.$toast("打开事件");
            // 发起请求---银行账户申请（）
        },
        submitForm() {
            this.$toast("提交事件");
            // 账户单选额外处理
            // this.paymentInforData.paymentAccount=
        },

        closed() {
            this.$toast("关闭事件");
        },
        cancel() {
            this.$toast("取消事件");
        },
    },
};
</script>
<style scoped lang="scss">
.margin-top {
    margin-top: 30px;
}
</style>
