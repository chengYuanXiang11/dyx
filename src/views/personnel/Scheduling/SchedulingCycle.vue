<template>
    <div>
        <!-- 设置排班周期 -->
        <el-dialog
            title="设置排班周期"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            @open="formStart"
            class="fil-dialog"
        >
            <el-scrollbar style="height: 100%" class="fil-scrollbar">
                <el-form
                    ref="ruleForm"
                    :model="form"
                    status-icon
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <!-- :label-position="top" -->
                    <el-form-item label="周期名称" prop="name">
                        <el-input
                            v-model="form.name"
                            placeholder="请输入名称,不超过15个字符"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="周期天数">
                        <label
                            @mouseleave="changeControls"
                            @mouseenter="changeControls"
                        >
                            <el-input-number
                                v-model="form.Days"
                                controls-position="right"
                                :min="1"
                                :max="31"
                                class="numberSize"
                                :controls="numberControls"
                                placeholder="请输入天数"
                                @change="changeForm"
                            ></el-input-number
                            ><span class="cycleSize"
                                >最大周期为31天</span
                            ></label
                        >
                    </el-form-item>
                    <el-form-item
                        :label="`第${day}天`"
                        prop="age"
                        v-for="day in form.Days"
                        :key="day"
                    >
                        <el-select
                            v-model="form.cycle[day - 1]"
                            ref="selectFrom"
                            placeholder="请选择"
                            @change="changeSelect($event, day)"
                            class="fontColor"
                            value-key="id"
                        >
                            <el-option
                                v-for="item in scheduling.existingShift.data"
                                :key="item.id"
                                :value="item"
                                :label="itemHtml(form.cycle[day - 1])"
                            >
                                <div class="el-select-item">
                                    {{ itemHtml(item) }}
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="submitForm('ruleForm')"
                            >确认</el-button
                        >
                        <el-button @click="dialogVisible = false"
                            >取消</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import ShiftDialog from "@/views/components/shiftDialog";
import { mapState } from "vuex";
export default {
    name: "SchedulingCycle",
    components: {
        ShiftDialog,
    },
    data() {
        var validateName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入排班周期名称"));
            } else {
                if (value.length >= 15) {
                    callback(new Error("请注意名称需要小于15位"));
                } else {
                    callback();
                }
            }
        };
        return {
            form: {},
            numberControls: false,

            // 周期名称验证

            rules: {
                name: [{ validator: validateName, trigger: "blur" }],
            },
        };
    },
    computed: {
        ...mapState({
            scheduling: (state) => state.scheduling,
        }),
        dialogVisible: {
            get() {
                return this.CycleVisible;
            },
            set(val) {
                this.$emit("update:CycleVisible", val);
            },
        },
    },
    props: {
        CycleVisible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleClose(done) {
            done();
        },
        // 打开弹窗时候数据更新
        formStart() {
            this.form = JSON.parse(JSON.stringify(this.scheduling.ruleForm));
            for (let i = 0; i < this.form.Days; i++) {
                if (this.form.cycle[i] === undefined) {
                    this.form.cycle[i] = {
                        id: -1,
                        working_shift_name: "休息",
                        color: "#d9d9d9",
                        first_working_time: "休息",
                        new: true,
                    };
                }
            }
        },
        // select展示
        itemHtml(value) {
            if (value.id === -1) {
                return `${value.working_shift_name}`;
            } else {
                return `${value.working_shift_name}     ${value.first_working_time||''} ${value.first_working_time?'-':''} ${value.first_offduty_time||''} ${value.second_working_time?';':''} ${value.second_working_time||''} ${value.second_working_time?'-':''} ${value.second_offduty_time||''} ${value.third_working_time?';':''} ${value.third_working_time||''} ${value.third_working_time?'-':""}  ${value.third_offduty_time||''}${value.third_offduty_time?';':''} `;
            }
        },
        // 确认添加班次
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.commit("scheduling/setRuleForm", this.form);
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        // 添加数据（默认）
        changeForm(newIndex, oldIndex) {
            // 加
            if (newIndex > oldIndex) {
                this.$set(this.form.cycle, newIndex - 1, {
                    id: -1,
                    working_shift_name: "休息",
                    color: "#d9d9d9",
                    first_working_time: "休息",
                    new: true,
                });
            } else {
                // 减
                this.form.cycle.splice(oldIndex, 1);
            }

            //   this.$refs.selectFrom
        },
        changeSelect(v, index) {
            //         Vue.directive('focus',{
            // bind:function(el){
            // el.focus()
            // },
            // updated:function(el){
            // el.focus()
            // },
            // inserted:function(el){
            // el.focus()                           D
            // },
            // })
            this.$set(this.form.cycle, index - 1, v);
        },
        changeControls() {
            this.numberControls = !this.numberControls;
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    width: 640px;
}
@media screen and (max-width: 767px) {
    ::v-deep .el-dialog {
        min-width: 150px;
    }
}
.fil-scrollbar {
    width: 100%;
    height: 431px;
    border-radius: 2px;
    box-sizing: border-box;
    .numberSize {
        width: 135px;
        height: 32px;
        margin-right: 10px;
    }
}
::v-deep .el-input__inner:hover {
    border-color: #1890ff;
}
.fontColor {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.9);
    background-color: #fff !important;
    width: 404px;
}
::v-deep .el-select-dropdown__item:hover {
    background-color: #fff;
}
::v-deep .fil-scrollbar .numberSize {
    height: auto;
}
.el-select-item {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.9);
}
</style>
