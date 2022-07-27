<template>
    <el-row class="warp">
        <el-col>
            <span class="h2-font">{{ this.$route.query.flow_name }}</span>
        </el-col>
        <!-- {{fileList}} -->
        <el-col class="form-warp">
            <el-form
                v-loading="loading"
                class="form-apply"
                :ref="type.formRef"
                label-position="left"
                label-width="120px"
                label-suffix=":"
            >
                <!-- 动态表单 -->
                <form-create
                    v-if="rulfs.length > 0"
                    class="form-create"
                    v-model="fApi"
                    :rule="rulfs"
                    :option="option"
                    :rows="8"
                    prefix-icon="el-icon-date"
                    @change="changeValidate"
                    @leave-type-input="resetForm"
                    @leave-time-change="dayChange('leave')"
                    @leave-end-time-change="dayChange('leave')"
                    @clockin-time-input="clockinChange"
                    @overtime-time-change="dayChange('overtime')"
                    @overtime-end-time-change="dayChange('overtime')"
                    @goout-time-change="dayChange('goout')"
                    @goout-end-time-change="dayChange('goout')"
                    @changeshift-time-change="substituteTime('start')"
                    @changeshift-end-time-change="substituteTime('end')"
                >
                </form-create>
                <Budget
                    v-loading="loading"
                    ref="mychild"
                    v-model="groupData"
                    :validate.sync="groupValidate"
                    :rule="groupRule"
                    v-if="this.groupRule.length > 0"
                    @ochange="changeValidate"
                    @TotalDuration="TotalDuration"
                    @TotalMoney="TotalMoney"
                    :label="code"
                ></Budget>

                <!-- 下部区域 -->
                <form-create
                    v-if="this.BootomRule.length > 0"
                    v-model="BootomfApi"
                    :rule="BootomRule"
                    :option="option"
                    :rows="8"
                    prefix-icon="el-icon-date"
                    @change="onChange(true)"
                >
                </form-create>
            </el-form>
            <!-- 审核流程 -->
            <el-row class="ringht-warp" v-if="queryType === 'add'">
                <Examine
                    :process.sync="process"
                    :examineData.sync="examineData"
                >
                </Examine>
            </el-row>
        </el-col>

        <!-- 底部提交 -->
        <ApplyFoot v-if="queryType === 'add'">
            <el-button @click="goBack" plain>取消</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </ApplyFoot>
    </el-row>
</template>

<script>
// 组件
import HolidayTypes from "@/views/system/form/components/form/module/holiday-types.vue";
import PunchTimeSelect from "@/views/system/form/components/form/module/punchTime-select.vue";
import DictSelect from "@/views/system/form/components/form/module/dict-select.vue";
import Examine from "./Examine/Examine .vue";
import ApplyFoot from "./FormComponents/Foot/ApplyFoot.vue";
import Substitute from "./FormComponents/Substitute/Substitutes.vue";
import Budget from "./FormComponents/budget/budget.vue";
import Execl from "@/views/personnel/Scheduling/Execl.vue";

//接口
import axios from "axios";
// 拿到假期的详细规则
import { getInfo } from "@/request/api/personnel/checking/holiday";
import { getUserProfile } from "@/request/api/organization/user.js";

import { flowDetails, getJson } from "@/request/api/system/form.js";
import { getProcess, setFoundflow } from "@/request/api/system/flow.js";
import { getToken } from "@/utils/auth.js";
// 实验多选接口（非正式数据）
import { getDicts } from "@/request/api/basis/dict/data.js";
import { calcDay, calcHour } from "../utils/day";
// 日期处理库
import moment from "moment";
// 多选请求接口
formCreate.register({
    name: "selectData",
    init({ value }, rule) {
        switch (value) {
            case "makeup":
                // 请求补卡数据
                getDicts("usingLaborType").then((res) => {
                    res.data.map((v) => {
                        v.value = v.label;
                    });
                    rule.options = res.data;
                });
                break;
            case "overtime":
                rule.options = [
                    {
                        id: 1,
                        label: "转换为调休假",
                        value: "转换为调休假",
                    },
                    {
                        id: 2,
                        label: "转换为工资",
                        value: "转换为工资",
                    },
                ];
                break;
            case "businesstripDestination":
                getDicts("usingLaborType").then((res) => {
                    res.data.map((v) => {
                        v.value = v.label;
                    });
                    rule.options = res.data;
                });
                break;
            default:
                break;
        }
    },
});

export default {
    name: "Apply",
    data() {
        return {
            // 数据
            type: {},
            // 动态表单数据
            fApi: {},
            BootomfApi: {},
            BootomRule: [],
            // 表单全局配置
            option: {
                form: {
                    disabled: false,
                },
                submitBtn: false,
                resetBtn: false,
            },
            // 表单规则
            rulfs: [],
            groupData: [],
            // 可添加可删除表单的规则
            groupRule: [],
            // 可添加表单验证是否通过
            groupValidate: false,

            // 审核人和抄送人
            examineData: [],
            // 申请名称
            name: "",
            // 是否显示流程
            process: false,
            datas: [],
            users: [],
            //控制是否继续验证,防止频繁请求接口
            key: true,
            code: this.$route.query.code,
            id: this.$route.query.id,
            // 城市列表
            city: [],
            //浅比较
            FormData: [],
            copyFormData: null,
            loading: true,
            // 打开上传
            // 总金额
            // 上传文件地址
            fileList: [],
            // 添加或者查看默认添加
            queryType: this.$route.query.type == "see" ? "see" : "add",
        };
    },
    components: {
        HolidayTypes,
        DictSelect,
        PunchTimeSelect,
        ApplyFoot,
        Examine,
        Substitute,
        // 预算申请
        Budget,
        Execl,
    },
    computed: {
        fApiLength() {
            return this.code === "businesstrip" ? this.copyfApi.length : 0;
        },
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    methods: {
        getList() {
            if (this.$route.query.flow_name !== undefined) {
                this.$route.meta.title = this.$route.query.flow_name;
            }
            // axios.get("http://localhost:8081/a.json").then((res) => {
            //     // this.rulfs = res;
            //     // console.log(res)
            //     res.forEach((v) => {
            //         if (v.group) {
            //             this.groupRule.push(v);
            //         } else if (v.Bootom) {
            //             this.BootomRule.push(v);
            //         } else {
            //             this.rulfs.push(v);
            //         }
            //     });
            //     console.log(this.BootomRule);
            //     // 修改申请部门
            //     getUserProfile().then((res) => {
            //         this.setValue("adjustmentDept", res.data.dept.deptName);
            //         this.setValue("budgetDept", res.data.dept.deptName);

            //         // this.setValue([`${this.code}Dept`], res.data.dept.deptName);
            //     });
            //     this.$nextTick(() => {
            //         // 添加验证规则
            //         if (this.fApi.updateValidate) {
            //             this.addValidate("budget");
            //         }
            //         this.loading = false;
            //     });
            // });

            // // 根据code获取数据
            flowDetails(this.id)
                .then((res) => {
                    this.type = res.data;
                    let data = JSON.parse(this.type.config).formData;
                    data.forEach((v) => {
                        if (v.group) {
                            this.groupRule.push(v);
                        } else if (v.Bootom) {
                            this.BootomRule.push(v);
                        } else {
                            this.rulfs.push(v);
                        }
                    });
                    this.groupData = [
                        {
                            reimbursementDuration: "0",
                            reimbursementType: "报销类型2",
                            reimbursementTime: "2021-11-02 00:00:00",
                        },
                        {
                            reimbursementDuration: "0",
                            reimbursementType: "报销类型1",
                            reimbursementTime: "2021-11-02 00:00:00",
                        },
                        {
                            reimbursementDuration: "0",
                            reimbursementType: "报销类型2",
                            reimbursementTime: "2021-11-02 00:00:00",
                        },
                    ];
                    this.name = this.type.name;
                    this.num = 1;
                    if (this.rulfs.length > 0) {
                        this.$nextTick(() => {
                            // 添加验证规则
                            this.addValidate(this.$route.query.code);
                            if (this.queryType == "see") {
                                this.fApi.coverValue({
                                    reimbursementDuration: "0",
                                    reimbursementMoney: "22213",
                                    reimbursementTime: "2021-11-02 00:00:00",
                                    reimbursementType: "报销类型1",
                                    reimbursementReason: "12",
                                    reimbursementTotalMoney: 22213,
                                    reimbursementAccount: "9559980868435875810",
                                });
                                this.BootomfApi.coverValue({
                                    reimbursementDuration: "0",
                                    reimbursementMoney: "22213",
                                    reimbursementTime: "2021-11-02 00:00:00",
                                    reimbursementType: "报销类型1",
                                    reimbursementReason: "12",
                                    reimbursementTotalMoney: 22213,
                                    reimbursementAccount: "9559980868435875810",
                                    budgetFile: [
                                        {
                                            name: "bba73335-e751-4715-aac5-d1b61156ffe2.xlsx",
                                            percentage: 100,
                                            size: "8k",
                                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            url: "http://mrppcapiuat.yugu8.com/pc/media/system/2021-11-29/dd959831-e5c3-45d3-a7ee-ec45368153f2.xlsx",
                                        },
                                    ],
                                });

                                this.option.form.disabled = true;
                            }
                        });
                    }
                })
                .then(() => {
                    if (this.rulfs.length > 0) {
                        // 默认添加申请部门
                        if (
                            this.fApi.getValue(`${this.code}Dept`) !== undefined
                        ) {
                            getUserProfile().then((res) => {
                                this.setValue(
                                    `${this.code}Dept`,
                                    res.data.dept.deptName
                                );
                            });
                        }
                    }
                })
                .catch((err) => {
                    this.$message.error("请求超时，请刷新重试");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 假期类型改变是否重置表单（保留需求）
        resetForm() {
            //重置表单
            this.fApi.reload();
            this.$router.back();
        },
        // 提交
        onSubmit() {
            // console.log(this.groupData, {
            //     examine_id: this.$route.query.id,
            //     // flow_var:Object.assign(this.fApi.formData(),this.BootomfApi.formData()),
            //     flow_var: this.fApi.formData(),

            //     // this.PeerUsers
            //     file: this.fileList,
            //     node_list: this.examineData,
            // });
            if (this.$refs.mychild) {
                this.$refs.mychild.onChange(true);
            }
            // 触发子组件验证方法

            // 如果不需要子项目
            if (this.groupRule.length <= 0) {
                this.fApi.submit((formData, fApi) => {
                    this.fApi.validate((valid, fail) => {
                        if (valid) {
                            this.key = false;
                            //todo 字段验证通过

                            // 删除警示语，剔除无用数据
                            if (Reflect.has(formData, "makeupTimeAlert")) {
                                Reflect.deleteProperty(
                                    formData,
                                    "makeupTimeAlert"
                                );
                            }
                            //     let key = Object.keys(formData).filter((v) => v.indexOf("Duration") >= 0).join('')
                            //    let time =  formData[key]
                            //     console.log(time)
                            //     formData[key] = Number(time)
                            //     formData['overtimeTime'] = new Date("2021-11-03 00:00:00")
                            //     formData['overtimeEndTime'] = new Date("2021-12-25 00:00:00")
                            // Object.keys(formData).indexOf('Duration')
                            setFoundflow({
                                examine_id: this.$route.query.id,
                                flow_var: formData,
                                node_list: this.examineData,
                            })
                                .then((res) => {
                                    this.$message({
                                        message: "申请提交成功",
                                        type: "success",
                                    });
                                    this.$router.back();
                                })
                                .catch((err) => {
                                    this.$message.error("申请提交失败");
                                });
                            console.log(
                                formData,
                                this.budgetsData,
                                this.validate
                            );
                            // 发起请求拿到审核数据
                        }
                    });
                    //   });
                });
            } else {
                // 子组件验证通过
                if (this.fApi.validate) {
                    this.fApi.validate((valid, fail) => {
                        if (valid && this.groupValidate) {
                            //  formdata.peerUsers = this.PeerUsers;
                            switch (this.code) {
                                case "businesstrip":
                                    console.log({
                                        examine_id: this.$route.query.id,
                                        flow_var: {
                                            var: this.groupData,
                                            triptype: "trip",
                                            ...this.fApi.formData(),
                                            ...this.BootomfApi.formData(),
                                        },

                                        node_list: this.examineData,
                                    });
                                    break;
                                case "budget":
                                    setFoundflow({
                                        examine_id: this.$route.query.id,
                                        flow_var: {
                                            var: this.groupData,
                                            triptype: "trip",
                                            ...this.fApi.formData(),
                                            ...this.BootomfApi.formData(),
                                        },

                                        node_list: this.examineData,
                                    })
                                        .then((res) => {
                                            this.$message({
                                                message: "申请提交成功",
                                                type: "success",
                                            });
                                            this.$router.back();
                                        })
                                        .catch((err) => {
                                            this.$message.error("申请提交失败");
                                        });

                                    break;
                            }
                        }
                    });
                } else {
                    if (code === "businesstrip") {
                        //    if(this.groupValidate&&)
                    }
                }

                //     setFoundflow({
                //         examine_id: this.$route.query.id,
                //         flow_var: formdata,
                //         node_list: this.examineData,
                //     })
                //         .then((res) => {
                //             this.$message({
                //                 message: "申请提交成功",
                //                 type: "success",
                //             });
                //             this.$router.back();
                //         })
                //         .catch((err) => {
                //             this.$message.error("申请提交失败");
                //         });
                // }
            }
        },
        // 取消返回请假列表页面
        goBack() {
            // this.$refs[formName].resetFields();
            this.$router.back();
        },
        // 计算日期差距
        /**
         * newV    (开始时间)
         * enV    (结束时间)
         * type  (申请类型)
         * k      (数组时候有用,数组下标)
         */
        getLabels(v) {
            console.log(v);
        },
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
        // 计算日期差距
        /**
         * type : 申请类型
         */
        dayChange(type) {
            if (
                this.fApi.getValue(`${type}Time`) &&
                this.fApi.getValue(`${type}EndTime`)
            ) {
                this.day(
                    new Date(this.fApi.getValue(`${type}Time`)),
                    new Date(this.fApi.getValue(`${type}EndTime`)),
                    type
                );
            }
        },
        // 直接修改值,比如请假
        setValue(type, value) {
            this.fApi.setValue({ [type]: value });
        },
        addValidate(type) {
            // 开始时间日期验证
            this.fApi.updateValidate(
                [`${type}Time`],
                [
                    {
                        validator: (rule, value, callback) => {
                            let endTime = this.fApi.getValue([
                                `${type}EndTime`,
                            ]);
                            if (value !== null) {
                                // 如果出差时长等于0
                                if (new Date(value) - new Date(endTime) == 0) {
                                    callback("时长应该大于0");
                                }
                                // 如果结束时间存在，则重新计算出差时长
                                else if (endTime) {
                                    this.day(
                                        new Date(value),
                                        new Date(endTime),
                                        type
                                    );
                                    this.fApi.validateField([`${type}EndTime`]);
                                    if (this.groupRule.length > 0) {
                                        // this.groupData.forEach(v=>{
                                        //     console.log(v)
                                        // })
                                    }
                                    callback();
                                }
                            }
                            callback();
                        },
                    },
                ],
                true
            );
            // 结束时间日期验证
            this.fApi.updateValidate(
                [`${type}EndTime`],
                [
                    {
                        validator: (rule, value, callback) => {
                            let startTime = this.fApi.getValue([`${type}Time`]);
                            if (value !== null) {
                                if (new Date(value) - new Date(startTime) < 0) {
                                    callback("结束时间不得小于开始时间");
                                }
                                if (
                                    new Date(value) - new Date(startTime) ==
                                    0
                                ) {
                                    callback("时长应该大于0");
                                }
                            }
                            callback();
                        },
                    },
                ],
                true
            );
            this.fApi.updateValidate(
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
                                this.fApi.setValue(
                                    `${this.code}Money`,
                                    Number.parseFloat(value).toFixed(2)
                                );
                                return;
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                true
            );

            //  补卡时间验证
            this.fApi.updateValidate(
                "makeupTime",
                [
                    {
                        validator: (rule, value, callback) => {
                            // 打卡时间
                            // 补卡时间缺乏自动适配合适(待解决，等班次接口)
                            let clockinTime = this.fApi.getValue("clockinTime");
                            // 未选择打开时间则提示选择打开时间
                            if (clockinTime === undefined) {
                                this.setTips("makeupTime", "");
                                callback("请优先先选择打卡时间");
                            } else {
                                // 补卡时间不在正确时间内
                                let time = new Date(value).getTime();
                                let startTime =
                                    new Date().getTime() - 60 * 60 * 1000;
                                let endTime =
                                    new Date().getTime() + 60 * 30 * 1000;
                                if (time > endTime || time < startTime) {
                                    callback("请选择正确的补卡时间");
                                } else {
                                    // 补卡时间正确，显示提示语
                                    callback();
                                }
                            }
                        },
                    },
                ],
                true
            );
            this.fApi.on("payment-type-visible-change", (v) => {
                if (v) {
                    // 打开加载
                    this.fApi.mergeRule(
                        "paymentType",
                        {
                            props: { loading: true },
                        },
                        true
                    );
                    this.getDicts("paymentType").then((res) => {
                        res.data.forEach((v) => {
                            v.value = v.label;
                        });
                        this.fApi.updateRule(
                            "paymentType",
                            {
                                options: res.data,
                            },
                            true
                        );
                        // 关闭加载
                        this.fApi.mergeRule(
                            "paymentType",
                            {
                                props: { loading: false },
                            },
                            true
                        );
                    });
                }
            });
        },

        // 添加申请在这添加
        // 修改时全局验证（用于显示隐藏审批流程，限制是为了优化显示，只有所有表单都有值，并且通过验证才显示审核）
        onChange(boolean) {
            console.log(boolean);
                    console.log(this.BootomfApi.getValue("businesstripReason"));

            if (boolean) {
                // 如果没有数组表单
                if (this.groupRule.length <= 0) {
                    this.fApi.validate((valid, fail) => {
                        if (valid) {
                            // 限制事由等频繁触发
                            if (this.key) {
                                this.FormData = this.fApi.formData();
                                this.fApi.submit((formData, fApi) => {
                                    this.key = false;
                                    if (this.code === "goout") {
                                        formData.gooutImg =
                                            formData.gooutImg[0];
                                        console.log(formData);
                                    }

                                    // 发起请求拿到审核数据
                                    getProcess({
                                        examine_id: this.$route.query.id,
                                        var: formData,
                                    }).then((res) => {
                                        this.examineData = res.data;
                                        console.log(this.examineData);
                                        this.process = true;
                                    });
                                    //   });
                                });
                            } else {
                                // 当时间变动，重新请求
                                let data = this.fApi.formData();

                                if (
                                    data[`${this.code}Duration`] ===
                                    this.FormData[`${this.code}Duration`]
                                ) {
                                    return;
                                } else {
                                    this.key = true;
                                    this.onChange(true);
                                }
                            }
                        } else {
                            if (!this.key) {
                                // 如果是因为事由说明导致验证不通过,则不需要改变数据
                                if (
                                    this.fApi.getValue(`${this.code}Reason`) ===
                                    ""
                                ) {
                                    return;
                                } else {
                                    this.process = false;
                                    this.key = true;
                                }
                            }
                        }
                    });
                } else {
                    // 多次申请待优化
                    let fApiKey = true;
                    let BootomfApiKey = true;
                    // 顶部表单验证
                    if (this.fApi.validate) {
                        this.fApi.validate((valid, fail) => {
                            if (!valid) {
                                fApiKey = false;
                            }
                        });
                    }
                    // 底部表单验证
                    if (this.BootomfApi.validate) {
                        this.BootomfApi.validate((valid, fail) => {
                            if (!valid) {
                                BootomfApiKey = false;
                            }
                        });
                    }
                    if (this.groupValidate && BootomfApiKey && fApiKey) {
                        let data = Object.assign({}, this.groupData);
                        if (this.fApi.formData) {
                            data = Object.assign(data, this.fApi.formData());
                        }
                        if (this.BootomfApi.formData) {
                            data = Object.assign(
                                data,
                                this.BootomfApi.formData()
                            );
                        }
                        getProcess({
                            examine_id: this.$route.query.id,
                            var: data,
                        }).then((res) => {
                            this.examineData = res.data;
                            this.process = true;
                        });
                    }
                }
            }
        },
        // 根据条件禁止全局验证,优化显示
        changeValidate() {
            switch (this.$route.query.code) {
                case "leave":
                    // 当请假时间不为0，并且请假理由和请假类型确定时，才触发验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("leaveDuration") !== "0" &&
                                  this.fApi.getValue("leaveType") &&
                                  this.fApi.getValue("leaveReason")
                            : true
                    );
                    break;
                case "makeup":
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("clockinTime") &&
                                  this.fApi.getValue("makeupReason") &&
                                  this.fApi.getValue("makeupTime")
                            : true
                    );
                    break;
                case "changeshift":
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("changeshiftSubstitute") &&
                                  this.fApi.getValue("changeshiftTime") &&
                                  this.fApi.getValue("changeshiftEndTime") &&
                                  this.fApi.getValue("changeshiftReason")
                            : true
                    );
                    break;
                case "overtime":
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("overtimeDuration") &&
                                  this.fApi.getValue("issueType") &&
                                  this.fApi.getValue("overtimeReason")
                            : true
                    );
                    break;
                case "goout":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("gooutDuration") &&
                                  this.fApi.getValue("gooutReason")
                            : true
                    );
                    break;
                case "businesstrip":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.BootomfApi.getValue("businesstripReason").length
                            : true
                    );
                    break;
                case "lizhi":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("lizhiTime") &&
                                  this.fApi.getValue("lizhiReason")
                            : true
                    );
                    break;
                case "budget":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("budgetName") &&
                                  this.fApi.getValue("budgetReason") &&
                                  this.fApi.getValue("budgetEndTime")
                            : true
                    );
                    break;
                case "payment":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("paymentMoney") &&
                                  this.fApi.getValue("paymentTime") &&
                                  this.fApi.getValue("paymentType") &&
                                  this.fApi.getValue("paymentAccount")
                            : true
                    );
                    break;
                case "pettycash":
                    // 必须每个值都有才会触发全局验证
                    this.onChange(
                        this.key
                            ? this.fApi.getValue("pettycashTime") &&
                                  this.fApi.getValue("pettycashReason") &&
                                  this.fApi.getValue("pettycashPayee") &&
                                  this.fApi.getValue("pettycashMoney") &&
                                  this.fApi.getValue("pettycashAccount")
                            : true
                    );
                    break;
            }
        },
        //计算总时长
        TotalDuration(val) {
            if (this.BootomfApi.setValue) {
                this.BootomfApi.setValue({
                    [`${this.code}TotalDuration`]: val,
                });
            }
        },
        //计算总金额
        TotalMoney(val) {
            if (this.BootomfApi.onSubmit !== undefined)
                this.BootomfApi.setValue([`${this.code}TotalMoney`], val);
        },
        // 补卡操作
        // 原打开时间
        clockinChange() {
            // 修改补卡提示
            this.setAlert(
                "makeupTimeAlert",
                `可补卡时间：${moment(
                    new Date(new Date().getTime() - 60 * 60 * 1000)
                ).format("YYYY-MM-DD HH:mm")} - ${moment(
                    new Date(new Date().getTime() + 60 * 30 * 1000)
                ).format("YYYY-MM-DD HH:mm")}`
            );
        },
        // // 打开选人
        // openSelectUsersDialog() {
        //     this.SubstituteShowDialog = true;
        // },
        // 提示语替换
        setTips(type, font) {
            this.fApi.updateRule([type], {
                suffix: {
                    type: "el-link",
                    children: [font],
                },
            });
        },
        // 警告替换
        setAlert(type, font) {
            this.fApi.updateRule([type], {
                children: [font],
            });
        },
        // 调班提示
        substituteTime(type) {
            // 如果替班人存在
            if (this.fApi.getValue("changeshiftSubstitute")) {
                getUserProfile().then((res) => {
                    this.substituteShift(
                        type,
                        res.data.username,
                        this.fApi.getValue("changeshiftSubstitute")
                    );
                });
            } else {
                //触发名字验证
                //未选择人先清除
                this.fApi.resetFields();
                // 再触发名字验证
                this.fApi.validateField(
                    "changeshiftSubstitute",
                    (valid, fail) => {
                        if (valid) {
                            //todo 字段验证通过
                            return;
                        } else {
                            return;
                        }
                    }
                );
            }
        },
        // 调班班次提示
        substituteShift(type, name1, name2 = false) {
            if (type === "start") {
                this.fApi.updateRule("changeshiftTime", {
                    suffix: {
                        type: "el-link",
                        children: [
                            `${name1}从${"早班"}换为${"休息"},${
                                name2 ? `${name2}从${"休息"}换为${"早班"}` : ""
                            }`,
                        ],
                    },
                });
            } else if (type === "end") {
                this.fApi.updateRule("changeshiftEndTime", {
                    suffix: {
                        type: "el-link",
                        children: [
                            `${name1}从${"早班"}换为${"休息"}，${
                                name2 ? `${name2}从${"休息"}换为${"早班"}` : ""
                            }`,
                        ],
                    },
                });
            }
        },
    },
};
</script>

<style scoped lang="scss">
// 输入框等所有表单宽度
$inputWidth: 360px;
// 多行文本输入高度
$textarea: 120px;
::v-deep .fdasf {
    margin: 20px;
}
.warp {
    height: 80%;
    background-color: #fff;
    overflow-y: scroll;
    .h2-font {
        padding: 16px 0px 0px 24px;
        display: inline-block;
        font-size: 16px;
        font-weight: 500;
        color: rgba(1, 6, 33, 0.9);
        line-height: 24px;
    }
    .form-warp {
        border-radius: 2px;
        overflow: auto;
        display: flex;
        // overflow: hidden;
        // overflow-x: hidden;
        h1 {
            padding: 16px 24px;
        }
        :v-deep .el-textarea__inner {
            height: 120px;
        }
        .form-apply {
            width: 650px;

            padding: 32px 0px 48px 48px;
            ::v-deep .el-select,
            .el-input__inner,
            .el-input--medium {
                width: $inputWidth;
            }
            .form-create {
                // 添加图标
                ::v-deep .el-icon-circle-plus-outline {
                    position: fixed;
                    bottom: -20px;
                    left: 0px;
                }
                // 行程头标题
                ::v-deep .el-card__header div {
                    position: absolute;
                    top: 0px;
                    padding-right: 20px;
                }
                // 删除图标
                ::v-deep .el-icon-remove-outline {
                    position: absolute;
                    left: 500px;
                    left: -80px;
                    top: -300px;
                    transform: scale(0.8);
                }
            }

            .inputPublic {
                width: $inputWidth;
            }
            .examine {
                width: 42px;
                height: 22px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(1, 6, 33, 0.9);
                line-height: 22px;
                margin-right: 10px;
            }
            .lastItem {
                margin-top: 45px;
                ::v-deep
                    .el-timeline
                    .el-timeline-item:last-child
                    .el-timeline-item__tail {
                    display: none;
                }
            }

            .CC {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                font-size: 22px;
                color: #048790;
                border: 1px solid #048790;
            }
            ::v-deep .el-input__prefix i {
                position: absolute;
                right: -350px;
            }
            ::v-deep .el-input--medium .el-input__inner {
                padding-left: 15px;
            }
        }
        .ringht-warp {
            flex: 1;
        }
        // ::v-deep .el-timeline-item {
        //     padding-bottom: 80px;
        //     padding-left: 20px;
        // }
        // ::v-deep .el-timeline-item:last-child {
        //     padding-bottom: 20px;
        //     padding-left: 20px;
        // }

        // 折叠边框去除
        ::v-deep .el-collapse {
            border: none;
        }
        ::v-deep .el-collapse-item__header {
            border: none;
        }
        // 输入框宽度
        ::v-deep .el-input--medium .el-input__inner {
            width: $inputWidth;
            cursor: pointer;
        }
        ::v-deep .el-textarea {
            width: $inputWidth;
        }
        ::v-deep .el-textarea__inner {
            height: $textarea;
        }
        // 输入框清除按钮样式
        ::v-deep .el-icon-circle-close {
            position: absolute;
            left: 100px;
        }
        // 提示语句
        ::v-deep .el-link.el-link--default {
            position: absolute;
            left: 0px;
            top: 27px;
            font-size: 13px;
            transform: scale(0.9);
            color: #c0c4cc;
        }
        //警示语句
        ::v-deep .el-alert--info.is-light {
            background-color: #fff;
            height: 20px;
            position: relative;
            left: 110px;
        }
    }
}
</style>
