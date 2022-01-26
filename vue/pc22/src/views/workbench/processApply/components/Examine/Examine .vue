<template>
    <!-- 审批流程 -->
    <div>
        <!-- 为满足条件下审核流程基本展示 -->
        <div class="tips" v-show="!process">
            <div class="tips-title">审批流程:</div>
            <span class="tips-font">必填信息填写完整后，将显示审批流程</span>
        </div>
        <!-- 审核人 -->
        <div v-show="process">
            <div class="show-tips-title">审批流程</div>
            <div class="examine-label" :style="{ marginLeft: '8px' }">
                <el-timeline>
                    <el-timeline-item
                        v-for="(item, index) in dataValue"
                        :key="index"
                    >
                        <!-- class="examine" -->
                        <div class="title-font">
                            {{
                                item.properties.title === "发起人"
                                    ? "发起"
                                    : item.properties.title
                            }}
                            <div class="explain-font">
                                {{
                                    nodeExplain(
                                        item.properties.title,
                                        item.properties.counterSign
                                    )
                                }}
                            </div>
                        </div>
                        <SelectUsersDialog
                            :visible.sync="approverShowDialog"
                            :data="datas"
                            :users="users"
                            model="user"
                            :multiple="true"
                            placeholder="请选择人员"
                            @confirm="approverGetDatas"
                        ></SelectUsersDialog>
                        <div class="Approvers">
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
                                <!-- // 是否可以修改 -->
                                <el-badge
                                    value="x"
                                    class="item"
                                    v-if="
                                        Modifiable(item.properties.userOptional)
                                    "
                                    @click.native="deleteUser(index, userIndex)"
                                >
                                </el-badge>

                                <span class="Approver-font">
                                    {{ user.user_name }}
                                </span>
                            </div>
                            <el-button
                                v-if="Modifiable(item.properties.userOptional)"
                                class="CC"
                                :circle="true"
                                icon="el-icon-plus"
                                @click="approverSelectUsers(index, userIndex)"
                            ></el-button>
                        </div>

                        <!-- 添加按钮在满足一定条件下才会展示 -->
                    </el-timeline-item>
                    <el-timeline-item class="title-font">
                        流程结束
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Examine",
    data() {
        return {
            approverShowDialog: false,
            CCShowDialog: false,
            datas: [],
            users: [],
            index: 0,
            userIndex: 0,
        };
    },
    props: {
        process: {
            type: Boolean,
            default: false,
        },
        examineData: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        // 选人
        approverGetDatas(e, close) {
            this.$set(this.dataValue[this.index].properties, "menbers", e);
            this.datas = [];
            this.index = 0;
            this.userIndex = 0;
            close();
        },
        // 弹窗
        approverSelectUsers(index, userIndex) {
            let arr = this.dataValue[index].properties.menbers;
            arr = arr === undefined ? [] : arr;
            this.datas = arr;
            this.index = index;
            this.userIndex = userIndex;
            this.approverShowDialog = true;
        },

        // 点击删除抄送人
        deleteUser(index, userIndex) {
            this.dataValue[index].properties.menbers.splice(userIndex, 1);
        },
        nodeExplain(title, boolean) {
            if (title === "审批人")
                return boolean ? "需要所有人同意" : "一人同意即可";
        },
    },
    computed: {
        // 是否可以修改抄送和审核
        Modifiable() {
            return function (v) {
                return v === true;
            };
        },
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
};
</script>
<style lang="scss" scoped>
.tips {
    .tips-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(1, 6, 33, 0.9);
    }
    .tips-font {
        padding-left: 2em;
        font-size: 14px;
        opacity: 0.6;
    }
}
.show-tips-title {
    width: 96px;
    height: 32px;
    font-size: 24px;
    font-weight: 500;
    color: rgba(1, 6, 33, 0.9);
    line-height: 32px;
    display: inline-block;
    margin-bottom: 20px;
}
.title-font {
    font-size: 14px;
    font-weight: 500;
    color: rgba(1, 6, 33, 0.9);
    line-height: 30px;
}
//流程提示
.explain-font {
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #010621;
    line-height: 20px;
    opacity: 0.5;
}
.Approvers {
    display: flex;
    justify-content: flex-start;
    .Approver-warp {
        cursor: pointer;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        // width: 40px;
        // height: 40px;
        border-radius: 50%;
        color: #010621;
        margin-right: 10px;
        position: relative;
        ::v-deep .el-badge__content.is-fixed {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            padding: 0;
            margin: 0;
            top: 6px;
            left: 11px;
            background: #333333;
            text-align: center;
            vertical-align: middle;
            border: none;
            cursor: pointer;
        }
        .Approver {
            // width: 40px;
            // height: 40px;
            border-radius: 50%;
            background: #048790;
            color: #fff;
            border: 1px solid #e6e6e6;
            cursor: pointer;
            justify-content: center;
        }
        .Approver-font {
            position: relative;
            top: 5px;
            // width: 50px;
            left: 0px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(1, 6, 33, 0.55);
            line-height: 12px;
            white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
        }
    }
}

.CC {
    border-radius: 50%;
    width: 40px;
    font-size: 22px;
    color: #048790;
    border: 1px solid #048790;
    position: relative;
    height: 40px;
    top: 0px;
    // left: 10px;
    ::v-deep i {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
.flowEnd {
    position: absolute;
    bottom: -15px;
    left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.9);
    margin-right: 10 px;
}

// 删除按钮
.item {
    position: absolute;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    display: inline-block;
    top: -1px;
    right: 5px;
    background: #000;
    border-radius: 50%;
    ::v-deep .el-badge__content {
        background-color: transparent;
        border: none;
        border-radius: 10px;
        color: #ffffff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        position: absolute;
        white-space: nowrap;
        border: lemonchiffon;
        left: -3px;
        top: -3px;
    }
}

// 临时
.el-timeline {
    margin-bottom: 80px;
}
</style>
