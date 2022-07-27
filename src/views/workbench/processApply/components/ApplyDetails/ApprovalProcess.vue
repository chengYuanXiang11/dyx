<template>
    <!-- 审批流程 -->
    <div>
        <!-- 为满足条件下审核流程基本展示 -->
        <!-- 审核人 -->
        <el-form-item
            class="examine-label"
            label="审批情况 "
            :style="{ marginBootom: '8px' }"
        >
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in dataValue"
                    :style="{ height: `${liHeight(item.properties)}px` }"
                    :key="index"
                    icon="el-icon-edit"
                    :timestamp="
                        item.properties.title === '发起人'
                            ? '发起'
                            : item.properties.title
                    "
                >
                    <i class="el-icon-info examin-icon"></i>
                    <template slot="dot">
                        <div class="examine">
                            <div
                                v-for="(user, userIndex) in item.properties
                                    .menbers"
                                :key="userIndex"
                                class="Approver-warp"
                            >
                                <el-avatar class="Approver" size="large">
                                    <template #default>
                                        <div>
                                            {{
                                                user.user_name.substring(
                                                    user.user_name.length - 2
                                                )
                                            }}
                                        </div>
                                    </template>
                                </el-avatar>
                                <span
                                    :class="
                                        user.user_name.length > 4
                                            ? 'Approver-font-true'
                                            : 'Approver-font-false'
                                    "
                                >
                                    {{ user.user_name }}
                                </span>
                            </div>
                        </div>
                    </template>
                </el-timeline-item>
                <span class="flowEnd">流程结束</span>
            </el-timeline>
        </el-form-item>
              <!-- 表单 -->
                <el-col :span="16" v-if="type===1">
                    <el-form label-suffix=":" :model="formData">
                        <el-form-item label="审批结果">
                            <el-radio-group v-model="formData.status">
                                <el-radio-button type="success" label="1"
                                    >同意</el-radio-button
                                >
                                <el-radio-button label="0"
                                    >拒绝</el-radio-button
                                >
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审批备注">
                            <el-input
                                type="textarea"
                                v-model="formData.remarks"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
    </div>
</template>
<script>
export default {
    name: "ExamineState",
    data() {
        return {
            approverShowDialog: false,
            CCShowDialog: false,
            datas: [],
            users: [],
            index: 0,
            userIndex: 0,
            //li 基本高度
            liHeights: 60,
        };
    },
    props: {
        examineData: {
            type: Array,
            default: () => [],
        },
        formData:{
            type:Object,
            default:()=>{}
        },
        type:{
            type:Number,
            default:0
        }
    },
    created() {},
    computed: {
        dataValue: {
            get() {
                return this.examineData;
            },
            set(val) {
                console.log(val);
                this.$emit("update:examineData", val);
            },
        },
    },
    methods: {
        liHeight(val) {
            // return
            let value = val.menbers;
            if (value) {
                return value.length == 0
                    ? this.liHeights
                    : Math.ceil(value.length / 3) * this.liHeights;
            } else {
                return 10;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.examine {
    display: flex;
    flex-flow: row wrap;
    margin-left: 20px;
    margin-top: 20px;
}
//图标
.examin-icon {
    position: absolute;
    left: 0px;
    top: -12px;
}
.Approver-warp {
    display: flex;
    flex-flow: column wrap;
    width: 60px;
    margin-left: 10px;

    //     cursor: pointer;
    //     width: 40px;
    //     height: 40px;
    //     border-radius: 50%;
    //     color: #010621;
    //     margin-right: 10px;
    //     position: relative;
    //     ::v-deep .el-badge__content.is-fixed {
    //         width: 15px;
    //         height: 15px;
    //         border-radius: 50%;
    //         padding: 0;
    //         margin: 0;
    //         top: 6px;
    //         left: 11px;
    //         background: #333333;
    //         text-align: center;
    //         vertical-align: middle;
    //         border: none;
    //         cursor: pointer;
    //     }
    .Approver {
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        // background: #048790;
        color: #fff;
        border: 1px solid #e6e6e6;
        cursor: pointer;
    }
}
::v-deep .el-timeline-item__dot {
    align-items: flex-start;
    flex-flow: column;
}
::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: inline-block;
}
::v-deep .el-timeline-item {
    margin-bottom: 20px;
}
.Approver-font-true,
.Approver-font-false {
    transform: scale(0.8);
    text-align: start;
    position: relative;
    left: -5px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 12px;
    white-space: nowrap;
    &::before {
        text-align: center;
        position: absolute;
        color: #fff;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        line-height: 18px;
    }
}
.Approver-font-true {
    &::before {
        content: "√";
        left: 20px;
        top: -40px;
        background: #048790;
    }
}
.Approver-font-false {
    &::before {
        content: "X";
        left: 20px;
        top: -40px;
        background: red;
    }
}
::v-deep .el-form-item__content {
    margin-top: 50px;
}
</style>
