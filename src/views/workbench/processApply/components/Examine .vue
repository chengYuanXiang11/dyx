<template>
    <!-- 审批流程 -->
    <div>
        <!-- 为满足条件下审核流程基本展示 -->
        <el-form-item label="审批流程 " class="examine-label" v-show="!process">
            <span>必填信息填写完整后，将显示审批流程</span>
        </el-form-item>
        <!-- 审核人 -->
        <el-form-item
            class="examine-label"
            v-show="process"
            label="审批流程 "
            :style="{ marginLeft: '8px' }"
        >
            <el-timeline v-for="(item, index) in dataValue" :key="index">
                <el-timeline-item>
                    <template slot="dot">
                        <span class="examine">
                            {{
                                item.properties.title === "发起人"
                                    ? "发起"
                                    : item.properties.title
                            }}
                        </span>
                        <SelectUsersDialog
                            :visible.sync="approverShowDialog"
                            :data="datas"
                            :users="users"
                            model="user"
                            :multiple="true"
                            placeholder="请选择人员"
                            @confirm="approverGetDatas"
                        ></SelectUsersDialog>

                        <div
                            v-for="(user, userIndex) in item.properties.menbers"
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
                                value="一"
                                class="item"
                                v-if="Modifiable(item.properties.userOptional)"
                                @click.native="deleteUser(index, userIndex)"
                            >
                            </el-badge>

                            <span class="Approver-font">
                                {{ user.user_name }}
                            </span>
                        </div>
                        <!-- 添加按钮在满足一定条件下才会展示 -->
                        <el-button
                            v-if="Modifiable(item.properties.userOptional)"
                            class="CC"
                            :circle="true"
                            icon="el-icon-plus"
                            @click="approverSelectUsers(index, userIndex)"
                        ></el-button>
                    </template>
                </el-timeline-item>
            </el-timeline>
            <span class="flowEnd"  v-show="process">流程结束</span>
        </el-form-item>
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
.examine,
.ccName {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.9);
    line-height: 22px;
    margin-right: 10px;
}
.ccName {
    margin-left: 13px;
}
.examine::before {
    content: "*";
    color: #ff4d4f;
    margin-right: 4px;
}
.lastItem {
    margin-top: 45px;
    ::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
        display: none;
    }
}
.Approver-warp {
    cursor: pointer;
    width: 40px;
    height: 40px;
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
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #048790;
        color: #fff;
        border: 1px solid #e6e6e6;
        cursor: pointer;
    }
    .Approver-font {
        position: absolute;
        top: 50px;
        width: 50px;
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

.CC {
    border-radius: 50%;
    width: 32px;
    font-size: 22px;
    color: #048790;
    border: 1px solid #048790;
    position: relative;
    height: 32px;
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
// 时间线的连接线样式
::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: block;
    width: 1px;
    height: 60px;
    background: rgba(0, 1, 17, 0.15);
    border: none;
}

.item {
    position: relative;
    vertical-align: middle;
    width: 15px;
    display: inline-block;
    left: 24px;
    top: -66px;
    height: 15px;
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
        left: -4px;
    }
}

// 临时
.el-timeline {
    margin-bottom: 80px;
}
</style>
