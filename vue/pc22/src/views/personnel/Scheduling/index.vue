<template>
    <div class="dashboard-editor-container app-container">
        <!-- 班次和周期 -->
        <Scheduling
            :choice_shifit.sync="choice_shifit"
            :date="String(date1)"
            :loading="loading"
            :requestMode="requestMode"
            :attendanceFroupId="attendanceFroupId"
            v-if="attendanceFroupId !== ''"
            @recovery="setRecovery"
        ></Scheduling>
        <!-- 月份选择 姓名搜索 -->
        <el-col :offset="1" :span="16">
            <el-form label-width="80px">
                <el-form-item label="月份选择">
                    <!-- 月份选择  -->
                    <el-col :span="6" class="month">
                        <el-date-picker
                            v-model="date1"
                            type="month"
                            placeholder="选择日期"
                            prefix-icon="el-icon-date"
                            :clearable="false"
                            format="yyyy 第 M 月"
                            style="width: 100%"
                            :validate-event="true"
                            @change="
                                (newV, oldV) => handlerShow(getMonth, newV)
                            "
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker> </el-col
                    ><el-col :span="6" :offset="1">
                        <!-- 姓名搜索 -->
                        <el-input
                            v-model="employeeName"
                            placeholder="可输入员工姓名搜索"
                            suffix-icon="el-icon-search"
                        >
                        </el-input>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 保存 恢复 导入 导出 -->
        <el-col class="row-bg marLef5" >
            <el-col
                :style="{
                    width: `${tableWidth}px`,
                    height: `100%`,
                    position: 'relative',
                }"
            >
                <el-col :span="6" :offset="2" class="checkboxLeft">
                    未排班时
                    <el-checkbox v-model="choice_shifit"
                        >员工可打卡</el-checkbox
                    >
                     <el-checkbox v-model="choice_shifit"
                        >员工可自行选择班次打卡</el-checkbox
                    >
                </el-col>
                <!-- 导入 导出  -->
                <el-col v-show="showButton <= 0" class="excel-col">
                    <span class="execl-font"> Excel排班 : </span>
                    <el-button type="primary" class="row-button row-button1"
                        >第一步:导出排班表</el-button
                    >
                    <svg-icon
                        icon-class="Right-icon"
                        :style="{ margin: '0px 5px' }"
                    ></svg-icon>
                    <el-button type="primary">第二步:导入排班表</el-button>
                </el-col>
                <!-- 已调整项 -->
                <el-col v-show="showButton > 0" class="submit-col">
                    已调整：<span>{{ showButton }}</span
                    >项
                    <el-button type="primary" @click="submit">保存</el-button>
                    <el-button @click="setRecovery">恢复</el-button>
                </el-col>
            </el-col>
        </el-col>

        <!-- 排版表格 -->
        <div ref="scheduling-main">
            <el-table
                :data="tableData2"
                class="marLef5"
                :style="{ width: `${tableWidth}px`, height: `100%` }"
                border
                width="100%"
                ref="schedulingTable"
                v-loading="loading"
                :fit="true"
            >
                <el-table-column
                    prop="userName"
                    label="姓名"
                    fixed="left"
                    :resizable="false"
                    width="80px"
                >
                    <template slot-scope="scope">
                        <div
                            class="userNameClass"
                            @click="
                                changeShift(
                                    $event,
                                    scope.$index,
                                    'rowheader',
                                    scope.$index,
                                    scope.row
                                )
                            "
                        >
                            {{ scope.row.userName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(o, index) in headers"
                    :key="index"
                    align="center"
                    :resizable="false"
                    class-name="clickable"
                    width="35px"
                >
                    <template slot="header">
                        <div
                            class="table-header"
                            @click="
                                changeShift($event, index, 'header', index, o)
                            "
                            :style="{
                                background:
                                    new Date().getUTCDate() === o.day &&
                                    date1.getYear() == new Date().getYear() &&
                                    date1.getMonth() == new Date().getMonth()
                                        ? '#1585ff'
                                        : '',
                                color:
                                    new Date().getUTCDate() === o.day &&
                                    date1.getYear() == new Date().getYear() &&
                                    date1.getMonth() == new Date().getMonth()
                                        ? '#fff'
                                        : '',
                            }"
                        >
                            {{ o.day }}<br />
                            {{ o.week }}
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            v-if="isShowTooltip(index, scope.row)"
                            :open-delay="700"
                            placement="top-start"
                            :disabled="false"
                        >
                            <template slot="content">
                                <!-- 对应tooltip悬浮显示 -->
                                <div
                                    v-html="formatTooltip(index, scope.row)"
                                ></div>
                            </template>
                            <div
                                class="table-row"
                                @click="
                                    changeShift(
                                        $event,
                                        index,
                                        'row',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                                v-html="format(index, scope.row)"
                            ></div>
                        </el-tooltip>

                        <div
                            v-else
                            class="table-row"
                            @click="
                                changeShift(
                                    $event,
                                    index,
                                    'row',
                                    scope.$index,
                                    scope.row
                                )
                            "
                            v-html="format(index, scope.row)"
                        ></div>
                    </template>
                </el-table-column>
            </el-table>
                <el-col class="marLef5"   :style="{ width: `${tableWidth}px`, height: `100%` }">
                <!-- <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    :pageSizes="[10, 20, 50]"
                /> -->
            </el-col>
            <!-- 更改排班选择 -->
            <div
                v-show="showPopover"
                class="popover"
                :style="{ left: `${popoverLeft}px`, top: `${popoverTop}px` }"
            >
                <i class="el-icon-caret-top arrow"></i>
                <div class="popover-main">
                    <el-radio-group v-model="schedulingType">
                        <el-radio-button label="1">按班次排班</el-radio-button>
                        <el-radio-button
                            label="2"
                            :disabled="
                                popoverOption.type == 'header' ||
                                popoverOption.type == 'rowheader' ||
                                scheduling.ruleForm.cycle.length <= 0
                            "
                            >按周期排班</el-radio-button
                        >
                    </el-radio-group>
                    <div class="scheduling-list" v-show="schedulingType == '1'">
                        <div class="title">修改该成员当天班次</div>
                        <ul>
                            <li
                                v-for="(o, index) in scheduling.existingShift
                                    .data"
                                :key="o.id"
                                class="title-td"
                                @click="setShift(undefined, o)"
                                :style="tagColor(o, index)"
                            >
                                {{ o.working_shift_name }}
                            </li>
                            <li @click="setShift('clear')">清空</li>
                        </ul>
                    </div>
                    <div class="scheduling-list" v-show="schedulingType == '2'">
                        <div class="title">
                            从该天开始，按周期排班，直至本月最后一天
                        </div>
                        <ul>
                            <li @click="setShifts">
                                {{ scheduling.ruleForm.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from "vuex";
import Scheduling from "./Scheduling.vue";
// import data from "./system/form/components/form/form";
import { debounce } from "@/utils/index.js";
//  排班接口
import {
    getShift,
    addShift,
    getNameShift,
    putShift,
} from "@/request/api/personnel/checking/scheduling";
//  班次接口
import { getList as getshiftList } from "@/request/api/personnel/checking/shift";
// 考勤组接口
import { getCheckingGroup as getGroupList } from "@/request/api/personnel/checking/checkingGroup";
export default {
    name: "SchedulingIndex",
    data() {
        return {
            // 排班表数据
            tableData: [],
            // 拷贝保存一个数据，为了恢复
            tableData2: [],
            // 关联用户
            wattendance_user: [],
            // 排班表表头
            headers: [],
            // 排班左键菜单显隐
            showPopover: false,
            // 排班左键菜单定位
            popoverLeft: 10,
            popoverTop: 10,
            // 排班左键菜单周期和班次切换
            schedulingType: "1",
            // 点击位置(行，列)
            popoverOption: {},
            //   排板表loading
            loading: false,
            // 当前月份
            date1: undefined,
            // 用于月份回滚
            date2: undefined,
            choice_shifit: "",
            // 月份选择器配置
            pickerOptions: {
                shortcuts: [
                    {
                        text: "本月",
                        onClick(picker) {
                            picker.$emit("pick", new Date());
                        },
                    },
                ],
            },
            // 员工姓名搜索框
            employeeName: "",
            // 已修改项数量
            showButton: 0,
            //   搜索防抖
            fn: debounce(async function () {
                this.loading = true;
                this.getMonth();
            }, 1000),
            // 请求方式(添加或者更新)
            requestMode: "add",
            //排班id
            attendanceFroupId: "",
            attendanceFroupId2: "",
            //角色搜索用id
            userId: [],
            // 保存所有数据
            dataAll: [],
        };
    },
    components: {
        Scheduling,
    },
    created() {
        this.date1 = new Date();
        this.date2 = new Date();
        this.getMonth("created");
    },
    mounted() {
        document.addEventListener("click", this.bodyClosePopover);
        window.addEventListener("resize", this.mediumSizeChange);
    },
    computed: {
        ...mapState({
            scheduling: (state) => state.scheduling,
        }),
        tableWidth() {
            return this.headers.length * 35 + 82;
        },
        // 为对比监听的新旧对象
        tableData3() {
            return JSON.parse(JSON.stringify(this.tableData2));
        },
        DayBack() {
            return;
        },
    },
    watch: {
        // 监听数据变化,判断修改了几项
        tableData3: {
            handler(newV, oldV) {
                if (this.showButton < 0) {
                    this.showButton = 0;
                }
                if (oldV.length === 0 || newV.length === 0) {
                    this.showButton = 0;
                    return;
                }
                newV.forEach((v, k) => {
                    let newValue = 0;
                    let oldValue = 0;
                    v.shift.forEach((i) => {
                        if (i && i.new === true) {
                            newValue += 1;
                        }
                    });
                    if (oldV[k] !== undefined) {
                        oldV[k].shift.forEach((i) => {
                            if (i && i.new === true) {
                                oldValue += 1;
                            }
                        });
                    }
                    if (newValue < 0 || oldValue < 0) {
                        this.showButton = 0;
                        return;
                    }
                    this.showButton += newValue - oldValue;
                });
            },
            deep: true,
        },
        // 姓名改变重新请求
        employeeName: {
            handler() {
                this.fn();
            },
        },
    },
    methods: {
        // 恢复
        recovery() {
            this.$emit("recovery");
        },
        // 保存上传数据(处理数据格式)
        submit() {
            // 用户id
            const user = this.wattendance_user.map((v) => {
                return v.user_id;
            });
            // 年月
            let year = new Date(this.date1).getFullYear();
            let month = new Date(this.date1).getMonth() + 1;
            // 考勤班次，存储班次id
            let attendance_shift = this.scheduling.existingShift.data.map(
                (v) => {
                    if (v.id !== -1) {
                        return v.id;
                    } else {
                        return undefined;
                    }
                }
            );
            attendance_shift = attendance_shift.filter((v) => {
                return v !== undefined;
            });
            // 排班周期信息
            const period_info = {
                period_name: this.scheduling.ruleForm.name,
                period_num: this.scheduling.ruleForm.Days,
                period_shift: this.scheduling.ruleForm.cycle.map((v) => {
                    return v.id;
                }),
            };
            // 排班表信息
            const userInfo = [];
            this.tableData2.forEach((v, k) => {
                let shiftArr = v.shift.map((vArr) => {
                    return {
                        id: vArr.id,
                        date: vArr.date,
                        name: vArr.working_shift_name || vArr.name,
                        status: vArr.status === 0 ? 0 : 1,
                    };
                });
                userInfo.push({
                    userName: v.userName,
                    userId: v.userId,
                    shift: shiftArr,
                });
            });
            const data = [
                {
                    year,
                    month,
                    userInfo,
                },
            ];
            // 把未更改数据给data
            data.forEach((v) => {
                this.dataAll.forEach((value) => {
                    // 改变同月的数据
                    if (v.year === value.year && v.month === value.month) {
                        value.userInfo.forEach((valueUse) => {
                            let index = v.userInfo.findIndex(
                                (vUse) =>
                                    vUse.userId === valueUse.userId &&
                                    vUse.userName === valueUse.userName
                            );
                            if (index === -1) {
                                v.userInfo.push(valueUse);
                            }
                        });
                    } else {
                        data.push(value);
                    }
                });
            });

            this.showButton = 0;
            const dataArr = {
                attendance_shift,
                period_info,
                // 是否勾选为排班
                choice_shift: this.choice_shifit === true ? 1 : 2,
                scheduling_time: data,
                user,
                attendance: this.$route.query.id,
            };
            console.log(dataArr)
            // 发送请求
            if(this.requestMode ==='add'){
                addShift(dataArr)
                .then((res) => {
                        this.$message({
                        message: "添加成功",
                        type: "success ",
                    });
                 this.getMonth();
                })
                .catch((err) => {
                    this.$message({
                        message: "添加失败",
                        type: "error",
                    });
                     this.getMonth();
                });
            }else{
                putShift(dataArr,this.attendanceFroupId)
                .then((res) => {
                     this.$message({
                        message: "修改成功",
                        type: "success ",
                    });
                    this.getMonth();
                })
                .catch((err) => {
                    this.$message({
                        message: "修改失败",
                        type: "error",
                    });
                     this.getMonth();
                });
            }
        },
        // 恢复按钮
        setRecovery() {
            this.tableData2 = JSON.parse(JSON.stringify(this.tableData));
        },
        getMonthDays(year, month) {
            var thisDate = new Date(year, month, 0); //当天数为0 js自动处理为上一月的最后一天
            return thisDate.getDate();
        },
        getWeekByDay(year, month, day) {
            var thisDate = new Date(year, month, day);
            var today = new Array("一", "二", "三", "四", "五", "六", "日");
            return today[thisDate.getDay()];
        },
        changeShift(event, index, type, rowIndex, row = {}) {
            // 重置班次周期选项
            this.schedulingType = 1;
            // 如果点击的不是表头,需要验证用户是否存在于考勤组
            if (type !== "header") {
                // 如果选中时间小于
                if (this.isGroup(index, row.userId)) {
                    this.showPopover = false;
                    return false;
                }
            }

            this.popoverOption = {
                index,
                type,
                rowIndex,
            };
            let child = event.target.getBoundingClientRect();
            let main = this.$refs["scheduling-main"];
            let parent = main.getBoundingClientRect();
            this.popoverTop =
                child.top + child.height + main.offsetTop - parent.top;
            this.popoverLeft = child.left + main.offsetLeft - parent.left;
            this.showPopover = true;
        },
        popoverHide() {
            this.showPopover = false;
            this.popoverOption = {};
        },
        // 窗口变化刷新排班表
        mediumSizeChange() {
            this.$nextTick(() => {
                if (this.$refs["schedulingTable"]) {
                    this.$refs["schedulingTable"].doLayout();
                }
            });
        },
        bodyClosePopover(e) {
            if (!this.$refs["scheduling-main"].contains(e.target)) {
                this.popoverHide();
            }
        },
        // 用于渲染排班表格色块和内容
        format(index, val) {
            let name = "";
            if (val.shift[index] === undefined) {
                return;
            }
            // 如果用户不在考勤组之内（为了已有数据）
            if (val.shift[index].status === 0) {
                if (val.shift[index].name.length > 2) {
                    return (name = `<span style="background:#f6f6f6;color:rgb(191, 191, 191)" class="divColor">
                            ${val.shift[index].name.substring(0, 2)}
                                    </br>
                                    ${val.shift[index].name.substring(2, 4)}
                            </span>`);
                } else {
                    return (name = `<span style="background:#f6f6f6;color:rgb(191, 191, 191)" class="divColor">${val.shift[index].name}</span>`);
                }
            }

            // 从当前开始后面的不准执行

            if (val.shift && val.shift[index]) {
                const str = val.shift[index].name;
                // 当前下标 % 颜色数组长度，得到颜色
                const num = this.scheduling.existingShift.data.findIndex(
                    (value) => {
                        if (value.id === -1) {
                            return false;
                        }
                        if (value.working_shift_name === str) {
                            return true;
                        }
                    }
                );
                let nodeColor =
                    this.scheduling.color[num % this.scheduling.color.length];
                // 空白处理
                if (nodeColor === undefined) {
                    nodeColor = "#fff";
                }
                // 休息处理
                if (str === "休息") {
                    //用户在考勤组内并且班次为休息
                    nodeColor = "#d9d9d9";
                }
                // str为空时候
                if (!str) {
                    name = `<span style="background:${nodeColor}" class="divColor"></span>`;
                } else {
                    // str长度小于2时，不需要截取
                    if (str.length <= 2) {
                        name = `<span style="background:${nodeColor}" class="divColor">${str}</span>`;
                    } else {
                        name = `<span style="background:${nodeColor}"  class="divColor">
                    ${str.substring(0, 2)}
                        </br>
                    ${str.substring(0, 2)}
                    </span>`;
                    }
                    // 如果用户不在考勤组之内
                    if (val.shift[index].new) {
                        name = `<span style="background:${nodeColor}"  class="divColor">${name}<i></i></span>`;
                    }
                }
            }
            return name;
        },
        // 排班提示渲染
        formatTooltip(index, val) {
            // 查看用户是否在考勤组内
            if (val.shift[index].status === 0) {
                return "无法排班，原因：该人员不在此考勤组内";
            }
            if (this.isGroup(index, val.userId)) {
                return "无法排班，原因：该人员不在此考勤组内";
            }
            // if (this.isGroup(index, val.userId)) {
            //     return "无法排班，原因：该人员不在此考勤组内";
            // }
            // 查看当前班次是否在考勤班次之内
            let id = val.shift[index].id;
            let ind = this.scheduling.existingShiftAll.findIndex(
                (v) => v.id === id
            );
            //如果不是休息班次
            if (ind !== -1 && id !== "") {
                let data = this.scheduling.existingShiftAll[ind];
                return `${data.working_shift_name}${
                    data.first_working_time || ""
                }${data.first_offduty_time || ""}${
                    data.second_working_time || ""
                }${data.second_offduty_not_clock || ""}${
                    data.third_working_time || ""
                }${data.third_offduty_time || ""}`;
            } else {
                //如果是休息班次
                if (id === -1) {
                    return `休息`;
                } else {
                }
            }
        },
        // 是否有排班提示
        isShowTooltip(index, val) {
            if (this.isGroup(index, val.userId)) {
                return true;
            }
            if (val.shift[index] !== undefined) {
                let id = val.shift[index].id;
                return id !== "";
            }
        },
        // (弹窗)点击对应班次更新排班表
        setShift(setType, o) {
            let { index, type, rowIndex } = this.popoverOption;
            let val =
                setType == "clear"
                    ? {
                          working_shift_name: "",
                          name: "",
                          new: true,
                          date: index + 1,
                          id: "",
                      }
                    : {
                          working_shift_name: o.working_shift_name,
                          name: o.working_shift_name,
                          new: true,
                          date: index + 1,
                          id: o.id,
                      };
            // 点击日期时修改一列
            if (type == "header") {
                    console.log("header")
                this.tableData2.forEach((item) => {
                    if (item.shift[index].status !== 0) {
                        this.$set(item.shift, index, val);
                    }else{
                    }
                });
                //选择姓名时修改一行
            } else if (type == "rowheader") {
                this.tableData2[index].shift.forEach((value, key) => {
                    if (value.status !== 0) {
                        this.$set(this.tableData2[index].shift, key, val);
                    }
                });
            } else {
                //   单选
                this.$set(this.tableData2[rowIndex].shift, index, val);
            }
            this.popoverHide();
        },
        // 点击周期更新排班表
        setShifts() {
            let arr = {};
            let { index, rowIndex } = this.popoverOption;
            for (let i = 0; i < this.headers.length - index; i++) {
                let dataIndex = i % this.scheduling.ruleForm.cycle.length;
                arr = JSON.parse(
                    JSON.stringify(this.scheduling.ruleForm.cycle[dataIndex])
                );
                arr.date = index + i + 1;
                arr.new = true;
                arr.name = arr.working_shift_name;
                if(this.tableData2[rowIndex].shift[index+i].status !==0){
                    this.$set(this.tableData2[rowIndex].shift, index + i, arr);
                }

                arr = {};
            }
            this.popoverHide();
        },
        // 获取子组件月份，根据月份修改排班表
        getMonth(type) {
            const years = this.date1.getFullYear();
            const month = this.date1.getMonth() + 1;
            var dayNum = this.getMonthDays(years, month);
            var dayArr = [];
            for (let i = 0; i < dayNum; i++) {
                var item = {
                    day: i + 1,
                    week: this.getWeekByDay(years, month - 1, i),
                };
                dayArr.push(item);
            }
            this.headers = dayArr;
            this.loading = true;
            // 区分初始化和更新(防止班次和周期闪烁)
            if (type === "created") {
                this.initialization(`${years}-${month}`, dayNum, "created");
            } else {
                this.initialization(`${years}-${month}`, dayNum, "update");
            }
        },
        // 处理数据(初始化)
        async initialization(date, dayNum, type) {
            let tableData = null; //表格数据处理
            let refForm = null; // 周期处理
            let tag = null; // 标签处理
            let employeeName = this.employeeName;
            try {
                // 请求表格数据
                let formData = await this.initializationTabular({
                    tableData,
                    refForm,
                    date,
                    type,
                    employeeName,
                    dayNum,
                });
                tableData = formData.tableData;
                refForm = formData.refForm;
                if (type === "created") {
                    //  处理班次和周期
                    let cycleData = await this.initializationShift({
                        refForm,
                        tag,
                    });
                    refForm = cycleData.refForm;
                    tag = cycleData.tag;
                }
                // 初始化渲染表格
                await this.initializationEmptyTabular(tableData, dayNum);
                this.loading = false;
            } catch (error) {
                // 如果表格刚刚创建，返回null，直接使用原始数据
                if (error === null) {
                    // 即表格刚建立无数据
                    this.initializationEmptyTabular([undefined], dayNum);
                    // this.loading=false
                }
            }
        },
        // 处理表格数据(对应月份)
        initializationTabular(products) {
            return new Promise((response, reject) => {
                let { tableData, refForm, date, type, employeeName, dayNum } =
                    products;
                getNameShift(this.$route.query.id, date, employeeName)
                    .then((res) => {
                        let data = res.data.results[0];
                        getShift(this.$route.query.id).then((res) => {
                            this.dataAll = res.data.results[0].scheduling_time;
                            if (this.dataAll.length > 0) {
                                this.requestMode = "put";
                            }
                        });

                        this.choice_shifit =
                            data.choice_shift == 1 ? true : false;
                        // 排班数据id，用于更新排班
                        this.attendanceFroupId2 = data.id;
                        tableData = data.scheduling_time.userInfo;
                        if (!Array.isArray(tableData)) {
                            tableData = [tableData];
                        }
                        if (type === "created") {
                            this.$store.commit(
                                "scheduling/setExistingShift",
                                JSON.parse(data.attendance_shift)
                            );
                        }
                        refForm = JSON.parse(res.data.results[0].period_info);
                        response({ tableData, refForm });
                    })
                    .catch((err) => {
                        reject(null);
                    });
            });
        },
        // 处理标签和周期数据(与月份无关)
        initializationShift(products) {
            return new Promise((response, reject) => {
                let { refForm, tag, type } = products;
                getshiftList({
                    pageNum: 1,
                    pageSize: 1000,
                }).then((res) => {
                    tag = res.data.results.filter((v) => {
                        return this.scheduling.existingShift.data.includes(
                            v.id
                        );
                    });

                    tag.push({
                        id: -1,
                        working_shift_name: "休息",
                        color: "#d9d9d9",
                        first_working_time: "休息",
                    });
                    this.$store.commit(
                        "scheduling/setExistingShiftAll",
                        res.data.results
                    );
                    this.$store.commit("scheduling/setExistingShift", tag);
                    this.$store.commit("scheduling/processingData", refForm);
                    response({ refForm, tag });
                });
            });
        },
        // 处理当表格数据为空时(对应月份无数据时)
        initializationEmptyTabular(data, dayNum) {
            // 无数据的时候,给予基本的数据结构
            if (data[0] === undefined) {
                this.requestMode = "add";
                this.userId = [];
                data = [];
                // 姓名搜索为空
                if (this.employeeName === "") {
                    let shiftsArr = [];
                    for (let i = 0; i < dayNum; i++) {
                        shiftsArr.push({
                            date: i + 1,
                            working_shift_name: "",
                            id: "",
                            name: "",
                        });
                    }
                    // 获取用户id
                    getGroupList(this.$route.query.id)
                        .then((res) => {
                            // 是否有关联用户，有就给相对用户已初始值，否则返回空数组
                            if (res.data.wattendance_user.length > 0) {
                                this.wattendance_user =
                                    res.data.wattendance_user;
                                res.data.wattendance_user.forEach((v) => {
                                    data.push({
                                        userName: v.user_name,
                                        userId: v.user_id,
                                        shift: JSON.parse(
                                            JSON.stringify(shiftsArr)
                                        ),
                                    });
                                });
                            } else {
                                data = [];
                            }
                            this.tableData = JSON.parse(JSON.stringify(data));
                            this.tableData2 = JSON.parse(JSON.stringify(data));

                            this.attendanceFroupId = -1;
                            this.loading = false;
                        })
                        .catch((err) => {
                            data.push({
                                userName: undefined,
                                userId: undefined,
                                shift: JSON.parse(JSON.stringify(shiftsArr)),
                            });
                            this.tableData = JSON.parse(JSON.stringify(data));

                            this.tableData2 = JSON.parse(JSON.stringify(data));
                            // 如果用户不在考勤组之内
                        });
                } else {
                    this.tableData = [];
                    this.tableData2 = [];
                }
                this.attendanceFroupId = this.attendanceFroupId2;
                this.loading = false;
                this.showButton = 0;
            } else {
                this.requestMode = "put";
                this.userId = [];
                getGroupList(this.$route.query.id).then((res) => {
                    this.wattendance_user = res.data.wattendance_user;
                    this.tableData = JSON.parse(JSON.stringify(data));

                    // 查看是否有刚被删除的考勤组成员
                    let isPut = this.deleteGroup(this.tableData);
                    this.tableData2 = JSON.parse(
                        JSON.stringify(this.tableData)
                    );

                    this.attendanceFroupId = this.attendanceFroupId2;
                    this.showButton = 0;
                    this.loading = false;
                    console.log(isPut);
                    // 有立刻修改
                    if (isPut) {
                        this.requestMode = "put";
                        console.log("修改");
                        // this.submit()
                    } else {
                        // 没有就赋值进行下一步
                    }
                });
            }
        },
        // tage考勤标签设置不同颜色
        tagColor(item, index) {
            if (item.color) {
                return { background: item.color };
            } else {
                return {
                    background:
                        this.scheduling.color[
                            index % this.scheduling.color.length
                        ],
                };
            }
        },
        // 月份是否修改提示
        handlerShow(fn, newV, oldV) {
            this.date1 = this.date2;
            if (this.showButton > 0) {
                const h = this.$createElement;
                this.$confirm(null, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    message: h("div", null, [
                        h("i", {
                            class: "el-message-box__status el-icon-warning    el-message-box__status_postation",
                        }),
                        h(
                            "div",
                            { class: "el-message-confirm-title" },
                            "当月排班信息尚未保存"
                        ),
                        h(
                            "span",
                            { class: "el-message-confirm-content" },
                            "你确定放弃对排班信息的修改吗？"
                        ),
                    ]),
                })
                    .then((res) => {
                        this.date1 = newV;
                        this.date2 = newV;
                        fn();
                    })
                    .catch((err) => {
                        return false;
                    });
            } else {
                this.date1 = newV;
                this.date2 = newV;
                fn(newV);
            }
        },
        //是否在考勤组之内
        isGroup(index, id) {
            let date = new Date();
            // 如果在当前日期之外，并且用户不在考勤组之内
            if (
                this.date1.getFullYear() >= date.getFullYear() &&
                this.date1.getMonth() >= date.getMonth() &&
                index >= date.getDate()
            ) {
                if (!this.wattendance_user.some((v) => v.user_id === id)) {
                    return true;
                }
            }
        },
        // 对不在考勤组内的进行排序
        deleteGroup(value) {
            let boolean = false;
            // 修改不满足条件的值
            value.map((val, index) => {
                val.shift.map((v, k) => {
                    // 数据是否为有效数据(id存在)    数据是否已做出区分(status存在)
                    if (
                        v.id !== "" &&
                        (v.status === undefined ? true : false)
                    ) {
                        // 当前日期是否需要变为无法修改的数据
                        if (this.isGroup(v.date - 1, val.userId)) {
                            value[index].shift[k] = {
                                date: v.date,
                                id: -1,
                                name: "休息",
                                status: 0,
                            };
                            boolean = true;
                        }
                    }
                });
            });
            console.log(boolean);
            return boolean;
        },
    },
    beforeDestroy() {
        document.removeEventListener("click", this.bodyClosePopover);
        document.removeEventListener("resize", this.mediumSizeChange);
    },
};
</script>

<style lang="scss" scoped>
.app-container {
    position: relative;
    min-width: 1050px;
    //   选择班次修改弹窗样式
    .popover {
        position: absolute;
        z-index: 9999;
        padding: 12px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px #bfbfbf;
        // box-shadow: 0 2px 4px rgb(31 35 41 / 12%);
        width: 228px;
        // 班次图标样式
        .arrow {
            position: absolute;
            top: -10px;
            left: 14px;
            color: #048790;
        }
        .popover-main {
            .scheduling-list {
                .title {
                    color: rgba(0, 0, 0, 0.43);
                    margin-top: 15px;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                }
                ul {
                    li {
                        height: 32px;
                        background: #048790;
                        color: #fff;
                        text-align: center;
                        line-height: 32px;
                        font-size: 14px;
                        border-radius: 4px;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    // 表格内容样式
    ::v-deep .clickable {
        padding: 0px;

        .cell {
            padding: 0px;
            line-height: normal;
            color: #010621;

            .table-header,
            .table-row {
                cursor: pointer;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #010621;
                font-weight: normal;
                .divColor {
                    background: #6691f7;
                    color: white;
                    width: 100%;
                    height: 44px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    line-height: 22px;
                }
                .userNameClass {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .no-existent-Color {
                    cursor: default;
                    background-color: rgb(246, 246, 246);
                    color: rgb(191, 191, 191);
                }
                i {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-top: 7px solid red;
                    border-left: 7px solid transparent;
                }
            }
            // 表头样式
            .table-header {
                flex-direction: column;
                font-weight: normal;
                padding: 10px 0;
                height: 62px;
            }
        }
    }
    .userNameClass {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .row-bg {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 20px;
        .checkboxLeft {
            padding-left: 24px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(1, 6, 33, 0.75);
            line-height: 22px;
        }
        .excel-col {
            width: auto;
            font-size: 14px;
            position: absolute;
            right: 0px;
            .execl-font {
                width: 66px;
                height: 20px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(1, 6, 33, 0.9);
                line-height: 20px;
            }
            .row-button {
                width: 148px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #d0d0d3;
            }
            .row-button1 {
                color: rgba(1, 6, 33, 0.75);
                margin-left: 20px;
            }
            .row-button2 {
                color: #ffffff;
                background-color: #048790;
            }
        }
        .submit-col {
            width: auto;
            position: absolute;
            right: 0px;
        }
    }
    .marLef5 {
        margin-left: 5%;
        width: 95%;
    }
    .radio-box {
        border: none;
        color: #048790;
        border-bottom: 2px solid;
        border-radius: 0px;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        box-shadow: none;
        color: #048790;
        border: none;
        border-bottom: 1px solid;
        border-radius: 0px;
        background-color: #fff;
    }
    ::v-deep .el-radio-button--medium .el-radio-button__inner {
        border: none;
    }
    ::v-deep
        .el-table--scrollable-x
        .el-table__body-wrapper::-webkit-scrollbar {
        height: 8px;
        background-color: #cccccc;
        cursor: pointer;
    }
    // 自定义滚动条后对齐表格
    ::v-deep .el-table__fixed,
    .el-table__fixed-right {
        height: 100% !important;
    }
    // 月份选择器图标样式单独设置
    ::v-deep .month .el-input__prefix {
        position: absolute;
        right: 5px;
        left: auto;
    }
}
::v-deep .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
//  排版未保存警告弹窗样式
// 图标
.el-message-box__status_postation {
    color: #faad14;
    position: absolute;
    top: 10px;
    left: 0px;
}
// 标题
.el-message-confirm-title {
    display: block;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 18px;
    line-height: 1.4;
    margin-left: 38px;
    margin-bottom: 10px;
}
// 内容
.el-message-confirm-content {
    margin-left: 38px;
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    box-sizing: border-box;
    line-height: 1.5;
    word-wrap: break-word;
    margin-bottom: 25px;
}
::v-deep .el-input__inner:hover {
    border-color: #1890ff;
}
::v-deep .el-descriptions-item__label.is-bordered-label {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #010621;
    line-height: 14px;
}
::v-deep .el-table--border th.el-table__cell {
    color: rgba(0, 0, 0, 0.65);
    background-color: #f0f0f0;
    transition: background 0.3s ease;
}
::v-deep .el-table td.el-table__cell div {
    box-sizing: border-box;
}
::v-deep .el-table--medium .el-table__cell {
    padding: 0px;
}

::v-deep .el-table th.el-table__cell:first-child > .cell {
    height: 63px;
    line-height: 63px;
}
</style>
