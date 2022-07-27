<template>
    <div class="app-container Schedulemgmt">
        <div class="dept-main">
            <div class="head-container">
                <el-input
                    v-model="deptName"
                    placeholder="请输入部门名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px"
                />
            </div>
            <div class="head-container">
                <el-tree
                    ref="tree"
                    :data="deptOptions"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    default-expand-all
                    @node-click="handleNodeClick"
                    class="yg-tree"
                />
            </div>
        </div>
        <div class="data-main">
            <el-form
                ref="queryForm"
                :model="queryParams"
                :inline="true"
                label-width="68px"
                v-if="CalendarType == 'list'"
            >
                <el-form-item label="日程标题" prop="username">
                    <el-input
                        v-model="queryParams.agendaSubject"
                        placeholder="请输入日程标题"
                        clearable
                        size="small"
                        style="width: 220px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="日程时间">
                    <el-date-picker
                        v-model="queryParams.times"
                        size="small"
                        style="width: 220px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="queryParams.status"
                        placeholder="日程状态"
                        clearable
                        size="small"
                        style="width: 220px"
                    >
                        <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery"
                        >搜索</el-button
                    >
                    <el-button
                        icon="el-icon-refresh"
                        size="mini"
                        @click="resetQuery"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
            <div class="Calendar-tool">
                <el-button type="primary" @click="addSchedule" icon="el-icon-plus">新建</el-button>
                <div class="time-tool" v-if="CalendarType != 'list'">
                    <el-button
                        icon="el-icon-arrow-left"
                        @click="changeDate('prev')"
                    ></el-button>
                    <el-date-picker
                        v-model="CalendarVal"
                        :editable="false"
                        :clearable="false"
                        :type="CalendarType"
                        placeholder="选择日期"
                        @change="toDay"
                        :format="datePickerFormat"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                    <el-button
                        icon="el-icon-arrow-right"
                        @click="changeDate('next')"
                    ></el-button>
                </div>
                <div class="right-tool">
                    <el-button
                        type="primary"
                        @click="toToday"
                        :disabled="isToday"
                        v-if="CalendarType != 'list'"
                        >今天</el-button
                    >
                    <el-radio-group
                        v-model="CalendarType"
                        @change="changeCalendarView"
                    >
                        <el-radio-button label="month">月</el-radio-button>
                        <el-radio-button label="week">周</el-radio-button>
                        <el-radio-button label="date">日</el-radio-button>
                        <el-radio-button label="list">列表</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <FullCalendar
                :options="calendarOptions"
                ref="FullCalendar"
                v-show="CalendarType != 'list'"
            />
            <template v-if="CalendarType == 'list'">
                <el-table v-loading="loading" :data="tableData" class="yg-table">
                    <el-table-column label="日程标题" prop="agendaSubject" />
                    <el-table-column label="开始时间">
                        <template slot-scope="scope">
                            {{ parseTime(new Date(scope.row.startTime)) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" prop="stopTime">
                        <template slot-scope="scope">
                            {{ parseTime(new Date(scope.row.stopTime)) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" :formatter="formatStatus" />
                    <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                @click="getDetails(scope.row.id, 'details')"
                                >查看</el-button
                            >
                            <el-button
                                size="mini"
                                type="text"
                                @click="getDetails(scope.row.id, 'edit')"
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
                <pagination
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
                />
            </template>
            <Yg-Drawer
                v-model="showDrawer"
                :title="drawerTitle"
                @confirm="confirmForm"
                @closed="drawerClosed"
                @cancel="drawerClosed"
                :confirmLoading="btnLoading"
                :showFooter="drawerType != 'details'"
            >
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="80px"
                    :disabled="drawerType == 'details'"
                >
                    <el-form-item label="日程主题" prop="agendaSubject">
                        <el-input
                            v-model="form.agendaSubject"
                            placeholder="请输入日程主题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                            v-model="form.startTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="stopTime">
                        <el-date-picker
                            v-model="form.stopTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="组织人" prop="organizationMan">
                        <div
                            class="userList"
                            v-if="Object.keys(form.organizationMan).length > 0"
                        >
                            <el-tag
                                >{{ form.organizationMan.user_name }}</el-tag
                            >
                        </div>
                        <el-button
                            type="primary"
                            size="small"
                            @click="selectUsersDialog = true,selectType = 0"
                            v-if="drawerType != 'details'"
                            >{{`${Object.keys(form.organizationMan).length > 0 ? '修改' : '选择'}组织人`}}</el-button
                        >
                    </el-form-item>
                    <el-form-item label="关联人">
                        <div
                            class="userList"
                            v-if="form.affiliatedPerson.length > 0"
                        >
                            <el-tag
                                v-for="o in form.affiliatedPerson"
                                :key="o.user_id"
                                :closable="drawerType != 'details'"
                                @close="removeUser(o)"
                                >{{ o.user_name }}</el-tag
                            >
                        </div>
                        <p
                            class="tip"
                            v-if="
                                form.affiliatedPerson.length <= 0 &&
                                drawerType == 'details'
                            "
                        >
                            未选择关联人
                        </p>
                        <el-button
                            type="primary"
                            size="small"
                            @click="selectUsersDialog = true,selectType = 1"
                            v-if="drawerType != 'details'"
                            >选择关联人</el-button
                        >
                    </el-form-item>
                    <el-form-item label="地点">
                        <el-input
                            v-model="form.place"
                            placeholder="请输入地点"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="日程内容">
                        <el-input
                            type="textarea"
                            :row="4"
                            v-model="form.agendaContent"
                            placeholder="请输入日程内容"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </Yg-Drawer>
            <SelectUsersDialog
                :visible.sync="selectUsersDialog"
                :data="selectType == 1 ? form.affiliatedPerson : form.organizationMan"
                model="user"
                :multiple="selectType == 1"
                placeholder="请选择人员"
                @confirm="getDatas"
            ></SelectUsersDialog>
        </div>
    </div>
</template>

<script>
import { treeselect } from "@/request/api/organization/dept";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    addSchedule,
    allScheduleList,
    scheduleDetails,
    scheduleUpdate,
} from "@/request/api/personnel/schedule.js";
export default {
    name: "Schedulemgmt",
    components: {
        FullCalendar, // make the <FullCalendar> tag available
    },
    data() {
        return {
            deptName: "",
            deptOptions: undefined,
            defaultProps: {
                children: "children",
                label: "label",
            },
            CalendarVal: new Date(),
            CalendarType: "month",
            showDrawer: false,
            btnLoading: false,
            drawerType: "add",
            activeName: "calendar",
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                times: [],
            },
            statusOptions: [
                {
                    label: "待开始",
                    value: 1,
                },
                {
                    label: "进行中",
                    value: 2,
                },
                {
                    label: "已结束",
                    value: 3,
                },
            ],
            loading: false,
            tableData: [],
            total: 0,
            form: {
                affiliatedPerson: [],
                organizationMan:{}
            },
            rules: {
                agendaSubject: [
                    {
                        required: true,
                        message: "请输入日程主题",
                        trigger: "blur",
                    },
                ],
                organizationMan: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (Object.keys(value).length <= 0) {
                                callback(
                                    new Error("请选择组织人")
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "请选择开始时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.form.stopTime) {
                                let startTime = new Date(value).getTime();
                                let endTime = new Date(
                                    this.form.stopTime
                                ).getTime();
                                if (startTime < endTime) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("开始时间必须小于结束时间")
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                stopTime: [
                    {
                        required: true,
                        message: "请选择结束时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.form.startTime) {
                                let startTime = new Date(
                                    this.form.startTime
                                ).getTime();
                                let endTime = new Date(value).getTime();
                                if (startTime < endTime) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("结束时间必须大于开始时间")
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
            },
            pickerOptions: {
                disabledDate(v) {
                    return v.getTime() < new Date().getTime() - 86400000;
                },
            },
            calendarOptions: {
                // 引入的插件，比如fullcalendar/daygrid，fullcalendar/timegrid引入后才可显示月，周，日
                plugins: [
                    dayGridPlugin,
                    interactionPlugin,
                    timeGridPlugin,
                    listPlugin,
                ],
                initialView: "dayGridMonth", // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
                firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推
                locale: "zh-cn", // 切换语言，当前为中文
                eventColor: "#048790", // 全部日历日程背景色
                aspectRatio: 2, // 设置日历单元格宽度与高度的比例。
                displayEventTime: true, // 是否显示时间
                allDayContent: "全天", // allDay文案
                dayMaxEventRows: 5, // 最多显示几个日程,
                moreLinkContent: this.formatMoreLinkContent, // 格式化更多文案
                noEventsContent: "暂无日程",
                headerToolbar: false,
                slotLabelFormat: {
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: false,
                    hour12: false, // 设置时间为24小时
                },
                // 事件
                eventClick: this.handleEventClick, // 点击日历日程事件
                slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
                events: this.init,
            },
            selectUsersDialog: false,
            calendar: null,
            selectType:1
        };
    },
    computed: {
        drawerTitle() {
            let str = "";
            switch (this.drawerType) {
                case "add":
                    str = "新增";
                    break;
                case "edit":
                    str = "编辑";
                    break;
                case "details":
                    str = "查看";
                    break;
            }
            return str + "日程";
        },
        datePickerFormat() {
            if (this.CalendarType == "month") {
                return "yyyy-MM";
            } else {
                return "yyyy-MM-dd";
            }
        },
        isToday() {
            let time =
                typeof this.CalendarVal == "string"
                    ? new Date(this.CalendarVal)
                    : this.CalendarVal;
            return new Date().toDateString() == time.toDateString();
        },
    },
    mounted() {
        this.calendar = this.$refs.FullCalendar.getApi();
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.organizationMan = data.id;
            this.CalendarType == 'list' ? this.getList() : this.calendar.refetchEvents();
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect().then((response) => {
                this.deptOptions = this.handleTree(response.data, "id");
            });
        },
        // 左右箭头按钮
        changeDate(type) {
            if (type == "prev") {
                this.calendar.prev();
            } else {
                this.calendar.next();
            }
            this.CalendarVal = this.calendar.getDate();
        },
        // 改变日历视图
        changeCalendarView(e) {
            let type = "";
            switch (e) {
                case "month":
                    type = "dayGridMonth";
                    break;
                case "week":
                    type = "timeGridWeek";
                    break;
                case "date":
                    type = "timeGridDay";
                    break;
                case "list":
                    type = "dayGridMonth";
                    this.getList();
                    break;
            }
            this.calendar.changeView(type);
            this.CalendarVal = this.calendar.getDate();
        },
        // 跳转到指定日期
        toDay(e) {
            this.calendar.gotoDate(e);
        },
        // 回到今天
        toToday() {
            this.$refs.FullCalendar.getApi().today();
            this.CalendarVal = this.calendar.getDate();
        },
        // 新建按钮
        addSchedule() {
            this.showDrawer = true;
            this.drawerType = "add";
        },
        // 格式化状态
        formatStatus(row) {
            let item = this.statusOptions.find((el) => el.value == row.status);
            return item.label;
        },
        // 点击日程事件
        handleEventClick(event) {
            let id = event.event._def.publicId;
            this.getDetails(id, "details");
        },
        // 获取日程详情
        getDetails(id, type) {
            let self = this;
            scheduleDetails(id).then((res) => {
                let datas = self.filterObj(res.data, [
                    "agendaSubject",
                    "startTime",
                    "stopTime",
                    "place",
                    "agendaContent",
                    "id",
                    "organizationMan"
                ]);
                let affiliatedPerson = res.data.affiliatedPerson_list.map(
                    (item) => {
                        return {
                            user_id: item.userid,
                            user_name: item.username,
                        };
                    }
                );
                let organizationMan = {
                    user_id:datas.organizationMan.userid,
                    user_name:datas.organizationMan.username
                }
                datas.affiliatedPerson = affiliatedPerson;
                datas.organizationMan = organizationMan;
                self.showDrawer = true;
                self.drawerType = type;
                datas.startTime = this.parseTime(new Date(datas.startTime))
                datas.stopTime = this.parseTime(new Date(datas.stopTime))
                self.form = datas;
            });
        },
        /* 格式化更多文案 */
        formatMoreLinkContent(event) {
            return `更多(+${event.num})`;
        },
        // 格式化开始时间和结束时间
        getFormatDate(time, isEnd) {
            var dd = time;
            isEnd && dd.setDate(dd.getDate() - 1);
            var year = dd.getFullYear();
            var month = dd.getMonth() + 1;
            var strDate = dd.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            return `${year}-${month}-${strDate}`;
        },
        // 设置颜色
        settingColor(status) {
            let str = "";
            switch (status) {
                case "1":
                    str = "#048790";
                    // str = "#909399";
                    break;
                case "2":
                    str = "#409EFF";
                    break;
                case "3":
                    str = "#E6A23C";
                    break;
            }
            return str;
        },
        // 渲染方法
        init(event, callBack) {
            let startTime = this.getFormatDate(event.start);
            let endTime = this.getFormatDate(event.end, true);
            allScheduleList({
                startTime: startTime,
                stopTime: endTime,
                pageNum: "all",
                organizationMan:this.queryParams.organizationMan
            }).then((res) => {
                let scheduleList = res.data.map((item) => {
                    return {
                        id: item.id,
                        title: item.agendaSubject,
                        start: this.parseTime(new Date(item.startTime)),
                        end: this.parseTime(new Date(item.stopTime)),
                        color: this.settingColor(item.status),
                    };
                });
                callBack(scheduleList);
            });
        },
        // 抽屉提交事件
        confirmForm() {
            let self = this;
            self.$refs["form"].validate((vaild) => {
                if (vaild) {
                    self.btnLoading = true;
                    let data = self.deepClone(self.form);
                    data.affiliatedPerson = data.affiliatedPerson.map(
                        (item) => {
                            return item.user_id;
                        }
                    );
                    data.organizationMan = data.organizationMan.user_id;
                    if (this.drawerType == "add") {
                        addSchedule(data)
                            .then((res) => {
                                self.drawerSuccess("新增");
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        let itemId = data.id;
                        data.id = undefined;
                        scheduleUpdate(itemId, data)
                            .then((res) => {
                                self.drawerSuccess("修改");
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                }
            });
        },
        // 抽屉成功事件
        drawerSuccess(str) {
            this.$toast(`${str}成功！`);
            this.drawerClosed();
            this.getList();
            this.calendar.refetchEvents();
        },
        // 抽屉关闭事件
        drawerClosed() {
            this.showDrawer = false;
            this.form = {
                affiliatedPerson: [],
                organizationMan: {},
            };
            this.resetForm("form");
        },
        // 获取选择的人员数据
        getDatas(e) {
            this.selectUsersDialog = false;
            if(this.selectType == 1){
                this.form.affiliatedPerson = e;
            }
            else{
                this.form.organizationMan = e;
                this.$refs['form'].validateField("organizationMan")
            }
        },
        // 删除人员
        removeUser(item) {
            let index = this.form.affiliatedPerson.findIndex(
                (el) => el.user_id == item.user_id
            );
            this.form.affiliatedPerson.splice(index, 1);
        },
        // 获取日程列表
        getList() {
            this.loading = true;
            let datas = this.deepClone(this.queryParams);
            if (datas.times.length > 0) {
                datas.startTime = datas.times[0];
                datas.endTime = datas.times[1];
            }
            datas.times = undefined;
            allScheduleList(datas)
                .then((res) => {
                    this.tableData = res.data.results;
                    this.total = res.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // 列表搜索事件
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 列表重置搜索事件
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 20,
                times: [],
            };
            this.handleQuery();
        },
    },
    created() {
        this.getTreeselect()
    },
};
</script>

<style scoped lang="scss">
.Schedulemgmt{
    display: flex;
    .dept-main{
        width: 200px;
        margin-right: 20px;
    }
    .data-main{
        flex: 1;
    }
}
::v-deep .fc {
    .fc-button {
        background-color: #048790;
        border-color: #048790;
        &:hover {
            background: #369fa6 !important;
            border-color: #369fa6 !important;
            box-shadow: none;
        }
        &:active,
        &.fc-button-active {
            background: #047a82 !important;
            border-color: #047a82 !important;
            box-shadow: none !important;
        }
        &:active:focus,
        &:focus {
            box-shadow: none !important;
        }
        &:disabled,
        &:disabled:hover,
        &:disabled:active,
        &:disabled:focus {
            background-color: #82c3c8 !important;
            border-color: #82c3c8 !important;
            cursor: not-allowed;
        }
    }
    .fc-toolbar-chunk {
        display: flex;
    }
    .fc-header-toolbar {
        .fc-toolbar-chunk:last-child .fc-button-group {
            .fc-button {
                background: #fff !important;
                color: #606266;
                border: 1px solid #dcdfe6;
                &:hover,
                &.fc-button-active {
                    background: #369fa6 !important;
                    border-color: #369fa6 !important;
                    color: #fff;
                }
            }
        }
    }
    .fc .fc-daygrid-day.fc-day-today {
        background: rgb(54, 159, 166, 0.2);
        .fc-daygrid-day-number {
            color: #369fa6;
        }
    }
    .fc-col-header-cell .fc-scrollgrid-sync-inner {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;
    }
    .fc-daygrid-event{
        position: relative;
        padding-left: 10px;
        border-radius: 0;
        margin:5px 10px 0;
        border:solid 1px #ddd;
        color: #333;
        justify-content: flex-start;
        .fc-daygrid-event-dot{
            border-radius: 0;
            position: absolute;
            left: -1px;
            top: -1px;
            height: calc(100% + 2px);
            box-sizing: border-box;
            border-width: 2px;
            margin: 0;
        }
        .fc-event-title{
            font-weight: 400;
            margin-left: 10px;
            text-align: left;
            text-overflow: ellipsis;
        }
    }
}
::v-deep .Calendar-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .time-tool {
        display: flex;
        align-items: center;
        .el-date-editor {
            margin: 0 10px;
        }
    }
    .right-tool {
        display: flex;
        align-items: center;
        .el-button {
            margin-right: 10px;
        }
    }
}
.userList {
    margin-bottom: 15px;
    .el-tag {
        margin-right: 10px;
    }
}
.tip {
    color: #606266;
}
</style>

