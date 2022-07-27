<template>
    <div class="app-container">
        <el-form
            ref="checkingGroup"
            :model="form"
            :rules="rules"
            label-position="right"
            label-width="120px"
            class="checkingGroup"
        >
            <div class="form-item">
                <div class="form-item-title">基础信息</div>
                <div class="form-item-main">
                    <el-form-item
                        label="考勤组名称"
                        prop="attendance_group_name"
                    >
                        <el-input
                            v-model="form.attendance_group_name"
                            placeholder="请输入考勤组名称"
                            size="small"
                        />
                    </el-form-item>
                    <el-form-item label="考勤组负责人" prop="principalList">
                        <div
                            class="selectUser-list"
                            @click="showSelectUserDialog(1)"
                        >
                            <div class="user-list">
                                <el-tag
                                    v-for="principal in form.principalList.slice(
                                        0,
                                        6
                                    )"
                                    :key="'principal' + principal.user_id"
                                    >{{ principal.user_name }}</el-tag
                                >
                            </div>
                            <div
                                class="total"
                                v-if="form.principalList.length > 6"
                            >
                                等共{{ form.principalList.length }}个
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="参与考勤人员" prop="participantList">
                        <div
                            class="selectUser-list"
                            @click="showSelectUserDialog(2)"
                        >
                            <div class="user-list" v-if="participantNum > 0">
                                <el-tag
                                    v-for="deptItem in form.participantList.depts.slice(
                                        0,
                                        6
                                    )"
                                    :key="'deptItem' + deptItem.id"
                                    >{{ deptItem.deptName }}</el-tag
                                >
                                <el-tag
                                    v-for="userItem in form.participantList.users.slice(
                                        0,
                                        showUserLength
                                    )"
                                    type="info"
                                    :key="'userItem' + userItem.user_id"
                                    >{{ userItem.user_name }}</el-tag
                                >
                            </div>
                            <div class="placeholder" v-else>请选择考勤人员</div>
                            <div class="total" v-if="participantNum > 6">
                                等共{{ participantNum }}个
                            </div>
                        </div>
                    </el-form-item>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">考勤班次</div>
                <div class="form-item-main">
                    <el-form-item label="考勤类型">
                        <el-radio-group v-model="form.attendance_type">
                            <el-radio
                                :label="o.value"
                                v-for="(o, index) in checkingTypes"
                                :key="index"
                                >{{ o.label }}</el-radio
                            >
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型说明"
                        ><p class="text">
                            {{ typeDeclaration }}
                        </p></el-form-item
                    >
                    <el-form-item
                        label="班次设置"
                        v-if="form.attendance_type == 1"
                    >
                        <div class="shifts-setting">
                            <div class="default-shifts">
                                <p>
                                    {{ shiftInfo.working_shift_name }}:{{
                                        formatShiftTime(shiftInfo)
                                    }}
                                </p>
                                <el-button
                                    type="text"
                                    @click="viewShiftDetails(shiftInfo.id)"
                                    >详情</el-button
                                >
                                <el-button
                                    type="text"
                                    @click="openShiftDialog('setDefault')"
                                    >更改</el-button
                                >
                            </div>
                            <div class="shifts-table">
                                <el-table
                                    :data="shiftTableData"
                                    style="width: 100%"
                                >
                                    <el-table-column label="工作日" width="120">
                                        <template slot-scope="scope">
                                            <el-checkbox
                                                :checked="
                                                    scope.row.shift.id != -1
                                                "
                                                @change="
                                                    changeShift(
                                                        $event,
                                                        scope.$index
                                                    )
                                                "
                                                >{{
                                                    scope.row.name
                                                }}</el-checkbox
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="班次">
                                        <template slot-scope="scope">
                                            <span>{{
                                                scope.row.shift
                                                    .working_shift_name
                                            }}</span>
                                            <template
                                                v-if="scope.row.shift.id != -1"
                                            >
                                                <span>-</span>
                                                <span>{{
                                                    formatShiftTime(
                                                        scope.row.shift
                                                    )
                                                }}</span>
                                            </template>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        width="100"
                                        align="right"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                v-if="scope.row.shift.id != -1"
                                                @click="
                                                    viewShiftDetails(
                                                        scope.row.shift.id
                                                    )
                                                "
                                                >详情</el-button
                                            >
                                            <el-button
                                                type="text"
                                                @click="
                                                    openShiftDialog(
                                                        'updateShift',
                                                        scope.row,
                                                        scope.$index
                                                    )
                                                "
                                                >更改</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-form-item>
                    <!-- <template v-if="form.attendance_type == 3">
                        <el-form-item label="工作日设置">
                            <el-checkbox-group v-model="form.workday">
                                <el-checkbox label="1">周一</el-checkbox>
                                <el-checkbox label="2">周二</el-checkbox>
                                <el-checkbox label="3">周三</el-checkbox>
                                <el-checkbox label="4">周四</el-checkbox>
                                <el-checkbox label="5">周五</el-checkbox>
                                <el-checkbox label="6">周六</el-checkbox>
                                <el-checkbox label="7">周日</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="考勤开始时间">
                            <div class="checking-time">
                                <p>每天几点开始新一天的考勤</p>
                                <el-time-picker
                                    v-model="form.time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    :default-value="new Date(2016, 9, 10, 4, 0)"
                                >
                                </el-time-picker>
                            </div>
                        </el-form-item>
                    </template> -->
                    <template v-if="form.attendance_type != 2">
                        <!-- <el-form-item label="排休设置">
                            <el-checkbox :checked="true"
                                >按照中国大陆法定节假日自动排休</el-checkbox
                            >
                        </el-form-item> -->
                        <el-form-item label="特殊日设置">
                            <div class="specialDay-setting-buttons">
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="openShiftDialog('addMustClockItme')"
                                    >新增必须打卡日</el-button
                                >
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="needNotClockInDialog = true"
                                    >新增无须打卡日</el-button
                                >
                            </div>
                            <el-table
                                :data="mustClockIn"
                                style="width: 100%"
                                v-show="mustClockIn.length > 0"
                            >
                                <el-table-column
                                    label="日期"
                                    width="100px"
                                    prop="date"
                                ></el-table-column>
                                <el-table-column label="班次">
                                    <template slot-scope="scope">
                                        <span>{{
                                            scope.row.shift.working_shift_name
                                        }}</span>
                                        <template
                                            v-if="scope.row.shift.id != -1"
                                        >
                                            <span>-</span>
                                            <span>{{
                                                formatShiftTime(scope.row.shift)
                                            }}</span>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="140"
                                    align="right"
                                >
                                    <template slot-scope="scope">
                                        <template
                                            v-if="scope.row.shift.id != -1"
                                        >
                                            <el-button
                                                type="text"
                                                @click="
                                                    viewShiftDetails(
                                                        scope.row.shift.id
                                                    )
                                                "
                                                >详情</el-button
                                            >
                                            <el-button
                                                type="text"
                                                @click="
                                                    openShiftDialog(
                                                        'updateClockSingle',
                                                        scope.row,
                                                        scope.$index
                                                    )
                                                "
                                                >更改</el-button
                                            >
                                        </template>
                                        <el-button
                                            type="text"
                                            @click="
                                                removeClockData(scope.$index)
                                            "
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </template>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">考勤方式</div>
                <div class="form-item-main">
                    <el-form-item label="考勤方式" prop="attendance_way">
                        <el-checkbox-group v-model="form.attendance_way">
                            <el-checkbox label="1">地点打卡</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item
                        label="地点打卡"
                        v-show="form.attendance_way.indexOf('1') != -1"
                    >
                        <div class="site-clock">
                            <div class="operation-buttons">
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="selectSiteDialog = true"
                                    >新建考勤地点</el-button
                                >
                            </div>
                            <div class="site-list">
                                <el-table :data="siteList" style="width: 100%">
                                    <el-table-column
                                        label="考勤地点"
                                        prop="checkingName"
                                    ></el-table-column>
                                    <el-table-column
                                        label="有效范围/米"
                                        width="200"
                                    >
                                        <template slot-scope="scope">
                                            <el-select
                                                v-model="scope.row.scope"
                                                placeholder="请选择"
                                            >
                                                <el-option
                                                    v-for="(
                                                        item, index
                                                    ) in scopeList"
                                                    :key="index"
                                                    :value="item"
                                                >
                                                    <span>{{ item }}</span>
                                                    <span
                                                        style="
                                                            margin-left: 10px;
                                                        "
                                                        >米</span
                                                    >
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100">
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                @click="
                                                    showSiteDetails(scope.row)
                                                "
                                                >查看</el-button
                                            >
                                            <el-button
                                                type="text"
                                                @click="
                                                    removeClockSite(
                                                        scope.$index
                                                    )
                                                "
                                                >删除</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                    <div slot="empty">
                                        <i class="el-icon-tickets"></i>
                                        暂无考勤地点
                                    </div>
                                </el-table>
                            </div>
                        </div>
                    </el-form-item>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">考勤设置</div>
                <div class="form-item-main">
                    <el-form-item label="更多打卡规则">
                        <ul class="rules-list">
                            <li>
                                <el-checkbox
                                    v-model="form.legworkClock.isAllow"
                                    @change="changeRules($event, '1')"
                                    >允许外勤打卡</el-checkbox
                                >
                            </li>
                            <template v-if="form.legworkClock.isAllow">
                                <li class="add-padding">
                                    <el-checkbox
                                        v-model="form.legworkClock.mustRemark"
                                        >需填备注</el-checkbox
                                    >
                                </li>
                                <li class="add-padding">
                                    <el-checkbox
                                        v-model="form.legworkClock.mustPhoto"
                                        >需拍照上传</el-checkbox
                                    >
                                </li>
                            </template>
                            <li>
                                <el-checkbox
                                    v-model="form.allowRepair.isAllow"
                                    @change="changeRules($event, '2')"
                                    >允许补卡</el-checkbox
                                >
                            </li>
                            <template v-if="form.allowRepair.isAllow">
                                <li class="add-padding">
                                    <el-checkbox
                                        v-model="form.allowRepair.clippingTime"
                                    ></el-checkbox>
                                    <p>限制补卡时间：可申请过去</p>
                                    <el-input-number
                                        :min="0"
                                        v-model="form.allowRepair.repairTime"
                                        controls-position="right"
                                    ></el-input-number>
                                    <p>天内的补卡(填写0天，则只能补当日的卡)</p>
                                </li>
                                <li class="add-padding">
                                    <el-checkbox
                                        v-model="form.allowRepair.numCeiling"
                                    ></el-checkbox>
                                    <p>每人每月补卡次数上线</p>
                                    <el-input-number
                                        v-model="form.allowRepair.repairCount"
                                        :min="0"
                                        controls-position="right"
                                    ></el-input-number>
                                    <p>次(按自然月计算)</p>
                                </li>
                            </template>
                        </ul>
                    </el-form-item>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-main footer">
                    <el-form-item label="">
                        <el-button @click="leave">取消</el-button>
                        <el-button @click="submit" type="primary"
                            >确定</el-button
                        >
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <AddCheckingSite
            :show.sync="selectSiteDialog"
            @confirm="addCheckingSite"
            :scopeList="scopeList"
        ></AddCheckingSite>
        <CheckingSiteDetails
            :show.sync="siteDetailsDialog"
            :data="siteItem"
        ></CheckingSiteDetails>
        <ShiftDialog
            :show.sync="selectShiftDialog"
            ref="ShiftDialog"
            @confirm="ShiftDialogConfirm"
            :data="shiftData"
            :hasDate="
                shiftChangeType != 'setDefault' &&
                shiftChangeType != 'updateShift'
            "
            :dateDisabled="shiftChangeType == 'updateClockSingle'"
        ></ShiftDialog>
        <SelectUsersDialog
            :visible.sync="selectUserDialog"
            :data="dialogConfig.datas"
            :model="dialogConfig.model"
            multiple
            placeholder="请选择人员"
            @confirm="SelectUsersConfirm"
        ></SelectUsersDialog>
        <el-dialog
            title="新增无需打卡日期"
            :visible.sync="needNotClockInDialog"
            width="400px"
            @close="
                () => {
                    needNotClockDate = '';
                }
            "
        >
            <el-form>
                <el-form-item label="日期" label-width="80px">
                    <el-date-picker
                        v-model="needNotClockDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="needNotClockInDialog = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addNotClockIn"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AddCheckingSite from "./components/addCheckingSite.vue";
import CheckingSiteDetails from "./components/checkingSiteDetails.vue";
import ShiftDialog from "./components/shiftDialog.vue";
import formatShiftTime from "./components/formatShift";
import { getUserProfile } from "@/request/api/organization/user";
import { getList } from "@/request/api/personnel/checking/shift";
import {
    addCheckingGroup,
    getuserdept,
    getCheckingGroup,
    updateCheckingGroup,
} from "@/request/api/personnel/checking/checkingGroup";
export default {
    name: "checkingGroup-operation",
    data() {
        return {
            form: {
                attendance_type: 1,
                // workday: [],
                attendance_way: ["1"],
                principalList: [],
                participantList: {
                    users: [],
                    depts: [],
                },
                legworkClock: {
                    isAllow: false,
                    mustRemark: false,
                    mustPhoto: false,
                },
                allowRepair: {
                    isAllow: false,
                    clippingTime: false,
                    repairTime: 0,
                    numCeiling: false,
                    repairCount: 0,
                },
            },
            rules: {
                attendance_group_name: [
                    {
                        required: true,
                        message: "请输入考勤组名称",
                        trigger: "blur",
                    },
                ],
                principalList: [
                    {
                        required: true,
                        message: "请选择考勤组负责人",
                        trigger: "change",
                    },
                ],
                participantList: [
                    {
                        required: true,
                        message: "请选择参与考勤人员",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value.users.length == 0 &&
                                value.depts.length == 0
                            ) {
                                callback(new Error("请选择参与考勤人员"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                attendance_way: [
                    {
                        required: true,
                        message: "至少选择一种考勤方式",
                        trigger: "change",
                    },
                ],
            },
            checkingTypes: [
                {
                    label: "固定班制",
                    value: 1,
                    describe: "考勤组内每位人员的上下班时间一致",
                },
                {
                    label: "排班制",
                    value: 2,
                    describe:
                        "自定义设置每人的班次，请在保存考勤组设置后再进行排班",
                },
                // {
                //     label: "自由班制",
                //     value: 3,
                //     describe: "不设置班次，随时打卡",
                // },
            ],
            shiftTableData: [],
            siteList: [],
            scopeList: [100, 200, 300, 500, 1000, 2000, 3000],
            selectSiteDialog: false,
            siteDetailsDialog: false,
            siteItem: {},
            selectUserDialog: false,
            dialogConfig: {
                datas: [],
                model: "",
            },
            shiftInfo: {},
            shiftData: {},
            selectShiftDialog: false,
            shiftChangeType: "setDefault",
            shiftItemIndex: null,
            mustClockIn: [],
            needNotClockInDialog: false,
            needNotClockDate: "",
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
        };
    },
    components: {
        AddCheckingSite,
        CheckingSiteDetails,
        ShiftDialog,
    },
    computed: {
        typeDeclaration() {
            let arr = this.checkingTypes.find(
                (item) => item.value == this.form.attendance_type
            );
            return arr.describe;
        },
        participantNum() {
            let { users, depts } = this.form.participantList;
            return users.length + depts.length;
        },
        showUserLength() {
            let num = 6 - this.form.participantList.depts.length;
            return num <= 0 ? 0 : num;
        },
        formatShiftTime() {
            return function (item) {
                return formatShiftTime(item);
            };
        },
    },
    methods: {
        addCheckingSite(e) {
            this.siteList.push(e);
        },
        showSiteDetails(e) {
            this.siteDetailsDialog = true;
            this.siteItem = e;
        },
        openShiftDialog(type, item, index) {
            this.selectShiftDialog = true;
            this.shiftChangeType = type;
            switch (type) {
                case "setDefault":
                    this.shiftData = this.shiftInfo;
                    break;
                case "updateShift":
                    this.shiftData = item.shift;
                    this.shiftItemIndex = index;
                    break;
                case "addMustClockItme":
                    this.shiftData = {
                        date: "",
                        shift: {},
                    };
                    break;
                case "updateClockSingle":
                    this.shiftData = {
                        date: item.date,
                        shift: item.shift,
                    };
                    this.shiftItemIndex = index;
                    break;
            }
        },
        getDefaultShift() {
            getList({
                tag: "1",
            }).then((res) => {
                this.shiftInfo = res.data.results[0];
                this.setShiftTableData();
            });
        },
        getUserInfo() {
            getUserProfile().then((res) => {
                this.form.principalList.push({
                    user_id: res.data.id,
                    user_name: res.data.username,
                });
            });
        },
        SelectUsersConfirm(e) {
            this.selectUserDialog = false;
            if (this.dialogConfig.type == 1) {
                this.form.principalList = e;
                this.$refs['checkingGroup'].validateField("principalList");
            } else {
                this.$set(this.form.participantList, "users", e.users);
                this.$set(this.form.participantList, "depts", e.depts);
                let users = e.users.map((user) => user.user_id);
                let depts = e.depts.map((dept) => dept.id);
                this.$refs['checkingGroup'].validateField("participantList");
                getuserdept({
                    userId: users,
                    deptId: depts,
                }).then((res) => {
                    if (res.data.exists != "false") {
                        let str = "";
                        res.data.info.map((item) => {
                            str += `<div>${item}</div>`;
                        });
                        this.$alert(str, "提示", {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: "知道了",
                        });
                    }
                });
            }
        },
        showSelectUserDialog(type) {
            this.dialogConfig = {
                datas:
                    type == 1
                        ? this.form.principalList
                        : this.form.participantList,
                model: type == 1 ? "user" : "all",
                type: type,
            };
            this.selectUserDialog = true;
        },
        viewShiftDetails(id) {
            this.$refs["ShiftDialog"].openShiftDialog("view", id);
        },
        ShiftDialogConfirm(e) {
            switch (this.shiftChangeType) {
                case "setDefault":
                    this.shiftInfo = e;
                    this.setShiftTableData();
                    break;
                case "updateShift":
                    this.shiftInfo = e;
                    this.shiftTableData[this.shiftItemIndex].shift = e;
                    break;
                case "addMustClockItme":
                    this.mustClockIn.push(e);
                    break;
                case "updateClockSingle":
                    this.$set(this.mustClockIn, this.shiftItemIndex, e);
                    break;
            }
        },
        setShiftTableData() {
            let weekList = [
                {
                    name: "周一",
                    keys: "monday",
                },
                {
                    name: "周二",
                    keys: "tuesday",
                },
                {
                    name: "周三",
                    keys: "wednesday",
                },
                {
                    name: "周四",
                    keys: "thursday",
                },
                {
                    name: "周五",
                    keys: "friday",
                },
            ];
            let rest = [
                {
                    name: "周六",
                    keys: "saturday",
                    shift: {
                        id: -1,
                        working_shift_name: "休息",
                    },
                },
                {
                    name: "周日",
                    keys: "sunday",
                    shift: {
                        id: -1,
                        working_shift_name: "休息",
                    },
                },
            ];
            weekList.forEach((el) => {
                el.shift = this.shiftInfo;
            });
            this.shiftTableData = weekList.concat(rest);
        },
        changeShift(e, index) {
            this.shiftTableData[index].shift = e
                ? this.shiftInfo
                : {
                      id: -1,
                      working_shift_name: "休息",
                  };
        },
        removeClockData(index) {
            this.mustClockIn.splice(index, 1);
        },
        addNotClockIn() {
            if (this.needNotClockDate == "") {
                this.$toastError("请选择日期");
                return false;
            }
            let dateIsExist = this.mustClockIn.find(
                (item) => item.date == this.needNotClockDate
            );
            if (dateIsExist) {
                this.$toastError("该日期已被设为必须打卡");
                return false;
            }
            this.needNotClockInDialog = false;
            this.mustClockIn.push({
                date: this.needNotClockDate,
                shift: {
                    id: -1,
                    working_shift_name: "休息",
                },
            });
        },
        removeClockSite(index) {
            this.siteList.splice(index, 1);
        },
        changeRules(e, type) {
            if (!e) {
                if (type == "1") {
                    for (var key in this.form.legworkClock) {
                        this.form.legworkClock[key] = false;
                    }
                } else {
                    this.form.allowRepair.clippingTime = false;
                    this.form.allowRepair.numCeiling = false;
                }
            }
        },
        submit() {
            this.$refs["checkingGroup"].validate((valid) => {
                if (valid) {
                    if (this.siteList.length <= 0) {
                        this.$toastError("请至少添加一个考勤地点");
                    } else {
                        let submitData = this.formatSubmitData();
                        this.$confirm(
                            "请选择本次人员或班次变动的生效时间",
                            "提示",
                            {
                                confirmButtonText: "立即生效",
                                cancelButtonText: "明日生效",
                                type: "warning",
                            }
                        )
                            .then(() => {
                                submitData.effect = 1;
                            })
                            .catch(() => {
                                submitData.effect = 2;
                            })
                            .finally(() => {
                                if (this.CheckingGroupId) {
                                    updateCheckingGroup(
                                        this.CheckingGroupId,
                                        submitData
                                    ).then((res) => {
                                        this.$toast("编辑考勤组成功");
                                        this.goBack();
                                    });
                                } else {
                                    addCheckingGroup(submitData).then((res) => {
                                        this.$toast("新增考勤组成功");
                                        this.goBack();
                                    });
                                }
                            });
                    }
                } else {
                    this.$toastError("请将表单填写完整！");
                }
            });
        },
        formatSubmitData() {
            let data = this.filterObj(this.form, [
                "attendance_group_name",
                "attendance_type",
                "attendance_way",
            ]);
            data.user_principal = this.form.principalList.map(
                (item) => item.user_id
            );
            data.wattendance_user = this.form.participantList.users.map(
                (item) => item.user_id
            );
            data.wattendance_dept = this.form.participantList.depts.map(
                (item) => item.id
            );
            if (data.attendance_type == "1") {
                data.default_work = this.shiftInfo.id;
                let attendance_time = {};
                this.shiftTableData.map((item) => {
                    attendance_time[item.keys] = item.shift.id;
                });
                data.attendance_time = attendance_time;
                data.custom_clock_day = this.mustClockIn.map((item) => {
                    return {
                        date: item.date,
                        shift_id: item.shift.id,
                    };
                });
            }
            data.place_clock = this.siteList.map((item) => {
                return {
                    attendanceAddr: item.address,
                    coords: item.position,
                    remarkAddr: item.checkingName,
                    clockScope: item.scope,
                };
            });
            data.clock_rules = {
                legworkClock: this.form.legworkClock,
                allowRepair: this.form.allowRepair,
            };
            return data;
        },
        goBack() {
            this.closePage("/personnel/checking/checkingGroup");
        },
        leave() {
            this.$confirm(
                "离开页面，当前页面内容将不予保存，是否离开?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.goBack();
                })
                .catch(() => {});
        },
        getCheckingGroupInfo() {
            getCheckingGroup(this.CheckingGroupId).then((res) => {
                let data = this.deepClone(res.data);
                let form = this.filterObj(data, [
                    "attendance_group_name",
                    "attendance_type",
                    "attendance_way",
                ]);
                this.form.principalList = data.user_principal;
                this.$set(
                    this.form.participantList,
                    "users",
                    data.wattendance_user
                );
                this.$set(
                    this.form.participantList,
                    "depts",
                    data.wattendance_dept
                );
                let clock_rules = data.clock_rules;
                this.form.legworkClock = clock_rules.legworkClock;
                this.form.allowRepair = clock_rules.allowRepair;
                let allowRepair = clock_rules.allowRepair;
                this.form.allowRepair.repairTime = allowRepair.clippingTime && allowRepair.isAllow ? allowRepair.repairTime : 0;
                this.form.allowRepair.repairCount = allowRepair.numCeiling && allowRepair.isAllow ? allowRepair.repairCount : 0;
                if (data.attendance_type == 1) {
                    this.shiftInfo = data.default_work;
                    this.shiftTableData = data.attendance_time;
                    this.mustClockIn = data.custom_clock_day;
                } else {
                    this.getDefaultShift();
                }
                this.siteList = data.place_clock.map((item) => {
                    return {
                        address: item.attendanceAddr,
                        position: item.coords,
                        checkingName: item.remarkAddr,
                        scope: item.clockScope,
                        coordinate: item.coords.join(","),
                    };
                });
                this.form = Object.assign({},this.form, form);
            });
        },
    },
    created() {
        if (this.$route.params.type == "edit") {
            this.CheckingGroupId = this.$route.query.id;
            this.getCheckingGroupInfo();
        } else {
            this.getUserInfo();
            this.getDefaultShift();
        }
    },
};
</script>

<style scoped lang="scss">
.checkingGroup {
    width: 800px;
    .form-item-title {
        color: #1f2f3d;
        margin: 20px 0;
        font-size: 22px;
    }
    .form-item-main {
        padding-left: 40px;
        .text {
            color: #606266;
        }
        .shifts-setting {
            .default-shifts {
                display: flex;
                p {
                    margin-right: 10px;
                }
            }
            .shifts-table {
                .el-checkbox {
                    margin-right: 10px;
                }
            }
        }
        .checking-time {
            display: flex;
            p {
                color: #606266;
            }
            .el-date-editor {
                width: 120px;
                margin-left: 10px;
            }
        }
        .rules-list {
            li {
                display: flex;
                margin-bottom: 10px;
                .el-input-number {
                    width: 100px;
                    margin-left: 10px;
                }
                p {
                    color: #606266;
                    margin-left: 10px;
                }
                &.add-padding {
                    padding-left: 40px;
                }
            }
        }
    }
    .selectUser-list {
        display: flex;
        border: solid 1px #ddd;
        border-radius: 4px;
        height: 38px;
        &:hover {
            border-color: #048790;
            cursor: text;
        }
        .user-list {
            flex: 1;
            padding: 5px 10px;
            display: flex;
            align-items: center;
            .el-tag {
                margin-right: 10px;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: keep-all;
            }
        }
        .placeholder {
            color: #c0c4cc;
            padding-left: 10px;
        }
        .total {
            padding: 0 10px;
        }
    }
}
</style>

