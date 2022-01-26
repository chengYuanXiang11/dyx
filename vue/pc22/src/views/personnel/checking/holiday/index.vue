<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column
                label="假期名称"
                prop="vacation_name"
            ></el-table-column>
            <el-table-column
                label="单位时长"
                :formatter="formatUnit_time"
            ></el-table-column>
            <el-table-column
                label="计算方式"
                :formatter="formatCount_type"
            ></el-table-column>
            <el-table-column
                label="余额规则"
                :formatter="formatRules"
            ></el-table-column>
            <el-table-column
                label="使用范围"
                :formatter="formatRange"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="operation('edit', scope.row.id, scope)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="del(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <Yg-Drawer
            v-model="showDrawer"
            :title="(drawerType == 'add' ? '新建' : '编辑') + '假期'"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
            size="700px"
        >
            <h5>基本信息</h5>
            <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item label="假期名称" prop="vacation_name">
                    <el-input
                        v-model="form.vacation_name"
                        placeholder="假期名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="适用人员">
                    <el-select
                        v-model="applicationType"
                        placeholder="请选择"
                        @change="changeSelect"
                    >
                        <el-option
                            v-for="(item, index) in applicationArr"
                            :key="index"
                            :label="item"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                    <SelectUsersDialog
                        :visible.sync="showDialog"
                        :data="datas"
                        placeholder="请选择人员"
                        @confirm="selectConfirm"
                    ></SelectUsersDialog>
                </el-form-item>
                <el-form-item label="是否带薪">
                    <el-radio-group v-model="form.whether_paid">
                        <el-radio label="1">不带薪</el-radio>
                        <el-radio label="2">带薪</el-radio>
                    </el-radio-group>
                    <p v-if="form.whether_paid == 2">
                        若员工请带薪假，将在考勤统计中算作出勤
                    </p>
                </el-form-item>
                <el-form-item label="新员工请假">
                    <span style="margin-right: 10px">入职时间＜</span>
                    <el-input-number
                        v-model="form.new_employee_dayoff"
                        controls-position="right"
                        size="small"
                        :min="1"
                        :max="10"
                    ></el-input-number>
                    <span class="span_margin">天，不可以申请此假</span>
                </el-form-item>
                <h5>请假规则</h5>
                <el-form-item label="请假时长核算：">
                    <el-radio-group v-model="form.count_type">
                        <el-radio label="1">按工作日</el-radio>
                        <el-radio label="2">按自然日</el-radio>
                    </el-radio-group>
                    <p v-if="form.count_type == 1">
                        请假时段中不包含员工的休息日，例如未排班的双休日、法定节假日
                    </p>
                    <p v-else>请假时段中包含的休息日，也会计入请假天数</p>
                </el-form-item>
                <el-form-item label="最小请假单位">
                    <el-radio-group v-model="form.unit_time">
                        <el-radio label="1">按小时</el-radio>
                        <el-radio label="2">按半天</el-radio>
                        <el-radio label="3">按天</el-radio>
                    </el-radio-group>
                    <p v-if="form.unit_time == 1">
                        员工以0.5小时为最小单位选择时间，考勤报表按小时统计
                    </p>
                    <p v-if="form.unit_time == 2">
                        员工以半天为最小单位选择时间，考勤报表按天统计
                    </p>
                    <p v-if="form.unit_time == 3">
                        员工以1天为最小单位选择时间，考勤报表按小时统计
                    </p>
                </el-form-item>
                <el-form-item
                    label="余额折算规则"
                    prop="unit_time"
                    v-if="form.unit_time == 1"
                >
                    <span style="margin-right: 10px">工作时长 </span>
                    <el-input-number
                        v-model="form.balance_convert_rules"
                        controls-position="right"
                        size="small"
                        :min="1"
                        :max="8"
                    ></el-input-number>
                    <span class="span_margin"> 小时，记为一天</span>
                </el-form-item>
                <h5>余额规则</h5>
                <el-form-item label="是否限额">
                    <el-radio-group v-model="form.balance_rules" @change="getlimit">
                        <el-radio label="1">不限额</el-radio>
                        <el-radio label="2">限额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="余额发放方式："
                    v-if="form.balance_rules == 2"
                >
                    <el-radio-group
                        v-model="form.giveout_function"
                        @change="changeIssueType(form.giveout_function)"
                    >
                        <el-radio label="1">按年</el-radio>
                        <el-radio label="2">按月</el-radio>
                        <el-radio label="3">手动发放</el-radio>
                        <el-radio label="4"
                            >加班时长自动转换为假期余额</el-radio
                        >
                    </el-radio-group>
                    <p v-if="form.giveout_function == 1">
                        自动按每年固定时间发放假期余额
                    </p>
                    <p v-if="form.giveout_function == 2">
                        自动按每月固定时间发放假期余额
                    </p>
                    <p v-if="form.giveout_function == 3">
                        保存成功后，可在假期余额中手动导入余额
                    </p>
                    <p v-if="form.giveout_function == 4">
                        加班时长隔日自动转换为假期余额
                    </p>
                </el-form-item>
                <el-row style="position: relative">
                    <el-form-item
                        class="Issue_date errorTips"
                        label="发放日期"
                        prop="giveout_time_month"
                        v-if="
                            (form.giveout_function == 1 ||
                                form.giveout_function == 2) &&
                            form.balance_rules == 2
                        "
                    >
                        <span
                            v-if="form.giveout_function == 1"
                            style="margin-right: 10px"
                            >每年</span
                        >
                        <span
                            v-if="form.giveout_function == 2"
                            style="margin-right: 10px"
                            >每月</span
                        >
                        <el-select
                            v-if="form.giveout_function == 1"
                            v-model="form.giveout_time_month"
                            placeholder="月份"
                            @change="setDayArr(form.giveout_time_month)"
                        >
                            <el-option
                                v-for="(item, index) in monthArr"
                                :key="index"
                                :label="item"
                                :value="item"
                                size="mini"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        prop="giveout_time_day"
                        class="Issue_date errorTips1"
                        style="position: absolute; top: 0px; left: 40%"
                        v-if="
                            form.giveout_function == '1' &&
                            form.balance_rules == 2
                        "
                    >
                        <el-select
                            class="span_margin"
                            v-model="form.giveout_time_day"
                            placeholder="日"
                            v-if="
                                form.giveout_function == '1' ||
                                form.giveout_function == '2'
                            "
                            @focus="dayFocus(1)"
                        >
                            <el-option
                                v-for="(item, index) in dayArr"
                                :key="index"
                                :label="item"
                                :value="item"
                                size="mini"
                            >
                            </el-option>
                        </el-select>
                        <span
                            v-if="
                                (form.giveout_function == 1 ||
                                    form.giveout_function == 2) &&
                                form.balance_rules == 2
                            "
                            class="span_margin"
                            >发放</span
                        >
                    </el-form-item>
                    <el-form-item
                        prop="giveout_time_day"
                        class="Issue_date errorTips1"
                        style="position: absolute; top: 0px; left: 22%"
                        v-if="
                            form.giveout_function == '2' &&
                            form.balance_rules == 2
                        "
                    >
                        <el-select
                            class="span_margin"
                            v-model="form.giveout_time_day"
                            placeholder="日"
                            v-if="
                                form.giveout_function == '1' ||
                                form.giveout_function == '2'
                            "
                            @focus="dayFocus(2)"
                        >
                            <el-option
                                v-for="(item, index) in dayArr"
                                :key="index"
                                :label="item"
                                :value="item"
                                size="mini"
                            >
                            </el-option>
                        </el-select>
                        <span
                            v-if="
                                (form.giveout_function == 1 ||
                                    form.giveout_function == 2) &&
                                form.balance_rules == 2
                            "
                            class="span_margin"
                            >发放</span
                        >
                    </el-form-item>
                </el-row>

                <el-form-item
                    label="发放规则"
                    v-if="form.balance_rules == 2 && form.giveout_function == 1"
                >
                    <el-radio-group
                        v-model="form.giveout_rules"
                        v-if="form.giveout_function == 1"
                    >
                        <el-radio label="1">固定额度</el-radio>
                        <el-radio label="2">按照工龄</el-radio>
                        <el-radio label="3">按照司龄</el-radio>
                    </el-radio-group>
                    <span v-if="form.giveout_function == 2">固定额度 </span>
                </el-form-item>
                <el-form-item
                    label="额度配置"
                    v-if="
                        (form.giveout_function == 1 ||
                            form.giveout_function == 2) &&
                        form.balance_rules == 2 &&
                        form.giveout_rules == 1
                    "
                >
                    <div
                        v-if="
                            form.giveout_rules == 1 &&
                            form.balance_rules == 2 &&
                            form.giveout_function == 1
                        "
                    >
                        <span>每人每年固定额度 </span>
                        <el-input-number
                            v-model="form.line_config"
                            controls-position="right"
                            size="small"
                            :min="1"
                            :max="10"
                        ></el-input-number>
                        <span>天 </span>
                    </div>
                    <div v-if="form.giveout_function == 2">
                        <span>固定额度 </span>
                        <el-input-number
                            v-model="form.line_config"
                            controls-position="right"
                            size="small"
                            :min="1"
                            :max="10"
                        ></el-input-number>
                        <span>天 </span>
                    </div>
                </el-form-item>
                <el-form-item
                    label="工龄配置"
                    v-if="form.giveout_rules == 2 && form.balance_rules == 2"
                >
                    <div
                        v-for="(item, index) in form.length_of_service"
                        :key="index"
                    >
                        <span
                            v-if="index == 0"
                            style="display: inline-block; width: 130px"
                            >工龄＜1年时，享有
                        </span>
                        <span v-else style="display: inline-block; width: 130px"
                            >工龄≥{{ index }}年时，享有
                        </span>
                        <el-input-number
                            v-model="form.length_of_service[index]"
                            controls-position="right"
                            size="small"
                            :min="1"
                            :max="10"
                        ></el-input-number>
                        <span class="span_margin"> 天假期</span>
                        <span
                            v-if="index == form.length_of_service.length - 1"
                            style="
                                margin-left: 30px;
                                color: #5d4bf1;
                                cursor: pointer;
                            "
                            @click="DelIssueRules(1, index)"
                            >删除</span
                        >
                    </div>
                    <span
                        style="color: rgb(93, 75, 241); cursor: pointer"
                        @click="AddIssueRules(1)"
                        >新增一行</span
                    >
                </el-form-item>
                <el-form-item
                    label="司龄配置"
                    v-if="form.giveout_rules == 3 && form.balance_rules == 2"
                >
                    <div
                        v-for="(item, index) in form.length_of_cpservice"
                        :key="index"
                    >
                        <span
                            v-if="index == 0"
                            style="display: inline-block; width: 130px"
                            >司龄＜1年时，享有
                        </span>
                        <span v-else style="display: inline-block; width: 130px"
                            >司龄≥{{ index }}年时，享有
                        </span>
                        <el-input-number
                            v-model="form.length_of_cpservice[index]"
                            controls-position="right"
                            size="small"
                            :min="1"
                            :max="10"
                        ></el-input-number>
                        <span class="span_margin"> 天假期</span>
                        <span
                            v-if="index == form.length_of_cpservice.length - 1"
                            style="
                                margin-left: 30px;
                                color: #5d4bf1;
                                cursor: pointer;
                            "
                            @click="DelIssueRules(2, index)"
                            >删除</span
                        >
                    </div>
                    <span
                        style="color: rgb(93, 75, 241); cursor: pointer"
                        @click="AddIssueRules(2)"
                        >新增一行</span
                    >
                </el-form-item>
                <el-form-item label="有效期" v-if="form.balance_rules == 2">
                    <el-radio-group
                        v-model="form.validity"
                        v-if="
                            form.giveout_function == 1 ||
                            form.giveout_function == 2
                        "
                    >
                        <el-radio label="1">按发放日</el-radio>
                        <el-radio label="2">长期有效</el-radio>
                    </el-radio-group>
                    <el-radio-group
                        v-model="form.validity"
                        v-if="form.giveout_function == 3"
                    >
                        <el-radio label="3">每年固定日期失效</el-radio>
                        <el-radio label="2">长期有效</el-radio>
                    </el-radio-group>
                    <el-radio-group
                        v-model="form.validity"
                        v-if="form.giveout_function == 4"
                    >
                        <el-radio label="1">按发放日</el-radio>
                        <el-radio label="3">每年固定日期失效</el-radio>
                        <el-radio label="2">长期有效</el-radio>
                    </el-radio-group>
                    <div v-if="form.validity == 1">
                        <span>发放日起</span>
                        <el-input-number
                            v-model="form.new_employee_dayoff"
                            controls-position="right"
                            size="small"
                            :min="1"
                            :max="10"
                        ></el-input-number>
                        <span>后失效</span>
                    </div>
                    <div v-if="form.validity == 3" class="Issue_date">
                        <span style="margin-right: 10px">每年</span>
                        <el-select
                            v-model="form.expiry_date_month"
                            placeholder="月"
                            @change="setInvalidation(form.expiry_date_month)"
                        >
                            <el-option
                                v-for="(item, index) in monthArr"
                                :key="index"
                                :label="item"
                                :value="item"
                                size="mini"
                            >
                            </el-option>
                        </el-select>
                        <el-select
                            v-model="form.expiry_date"
                            placeholder="日"
                            class="span_margin"
                            @focus="InvalidationFocus"
                        >
                            <el-option
                                v-for="(item, index) in invalidationDay"
                                :key="index"
                                :label="item"
                                :value="item"
                                size="mini"
                            >
                            </el-option>
                        </el-select>
                        <span class="span_margin">失效</span>
                    </div>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getList,
    delHoliday,
    addOfficeAddress,
    updateOfficeAddress,
} from "@/request/api/personnel/checking/holiday";
export default {
    name: "Officeaddress",
    data() {
        return {
            //选人弹窗
            datas: {
                depts: [],
                users: [],
            },
            showDialog: false,
            selectMsg: "",
            applicationType: "全部人员", //适用人员
            applicationArr: ["全部人员", "选择人员"], //适用人员数组
            monthArr: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
            ],
            dayArr: [],
            invalidationDay: [],
            loading: true,
            btnLoading: false,
            tableData: [],
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
							is_limit:"0",
                description: "string", // 描述
                count_type: "1", // 计算方式-请假时长核算
                balance_rules: "1", // 余额规则
                scope_of_application_all: true, // 适用范围-全体人员-默认为关闭
                whether_paid: "1", // 是否带薪
                new_employee_dayoff: 0, // 新员工请假
                unit_time: "1", // 最小请假单位
                balance_convert_rules: "1", // 余额折算规则
                scope_of_application_dept: [], //适用范围-部门
                scope_of_application_user: [], //适用范围-用户
                giveout_function: "1", //余额发放方式
                giveout_time_month: "1月", //发放日期(月)
                giveout_time_day: "1日", //发放日期(日)
                giveout_rules: "1", //发放规则
                line_config: "", //额度配置
                length_of_service: "[]",
                length_of_cpservice: "[]",
                validity: "1", //有效期
                expiry_date: "1日",
                expiry_date_month: "1月",
                Issuance_lapsed: "", //发放失效
            },
            rules: {
                vacation_name: [
                    {
                        required: true,
                        message: "请输入假期名称",
                        trigger: "blur",
                    },
                ],
                giveout_time_month: [
                    {
                        required: true,
                        message: "请选择月份",
                        trigger: "blur",
                    },
                ],
                giveout_time_day: [
                    {
                        required: true,
                        message: "请选择时间",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    watch: {
        datas: {
            //  监听整个对象内的所有属性
            handler(newValue, oldValue) {
                var selectArr = [];
                for (var i = 0; i < newValue.depts.length; i++) {
                    selectArr.push(newValue.depts[i].deptName);
                }
                for (var i = 0; i < newValue.users.length; i++) {
                    selectArr.push(newValue.users[i].user_name);
                }
                this.selectMsg = selectArr.join(",");
                if (this.selectMsg == "") {
                    this.applicationType = "全体人员";
                } else {
                    this.applicationType = this.selectMsg;
                }
            },
            deep: true,
        },
    },
    methods: {
			getlimit(){
				// console.log(this.form.balance_rules)
				let res = this.form.balance_rules
				if(res == '1'){
					this.form.is_limit = "0"
				}else{
					this.form.is_limit = "1"
				}
			},
        selectConfirm(e){
            this.datas = e;
            this.showDialog = false;
        },
        changeSelect() {
            if (this.applicationType == "选择人员") {
                this.form.scope_of_application_all = false;
                if (this.selectMsg != "") {
                    this.applicationType = this.selectMsg;
                }
                this.showDialog = true;
            } else {
                this.form.scope_of_application_all = true;
                this.applicationType = "全体人员";
                this.datas.depts = [];
                this.datas.users = [];
            }
        },
        //设置发放日期
        setDayArr(val) {
            this.form.giveout_time_day = "";
            this.dayArr = [];
            var date = new Date();
            var nowYear = date.getFullYear();
            if (
                (nowYear % 4 == 0 && nowYear % 100 != 0) ||
                nowYear % 400 == 0
            ) {
                if (val == "2月") {
                    for (var i = 1; i < 28; i++) {
                        this.dayArr.push(i + "日");
                    }
                } else if (
                    val == "1月" ||
                    val == "3月" ||
                    val == "5月" ||
                    val == "7月" ||
                    val == "8月" ||
                    val == "10月" ||
                    val == "12月"
                ) {
                    for (var i = 1; i < 32; i++) {
                        this.dayArr.push(i + "日");
                    }
                } else {
                    for (var i = 1; i < 31; i++) {
                        this.dayArr.push(i + "日");
                    }
                }
            } else {
                if (val == "2月") {
                    for (var i = 1; i < 29; i++) {
                        this.dayArr.push(i + "日");
                    }
                } else if (
                    val == "1月" ||
                    val == "3月" ||
                    val == "5月" ||
                    val == "7月" ||
                    val == "8月" ||
                    val == "10月" ||
                    val == "12月"
                ) {
                    for (var i = 1; i < 32; i++) {
                        this.dayArr.push(i + "日");
                    }
                } else {
                    this.dayArr = [];
                    for (var i = 1; i < 31; i++) {
                        this.dayArr.push(i + "日");
                    }
                }
            }
        },
        //设置失效日期
        setInvalidation(val) {
            this.form.expiry_date = "";
            this.invalidationDay = [];
            var date = new Date();
            var nowYear = date.getFullYear();
            if (
                (nowYear % 4 == 0 && nowYear % 100 != 0) ||
                nowYear % 400 == 0
            ) {
                if (val == "2月") {
                    for (var i = 1; i < 28; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                } else if (
                    val == "1月" ||
                    val == "3月" ||
                    val == "5月" ||
                    val == "7月" ||
                    val == "8月" ||
                    val == "10月" ||
                    val == "12月"
                ) {
                    for (var i = 1; i < 32; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                } else {
                    for (var i = 1; i < 31; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                }
            } else {
                if (val == "2月") {
                    for (var i = 1; i < 29; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                } else if (
                    val == "1月" ||
                    val == "3月" ||
                    val == "5月" ||
                    val == "7月" ||
                    val == "8月" ||
                    val == "10月" ||
                    val == "12月"
                ) {
                    for (var i = 1; i < 32; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                } else {
                    this.invalidationDay = [];
                    for (var i = 1; i < 31; i++) {
                        this.invalidationDay.push(i + "日");
                    }
                }
            }
        },
        dayFocus(val) {
            if (val == 1) {
                if (this.dayArr.length == 0) {
                    this.$notify({
                        title: "",
                        message: "请先选择月份",
                    });
                }
            } else {
                for (var i = 1; i < 31; i++) {
                    this.dayArr.push(i + "日");
                }
            }
        },
        InvalidationFocus() {
            if (this.invalidationDay.length == 0) {
                this.$notify({
                    title: "",
                    message: "请先选择月份",
                });
            }
        },
        changeIssueType(val) {
            if (val == 1 || val == 2) {
                if (val == 1) {
                    this.form.giveout_time_month = "1月";
                    this.form.giveout_time_day = "1日";
                } else {
                    this.form.giveout_time_day = "1日";
                }
                this.form.validity = "1";
            } else if (val == 3) {
                this.form.validity = "3";
            }
        },
        DelIssueRules(val, index) {
            if (val == 1) {
                this.form.length_of_service.splice(index, 1);
            } else {
                this.form.length_of_cpservice.splice(index, 1);
            }
        },
        AddIssueRules(val) {
            if (val == 1) {
                this.form.length_of_service.push("1");
            } else {
                this.form.length_of_cpservice.push("1");
            }
        },
        getList() {
            this.loading = true;
            getList()
                .then((response) => {
                    this.tableData = response.data.results;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        del(id) {
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delHoliday(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                })
                .catch(() => {
                    return true;
                });
        },
        operation(type, id, val) {
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            if (type == "add") {
                this.datas.depts = [];
                this.datas.users = [];
            }
            if (type == "edit") {
                this.form = JSON.parse(JSON.stringify(val.row));
                this.datas.depts = JSON.parse(
                    JSON.stringify(val.row.scope_of_application_dept)
                );
                this.datas.users = JSON.parse(
                    JSON.stringify(val.row.scope_of_application_user)
                );
            }
        },
        drawerClosed() {
            this.showDrawer = false;
            this.form = {
                description: "string", // 描述
                count_type: "1", // 计算方式-请假时长核算
                balance_rules: "1", // 余额规则
                scope_of_application_all: true, // 适用范围-全体人员-默认为关闭
                whether_paid: "1", // 是否带薪
                new_employee_dayoff: 0, // 新员工请假
                unit_time: "1", // 最小请假单位
                balance_convert_rules: "1", // 余额折算规则
                scope_of_application_dept: [], //适用范围-部门
                scope_of_application_user: [], //适用范围-用户
                giveout_function: "1", //余额发放方式
                giveout_time_month: "1月", //发放日期(月)
                giveout_time_day: "1日", //发放日期(日)
                giveout_rules: "1", //发放规则
                line_config: "", //额度配置
                length_of_service: "[]",
                length_of_cpservice: "[]",
                validity: "1", //有效期
                expiry_date: "1日",
                expiry_date_month: "1月",
                Issuance_lapsed: "", //发放失效
            };
        },
        confirmForm() {
            const self = this;
            self.form.scope_of_application_dept = [];
            self.form.scope_of_application_user = [];
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    if (self.drawerType == "add") {
                        for (var i = 0; i < self.datas.depts.length; i++) {
                            self.form.scope_of_application_dept.push(
                                self.datas.depts[i].id
                            );
                        }
                        for (var j = 0; j < self.datas.users.length; j++) {
                            self.form.scope_of_application_user.push(
                                self.datas.users[j].user_id
                            );
                        }
                        addOfficeAddress(self.form)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        for (var i = 0; i < self.datas.depts.length; i++) {
                            self.form.scope_of_application_dept.push(
                                self.datas.depts[i].id
                            );
                        }
                        for (var j = 0; j < self.datas.users.length; j++) {
                            self.form.scope_of_application_user.push(
                                self.datas.users[j].user_id
                            );
                        }
                        delete self.form.creator;
                        updateOfficeAddress(self.form, self.itemId)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("编辑成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                } else {
                    self.$toastError("请将表单填写完整");
                }
            });
        },
        formatCity(row) {
            let citys = row.city.map((item) => {
                return item.name;
            });
            return citys.join("");
        },
        formatUnit_time(row) {
            switch (row.unit_time) {
                case "1":
                    return "按小时请假";
                case "2":
                    return "按半天请假";
                case "3":
                    return "按天请假";
            }
        },
        formatCount_type(row) {
            switch (row.count_type) {
                case "1":
                    return "按工作日";
                case "2":
                    return "按自然日";
            }
        },
        formatRules(row) {
            if (row.balance_rules == 1) {
                return "不限余额";
            } else {
                if (row.giveout_function == "3") {
                    return "手动发放";
                } else if (row.giveout_function == "1") {
                    return `每年${row.giveout_time_month}${row.giveout_time_day}发放，${this.strikingBalance(row.unit_time,row.line_config)}`
                } else if (row.giveout_function == "2") {
                    return `每月${row.giveout_time_day}发放，${this.strikingBalance(row.unit_time,row.line_config)}`
                } else {
                    return "加班时长自动转换为假期余额";
                }
            }
        },
				strikingBalance(type,val){
						return type == '1' ? `${val * 8}小时` : `${val}天`
				},
        formatRange(row){
            if (row.scope_of_application_all) {
                return "全体人员";
            } else {
                let deptNum = row.scope_of_application_dept.length,userNum = row.scope_of_application_user.length;
                let strArr = []
                deptNum > 0 && strArr.push(`${deptNum}个部门`);
                userNum > 0 && strArr.push(`${userNum}个人`);
                return strArr.join(",")
            }
        }
    },
};
</script>
<style scoped>
.Issue_date /deep/ .el-select {
    width: 100px;
}
.Issue_date /deep/ .el-form-item__content {
    margin-left: 0px !important;
}
.errorTips /deep/.el-form-item__error {
    left: 25% !important;
}
.errorTips1 /deep/.el-form-item__error {
    left: 7% !important;
}
p {
    color: #ccc;
}
.span_margin {
    margin-left: 10px;
}
</style>
