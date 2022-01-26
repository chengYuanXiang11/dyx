<template>
    <el-row>
        <el-col class="form-warp">
            <!-- <el-form>
                <el-form-item
                    label="调整明细 ："
                    prop="age"
                    :rules="[
                        { required: true, message: '不能为空' }

                    ]"
                >
                </el-form-item>
            </el-form> -->
            <template>
                <div v-for="(items, index) in budgetsfApi" :key="index">
                    <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span
                                >{{ title
                                }}{{
                                    fApiLength > 1 ? `( ${index + 1} )` : ""
                                }}</span
                            >
                            <el-button
                                style="float: right; padding: 3px 0"
                                type="text"
                                @click="removeBusinesstrip(index)"
                                >删除</el-button
                            >
                        </div>
                        <form-create
                            class="form-create"
                            v-model="budgetsfApi[index]"
                            :rule="budgetsRule[index]"
                            :rows="8"
                            :option="option"
                            prefix-icon="el-icon-date"
                            @change="changeValidate"
                        >
                        </form-create>
                    </el-card>
                </div>
            </template>
            <el-col>
                <el-button @click="addBusinesstrip">添加项目</el-button>
            </el-col>
            <!-- 总金额计算 -->
            <!-- <el-col v-if="code === 'budget'">
                <el-form-item label="总金额(元)：" placeholder="请输入">
                    <el-input disabled v-model="totalAmount"></el-input>
                </el-form-item>
            </el-col> -->

            <!-- <el-form-item
                class="examine-label"
                label="同行人"
                :style="{ marginLeft: '8px' }"
            >
                <el-timeline>
                    <el-timeline-item>
                        <template slot="dot">
                            <SelectUsersDialog
                                :visible.sync="PeerShowDialog"
                                :data="datas"
                                :users="users"
                                :oneself="true"
                                model="user"
                                :multiple="true"
                                placeholder="请选择人员"
                                @confirm="peerGetDatas"
                            ></SelectUsersDialog>
                            <div
                                v-for="item in PeerUsers"
                                :key="item.user_id"
                                class="Approver-warp"
                            >
                                <el-badge value="一">
                                    <el-avatar class="Approver" size="large">
                                        <template #default>
                                            <div>
                                                {{
                                                    item.user_name.substring(
                                                        item.user_name.length -
                                                            2
                                                    )
                                                }}
                                            </div>
                                        </template>
                                    </el-avatar>
                                </el-badge>
                                <span class="Approver-font">
                                    {{ item.user_name }}
                                </span>
                            </div>
                            <el-button
                                :circle="true"
                                icon="el-icon-plus"
                                @click="peerSelectUsers"
                            ></el-button>
                        </template>
                    </el-timeline-item>
                </el-timeline>
            </el-form-item> -->
        </el-col>
        {{ value }}
    </el-row>
</template>

<script>
// 实验多选接口（非正式数据）
import { getDicts } from "@/request/api/basis/dict/data.js";
// 获取项目信息
import { getBudgetsAll } from "@/request/api/financial/budget/project.js";
import { debounce } from "@/utils";
import { calcDay, calcHour } from "../../../utils/day";

export default {
    name: "Apply",
    data() {
        return {
            key: true,
            code: this.$route.query.code,
            option: {
                submitBtn: false,
                resetBtn: false,
            },
            // 基础规则
            rulfs: [],
            // 规则数组
            budgetsRule: [],
            // fApi数组
            budgetsfApi: [],
            // 表单数据
            budgetsFormData: null,
            createdKey: true,
            totalAmount: 0,
            debounceAmount: null,
            // 城市列表
            city: [],
            queryType: this.$route.query.type == "see" ? "see" : "add",
        };
    },
    computed: {
        fApiLength() {
            return this.budgetsfApi.length;
        },
        title() {
            switch (this.label) {
                case "businesstrip":
                    return "行程";
                case "budget":
                    return "项目";
                default:
                    break;
            }
        },
    },
    created() {
        this.rulfs = this.rule;
        this.debounceAmount = debounce(this.calculateTotalAmount, 200);
        // 查看时
        if (this.queryType == "see") {
            this.value.forEach((v, k) => {
                this.addBusinesstrip();
            });
            this.$nextTick(() => {
                this.budgetsfApi.forEach((v, k) => {
                    v.coverValue(this.value[k]);
                });
            });
        } else {
            // 新增时
            this.addBusinesstrip();
        }
    },
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        // 根据code处理不同的label
        label: {
            type: String,
            default: "",
        },
        // 子组件验证
        validate: {
            type: Boolean,
            default: false,
        },
        // 基本规则
        rule: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        day(newV, endV, type, k = 0) {
            let day = calcHour(newV, endV);
            if (day === 0 || day < 0) {
                // 当时间差距为0或者有一个小于0时,赋值为0
                if (type === "businesstrip") {
                    return 0;
                } else {
                    //   this.setValue(`${type}Duration`, "0");
                    //   this.fApi.validateField(`${type}EndTime`);
                    return;
                }
            }
            if (type === "businesstrip") {
                // this.setValue(`${type}Duration`, String(day));
                return day;
            } else {
                this.setValue(`${type}Duration`, String(day));
            }
            // 时间更改触发结束时间的验证
        },
        // 直接修改值,比如请假
        setValue(type, value) {
            this.fApi.setValue({ [type]: value });
        },

        onChange(boolean) {
            console.log(boolean)
            if (boolean) {
                // unlocking代表所有行程表全部通过验证
                let unlocking = true;
                let Data = [];
                this.budgetsfApi.forEach((value, index) => {
                    value.validate((valid) => {
                        if (valid === false) {
                            unlocking = false;
                            console.log("审批不同");
                            this.$emit("update:validate", false);
                            // 此时代表验证不通过审批流程消失
                            // this.key = true;
                        }
                    });
                });
                // if (unlocking && this.key) {
                if (unlocking) {
                    //验证通过
                    this.budgetsfApi.forEach((value, index) => {
                        value.submit((formData, fApi) => {
                            // Data[`value${index}`] = formData;
                            Data.push(formData);
                        });
                    });
                    // if (this.code === "budget") {
                    // Data.totalAmount = this.totalAmount;
                    // }
                    this.$emit("update:validate", true);
                    if (this.code === "businesstrip") {
                        // 需要额外处理城市
                    }
                    this.$emit("input", Data);
                    // this.$emit("ochange");
                }
            }
        },
        changeValidate() {
            console.log(this.key
                    ? this.budgetsfApi.every((value, index) => {
                          return Object.values(value.formData()).every((v) => {
                              return v !== undefined && v !== null;
                          });
                      })
                    : true)
            this.onChange(
                this.key
                    ? this.budgetsfApi.every((value, index) => {
                          return Object.values(value.formData()).every((v) => {
                              return v !== undefined && v !== null;
                          });
                      })
                    : true
            );
        },
        // 添加
        addBusinesstrip() {
            let arr = JSON.parse(JSON.stringify(this.rulfs)).map((v) => {
                v.value = null;
                return v;
            });
            this.budgetsRule.push(arr);
            this.budgetsfApi.push({});
            this.city.push({});
            if (this.validate) {
                this.$emit("update:validate", false);
                this.$emit("ochange");
            }
            this.$nextTick(() => {
                this.addBusinesstripValidate();
            });
        },
        //删除
        removeBusinesstrip(index) {
            if (this.budgetsRule.length <= 1) {
                this.$message({
                    message: "已剩下最后一条，不可删除",
                    type: "warning",
                });
                return;
            }
            this.budgetsRule.splice(index, 1);
            this.budgetsfApi.splice(index, 1);
            this.city.splice(index, 1);
            this.calculateTotalAmount();
        },
        // 计算总金额
        calculateTotalAmount() {
            let arr = [];
            this.budgetsfApi.forEach((v) => {
                arr.push(v.formData()[`${this.code}Money`]);
            });
            arr = arr.reduce((a, b) => Number(a) + Number(b), 0);
            this.$emit("TotalMoney", arr);
        },
        addBusinesstripValidate() {
            let values = this.budgetsfApi[this.fApiLength - 1];
            let indexiLength = this.fApiLength - 1;
            // 开始时间日期验证
            values.updateValidate(
                [`${this.code}Time`],
                [
                    {
                        validator: (rule, value, callback) => {
                            let endTime = values.getValue(
                                `${this.code}EndTime`
                            );
                            if (value !== null) {
                                // 如果出差时长等于0

                                if (new Date(value) - new Date(endTime) == 0) {
                                    values.setValue({
                                        [`${this.code}Duration`]: "0",
                                    });
                                    callback("时长应该大于0");
                                } else if (
                                    // 如果出差时长小于0，并且开始结束时间都存在时候，触发结束时间验证
                                    new Date(value) - new Date(endTime) > 0 &&
                                    endTime
                                ) {
                                    values.validateField(`${this.code}EndTime`);
                                } else {
                                    // 如果结束时间存在，则重新计算出差时长
                                    if (endTime) {
                                        let day = this.day(
                                            new Date(value),
                                            new Date(endTime),
                                            this.code
                                        );

                                        values.setValue({
                                            [`${this.code}Duration`]:
                                                String(day),
                                        });
                                        // 计算总时长(天)
                                        let arr = [];
                                        this.budgetsfApi.forEach((v) => {
                                            arr.push(
                                                v.formData()[
                                                    `${this.code}EndTime`
                                                ]
                                            );
                                            arr.push(
                                                v.formData()[`${this.code}Time`]
                                            );
                                        });
                                        arr = arr
                                            .sort(
                                                (a, b) =>
                                                    new Date(a).getTime() -
                                                    new Date(b).getTime()
                                            )
                                            .filter((v) => v);
                                        this.$emit(
                                            "TotalDuration",
                                            calcDay(
                                                new Date(arr[0]),
                                                new Date(arr[arr.length - 1])
                                            )
                                        );
                                        callback();
                                    } else {
                                        // 如果结束时间不存在，则赋值为0
                                        values.setValue({
                                            [`${this.code}Duration`]: "0",
                                        });
                                    }
                                }
                            }
                            callback();
                        },
                    },
                ],
                true
            );
            // 结束时间验证
            values.updateValidate(
                [`${this.code}EndTime`],
                [
                    {
                        validator: (rule, value, callback) => {
                            let startTime = values.getValue("businesstripTime");
                            if (value !== null) {
                                if (new Date(value) - new Date(startTime) < 0) {
                                    values.setValue({
                                        [`${this.code}Duration`]: "0",
                                    });
                                    callback("结束时间不得小于开始时间");
                                } else if (
                                    new Date(value) - new Date(startTime) ==
                                    0
                                ) {
                                    values.setValue({
                                        [`${this.code}Duration`]: "0",
                                    });
                                    callback("时长应该大于0");
                                } else {
                                    if (startTime) {
                                        let day = this.day(
                                            new Date(startTime),
                                            new Date(value),
                                            "businesstrip"
                                        );
                                        values.setValue({
                                            [`${this.code}Duration`]:
                                                String(day),
                                        });
                                        values.validateField(
                                            `${this.code}Time`
                                        );
                                        let arr = [];
                                        this.budgetsfApi.forEach((v) => {
                                            arr.push(
                                                v.formData()[
                                                    `${this.code}EndTime`
                                                ]
                                            );
                                            arr.push(
                                                v.formData()[`${this.code}Time`]
                                            );
                                        });
                                        arr = arr
                                            .sort(
                                                (a, b) =>
                                                    new Date(a).getTime() -
                                                    new Date(b).getTime()
                                            )
                                            .filter((v) => v);
                                        this.$emit(
                                            "TotalDuration",
                                            calcDay(
                                                new Date(arr[0]),
                                                new Date(arr[arr.length - 1])
                                            )
                                        );
                                        callback();
                                    } else {
                                        values.setValue({
                                            [`${this.code}Duration`]: "0",
                                        });
                                    }
                                }
                            }
                            callback();
                        },
                    },
                ],
                true
            );
            // 项目金额验证
            values.updateValidate(
                [`${this.code}Money`],
                [
                    {
                        validator: (rule, value, callback) => {
                            if (value === null || value === undefined) {
                                return;
                            }
                            let fixed = value.toString().split(".")[1];
                            if (fixed !== undefined && fixed.length > 2) {
                                // this.$emit(
                                //     "TotalDuration",
                                //     calcDay(
                                //         new Date(arr[0]),
                                //         new Date(arr[arr.length - 1])
                                //     )
                                // );
                                // (待解决，持续按压增加)
                                values.setValue(
                                    `${this.code}Money`,
                                    Number.parseFloat(value).toFixed(2)
                                );
                                return;
                            } else {
                                this.debounceAmount();
                                callback();
                            }
                        },
                    },
                ],
                true
            );
            // (待解决)金额验证统一和并优化
            values.updateValidate(
                "adjustmentMoney",
                [
                    {
                        validator: (rule, value, callback) => {
                            let fixed = value.toString().split(".")[1];
                            if (fixed !== undefined && fixed.length > 2) {
                                values.setValue(
                                    "adjustmentMoney",
                                    Number.parseFloat(value).toFixed(2)
                                );
                                return;
                            } else {
                                this.debounceAmount();
                                callback();
                            }
                        },
                    },
                ],
                true
            );
            // 城市选择
            values.on("businesstrip-destination-get-labels", (v) => {
                if (this.city[indexiLength] == undefined) {
                    this.city[indexiLength] = {};
                }
                this.city[indexiLength].businesstripDestination = v;
                // this.setValue("businesstripDuration", v);
            });
            values.on("businesstrip-becity-get-labels", (v) => {
                if (this.city[indexiLength] == undefined) {
                    this.city[indexiLength] = {};
                }
                this.city[indexiLength].businesstripBecity = v;
            });
            // 预算项目时添加申请验证
            values.on("budget-visible-change", (v) => {
                if (v) {
                    // 打开加载
                    values.mergeRule(
                        "budgetName",
                        {
                            props: { loading: true },
                        },
                        true
                    );
                    // 获取节点数据
                    getBudgetsAll().then((res) => {
                        let arr = [];
                        res.data.forEach((v) => {
                            let child = JSON.parse(v.child_list);
                            // 没有二级的项目
                            if (child.length <= 0) {
                                v.label = v.name;
                                v.value = JSON.stringify(v);
                                arr.push(v);
                            } else {
                                // 有二级的项目
                                child.forEach((v) => {
                                    v.label = v.name;
                                    v.value = JSON.stringify(v);
                                    arr.push(v);
                                });
                            }
                        });
                        values.updateRule(
                            "budgetName",
                            {
                                options: arr,
                            },
                            true
                        );
                        // 关闭加载
                        values.mergeRule(
                            "budgetName",
                            {
                                props: { loading: false },
                            },
                            true
                        );
                    });
                }
            });
            // 报销申请
            values.on("reimbursement-visible-change", (v) => {
                // （待解决，接口不对）
                if (v) {
                    // 打开加载
                    values.mergeRule(
                        "reimbursementType",
                        {
                            props: { loading: true },
                        },
                        true
                    );
                    // 获取节点数据
                    this.getDicts("reimburseType").then((res) => {
                        res.data.forEach((v) => {
                            v.value = v.label;
                        });
                        values.updateRule(
                            "reimbursementType",
                            {
                                options: res.data,
                            },
                            true
                        );
                        // 关闭加载
                        values.mergeRule(
                            "reimbursementType",
                            {
                                props: { loading: false },
                            },
                            true
                        );
                    });
                }
            });
            // 预算调整
            values.on("callout-visible-change", (v) => {
                if (v) {
                    // 打开加载
                    values.mergeRule(
                        "adjustmentCallout",
                        {
                            props: { loading: true },
                        },
                        true
                    );
                    // 获取节点数据
                    getDicts("usingLaborType").then((res) => {
                        let arr = [
                            {
                                id: "1",
                                label: "2",
                                value: 2,
                            },
                        ];
                        values.updateRule(
                            "adjustmentCallout",
                            {
                                options: arr,
                            },
                            true
                        );
                        // 关闭加载
                        values.mergeRule(
                            "adjustmentCallout",
                            {
                                props: { loading: false },
                            },
                            true
                        );
                    });
                }
            });
            values.on("transferin-visible-change", (v) => {
                if (v) {
                    values.mergeRule(
                        "adjustmentTransferin",
                        {
                            props: { loading: true },
                        },
                        true
                    );
                    getDicts("usingLaborType").then((res) => {
                        let arr = [
                            {
                                id: "1",
                                label: "2",
                                value: 2,
                            },
                        ];
                        values.updateRule(
                            "adjustmentTransferin",
                            {
                                options: arr,
                            },
                            true
                        );
                        values.mergeRule(
                            "adjustmentTransferin",
                            {
                                props: { loading: false },
                            },
                            true
                        );
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-card {
    width: 500px;
}
::v-deep .el-input--medium .el-input__inner {
    width: 260px !important;
}
::v-deep .el-form-item--medium .el-form-item__label {
    width: auto !important;
}
::v-deep .el-form-item__content {
    margin-left: 100px !important;
}
// ::v-deep .el-form-item__content span {
//     position: absolute;
//     display: inline-block;
//     width: 88px;
//     font-size: 12px;
//     right: 0px;
// }
::v-deep .el-select .el-input .el-select__caret {
    display: none;
}
</style>
