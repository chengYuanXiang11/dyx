<template>
    <!--新建预算项目
         -->
    <Yg-Drawer
        v-model="showValue"
        :title="type == 'edit' ? '修改项目' : '新建项目'"
        @confirm="submitForm"
        @closed="closed"
        @cancel="cancel"
        @open="open"
        size="700px"
    >
        <el-col>
            <div
                v-loading="!if_response"
                element-loading-text="拼命加载中"
            ></div>
            <!-- 无子项时表单 -->
            <BudgetForm
                v-if="if_response"
                v-model="form"
                :itemShow="form.child_list && form.child_list.length <= 0"
                :type="type"
                :pay_detail="pay_detail"
                :apply_detail="apply_detail"
                :id="id"
                ref="formF"
                v-loading="!if_response"
            ></BudgetForm>
        </el-col>
        <!-- 有子项时表单 -->
        <el-col v-if="form.child_list && form.child_list.length > 0">
            <el-card
                class="box-card"
                v-for="(item, index) in form.child_list"
                :key="`item${index}`"
            >
                <div slot="header" class="clearfix">
                    <span>子项{{ index }}</span>
                    <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        @click="removechild_list(index)"
                        >删除按钮</el-button
                    >
                </div>
                <BudgetForm
                    v-if="if_response"
                    v-model="form.child_list[index]"
                    :choices_in="true"
                    :choices_out="true"
                    :type="type"
                    :ref="`form${index}`"
                    :pay_detail="pay_detail"
                    :apply_detail="apply_detail"
                    :id="id"
                ></BudgetForm>
            </el-card>
        </el-col>
        <!-- 待解决，等流程完毕,如果父级有金额并且不为0，才可以进行子项添加，否则不可进行子项添加，
            问题:刚开始创建时，无申请预算为0，此时与这种情况冲突
         -->
        <el-button @click="addSubitemBudget" v-if="if_response">
            添加子项
        </el-button>
    </Yg-Drawer>
</template>
<script>
import {
    addBudgets,
    getSingleBudgets,
    PUTBudgets,
} from "@/request/api/financial/budget/project.js";
import BudgetForm from "./BudgetForm.vue";
export default {
    name: "addBudget",
    data() {
        return {
            form: {
                name: "",
                pay_detail: [],
                apply_detail: [],
                child_list: [],
            },
            formData: {},
            // 当前付款类型
            pay_detail: [],
            // 当前报销类型
            apply_detail: [],
            if_response: false,
        };
    },
    components: {
        BudgetForm,
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "add",
        },
        id: {
            type: String,
            default: "1",
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
        // 打开重新请求
        async open() {
            this.if_response = false;
            await this.getpaymentType();
            await this.getreimburseType();
            if (this.type === "add") {
                this.form = {
                    name: "",
                    pay_detail: [],
                    apply_detail: [],
                    child_list: [],
                };
                this.if_response = true;
            }
            if (this.type === "edit") {
                getSingleBudgets(this.id)
                    .then((res) => {
                        this.form = res.data;
                        this.formData = JSON.parse(JSON.stringify(this.form));
                    })
                    .finally((err) => {
                        this.if_response = true;
                    });
            }
        },
        getpaymentType() {
            return new Promise((respone) => {
                this.getDicts("paymentType").then((res) => {
                    res.data.forEach((v) => {
                        v.name = v.label;
                    });
                    this.pay_detail = res.data;
                    respone();
                });
            });
        },
        getreimburseType() {
            return new Promise((respone) => {
                this.getDicts("reimburseType").then((res) => {
                    res.data.forEach((v) => {
                        v.name = v.label;
                    });
                    this.apply_detail = res.data;
                    respone();
                });
            });
        },
        // handleSelectionChange(selection, type) {
        //     this.form[type] = selection;
        // },
        // 添加子项
        addSubitemBudget() {
            this.form.pay_detail = [];
            this.form.apply_detail = [];
            this.form.child_list.push({ pay_detail: [], apply_detail: [] });
        },
        //删除子项
        removechild_list(index) {
            this.form.pay_detail = [];
            this.form.apply_detail = [];
            this.form.child_list.splice(index, 1);
        },
        submitForm() {
            let key = true;
            // 验证父级项目名称
            if (!this.$refs.formF.Verification()) {
                key = false;
            }
            // 验证子级项目名称
            if (this.form.child_list.length > 0) {
                this.form.child_list.forEach((v, index) => {
                    if (!this.$refs[`form${index}`][0].Verification()) {
                        key = false;
                    }
                });
            }
            // 验证通过
            if (key) {
                //   新建提交
                if (this.type == "add") {
                    addBudgets(this.form).then((res) => {
                        this.$message.success("新增成功");
                        if( this.$refs.form){
                             this.$refs.form.resetForm();
                        }

                        this.showValue = false;
                        this.form = {
                            name: "",
                            pay_detail: [],
                            apply_detail: [],
                            child_list: [],
                        };
                        this.formData = JSON.parse(JSON.stringify(this.form));
                        this.showValue = false;
                        this.$emit("reset");
                    });
                } else {
                    // 修改提交
                    PUTBudgets(this.id, this.form).then((res) => {
                        this.$message.success("修改成功");
                        this.showValue = false;
                        this.$emit("reset");
                    });
                }
            } else {
                this.$message.warning("请确认各个项目名称是否符合");
            }
        },
        // 去除空数组(暂无用)
        deleteUnok(form) {
            for (const key in form) {
                if (Object.hasOwnProperty.call(form, key)) {
                    if (Array.isArray(form[key]) && form[key].length === 0) {
                        Reflect.deleteProperty(form, key);
                    } else {
                        if (typeof form[key] === "object") {
                            this.deleteUnok(form[key]);
                        }
                    }
                }
            }
        },
        // 关闭
        closed() {
            this.form = JSON.parse(JSON.stringify(this.formData));
        },
        //取消
        cancel() {
            this.showValue = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.box-card {
    margin: 10px 0;
}
</style>
