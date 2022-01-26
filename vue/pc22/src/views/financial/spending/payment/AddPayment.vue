<template>
    <div class="app-container">
        <!-- 新建付款 -->
        <el-form
            ref="form"
            :model="form"
            label-width="180px"
            v-loading="loading"
        >
            <el-form-item label="付款状态">
                <el-radio-group v-model="form.paymentStatus">
                    <el-radio-button label="1">待付款</el-radio-button>
                    <el-radio-button label="2">已付款</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="付款类型">
                <el-select v-model="form.PaymentType" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.label"
                        :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="付款事由">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.paymentReason"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="付款金额(元)">
                <el-input placeholder="请输入内容" v-model="form.paymentAmount">
                </el-input>
            </el-form-item>
            <el-form-item label="期望付款日期">
                <el-date-picker
                    v-model="form.expectedDate"
                    type="date"
                    placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="收款人(单位)">
                <el-input
                    placeholder="请输入内容"
                    v-model="form.paymentAmount"
                ></el-input>
            </el-form-item>
            <el-form-item label="银行账户">
                <el-input
                    placeholder="请输入内容"
                    v-model="form.bankAccount"
                ></el-input>
            </el-form-item>
            <el-form-item label="付款账户"  v-if="form.paymentStatus === '2'">
                <span v-if="paymentAccount.length === 0">
                    请先在【银行账户】功能中设置付款账户
                </span>
                <el-radio-group v-model="form.paymentAccount">
                    <el-radio
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
            <el-form-item label="备注" v-if="form.paymentStatus === '2'">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
                <el-form-item label="附件">
               <Execl v-model="form.file" ></Execl>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>
import Execl from '@/views/personnel/Scheduling/Execl.vue'
export default {
    name: "AddPayment",
    data() {
        return {
            form: {
                paymentStatus: "1",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: "",
            },
            options: [],
            loading: false,
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
    components:{Execl},
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            this.getDicts("paymentType")
                .then((res) => {
                    res.data.forEach((v) => {
                        v.value = v.label;
                    });
                    this.options = res.data;
                })
                .finally((err) => {
                    this.loading = false;
                });
        },
        onSubmit() {
            console.log("submit!");
        },
    },
};
</script>
