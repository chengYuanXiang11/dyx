<template>
    <div class="add-node-btn-box">
        <div class="add-node-btn">
            <el-popover placement="right-start" v-model="visible">
                <div class="add-node-popover-body">
                    <a
                        class="add-node-popover-item approver"
                        @click.stop="addType('approver')"
                    >
                        <div class="item-wrapper">
                            <svg-icon icon-class="examine" />
                        </div>
                        <p>审批人</p>
                    </a>
                    <a
                        class="add-node-popover-item notifier"
                        @click="addType('copy')"
                    >
                        <div class="item-wrapper">
                            <svg-icon icon-class="Ccpeople" />
                        </div>
                        <p>抄送人</p>
                    </a>
                    <a
                        class="add-node-popover-item condition"
                        @click="addType('condition')"
                    >
                        <div class="item-wrapper">
                            <svg-icon icon-class="branch" />
                        </div>
                        <p>条件</p>
                    </a>
                </div>
                <button class="btn" type="button" slot="reference" v-if="!disabled">
                    <svg-icon icon-class="Plus" />
                </button>
            </el-popover>
        </div>
    </div>
</template>
<script>
import { utils } from "./utils/mixin";
export default {
    mixins: [utils],
    props: {
        value: {
            type: Object,
            default: () => {
                return {};
            },
        },
        nodeId: {
            type: String,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        value(newVal) {
            this.childNodeP = newVal;
        },
        childNodeP(newVal) {
            this.$emit("input", newVal);
        },
    },
    data() {
        return {
            visible: false,
            childNodeP: this.value,
        };
    },
    methods: {
        addType(type) {
            this.visible = false;
            let nodeId = this.genID();
            if(Object.keys(this.childNodeP).length > 0){
                this.childNodeP.prevId = nodeId;
            }
            let childNode = {
                    type,
                    nodeId: nodeId,
                    childNode: this.childNodeP,
                    prevId: this.nodeId,
                },
                data;
            if (type != "condition") {
                if (type == "approver") {
                    data = {
                        type: "approver",
                        content: "请设置审批人",
                        properties: {
                            title: "审批人",
                            assigneeType: "user",
                            menbers: [],
                            counterSign: true,
                            residenceTime: 0,
                        },
                    };
                } else if (type == "copy") {
                    data = {
                        content: "所有人",
                        properties: {
                            title: "抄送人",
                            menbers: [],
                            // 是否允许发起人自选
                            userOptional: true,
                        },
                    };
                }
            } else {
                data = {
                    conditions: [
                        {
                            content: "请设置条件",
                            prevId: childNode.nodeId,
                            nodeId: this.genID(),
                            properties: {
                                priority: 0,
                                isDefault: false,
                                initiator: null,
                                conditions: [],
                            },
                        },
                        {
                            content: "其他情况进入此流程",
                            prevId: childNode.nodeId,
                            nodeId: this.genID(),
                            properties: {
                                priority: 1,
                                isDefault: true,
                                initiator: null,
                                conditions: [],
                            },
                        },
                    ],
                };
            }
            childNode = Object.assign(childNode, data);
            this.childNodeP = childNode;
        },
    },
};
</script>