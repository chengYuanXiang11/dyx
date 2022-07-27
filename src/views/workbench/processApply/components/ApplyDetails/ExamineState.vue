<template>
    <!-- 审批流程 -->
    <div>
        <!-- 为满足条件下审核流程基本展示 -->
        <!-- 审核人 -->
        <div>审批流程</div>

        <el-timeline>
            <el-timeline-item
                v-for="(item, i) in dataValue"
                :key="i"
                type="primary "
                size="normal"
                color="hex"
                :class="`${i <= index ? 'Approver-Point-true' : ''}  ${
                    i < index ? 'Approver-Line-true' : ''
                }`"
                :timestamp="
                    nodeTitle(
                         i,index,
                        item.properties.title,
                        item.properties.menbers.length
                    )
                "
                placement="top"
            >
                <span class="explain-font">{{
                    nodeExplain(  item.properties.title,item.properties.counterSign)
                }}</span>
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
                        <span :class="nodeStatus(i, item)">
                            {{ user.user_name }}
                        </span>
                    </div>
                </div>
            </el-timeline-item>
            <el-timeline-item timestamp="结束" type="primary " placement="top">
            </el-timeline-item>
        </el-timeline>
        <!-- </el-form-item> -->
        <!-- 表单 -->
        <!-- type===0 代办事情未完成，需要表单 -->
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
        type: {
            type: String,
            default: "0",
        },
        node_id: {
            type: String,
            default: "",
        },
        index: {
            type: Number,
            default: "",
        },
        node_name:{
            type:String,
            default:""
        }
    },
    created() {
    },
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
        // 动态节点标题
        nodeTitle(i,index,title, length) {
            switch (title) {
                case "发起人":
                    return "发起";
                case "抄送人":
                    if(i<index){
                       return `已抄送${length}人`;
                    }else{
                        return "待抄送"
                    }
                case "审批人":
                    if(i===index){
                        return "审批(审批中)"
                    }else if(i<index){
                        return "审批已通过"
                    }else{
                        return "待审批"
                    }
                default:
                    break;
            }
        },
        //节点说明(会签---或签)
        nodeExplain(title,boolean) {
            if(title === '审批人')
            return boolean ? "需要所有人同意" : "一人同意即可";
        },
        // 添加节点状态等待，通过,拒绝
        nodeStatus(i, v) {
            // if(v) 如果不是审核,return
            if (this.index > i) {
                return "Approver-font-true";
            }
        },
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
// 流程线性完成到哪里
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
    // width: 60px;
    // height: 60px;

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
    transform: scale(0.8);
    text-align: start;
    position: relative;
    left: -5px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 12px;
    font-size: 12px;
    white-space: nowrap;
    &::before {
        text-align: center;
        position: absolute;
        color: #fff;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        left: 35px;
        top: -50px;
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
