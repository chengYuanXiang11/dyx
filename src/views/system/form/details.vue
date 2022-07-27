<template>
    <div class="app-container">
        <div v-loading="loading" v-if="!nonexistence">
            <div class="title">
                <span>{{ flowDetails.name }}-流程设置</span>
                <el-button type="text" size="mini" @click="viewDialog"
                    >预览</el-button
                >
                <el-button type="text" size="mini" @click="editFlow"
                    >编辑</el-button
                >
            </div>
            <WorkFlow ref="WorkFlow" v-model="nodeConfig"></WorkFlow>
            <div class="footer" v-if="$route.query.type == 'edit'">
                <el-button>取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </div>
        <div class="nonexistence" v-else>
            <el-empty description="当前流程尚未配置，是否配置？">
                <el-button type="primary" @click="settingFlow">配置</el-button>
            </el-empty>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :width="`${type == 'fitment' ? '800' : '600'}px`"
            title="查看表单"
        >
            <form-create
                v-model="fApi"
                :rule="rule"
                :option="option"
            ></form-create>
        </el-dialog>
        <el-dialog :visible.sync="showAddDialog" width="800px" title="配置流程">
            <el-form
                :model="addForm"
                ref="addFlowForm"
                label-width="100px"
                :rules="addRules"
            >
                <el-form-item label="表单名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="表单编码">
                    <el-input v-model="addForm.code" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属分组" prop="group_id">
                    <el-select v-model="addForm.group_id">
                        <el-option
                            v-for="group in flowGroupList"
                            :key="group.id"
                            :value="group.id"
                            :label="group.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表单数据">
                    <json-viewer
                        :value="addForm.formData"
                        v-if="dialogType == 'add'"
                    ></json-viewer>
                    <vue-json-editor
                        v-else
                        v-model="addForm.formData"
                        :showBtns="false"
                        mode="code"
                        lang="zh"
                    />
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="showAddDialog = false">取消</el-button>
                    <el-button type="primary" @click="addFlowSubmit"
                        >确定</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
// nodeConfig: {
//                 // 节点类型：start：发起人，approver：审批人，route：抄送人，condition：条件
//                 type: "start",
//                 // 内容显示文案
//                 content: "所有人",
//                 // 节点ID
//                 nodeId: this.genID(),
//                 // 发起人配置
//                 properties: {
//                     title: "发起人",
//                     initiator: [],
//                 },
// childNode: {
//     type: "condition",
//     conditions: [
//         {
//             content: "请设置条件",
//             properties: {
//                 priority: 0,
//                 isDefault: false,
//                 initiator: null,
//                 conditions: [],
//             },
//         },
//         {
//             content: "其他情况进入此流程",
//             properties: {
//                 priority: 1,
//                 isDefault: true,
//                 initiator: null,
//                 conditions: [],
//             },
//         },
//     ],
// },
// childNode: {
//     type: "approver",
//     content: "张三,李四",
//     nodeId: this.genID(),
//     prevId: this.genID(),
//     properties: {
//         title: "审批人",
//         assigneeType: "user",
//         approvers: [],
//         // true 会签，false 或签
//         counterSign: true,
//         // 滞流时间
//         residenceTime: 0,
//     },
//     childNode:{
//         type:"copy",
//         content: "王五，赵六",
//         nodeId: this.genID(),
//         prevId: this.genID(),
//         properties:{
//             title: "抄送人",
//             menbers:[],
//             // 是否允许发起人自选
//             userOptional:true,
//         }
//     }
// },
// }
import FormDialog from "./components/form/index";
import WorkFlow from "./components/workflow/index";
import { utils } from "./components/workflow/utils/mixin";

import config from "./components/form/config.js";
import {
    updateFlow,
    flowDetails,
    getFlowGroup,
    addFlow,
} from "@/request/api/system/form";
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true);
export default {
    name: "FormList",
    mixins: [utils],
    data() {
        return {
            fApi: {},
            rule: [],
            option: {
                global: {
                    "*": {
                        props: {
                            disabled: true,
                        },
                    },
                },
                submitBtn: {
                    show: false,
                },
            },
            dialogVisible: false,
            loading: false,
            // 页面类型：view查看，edit编辑
            type: this.$route.query.type,
            // 流程编码
            code: this.$route.query.code,
            id: this.$route.query.id,

            // 流程是否配置过
            nonexistence: false,
            // 默认流程节点数据
            defaultNodeConfig: {
                // 节点类型：start：发起人，approver：审批人，route：抄送人，condition：条件
                type: "start",
                // 内容显示文案
                content: "所有人",
                // 节点ID
                nodeId: this.genID(),
                // 发起人配置
                properties: {
                    title: "发起人",
                    initiator: [],
                },
            },
            // 流程弹窗
            showAddDialog: false,
            // 弹窗模式
            dialogType: "add",
            // 初始化流程表单
            addForm: {},
            // 初始化流程表单验证
            addRules: {
                name: [
                    {
                        required: true,
                        message: "请输入流程名称",
                        trigger: "blur",
                    },
                ],
                group_id: [
                    {
                        required: true,
                        message: "请选择考勤分组",
                        trigger: "change",
                    },
                ],
            },
            // 流程数据
            nodeConfig: {},
            // 分组列表
            flowGroupList: [],
            // 流程详情
            flowDetails: {},
        };
    },
    components: {
        FormDialog,
        WorkFlow,
        JsonViewer,
        vueJsonEditor,
    },
    methods: {
        viewDialog() {
            this.dialogVisible = true;
            let config = JSON.parse(this.flowDetails.config);
            this.rule = config.formData;
        },
        checkAllNode(processData) {
            let valid = true;
            const loop = (node, callback, parent) => {
                !this.checkNode(node, parent) && callback();
                if (node.childNode) loop(node.childNode, callback, parent);
                if (!isEmptyArray(node.conditionNodes)) {
                    node.conditionNodes.forEach((n) => loop(n, callback, node));
                }
            };
            loop(processData, () => (valid = false));
            return valid;
        },
        checkNode(node, parent) {
            // 抄送人应该可以默认自选
            let valid = true;
            const props = node.properties;
            if (this.isStartNode(node) && !props.initiator) {
                valid = false;
            }
            console.log(valid)
            if (this.isConditionNode(node)) {
                let empty_num = 0;
                node.conditions.map((item) => {
                    let node_item = item.properties;
                    if (
                        !node_item.initiator &&
                        node_item.conditions.length <= 0 &&
                        !node_item.isDefault
                    ) {
                        empty_num++;
                    }
                });
                valid = empty_num == 0;
            }
            console.log(node,props)
            if (
                this.isApproverNode(node) &&
                props.assigneeType == "user" &&
                props.menbers.length <= 0
            ) {
                valid = false;
            }
            return valid;
        },
        isConditionNode(node) {
            return node && node.type === "condition";
        },
        isCopyNode(node) {
            return node && node.type === "copy";
        },
        isStartNode(node) {
            return node && node.type === "start";
        },
        isApproverNode(node) {
            return node && node.type === "approver";
        },
        editFlow() {
            this.getFlowGroup(() => {
                this.dialogType = "edit";
                let config = JSON.parse(this.flowDetails.config);
                this.addForm = {
                    name: this.flowDetails.name,
                    code: this.flowDetails.code,
                    group_id: Number(this.flowDetails.group_id),
                    formData: config.formData,
                };
            });
        },
        getFlowGroup(callback) {
            getFlowGroup({
                pageNum: "all",
            }).then((res) => {
                this.flowGroupList = res.data;
                this.showAddDialog = true;
                callback && callback();
            });
        },
        // 设置流程
        settingFlow() {
            this.getFlowGroup(() => {
                let resp = config[this.code];
                this.addForm = {
                    code: this.code,
                    formData: resp,
                };
                this.dialogType = "add";
            });
        },
        addFlowSubmit() {
            this.$refs["addFlowForm"].validate((valid) => {
                if (valid) {
                    let data = {
                        name: this.addForm.name,
                        code: this.addForm.code,
                        group_id: this.addForm.group_id,
                        version: 0,
                        deploy_time: "string",
                        icon: "",
                        status: 1,
                        sort: 0,
                        is_delete: 0,
                    };
                    if (this.dialogType == "add") {
                        data.config = JSON.stringify({
                            formData: this.addForm.formData,
                            processData: this.defaultNodeConfig,
                        });
                        addFlow(data).then((res) => {
                            this.$toast("初始化流程成功！");
                            this.showAddDialog = false;
                            this.getFlowDetails();
                        });
                    } else {
                        if (this.checkAllNode(this.nodeConfig)) {
                            data.config = JSON.stringify({
                                formData: this.addForm.formData,
                                processData: this.nodeConfig,
                            });
                            updateFlow(this.flowDetails.id, data).then(
                                (res) => {
                                    this.$toast("编辑流程成功！");
                                    this.showAddDialog = false;
                                    this.getFlowDetails();
                                }
                            );
                        } else {
                            this.$toastError("请将节点条件设置完整！");
                        }
                    }
                }
            });
        },
        getFlowDetails() {
            this.loading = true;
            flowDetails(this.id)
                .then((res) => {
                    let r = res.data;
                    if (r) {
                        let config = JSON.parse(r.config);
                        this.nodeConfig = config.processData;
                        this.flowDetails = r;
                        this.$store.dispatch(
                            "flow/commit_fields",
                            config.formData
                        );
                    } else {
                        this.nonexistence = true;
                    }
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        submit() {
            let data = {
                name: this.flowDetails.name,
                code: this.flowDetails.code,
                group_id: this.flowDetails.group_id,
                version: 0,
                deploy_time: "string",
                icon: "",
                status: 1,
                sort: 0,
                is_delete: 0,
            };
            if (this.checkAllNode(this.nodeConfig)) {
                let config = JSON.parse(this.flowDetails.config);
                data.config = JSON.stringify({
                    formData: config.formData,
                    processData: this.nodeConfig,
                });
                updateFlow(this.flowDetails.id, data).then((res) => {
                    this.$toast("编辑流程成功！");
                    this.showAddDialog = false;
                    this.getFlowDetails();
                });
            } else {
                this.$toastError("请将节点条件设置完整！");
            }
        },
    },
    created() {
        this.getFlowDetails();
    },
};
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
        font-size: 16px;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.9);
        margin-right: 20px;
    }
    .el-button {
        padding: 0;
    }
}
.footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
