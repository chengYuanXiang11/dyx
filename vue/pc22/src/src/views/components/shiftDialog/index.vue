<template>
    <el-dialog
        :visible.sync="showDialog"
        :title="
            (dialogType == 'add'
                ? '新建'
                : dialogType == 'edit'
                ? '编辑'
                : '查看') + '班次'
        "
        @closed="drawerClosed"
        size="800px"
    >
        <el-form
            ref="form"
            :model="form"
            label-width="120px"
            :rules="rules"
            v-loading="formLoading"
            :disabled="formDisabled"
        >
            <el-form-item label="班次名称" prop="working_shift_name">
                <el-input
                    v-model="form.working_shift_name"
                    placeholder="请输入班次名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="上下班次数" prop="working_count">
                <el-radio-group
                    v-model="form.working_count"
                    @change="resetTime"
                >
                    <el-radio :label="1">一天一次上下班</el-radio>
                    <el-radio :label="2">一天两次上下班</el-radio>
                    <el-radio :label="3">一天三次上下班</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="time-setting">
                <h1>工作时间：{{ workingHours }}</h1>
                <!-- 第一次上下班 -->
                <div class="item">
                    <div class="item-header">第一次上班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="上班时间"
                                prop="first_working_time"
                            >
                                <el-time-picker
                                    v-model="form.first_working_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="first_late_time"
                                >
                                    <el-input-number
                                        v-model="form.first_late_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="first_working_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.first_working_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最早可提前</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="form.first_earliest_clock_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                    <div class="item-header">第一次下班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="下班时间"
                                prop="first_offduty_time"
                            >
                                <el-time-picker
                                    v-model="form.first_offduty_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                                <el-tag
                                    effect="dark"
                                    class="morrow"
                                    v-if="morrowIndex <= 1"
                                    >次日</el-tag
                                >
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="first_leave_early_time"
                                >
                                    <el-input-number
                                        v-model="form.first_leave_early_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="first_offduty_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.first_offduty_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最晚可延后</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="form.first_latest_clock_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="LastMaxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 第二次上下班-->
                <div class="item" v-show="form.working_count != 1">
                    <div class="item-header">第二次上班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="上班时间"
                                prop="second_working_time"
                            >
                                <el-time-picker
                                    v-model="form.second_working_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                                <el-tag
                                    effect="dark"
                                    class="morrow"
                                    v-if="morrowIndex <= 2"
                                    >次日</el-tag
                                >
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="second_late_time"
                                >
                                    <el-input-number
                                        v-model="form.second_late_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="second_working_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.second_working_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最早可提前</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="
                                            form.second_earliest_clock_time
                                        "
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                    <div class="item-header">第二次下班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="下班时间"
                                prop="second_offduty_time"
                            >
                                <el-time-picker
                                    v-model="form.second_offduty_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                                <el-tag
                                    effect="dark"
                                    class="morrow"
                                    v-if="morrowIndex <= 3"
                                    >次日</el-tag
                                >
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="second_leave_early_time"
                                >
                                    <el-input-number
                                        v-model="form.second_leave_early_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="second_offduty_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.second_offduty_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最晚可延后</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="form.second_latest_clock_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="LastMaxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 第三次上下班 -->
                <div class="item" v-show="form.working_count == 3">
                    <div class="item-header">第三次上班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="上班时间"
                                prop="third_working_time"
                            >
                                <el-time-picker
                                    v-model="form.third_working_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                                <el-tag
                                    effect="dark"
                                    class="morrow"
                                    v-if="morrowIndex <= 4"
                                    >次日</el-tag
                                >
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="third_late_time"
                                >
                                    <el-input-number
                                        v-model="form.third_late_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>晚到超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="third_working_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.third_working_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最早可提前</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="form.third_earliest_clock_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                    <div class="item-header">第三次下班</div>
                    <div class="item-form">
                        <div class="time-main">
                            <el-form-item
                                label="下班时间"
                                prop="third_offduty_time"
                            >
                                <el-time-picker
                                    v-model="form.third_offduty_time"
                                    placeholder="选择时间"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @change="changeTimePicker"
                                    :clearable="false"
                                />
                                <el-tag
                                    effect="dark"
                                    class="morrow"
                                    v-if="morrowIndex <= 5"
                                    >次日</el-tag
                                >
                            </el-form-item>
                        </div>
                        <ul class="time-option">
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="third_leave_early_time"
                                >
                                    <el-input-number
                                        v-model="form.third_leave_early_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为迟到</p>
                            </li>
                            <li>
                                <span>最早超过</span>
                                <el-form-item
                                    label-width="0px"
                                    prop="third_offduty_not_clock"
                                >
                                    <el-input-number
                                        v-model="form.third_offduty_not_clock"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="maxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟记为半天缺卡</p>
                            </li>
                            <li>
                                <span>最晚可延后</span>
                                <el-form-item label-width="0px">
                                    <el-input-number
                                        v-model="form.third_latest_clock_time"
                                        controls-position="right"
                                        :min="minTime"
                                        :max="LastMaxTime"
                                    ></el-input-number>
                                </el-form-item>
                                <p>分钟进行打卡</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 休息时间 -->
            <div v-show="form.working_count == 1">
                <el-form-item label="中途休息时间">
                    <div class="half-time">
                        <el-time-picker
                            v-model="form.work_break_start"
                            placeholder="选择时间"
                            value-format="HH:mm"
                            format="HH:mm"
                            :clearable="false"
                            :picker-options="{
                                selectableRange: halfTimeStartFormat,
                            }"
                        />
                        <span>—</span>
                        <el-time-picker
                            v-model="form.work_break_stop"
                            placeholder="选择时间"
                            value-format="HH:mm"
                            format="HH:mm"
                            :clearable="false"
                            :picker-options="{
                                selectableRange: halfTimeEndFormat,
                            }"
                        />
                        <el-tag
                            effect="dark"
                            class="morrow"
                            v-if="halfTimeMorrow"
                            >次日</el-tag
                        >
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" v-if="!formDisabled">
            <el-button @click="drawerClosed">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
let contrast = (st, et) => {
    return format(st) <= format(et);
};

let format = (val) => {
    let date = new Date();
    let time = val.split(":");
    return date.setHours(time[0], time[1]);
};

let timeInterval = (min, max) => {
    function minTime(time) {
        let h = Number(time.split(":")[0]),
            m = Number(time.split(":")[1]) + 1;
        if (m < 10) {
            m = "0" + m;
        } else if (m >= 60) {
            h++;
            m = "00";
        }
        if (h < 10) {
            h = "0" + h;
        } else if (h >= 24) {
            h = "00";
        }
        return `${h}:${m}:00`;
    }
    function maxTime(time) {
        let h = Number(time.split(":")[0]),
            m = Number(time.split(":")[1]) - 1;
        if (m < 10 && m >= 0) {
            m = "0" + m;
        } else if (m < 0) {
            h--;
            m = "59";
        }
        if (h < 10 && h >= 0) {
            h = "0" + h;
        } else if (h < 0) {
            h = "23";
        }
        return `${h}:${m}:00`;
    }
    return `${minTime(min)} - ${maxTime(max)}`;
};

let validators = (rule, value, callback, comparing, type) => {
    let msgStr = `当前时间必须${
        type == "LessThan" ? "小于缺卡" : "大于迟到"
    }时间！`;
    if (type == "LessThan") {
        if (value >= comparing) {
            callback(new Error(msgStr));
        } else {
            callback();
        }
    } else {
        if (value <= comparing) {
            callback(new Error(msgStr));
        } else {
            callback();
        }
    }
};
import count from "@/utils/calculate";
import {
    addShift,
    queryDetails,
    editShift,
} from "@/request/api/personnel/checking/shift";
export default {
    name: "ShiftDialog",
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        dialogType: {
            type: String,
            default: "add",
        },
        id: {
            default: null,
        },
    },
    data() {
        return {
            form: {
                working_count: 1,
            },
            rules: {
                working_shift_name: [
                    {
                        required: true,
                        message: "请输入班次名称",
                        trigger: "blur",
                    },
                ],
                working_count: [
                    {
                        required: true,
                        message: "请选择上下班次数",
                        trigger: "change",
                    },
                ],
                first_working_time: [
                    {
                        required: true,
                        message: "请选择第一次上班时间",
                        trigger: "change",
                    },
                ],
                first_offduty_time: [
                    {
                        required: true,
                        message: "请选择第一次下班时间",
                        trigger: "change",
                    },
                ],
                second_working_time: [
                    {
                        required: true,
                        message: "请选择第二次上班时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.morrowIndex < 2) {
                                if (
                                    contrast(
                                        value,
                                        this.form.first_offduty_time
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须大于第一次下班时间"
                                        )
                                    );
                                } else if (
                                    contrast(
                                        this.form.second_offduty_time,
                                        value
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须小于第二次下班时间！"
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                second_offduty_time: [
                    {
                        required: true,
                        message: "请选择第二次下班时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.morrowIndex < 3) {
                                if (
                                    contrast(
                                        value,
                                        this.form.second_working_time
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须大于第二次上班时间！"
                                        )
                                    );
                                } else if (
                                    this.form.working_count == 3 &&
                                    contrast(
                                        this.form.third_working_time,
                                        value
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须小于第三次上班时间！"
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                third_working_time: [
                    {
                        required: true,
                        message: "请选择第三次上班时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.morrowIndex < 4) {
                                if (
                                    contrast(
                                        value,
                                        this.form.second_offduty_time
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须大于第二次下班时间！"
                                        )
                                    );
                                } else if (
                                    contrast(
                                        this.form.third_offduty_time,
                                        value
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须小于第三次下班时间！"
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                third_offduty_time: [
                    {
                        required: true,
                        message: "请选择第三次下班时间",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.morrowIndex < 5) {
                                if (
                                    contrast(
                                        value,
                                        this.form.third_working_time
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "当前时间必须大于第三次上班时间！"
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                first_late_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.first_working_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                first_working_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.first_late_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
                first_leave_early_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.first_offduty_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                first_offduty_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.first_leave_early_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
                second_late_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.second_working_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                second_working_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.second_late_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
                second_leave_early_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.second_offduty_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                second_offduty_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.second_leave_early_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
                third_late_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.third_working_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                third_working_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.third_late_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
                third_leave_early_time: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.third_offduty_not_clock,
                                "LessThan"
                            );
                        },
                        trigger: "change",
                    },
                ],
                third_offduty_not_clock: [
                    {
                        validator: (rule, value, callback) => {
                            validators(
                                rule,
                                value,
                                callback,
                                this.form.third_leave_early_time,
                                "greater"
                            );
                        },
                        trigger: "change",
                    },
                ],
            },
            minTime: 0,
            maxTime: 720,
            LastMaxTime: 960,
            morrowIndex: 99,
            showDialog: this.value,
            formLoading: false,
            formDisabled: false,
        };
    },
    computed: {
        // 计算工作时间
        workingHours() {
            // 计算时间差，为负数时代表跨天，加上24小时，返回结果单位为分钟
            let calculate = (start, end) => {
                let timestamp = count.floatSub(format(end), format(start));
                let minutes = count.floatDivide(timestamp, 60000);
                let day = count.floatMultiply(60, 24);
                minutes = minutes <= 0 ? count.floatAdd(minutes, day) : minutes;
                return minutes;
            };
            let {
                first_working_time,
                first_offduty_time,
                second_working_time,
                second_offduty_time,
                third_working_time,
                third_offduty_time,
                work_break_start,
                work_break_stop,
                working_count,
            } = this.form;
            // 第一个班次工作时间
            let workingTime_one = calculate(
                first_working_time,
                first_offduty_time
            );
            // 第二个班次工作时间
            let workingTime_two = calculate(
                second_working_time,
                second_offduty_time
            );
            // 第三个班次工作时间
            let workingTime_three = calculate(
                third_working_time,
                third_offduty_time
            );
            // 休息时间
            let restTime = calculate(work_break_start, work_break_stop);
            let result;
            // 计算结果，需要调用@/utils/calculate中的方法，进行精度计算
            switch (working_count) {
                case 1:
                    result = count.floatSub(workingTime_one, restTime);
                    break;
                case 2:
                    result = count.floatAdd(workingTime_one, workingTime_two);
                    break;
                case 3:
                    let result1 = count.floatAdd(
                        workingTime_one,
                        workingTime_two
                    );
                    result = count.floatAdd(result1, workingTime_three);
                    break;
            }
            // 将分钟转化为小时和剩余分钟数
            let total_h = Math.floor(count.floatDivide(result, 60)),
                total_m = count.floatMod(result, 60);
            let str;
            // 小时分钟若为负数，则归零
            if (total_h < 0 || total_m < 0) {
                str = "0小时0分钟";
            } else {
                str = `${total_h}小时${total_m}分钟`;
            }
            return str;
        },
        // 休息开始时间限制
        halfTimeStartFormat() {
            // 判断是否存在次日
            if (this.halfTimeMorrow) {
                // 返回可选时间段数组，["00:00 - 休息结束时间","第一次上班时间 - 23:59"]
                return [
                    timeInterval("23:59", this.form.work_break_stop),
                    timeInterval(this.form.first_working_time, "00:00"),
                ];
            } else {
                // 不存在次日，判断条件为大于上班时间，并且小于休息结束时间
                return timeInterval(
                    this.form.first_working_time,
                    this.form.work_break_stop
                );
            }
        },
        // 休息结束时间限制
        halfTimeEndFormat() {
            // 判断是否存在次日
            if (this.morrowIndex <= 1) {
                // 返回可选时间段数组，["休息开始时间 - 23:59","00:00 - 第一次下班时间"]
                return [
                    timeInterval(this.form.work_break_start, "00:00"),
                    timeInterval("23:59", this.form.first_offduty_time),
                ];
            } else {
                // 不存在次日，判断条件为大于休息开始时间，并且小于下班时间
                return timeInterval(
                    this.form.work_break_start,
                    this.form.first_offduty_time
                );
            }
        },
        // 休息时间是否显示次日
        halfTimeMorrow() {
            // 判断班次是否为1班次，班次是否存在次日
            if (this.form.working_count == 1 && this.morrowIndex == 1) {
                // 判断休息结束时间是否小于第一次下班时间
                if (
                    format(this.form.work_break_stop) <
                    format(this.form.first_offduty_time)
                ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
    },
    methods: {
        drawerClosed() {
            this.form.working_shift_name = undefined;
            this.resetForm();
            this.showDialog = false;
        },
        onSubmit() {
            let self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    const loading = this.$load();
                    let default_shift = [
                        "working_shift_name",
                        "working_count",
                        "first_working_time",
                        "first_offduty_time",
                        "first_late_time",
                        "first_working_not_clock",
                        "first_earliest_clock_time",
                        "first_leave_early_time",
                        "first_offduty_not_clock",
                        "first_latest_clock_time",
                        "work_break_start",
                        "work_break_stop",
                    ];
                    let two_shift = [
                        "second_working_time",
                        "second_offduty_time",
                        "second_late_time",
                        "second_working_not_clock",
                        "second_earliest_clock_time",
                        "second_leave_early_time",
                        "second_offduty_not_clock",
                        "second_latest_clock_time",
                    ];
                    let datas;
                    if (self.form.working_count != 3) {
                        if (self.form.working_count == 2) {
                            default_shift = default_shift.concat(two_shift);
                        }
                        datas = self.filterObj(self.form, default_shift);
                    } else {
                        datas = self.form;
                    }
                    if (self.form.working_count != 1) {
                        delete datas.work_break_start;
                        delete datas.work_break_stop;
                    }
                    if (this.dialogType == "add") {
                        addShift(datas).then((res) => {
                            this.success("新增");
                        }).finally(res => {
                            loading.close();
                        });
                    } else {
                        editShift(datas, this.id).then((res) => {
                            this.success("修改");
                        }).finally(res => {
                            loading.close();
                        });
                    }
                } else {
                    this.$toastError("请将表单填写完整");
                }
            });
        },
        success(str) {
            this.$toast(`${str}班次成功！`);
            this.$emit("complete");
            this.drawerClosed();
        },
        resetTime(e) {
            // 格式化各个班次的初始值
            this.resetForm();
            this.morrowIndex = 99;
            this.form.working_count = e;
            if (e != 1) {
                this.form.first_offduty_time = "11:30";
                this.form.first_latest_clock_time = 60;
                this.form.halfTime = [];
            }
            if (e == "3") {
                this.form.second_offduty_time = "17:30";
                this.form.second_latest_clock_time = 60;
            }
        },
        resetForm() {
            let working_shift_name = this.form.working_shift_name;
            this.form = {
                working_count: 1,
                working_shift_name: working_shift_name,
                // 第一次上下班时间
                first_working_time: "09:00",
                first_offduty_time: "18:00",
                first_late_time: 0,
                first_working_not_clock: 30,
                first_earliest_clock_time: 60,
                first_leave_early_time: 0,
                first_offduty_not_clock: 30,
                first_latest_clock_time: 480,
                // 第二次上下班时间
                second_working_time: "13:30",
                second_offduty_time: "18:00",
                second_late_time: 0,
                second_working_not_clock: 30,
                second_earliest_clock_time: 30,
                second_leave_early_time: 0,
                second_offduty_not_clock: 30,
                second_latest_clock_time: 480,
                // 第三次上下班时间
                third_working_time: "19:30",
                third_offduty_time: "20:00",
                third_late_time: 0,
                third_working_not_clock: 30,
                third_earliest_clock_time: 30,
                third_leave_early_time: 0,
                third_offduty_not_clock: 30,
                third_latest_clock_time: 480,
                // 中途休息时间
                work_break_start: "12:00",
                work_break_stop: "13:00",
            };
        },
        changeTimePicker(e) {
            // 时间改变时，判断当前班次，取出对应的值，并循环判断，设置次日下标
            if (e) {
                let keyNames = [
                        "first_working_time",
                        "first_offduty_time",
                        "second_working_time",
                        "second_offduty_time",
                        "third_working_time",
                        "third_offduty_time",
                    ].slice(0, Number(this.form.working_count) * 2),
                    times = [],
                    datas = this.form;
                for (let i in datas) {
                    if (keyNames.indexOf(i) != -1) {
                        times.push(datas[i]);
                    }
                }
                this.compareTime(times);
            }
        },
        compareTime(times) {
            this.morrowIndex = 99;
            for (let i in times) {
                if (i > 0 && contrast(times[i], times[i - 1])) {
                    this.morrowIndex = i;
                    break;
                }
            }
        },
        getDetails() {
            this.formLoading = true;
            queryDetails(this.id)
                .then((res) => {
                    for (let key in this.form) {
                        for (let subKey in res.data) {
                            if (key == subKey && res.data[subKey] !== null) {
                                this.form[key] = res.data[subKey];
                            }
                        }
                    }
                })
                .finally((error) => {
                    this.formLoading = false;
                });
        },
        init() {
            if (this.dialogType != "add") {
                this.getDetails();
            } else {
                this.resetForm();
            }
            this.formDisabled = this.dialogType == "view";
        },
    },
    created() {
        this.resetForm();
    },
    watch: {
        value(newVal) {
            this.showDialog = newVal;
            newVal && this.init();
        },
        showDialog(newVal) {
            this.$emit("input", newVal);
        },
    },
};
</script>

<style scoped lang="scss">
.time-setting {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    h1 {
        font-size: 16px;
        font-weight: normal;
        padding-bottom: 10px;
        border-bottom: solid 1px #ddd;
    }
    .item {
        padding: 20px 0;
        .item-header {
            font-size: 14px;
            margin-bottom: 20px;
        }
        .item-form {
            display: flex;
            .time-main {
                width: 50%;
                .el-date-editor {
                    width: 120px;
                }
                .morrow {
                    margin-left: 10px;
                }
            }
            .time-option {
                padding-left: 20px;
                .el-form-item {
                    margin-bottom: 0px;
                    flex: 1;
                    width: calc(100% - 400px);
                    margin: 0px 25px;
                    .el-input-number {
                        width: 100%;
                    }
                }
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    span,
                    p {
                        font-size: 14px;
                        color: #666;
                        width: 80px;
                    }
                    p {
                        width: 120px;
                    }
                }
            }
        }
    }
}
.half-time {
    display: flex;
    align-items: center;
    span {
        color: #dcdfe6;
        margin: 0px 10px;
    }
    .el-date-editor {
        width: 120px;
    }
}
</style>