<template>
    <!-- 审批流程 -->
    <div>
        <!-- 为满足条件下审核流程基本展示 -->
        <!-- 审核人 -->
        <div>审批流程</div>
        <el-timeline v-if="loading">
            <el-timeline-item
                v-for="(item, i) in dataValue"
                :key="i"
                type="primary "
                size="normal"
                color="hex"
                :class="nodeLine(i, item)"
                :timestamp="item.properties.tableTitle"
                placement="top"
            >
                <span class="explain-font">
                    {{ item.properties.tableExplain }}
                </span>
                <div class="examine">
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
                        <!-- 节点状态 -->
                        <span
                            :class="
                                nodeStatus(
                                    user.result,
                                    user.finished,
                                    item.type
                                )
                            "
                        >
                            <span class="user-font"> {{ user.user_name }}</span>
                        </span>
                    </div>
                </div>
            </el-timeline-item>
            <el-timeline-item
                timestamp="结束"
                type="primary "
                placement="top"
                :class="`${
                    this.examineData.length <= nodeIndex
                        ? 'Approver-Point-true'
                        : ''
                }`"
            >
            </el-timeline-item>
        </el-timeline>
        {{ this.examineData.length }}{{ this.nodeIndex }}
        <!-- </el-form-item> -->
        <!-- 表单 -->
        <!-- type===0 代办事情未完成，需要表单 -->
    </div>
</template>
<script>
import { listByExamineInst } from "@/request/api/system/flow.js";

export default {
    name: "ExamineState",
    data() {
        return {
            approverShowDialog: false,
            CCShowDialog: false,
            datas: [],
            users: [],
            userIndex: 0,
            //li 基本高度
            liHeights: 60,
            node_status: [],
            loading: false,
            nodeIndex: this.indexValue,
        };
    },
    props: {
        examineData: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: "0",
        },
        indexValue: {
            type: Number,
            default: 0,
        },
        node_name: {
            type: String,
            default: "",
        },
        examineinst_id: {
            type: String,
            default: "",
        },
    },
    created() {
        this.getList();
    },

    computed: {
        dataValue: {
            get() {
                return this.examineData;
            },
            set(val) {
                this.$emit("update:examineData", val);
            },
        },
    },
    methods: {
        getList() {
            listByExamineInst(this.examineinst_id).then((res) => {
                this.node_status = res.data;
                this.examineData.forEach((v, index) => {
                    // 如果是审核
                    if (v.properties.counterSign !== undefined) {
                        let node_status_data = this.node_status[index - 1];
                        if (node_status_data) {
                            this.$set(
                                v.properties,
                                "menbers",
                                this.node_status[index - 1].undos
                            );
                            // 如果是会签
                            if (v.properties.counterSign) {
                                this.$set(
                                    v.properties,
                                    "tableExplain",
                                    "需要所有人同意"
                                );
                                // 只有到了该环节之后node_status才会有数据

                                //如果已经开始走节点数据
                                if (
                                    node_status_data.undos.some(
                                        (value) => value.result === 3
                                    )
                                ) {
                                    //会签拒绝
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "已拒绝"
                                    );
                                    this.nodeIndex += 1;

                                    return;
                                } else if (
                                    node_status_data.undos.some(
                                        (value) => value.result === 0
                                    )
                                ) {
                                    //会签未完成
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "待审核"
                                    );
                                    return;
                                } else {
                                    //会签通过
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "已通过"
                                    );
                                    this.nodeIndex = this.nodeIndex + 1;
                                    return;
                                }
                            } else if (!v.properties.counterSign) {
                                this.$set(
                                    v.properties,
                                    "tableExplain",
                                    "一人同意即可"
                                );

                                //如果是或签
                                if (
                                    node_status_data.undos.some(
                                        (value) => value.result === 3
                                    )
                                ) {
                                    // 或签拒绝
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "已拒绝"
                                    );
                                    this.nodeIndex += 1;

                                    return;
                                } else if (
                                    node_status_data.undos.every(
                                        (value) => value.result === 0
                                    )
                                ) {
                                    //或签未完成
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "待审核"
                                    );

                                    return;
                                } else {
                                    // 或签通过
                                    this.$set(
                                        v.properties,
                                        "tableTitle",
                                        "已通过"
                                    );

                                    return;
                                }
                            }
                        } else {
                            this.$set(v.properties, "tableTitle", "待审核");
                            if (v.properties.counterSign) {
                                this.$set(
                                    v.properties,
                                    "tableExplain",
                                    "需要所有人同意"
                                );
                            } else {
                                this.$set(
                                    v.properties,
                                    "tableExplain",
                                    "一人同意即可"
                                );
                            }
                        }
                    } else {
                        if (v.type === "start") {
                            this.$set(v.properties, "tableTitle", "发起");
                        } else if (v.type === "copy") {
                            if (index <= this.nodeIndex) {
                                this.$set(v.properties, "tableTitle", "已抄送");
                                this.nodeIndex += 1;
                            } else {
                                this.$set(v.properties, "tableTitle", "待抄送");
                            }
                        }
                        // 发起，抄送直接不处理
                        // this.index += 1;
                    }
                    // 如果不是审核环节,直接跳过
                });
            }).finally((error) => {
                   this.loading = true;
                });
        },
        // 渲染流程点和线的进度
        nodeLine(i) {
            let classNode = "";
            if (i <= this.nodeIndex) {
                //点
                classNode += "Approver-Point-true";
            }
            //线
            if (i < this.nodeIndex) {
                classNode += "   Approver-Line-true";
            }
            if (
                (this.node_name == "已通过" || this.node_name == "已拒绝") &&
                i == this.nodeIndex
            ) {
                classNode += "   Approver-Line-true";
            }
            return classNode;
        },
        // 添加节点状态等待，通过,拒绝
        nodeStatus(result, finished, type) {
            if (type === "approver") {
                switch (result) {
                    case 0:
                        return "";
                    case 2:
                        if (finished === 1) {
                            return "Approver-font-true";
                        } else {
                            return "";
                        }

                    case 3:
                        if (finished === 1) {
                            return "Approver-font-false";
                        }
                }
            } else {
                return "";
            }
        },
    },
};
</script>
<style lang="scss" scoped>
// 流程标题
::v-deep .el-timeline-item__timestamp {
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(1, 6, 33, 0.9);
    line-height: 22px;
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
// 流程线完成到哪里
.Approver-Line-true {
    ::v-deep .el-timeline-item__tail {
        border-left: 2px solid #048790;
    }
}
// 流程节点完成位置
.Approver-Point-true {
    ::v-deep .el-timeline-item__node--primary {
        background-color: #048790;
    }
}
.examine {
    display: flex;
    flex-flow: row wrap;
    // margin-left: 20px;
    // margin-top: 20px;
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
    justify-content: center;
    align-items: center;

    margin-left: 10px;
    .user-font {
        display: inline-block;
        width: 4em;
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.9);
        line-height: 20px;
        overflow: hidden;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }
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
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 50%;
        // background: #048790;
        color: #fff;
        border: 1px solid #e6e6e6;
        cursor: pointer;
    }
}
// ::v-deep .el-timeline-item__dot {
//     align-items: flex-start;
//     flex-flow: column;
// }
// ::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
//     display: inline-block;
// }
// ::v-deep .el-timeline-item {
//     margin-bottom: 20px;
// }
.Approver-font-true,
.Approver-font-false {
    text-align: start;
    position: relative;
    left: -5px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    // line-height: 12px;
    // font-size: 12px;
    white-space: nowrap;
    &::before {
        text-align: center;
        position: absolute;
        color: #fff;
        transform: scale(0.8);

        border-radius: 50%;
        width: 15px;
        height: 15px;
        left: 35px;
        top: -40px;
        line-height: 18px;
    }
}
.Approver-font-true {
    &::before {
        content: "√";
        background: #048790;
    }
}
.Approver-font-false {
    &::before {
        content: "X";
        background: red;
    }
}
::v-deep .el-timeline-item__node--primary {
    background-color: #dfe4ed;
}
// }

// .CC {
//     border-radius: 50%;
//     width: 32px;
//     font-size: 22px;
//     color: #048790;
//     border: 1px solid #048790;
//     position: relative;
//     height: 32px;
//     ::v-deep i {
//         position: absolute;
//         left: 50%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//     }
// }
// .flowEnd {
//     position: absolute;
//     bottom: -15px;
//     left: 10px;
//     font-size: 14px;
//     font-weight: 400;
//     color: rgba(1, 6, 33, 0.9);
//     margin-right: 10 px;
// }
// // 时间线的连接线样式
// ::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
//     display: block;
//     width: 1px;
//     height: 60px;
//     background: rgba(0, 1, 17, 0.15);
//     border: none;
// }

// .item {
//     position: relative;
//     vertical-align: middle;
//     width: 15px;
//     display: inline-block;
//     left: 24px;
//     top: -66px;
//     height: 15px;
//     background: #000;
//     border-radius: 50%;
//     ::v-deep .el-badge__content {
//         background-color: transparent;
//         border: none;
//         border-radius: 10px;
//         color: #ffffff;
//         display: inline-block;
//         font-size: 12px;
//         height: 18px;
//         line-height: 18px;
//         padding: 0 6px;
//         text-align: center;
//         position: absolute;
//         white-space: nowrap;
//         border: lemonchiffon;
//         left: -4px;
//     }
// }

// ::v-deep .el-form-item__content {
//     margin-top: 50px;
// }
</style>
