<template>
    <el-col :offset="1" :span="16">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item
                label="考勤班次"
                v-loading="loading"
                class="widthWarp"
            >
                <div class="Shift">
                    <span
                        v-for="(item, index) in scheduling.existingShift.data"
                        :key="item.id"
                    >
                        <el-tag
                            class="shifit_tag"
                            :style="tagColor(item, index)"
                            >{{ item.working_shift_name }}</el-tag
                        >
                    </span>

                    <!-- <el-button class="shfit_button" @click="OpenSelection('self',1)"> -->
                    <el-button class="shfit_button" @click="OpenSelection">
                        <i class="el-icon-circle-plus"></i>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="排班周期" class="widthWarp">
                <el-descriptions
                    direction="vertical"
                    :column="5"
                    border
                    size="mini"
                    v-if="scheduling.ruleForm.cycle.length > 0"
                >
                    <el-descriptions-item label="周期名称">
                        <span>
                            {{ scheduling.ruleForm.name }}
                        </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="周期班次">
                        <span
                            v-for="(shiftName, index) in this.scheduling
                                .ruleForm.cycle"
                            :key="index"
                        >
                            <span v-if="index > 0">-</span>
                            {{ shiftName.working_shift_name }}
                        </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="周期天数" :span="2">
                        <span>
                            {{ scheduling.ruleForm.Days }}
                        </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="操作">
                        <el-link type="primary" @click="hanlderCycle"
                            >设置</el-link
                        >
                    </el-descriptions-item>
                </el-descriptions>
                <el-link v-else type="primary" @click="hanlderCycle"
                    >点击设置</el-link
                >
            </el-form-item>
        </el-form>
        <!-- 选择班次 -->
        <el-dialog
            :visible.sync="showMapDrawer"
            title="选择班次"
            @close="closeTable"
            class="diaong"
        >
            <el-form>
                <el-form-item label="班次名称" v-cloak>
                    <!-- <el-input v-model="shiftName" placeholder="请输入班次名称">
                    </el-input>
                    <el-checkbox
                        v-model="shiftLock"
                        :checked="Boolean(shiftLock)"
                        >只展示我创建的班次</el-checkbox
                    > -->
                    <el-col :span="8">
                        <el-input
                            v-model="dialogSearch.name"
                            placeholder="请输入班次名称"
                        >
                        </el-input>
                    </el-col>
                    <el-col :span="6" class="choice-shift">
                        <el-checkbox
                            class="choice-shift-checkbox"
                            v-model="dialogSearch.shiftLock"
                            @change="getShiftData"
                            >只展示我创建的班次</el-checkbox
                        >
                        <el-button
                            @click="
                                selectShiftDialog = true;
                                showMapDrawer = false;
                            "
                            >+新建班次</el-button
                        >
                    </el-col>
                </el-form-item>
                <el-form-item v-loading="choiceLoading">
                    <el-scrollbar style="height: 500px">
                        <el-table
                            ref="multipleTable"
                            :data="tableData2"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :reserve-selection="true"
                            :row-key="getRowKey"
                            @select="handleSelectionChange"
                        >
                            <el-table-column
                                type="selection"
                                width="55"
                                prop="tag"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="working_shift_name"
                                label="班次名称"
                                width="120"
                                class-name="working_shift_name"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                label="考勤时间"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <div style="margin-left: 10px">
                                        {{ scope.row.first_working_time }}-{{
                                            scope.row.first_offduty_time
                                        }}
                                    </div>
                                    <div
                                        style="margin-left: 10px"
                                        v-if="scope.row.second_working_time"
                                    >
                                        {{ scope.row.second_working_time }}-{{
                                            scope.row.second_offduty_time
                                        }}
                                    </div>
                                    <div
                                        style="margin-left: 10px"
                                        v-if="scope.row.third_working_time"
                                    >
                                        {{ scope.row.third_working_time }}-{{
                                            scope.row.third_offduty_time
                                        }}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </el-form-item>
                <el-form-item>
                    <pagination
                        v-show="pagings.total > 0"
                        :total="pagings.total"
                        :page.sync="pagings.pageNum"
                        :limit.sync="pagings.pageSize"
                        :pageSizes="[10, 20, 30, 40]"
                        @pagination="getListNum"
                    />
                </el-form-item>
                <el-form-item>
                    <div class="stbmit-button">
                        <el-button type="primary" @click="mapconfirmForm"
                            >确认</el-button
                        >
                        <el-button @click="mapdrawerClosed">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新增班次 -->
        <ShiftDialog
            ref="ShiftDialog"
            v-model="selectShiftDialog"
            :data="shiftData"
            @close="ShiftDialogConfirm"
        ></ShiftDialog>
        <!-- 设置排班周期 -->
        <SchedulingCycle
            :CycleVisible.sync="CycleSonVisible"
            :existingShift.sync="scheduling.existingShift.data"
            :ruleForm="scheduling.ruleForm"
            v-bind="$attrs"
            v-on="$listeners"
        ></SchedulingCycle>
    </el-col>
</template>

<script>
import { mapState } from "vuex";
import { getList as getSelfList } from "@/request/api/personnel/checking/shift";

import ShiftDialog from "@/views/components/shiftDialog";
import SchedulingCycle from "./SchedulingCycle.vue";
import { debounce } from "@/utils/index.js";
export default {
    name: "Scheduling",
    components: {
        ShiftDialog,
        SchedulingCycle,
    },
    data() {
        return {
            form: {
                name: [],
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                resource: "",
                desc: "",
            },
            pagings: {
                total: 100,
                pageNum: 1,
                pageSize: 10,
            },
            // 选择班次loaing
            choiceLoading: false,
            // 选择班次搜索
            shiftName: "",
            // 选择班次只展示我创建
            shiftLock: localStorage.getItem(`${this.attendanceFroupId}选择`),
            showMapDrawer: false,
            // 所有考勤班次
            tableData: [],
            // 新增班次 显示隐藏
            selectShiftDialog: false,
            // 新增班次数据
            shiftData: {},
            CycleSonVisible: this.CycleVisible,
            // 设置排班周期显示隐藏
            CycleVisible: false,
            // 已选中班次
            Shifts: [],
            // 已经删除的班次
            deleteShifts: [],
            // 搜索防抖
            debounceFn: debounce(this.nameQuery, 1000),
            // 选择班次搜索
            dialogSearch: {
                name: "",
                shiftLock:
                    localStorage.getItem(`${this.attendanceFroupId}选择`) ===
                    "true"
                        ? true
                        : false,
            },
        };
    },
    props: {
        date: {
            type: String,
            default: "",
        },

        wattendance_user: {
            type: Array,
            dafault: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        requestMode: {
            type: String,
            default: "add",
        },
        attendanceFroupId: {
            type: Number,
            default: 0,
        },
    },
    created() {
        this.form.date1 = new Date();
        this.Shifts = JSON.parse(JSON.stringify(this.scheduling.existingShift));
        getSelfList({
            pageNum: 1,
            pageSize: 1000,
        }).then((res) => {
            this.$store.commit(
                "scheduling/setExistingShiftAll",
                res.data.results
            );
        });
    },
    computed: {
        ...mapState({
            scheduling: (state) => state.scheduling,
        }),
        tableData2() {
            let arr = [];
            // 如果只展示我创建
            if (this.dialogSearch.shiftLock) {
                arr = this.tableData.filter((v) => {
                    // 获取验证
                    return v.creator_name === "日程测试";
                });
                arr = arr.filter((v) => {
                    return v.working_shift_name.indexOf(this.shiftName) >= 0;
                });
            } else {
                if (this.shiftName === "") return this.tableData;
                arr = this.tableData.filter((v) => {
                    return v.working_shift_name.indexOf(this.shiftName) >= 0;
                });
            }
            // 根据输入框展示班次
            return arr;
        },
    },
    watch: {
        shiftName() {
            this.debounceFn();
        },
        tableData2: {
            handler() {
                this.$nextTick(function () {
                    this.settingTableSelect();
                });
            },
            immediate: false,
            deep: true,
        },
    },
    methods: {
        getListNum() {
            this.getShiftData();
        },
        // 姓名查询
        nameQuery() {
            this.choiceLoading = true;
            let self = "";
            let id = "";
            if (this.shiftLock) {
                self = "self";
                id = 1;
            }
            getShiftList(self, id).then((res) => {
                this.tableData = res.data.results.filter((v) => {
                    return v.working_shift_name.includes(this.shiftName);
                });
                this.$nextTick(function () {
                    this.settingTableSelect();
                    this.choiceLoading = false;
                });
            });
        },
        // 打开选择班次(重新请求数据)
        getShiftData() {
            this.choiceLoading = true;
            // 拿到全部班次
            getSelfList({
                working_shift_name: this.dialogSearch.name,
                self: this.dialogSearch.shiftLock ? "1" : undefined,
                pageNum: this.pagings.pageNum,
                pageSize: this.pagings.pageSize,
            }).then((res) => {
                this.tableData = res.data.results;
                this.pagings.total = res.data.count;
                this.settingTableSelect();
            });
        },
        // 多选回显
        settingTableSelect() {
            this.tableData.forEach((v) => {
                if (
                    // dom已存在,并且数据在临时数组或者以在确定数组中存在
                    this.$refs.multipleTable &&
                    (this.scheduling.existingShift.data.findIndex(
                        (value) => value.id === v.id
                    ) !== -1 ||
                        this.Shifts.data.findIndex(
                            (value) => value.id === v.id
                        ) !== -1) &&
                    (this.deleteShifts.length == 0 ||
                        this.deleteShifts.findIndex(
                            (value) => value.id === v.id
                        ) === -1)
                ) {
                    this.$nextTick(() => {
                        this.$refs.multipleTable.toggleRowSelection(v, true);
                    });
                }
            });
            this.choiceLoading = false;
        },
        // 打开多选时
        OpenSelection() {
            this.showMapDrawer = true;
            this.getShiftData();
        },
        getRowKey(row) {
            return row.id;
        },
        // 选择班次--多选添加进临时数组
        handleSelectionChange(val, row) {
            let idx = this.Shifts.data.findIndex((cItme) => cItme.id == row.id);
            if (idx == -1) {
                this.Shifts.data.push(row);
                // 如果添加时删除数组中存在
                let idx4 = this.deleteShifts.findIndex(
                    (cItme) => cItme.id == row.id
                );
                if (idx !== -1) {
                    this.deleteShifts.splice(idx4, 1);
                }
            } else {
                this.Shifts.data.splice(idx, 1);
                // 如果删除已有考勤班次内的数据添加到删除数组
                let idx2 = this.scheduling.existingShift.data.findIndex(
                    (cItme) => cItme.id == row.id
                );
                if (idx2 !== -1) {
                    if (this.deleteShifts.length === 0) {
                        this.deleteShifts.push(row);
                    } else {
                        // 如果删除数组不存在再添加，否则
                        let idx3 = this.deleteShifts.findIndex(
                            (value) => value.id === row.id
                        );
                        if (idx3 === -1) {
                            this.deleteShifts.push(row);
                        }
                    }
                }
            }
        },
        // 取消选择班
        mapdrawerClosed() {
            this.showMapDrawer = false;
        },
        // 确认更新班次
        mapconfirmForm() {
            let arr = [];
            arr = [...this.Shifts.data];
            // 根据原数据进行排序
            arr = this.diffData(arr, this.scheduling.existingShiftAll);
            arr.sort((a, b) => {
                return a.index - b.index;
            });
            // 排除休息
            arr = arr.filter((v) => v.id !== -1);
            if (this.deleteShifts.length > 0) {
                let str = "";
                this.deleteShifts.forEach((v, k) => {
                    if (k === 0) {
                        str += v.working_shift_name;
                    } else {
                        str += "-" + v.working_shift_name;
                    }
                });
                // 确定从考勤组移除：早班
                const h = this.$createElement;
                this.$confirm(null, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    message: h("div", null, [
                        h("i", {
                            class: "el-message-box__status el-icon-question el-message-box__status_postation",
                        }),
                        h(
                            "span",
                            { class: "el-message-confirm-title" },
                            `确认从考勤组移除:${str}`
                        ),
                        h(
                            "span",
                            { class: "el-message-confirm-content" },
                            "删除后，若有排班周期包含当前班次，该排班周期将自动删除，但是排班表中已排班次不受影响"
                        ),
                    ]),
                })
                    .then((res) => {
                        arr.push({
                            id: -1,
                            working_shift_name: "休息",
                            color: "#d9d9d9",
                            first_working_time: "休息",
                            new: true,
                        });
                        arr = [...new Set(arr)];
                        this.$store.commit("scheduling/setExistingShift", arr);
                        // 删除排班周期
                        this.$store.commit("scheduling/setRuleForm", {
                            name: "",
                            Days: 3,
                            cycle: [],
                        });
                        this.deleteShifts = [];
                        this.showMapDrawer = !this.showMapDrawer;
                    })
                    .catch((err) => {
                        this.$message({
                            message: "取消删除班次",
                            type: "error",
                        });
                    });
            } else {
                arr.push({
                    id: -1,
                    working_shift_name: "休息",
                    color: "#d9d9d9",
                    first_working_time: "休息",
                    new: true,
                });
                arr = [...new Set(arr)];
                this.$store.commit("scheduling/setExistingShift", arr);
                this.showMapDrawer = !this.showMapDrawer;
            }
        },
        // 对添加的数据排序
        diffData(arr1, arr2) {
            const _arr = [];
            arr1.forEach((v) => {
                let index = arr2.findIndex((value) => {
                    if (value.id !== -1 && v.id !== -1) {
                        return v.id === value.id;
                    }
                });

                if (index !== -1) {
                    arr2[index].index = index;
                    _arr.push(arr2[index]);
                }
            });
            return _arr;
        },
        hanlderCycle() {
            this.CycleSonVisible = !this.CycleSonVisible;
        },
        // 新建排班关闭
        ShiftDialogConfirm() {
            this.selectShiftDialog = false;
            this.OpenSelection();
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
                    // background: "#d9d9d9",
                };
            }
        },
        // 选择班次关闭时取消未确定的多选
        closeTable() {
            this.deleteShifts = [];
            this.Shifts = JSON.parse(
                JSON.stringify(this.scheduling.existingShift)
            );
        },
    },
};
</script>

<style lang="scss" scoped>
$widthcontent: "800px";
.widthWarp {
    width: $widthcontent;
}
.choice-shift {
    display: flex;
    margin: 0 10px;
    .choice-shift-checkbox {
        margin-right: 5px;
    }
}
::v-deep .el-dialog {
    min-width: 624px;
}
.Shift {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid rgba(217, 217, 217, 1);
    line-height: 32px;
    padding: 3px;
    border-radius: 4px;
    .shifit_tag {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        margin: 0 3px;
        cursor: pointer;
    }
    .shfit_button {
        border-radius: 50%;
        width: 22px;
        height: 22px;
        padding: 0px;
        font-size: 22px;
        border: none;
        margin: 0px;
        position: absolute;
        bottom: 8px;
        ::v-deep .el-icon-circle-plus {
            color: #048790;
        }
    }
}
.diaong {
    // 选择班次弹窗
    .working_shift_name {
        height: 40px;
    }
    .stbmit-button{
        display: flex;
        justify-content: space-around;
    }
}
::v-deep .el-input__inner:hover {
    border-color: #1890ff;
}
::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: none;
    cursor: pointer;
    padding: 15px;
    opacity: 0.7;
}
::v-deep .el-descriptions-item__label.is-bordered-label {
    font-weight: bold !important;
    opacity: 1 !important;
}
::v-deep .el-descriptions-row {
    font-weight: unset;
}
::v-deep .el-descriptions {
    border-radius: 4px;
    border: 1px solid #eaeaea;
}
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
}
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
::v-deep .el-table td.el-table__cell div {
    min-height: 40px;
}
::v-deep .el-table th.el-table__cell {
    color: rgba(0, 0, 0, 0.65);
    background-color: #f0f0f0;
}
</style>
