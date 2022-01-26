<template>
    <div>
        <!-- 发起人、审批人、抄送人节点 -->
        <div class="node-wrap" v-if="nodeConfig.type != 'condition'">
            <div
                class="node-wrap-box"
                :class="nodeConfig.type == 'start' ? 'start-node ' : ''"
            >
                <div>
                    <div
                        class="title"
                        :style="`background: rgb(${formatBgColor(
                            nodeConfig.type
                        )});`"
                    >
                        <svg-icon
                            icon-class="Ccpeople"
                            v-show="nodeConfig.type == 'copy'"
                        />
                        <svg-icon
                            icon-class="examine"
                            v-show="nodeConfig.type == 'approver'"
                        />
                        <span class="name">{{
                            nodeConfig.properties
                                ? nodeConfig.properties.title
                                : ""
                        }}</span>
                        <svg-icon
                            v-if="!disabled"
                            icon-class="Close-Circle"
                            class="close"
                            v-show="nodeConfig.type != 'start'"
                            @click="delNode()"
                        />
                    </div>
                    <div class="content" @click="setPerson">
                        <div class="text">
                            {{ nodeConfig.content }}
                        </div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <addNode
                v-model="nodeConfig.childNode"
                :nodeId="nodeConfig.nodeId"
                :disabled="disabled"
            ></addNode>
        </div>
        <!-- 条件节点 -->
        <div class="branch-wrap" v-else>
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <button
                        class="add-branch"
                        @click="addConditions"
                        v-if="!disabled"
                    >
                        添加条件
                    </button>
                    <div
                        class="col-box"
                        v-for="(item, index) in nodeConfig.conditions"
                        :key="index"
                    >
                        <div class="condition-node">
                            <div class="condition-node-box">
                                <div
                                    class="auto-judge"
                                    @click="setCondition(index, item)"
                                >
                                    <div class="title-wrapper">
                                        <span class="editable-title">{{
                                            index + 1 ==
                                            nodeConfig.conditions.length
                                                ? "默认"
                                                : `条件${index + 1}`
                                        }}</span>
                                        <span
                                            class="priority-title"
                                            :class="{
                                                default:
                                                    index + 1 ==
                                                    nodeConfig.conditions
                                                        .length,
                                            }"
                                            >优先级{{ index + 1 }}</span
                                        >
                                        <svg-icon
                                            icon-class="Close-Circle"
                                            v-if="
                                                index + 1 <
                                                    nodeConfig.conditions
                                                        .length && !disabled
                                            "
                                            class="anticon anticon-close close"
                                            @click.stop="delTerm(index)"
                                        />
                                    </div>
                                    <div class="content">
                                        {{ item.content }}
                                    </div>
                                </div>
                                <addNode
                                    v-model="item.childNode"
                                    :nodeId="item.nodeId"
                                    :disabled="disabled"
                                ></addNode>
                            </div>
                        </div>
                        <nodeWrap
                            v-if="
                                item.childNode &&
                                Object.keys(item.childNode).length != 0
                            "
                            v-model="item.childNode"
                        ></nodeWrap>
                        <div
                            class="top-left-cover-line"
                            v-if="index == 0"
                        ></div>
                        <div
                            class="bottom-left-cover-line"
                            v-if="index == 0"
                        ></div>
                        <div
                            class="top-right-cover-line"
                            v-if="index == nodeConfig.conditions.length - 1"
                        ></div>
                        <div
                            class="bottom-right-cover-line"
                            v-if="index == nodeConfig.conditions.length - 1"
                        ></div>
                    </div>
                </div>
                <addNode
                    v-model="nodeConfig.childNode"
                    :nodeId="nodeConfig.nodeId"
                    :disabled="disabled"
                ></addNode>
            </div>
        </div>
        <!-- 子节点 -->
        <nodeWrap
            v-if="
                nodeConfig.childNode &&
                Object.keys(nodeConfig.childNode).length != 0
            "
            v-model="nodeConfig.childNode"
            :disabled="disabled"
        ></nodeWrap>
        <!-- 设置发起人弹窗 -->
        <SettingStartUser
            :show.sync="startUserConfig.show"
            :datas="startUserConfig.data"
            @confirm="getStartInfo"
        ></SettingStartUser>
        <!-- 设置审批人弹窗 -->
        <SettingapproverUser
            :show.sync="approverUserConfig.show"
            :datas="approverUserConfig.data"
            @confirm="getSpproverInfo"
        ></SettingapproverUser>
        <!-- 设置抄送人弹窗 -->
        <SettingCopyUser
            :show.sync="copyUserConfig.show"
            :datas="copyUserConfig.data"
            @confirm="getCopyInfo"
        ></SettingCopyUser>
        <!-- 条件弹窗 -->
        <el-drawer
            :append-to-body="true"
            title="设置条件"
            :visible.sync="conditionDrawer"
            direction="rtl"
            size="550px"
            @closed="conditionDrawerClose"
        >
            <div class="drawer-main">
                <div class="drawer-form">
                    <el-form
                        class="conditionForm"
                        ref="conditionForm"
                        :model="conditionForm"
                        :rules="rules"
                    >
                        <el-form-item>
                            <el-select v-model="conditionForm.type">
                                <el-option
                                    v-for="(item, idx) in form_fields"
                                    :key="idx"
                                    :value="item.field"
                                    :label="item.title"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 发起人条件 -->
                        <el-form-item
                            v-if="conditionForm.type == 'initiator'"
                            prop="initiator"
                        >
                            <div class="select-userAndDept">
                                <div class="left-content">
                                    <div class="tags-main">
                                        <el-tag
                                            v-for="deptItem in conditionForm
                                                .initiator.depts"
                                            :key="'dept' + deptItem.id"
                                            >{{ deptItem.deptName }}</el-tag
                                        >
                                        <el-tag
                                            type="info"
                                            v-for="userItem in conditionForm
                                                .initiator.users"
                                            :key="'user' + userItem.user_id"
                                            >{{ userItem.user_name }}</el-tag
                                        >
                                    </div>
                                    <span>共{{ totalSelect }}个</span>
                                </div>
                                <el-button
                                    type="primary"
                                    @click="conditionVisible = true"
                                    >选择</el-button
                                >
                            </div>
                        </el-form-item>
                        <!-- 假期类型 -->
                        <el-form-item
                            v-if="conditionForm.type == 'leaveType'"
                            prop="leaveType"
                        >
                            <HolidayTypes
                                v-model="conditionForm.leaveType"
                                ref="HolidayTypes"
                            ></HolidayTypes>
                        </el-form-item>
                        <!-- 数字类型 -->
                        <el-form-item
                            v-if="showCondition(conditionForm.type)"
                            prop="number"
                        >
                            <div class="rated-conditions">
                                <el-select v-model="conditionForm.operator">
                                    <el-option
                                        :value="ctem.value"
                                        :label="ctem.label"
                                        v-for="(ctem, idx) in compare"
                                        :key="idx"
                                    ></el-option>
                                </el-select>
                                <el-input-number
                                    v-model="conditionForm.number"
                                    :min="0"
                                    controls-position="right"
                                ></el-input-number>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="drawer-footer">
                    <el-button @click="conditionDrawer = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="settingCondition"
                        >确 定</el-button
                    >
                </div>
            </div>
        </el-drawer>
        <!-- 条件选人弹窗 -->
        <SelectUsersDialog
            :visible.sync="conditionVisible"
            :data="conditionForm.initiator"
            placeholder="请选择人员"
            @confirm="getConditionUsers"
        ></SelectUsersDialog>
    </div>
</template>
<script>
import addNode from "./addNode.vue";
import config from "./utils/config.js";
import HolidayTypes from "../form/module/holiday-types";
import SettingStartUser from "./module/settingStartUser";
import SettingapproverUser from "./module/settingApproverUser";
import SettingCopyUser from "./module/settingCopyUser";
import { mapGetters } from "vuex";
import { utils } from "./utils/mixin";
const compare = [
    {
        label: "等于",
        value: "equal",
    },
    {
        label: "不等于",
        value: "notEqual",
    },
    {
        label: "小于",
        value: "lesThan",
    },
    {
        label: "小于等于",
        value: "lesThanOrEqual",
    },
    {
        label: "大于",
        value: "greaterThan",
    },
    {
        label: "大于等于",
        value: "greaterThanOrEqual",
    },
];
let numTypes = ["leaveDuration"];
export default {
    mixins: [utils],
    name: "nodeWrap",
    components: {
        addNode,
        HolidayTypes,
        SettingStartUser,
        SettingapproverUser,
        SettingCopyUser,
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    computed: {
        ...mapGetters(["form_fields"]),
        totalSelect() {
            let { users, depts } = this.conditionForm.initiator;
            return users.length + depts.length;
        },
        showCondition() {
            return function (type) {
                let type_arr = ["leaveDuration", "overtime"];
                return type_arr.indexOf(type) != -1;
            };
        },
        disabled(){
            return this.$route.query.type == 'view'
        }
    },
    watch: {
        value(newVal) {
            this.nodeConfig = newVal;
        },
        nodeConfig(newVal) {
            this.$emit("input", newVal);
        },
    },
    data() {
        return {
            // 流程数据
            nodeConfig: this.value,
            // 发起人数据配置
            startUserConfig: {
                show: false,
                data: {},
            },
            // 审批人数据配置
            approverUserConfig: {
                show: false,
                data: {},
            },
            // 抄送人数据配置
            copyUserConfig: {
                show: false,
                data: {},
            },
            conditionsConfig: {
                data: [],
            },
            // 条件弹窗是否显示
            conditionDrawer: false,
            conditionVisible: false,
            conditionForm: {
                type: "initiator",
                initiator: {
                    users: [],
                    depts: [],
                },
                operator: "equal",
                number: 0,
            },
            compare: compare,
            rules: {
                initiator: [
                    {
                        required: true,
                        message: "请选择发起人",
                        trigger: "change",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value.users.length == 0 &&
                                value.depts.length == 0
                            ) {
                                callback(new Error("请选择发起人"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "change",
                    },
                ],
                leaveType: [
                    {
                        required: true,
                        message: "请选择请假类型",
                        trigger: "change",
                    },
                ],
                number: [
                    {
                        required: true,
                        message: "请输入请假时长",
                        trigger: "change",
                    },
                ],
            },
            config: config,
            formType: this.$route.query.type,
            conditionIndex: null,
        };
    },
    mounted() {},
    methods: {
        // 格式化背景颜色
        formatBgColor(type) {
            switch (type) {
                case "start":
                    return "87, 106, 149";
                case "approver":
                    return "189, 122, 70";
                case "copy":
                    return "4, 135, 144";
            }
        },
        formatUserAndDept(item){
            let users = [],depts = []
            item.map((el,index) => {
                el.hasOwnProperty("user_id") ? users.push(el) : depts.push(el)
            })
            return {
                users,
                depts
            }
        },
        // 设置发起人
        setPerson() {
            if(this.disabled){
                return false
            }
            let { type, content, properties } = this.nodeConfig;
            if (type == "start") {
                this.startUserConfig = {
                    show: true,
                    data: {
                        content,
                        type: properties.initiator.length <= 0 ? "1" : "2",
                        users: this.formatUserAndDept(properties.initiator),
                    },
                };
            } else if (type == "approver") {
                this.approverUserConfig = {
                    show: true,
                    data: {
                        content,
                        assigneeType: properties.assigneeType,
                        users: this.formatUserAndDept(properties.menbers),
                        counterSign: properties.counterSign,
                        residenceTime: properties.residenceTime,
                    },
                };
            } else if (type == "copy") {
                this.copyUserConfig = {
                    show: true,
                    data: {
                        content,
                        menbers: this.formatUserAndDept(properties.menbers),
                        userOptional: properties.userOptional,
                    },
                };
            }
        },
        // 发起人确定事件
        getStartInfo(e) {
            this.nodeConfig.content = e.content;
            this.nodeConfig.properties.initiator = e.users;
        },
        // 审批人确定事件
        getSpproverInfo(e) {
            this.nodeConfig.content = e.content;
            this.nodeConfig.properties.menbers = e.users;
            this.nodeConfig.properties.counterSign = e.counterSign;
            this.nodeConfig.properties.assigneeType = e.assigneeType;
            this.nodeConfig.properties.residenceTime = e.residenceTime;
        },
        // 抄送人确定事件
        getCopyInfo(e) {
            this.nodeConfig.content = e.content;
            this.nodeConfig.properties.menbers = e.menbers;
            this.nodeConfig.properties.userOptional = e.userOptional;
        },
        // 条件设置发起人确定事件
        getConditionUsers(e) {
            this.conditionVisible = false;
            this.conditionForm.initiator = e;
        },
        // 删除当前节点
        delNode() {
            this.$confirm("是否删除当前节点?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.nodeConfig = this.nodeConfig.childNode;
                    this.$message({
                        message: "删除成功！",
                        type: "success",
                    });
                })
                .catch(() => {});
        },
        // 添加条件
        addConditions() {
            let index = this.nodeConfig.conditions.length - 1;
            this.nodeConfig.conditions.splice(index, 0, {
                content: "请设置条件",
                prevId: this.nodeConfig.nodeId,
                nodeId: this.genID(),
                properties: {
                    priority: index,
                    isDefault: false,
                    initiator: null,
                    conditions: [],
                },
            });
            this.nodeConfig.conditions.forEach( ( c, i ) => c.properties.priority = i )
        },
        // 删除条件
        delTerm(index) {
            this.$confirm("此操作将永久删除该条件分支, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    if (this.nodeConfig.conditions.length <= 2) {
                        this.nodeConfig = this.nodeConfig.childNode;
                    } else {
                        this.nodeConfig.conditions.splice(index, 1);
                        this.nodeConfig.conditions.forEach( ( c, i ) => c.properties.priority = i )
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        // 条件弹窗
        setCondition(index, item) {
            if(this.disabled){
                return false
            }
            let { properties } = item;
            if (properties.isDefault) {
                return false;
            }
            this.conditionIndex = index;
            let data = {};

            if (properties.initiator) {
                data = {
                    type: "initiator",
                    initiator: properties.initiator,
                };
            } else {
                let condition = properties.conditions[0]
                    ? properties.conditions[0]
                    : [];
                if (numTypes.indexOf(condition.field) != -1) {
                    data = {
                        type: condition.field,
                        operator: condition.conditionValue.type,
                        number: condition.conditionValue.value,
                    };
                } else{
                    data = {
                        type: condition.field,
                    };
                    data[condition.field] = condition.conditionValue
                }
            }
            this.conditionForm = Object.assign({}, this.conditionForm, data);
            this.conditionDrawer = true;
        },
        formatCondition(item) {
            let userList = item.users.map((user) => {
                return user.user_name;
            });
            let deptList = item.depts.map((dept) => {
                return dept.deptName;
            });
            let namelist = userList.concat(deptList).join(",");
            return namelist;
        },
        settingCondition() {
            this.$refs["conditionForm"].validate((valid) => {
                if (valid) {
                    let { type } = this.conditionForm;
                    let conditions =
                        this.nodeConfig.conditions[this.conditionIndex];
                    let contentTitle = this.form_fields.find(
                        (v) => v.field == type
                    ).title;
                    if (type == "initiator") {
                        conditions.properties.conditions = [];
                        conditions.properties.initiator =
                            this.conditionForm.initiator;
                        conditions.content = `[${contentTitle}：${this.formatCondition(
                            this.conditionForm.initiator
                        )}]`;
                    } else {
                        conditions.properties.initiator = null;
                        if (numTypes.indexOf(type) == -1) {
                            conditions.content = `[${contentTitle} 等于 ${this.conditionForm[type]}]`;
                            conditions.properties.conditions = [
                                {
                                    conditionValue: this.conditionForm[type],
                                    field: type,
                                },
                            ];
                        } else {
                            let compareTitle = compare.find(v => v.value == this.conditionForm.operator).label;
                            conditions.content = `[${contentTitle} ${compareTitle} ${this.conditionForm.number}]`;
                            conditions.properties.conditions = [
                                {
                                    conditionValue: {
                                        type: this.conditionForm.operator,
                                        value: this.conditionForm.number,
                                    },
                                    field: type,
                                },
                            ];
                        }
                    }
                    this.nodeConfig.conditions[this.conditionIndex] =
                        conditions;
                    this.conditionDrawer = false;
                }
            });
        },
        resetForm(value) {
            this.conditionForm = {
                type: value,
            };
            if (value == "initiator") {
                this.conditionForm.initiator = {
                    users: [],
                    depts: [],
                };
            } else if (value == "leaveType") {
                this.conditionForm.leaveType = {};
            } else if (value == "leaveTime") {
                this.conditionForm.expression = config.compare.default;
                this.conditionForm.num = 0;
            }
            this.conditionForm = Object.assign({}, this.conditionForm);
            this.$refs["conditionForm"].clearValidate();
        },
        conditionDrawerClose() {
            this.conditionForm = {
                type: "initiator",
                initiator: {
                    users: [],
                    depts: [],
                },
            };
            this.$refs["conditionForm"].clearValidate();
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
    margin-bottom: 0;
    span {
        font-size: 16px;
        color: #010621;
    }
}
.drawer-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    .drawer-form {
        flex: 1;
        padding: 20px 20px 0;
        overflow-y: auto;
        .conditionForm {
            .el-form-item {
                margin-bottom: 10px;
            }
            .el-select,
            .el-input-number {
                width: 100%;
            }
            .rated-conditions {
                display: flex;
                .el-select {
                    width: 150px;
                    margin-right: 20px;
                }
            }
        }
    }
    .drawer-footer {
        display: flex;
        justify-content: flex-end;
        padding: 20px;
        border-top: solid 1px #ddd;
    }
    .residenceTime {
        display: flex;
        align-items: center;
    }
    .residenceTime .el-input-number {
        width: 150px;
        margin: 0 20px;
    }
}
.select-userAndDept {
    display: flex;
    align-items: center;
    .left-content {
        border: solid 1px #ddd;
        border-right: none;
        flex: 1;
        display: flex;
        align-items: center;
        border-radius: 4px 0 0 4px;
        padding: 0 10px;
        .tags-main {
            flex: 1;
            overflow: hidden;
            height: 38px;
            .el-tag {
                margin-right: 10px;
            }
        }
    }
    .el-button {
        border-radius: 0 4px 4px 0;
        height: 38px;
    }
}
// .error_tip {
//     position: absolute;
//     top: 0px;
//     right: 0px;
//     transform: translate(150%, 0px);
//     font-size: 24px;
// }
// .add-node-popover-body {
//     display: flex;
// }
// .promoter_content {
//     padding: 0 20px;
// }
// .condition_content .el-button,
// .copyer_content .el-button,
// .approver_self_select .el-button,
// .promoter_content .el-button,
// .approver_content .el-button {
//     margin-bottom: 20px;
// }
// .el-form {
//     margin-top: 20px;
// }
// .el-form-item {
//     margin-bottom: 10px;
// }
// .residenceTime {
//     display: flex;
//     align-items: center;
// }
// .residenceTime .el-input-number {
//     width: 150px;
//     margin: 0 20px;
// }
// .promoter_content p {
//     color: #000000;
// }
// .promoter_person .el-dialog__body {
//     padding: 10px 20px 14px 20px;
// }
// .person_body {
//     border: 1px solid #f5f5f5;
//     height: 500px;
// }
// .person_tree {
//     padding: 10px 12px 0 8px;
//     width: 280px;
//     height: 100%;
//     border-right: 1px solid #f5f5f5;
// }
// .person_tree input {
//     padding-left: 22px;
//     width: 210px;
//     height: 30px;
//     font-size: 12px;
//     border-radius: 2px;
//     border: 1px solid #d5dadf;
//     background: url(~@/assets/images/workflow/list_search.png) no-repeat 10px
//         center;
//     background-size: 14px 14px;
//     margin-bottom: 14px;
// }
// .tree_nav span {
//     display: inline-block;
//     padding-right: 10px;
//     margin-right: 5px;
//     max-width: 6em;
//     color: #38adff;
//     font-size: 12px;
//     cursor: pointer;
//     background: url(~@/assets/images/workflow/jiaojiao.png) no-repeat right
//         center;
// }
// .tree_nav span:last-of-type {
//     background: none;
// }
// .person_tree ul,
// .has_selected ul {
//     height: 420px;
//     overflow-y: auto;
// }
// .person_tree li {
//     padding: 5px 0;
// }
// .person_tree li i {
//     float: right;
//     padding-left: 24px;
//     padding-right: 10px;
//     color: #3195f8;
//     font-size: 12px;
//     cursor: pointer;
//     background: url(~@/assets/images/workflow/next_level_active.png) no-repeat
//         10px center;
//     border-left: 1px solid rgb(238, 238, 238);
// }
// .person_tree li a.active + i {
//     color: rgb(197, 197, 197);
//     background-image: url(~@/assets/images/workflow/next_level.png);
//     pointer-events: none;
// }
// .person_tree img {
//     width: 14px;
//     vertical-align: middle;
//     margin-right: 5px;
// }
// .has_selected {
//     width: 276px;
//     height: 100%;
//     font-size: 12px;
// }
// .has_selected ul {
//     height: 460px;
// }
// .has_selected p {
//     padding-left: 19px;
//     padding-right: 20px;
//     line-height: 37px;
//     border-bottom: 1px solid #f2f2f2;
// }
// .has_selected p a {
//     float: right;
// }
// .has_selected ul li {
//     margin: 11px 26px 13px 19px;
//     line-height: 17px;
// }
// .has_selected li span {
//     vertical-align: middle;
// }
// .has_selected li img:first-of-type {
//     width: 14px;
//     vertical-align: middle;
//     margin-right: 5px;
// }
// .has_selected li img:last-of-type {
//     float: right;
//     margin-top: 2px;
//     width: 14px;
// }
// el-radio-group {
//     padding: 20px 0;
// }
// .approver_content {
//     padding-bottom: 10px;
//     border-bottom: 1px solid #f2f2f2;
// }
// .approver_content .el-radio,
// .approver_some .el-radio,
// .approver_self_select .el-radio {
//     width: 27%;
//     margin-bottom: 20px;
// }
// .copyer_content .el-checkbox {
//     margin-bottom: 20px;
// }
// .el-checkbox__label {
//     font-size: 12px;
// }
// .condition_content,
// .copyer_content,
// .approver_self_select,
// .approver_manager,
// .approver_content,
// .approver_some {
//     padding: 20px 20px 0;
// }
// .approver_manager p:first-of-type,
// .approver_some p {
//     line-height: 19px;
//     font-size: 14px;
//     margin-bottom: 14px;
// }

// .approver_manager p {
//     line-height: 32px;
// }
// .approver_manager select {
//     width: 420px;
//     height: 32px;
//     background: rgba(255, 255, 255, 1);
//     border-radius: 4px;
//     border: 1px solid rgba(217, 217, 217, 1);
// }
// .approver_manager p.tip {
//     margin: 10px 0 22px 0;
//     font-size: 12px;
//     line-height: 16px;
//     color: #f8642d;
// }
// .approver_self {
//     padding: 28px 20px;
// }
// .selected_list {
//     margin-bottom: 20px;
//     line-height: 30px;
// }
// .selected_list span {
//     margin-right: 10px;
//     padding: 3px 6px 3px 9px;
//     line-height: 12px;
//     white-space: nowrap;
//     border-radius: 2px;
//     border: 1px solid rgba(220, 220, 220, 1);
// }
// .selected_list img {
//     margin-left: 5px;
//     width: 7px;
//     height: 7px;
//     cursor: pointer;
// }
// .approver_self_select h3 {
//     margin: 5px 0 20px;
//     font-size: 14px;
//     font-weight: bold;
//     line-height: 19px;
// }
// .condition_copyer .el-drawer__body .priority_level {
//     position: absolute;
//     top: 11px;
//     right: 30px;
//     width: 100px;
//     height: 32px;
//     background: rgba(255, 255, 255, 1);
//     border-radius: 4px;
//     border: 1px solid rgba(217, 217, 217, 1);
// }
// .condition_content p.tip {
//     margin: 20px 0;
//     width: 510px;
//     text-indent: 17px;
//     line-height: 45px;
//     background: rgba(241, 249, 255, 1);
//     border: 1px solid rgba(64, 163, 247, 1);
//     color: #46a6fe;
//     font-size: 14px;
// }
// .condition_content ul {
//     max-height: 500px;
//     overflow-y: scroll;
//     margin-bottom: 20px;
// }
// .condition_content li > span {
//     float: left;
//     margin-right: 8px;
//     width: 70px;
//     line-height: 32px;
//     text-align: right;
// }
// .condition_content li > div {
//     display: inline-block;
//     width: 370px;
// }
// .condition_content li:not(:last-child) > div > p {
//     margin-bottom: 20px;
// }
// .condition_content li > div > p:not(:last-child) {
//     margin-bottom: 10px;
// }
// .condition_content li > a {
//     float: right;
//     margin-right: 10px;
//     margin-top: 7px;
// }
// .condition_content li select,
// .condition_content li input {
//     width: 100%;
//     height: 32px;
//     background: rgba(255, 255, 255, 1);
//     border-radius: 4px;
//     border: 1px solid rgba(217, 217, 217, 1);
// }
// .condition_content li select + input {
//     width: 260px;
// }
// .condition_content li select {
//     margin-right: 10px;
//     width: 100px;
// }
// .condition_content li p.selected_list {
//     padding-left: 10px;
//     border-radius: 4px;
//     min-height: 32px;
//     border: 1px solid rgba(217, 217, 217, 1);
// }
// .condition_content li p.check_box {
//     line-height: 32px;
// }
// .condition_list .el-dialog__body {
//     padding: 16px 26px;
// }
// .condition_list p {
//     color: #666666;
//     margin-bottom: 10px;
// }
// .condition_list p.check_box {
//     margin-bottom: 0;
//     line-height: 36px;
// }
// .demo-drawer__footer {
//     padding-left: 120px;
//     margin-top: 50px;
// }
</style>
