<template>
    <div class="app-container">
        <div v-loading="loading">
            <div class="title">
                <span>{{ flowName }}-流程设置</span>
                <el-button type="text" size="mini" @click="dialogVisible = true"
                    >预览</el-button
                >
                <el-button type="text" size="mini" @click="addFlow"
                    >新增</el-button
                >
            </div>
            <WorkFlow
                ref="WorkFlow"
                v-model="nodeConfig"
                :disabled="type == 'view'"
            ></WorkFlow>
            <div class="footer">
                <el-button>取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :width="`${type == 'fitment' ? '800' : '600'}px`"
            title="查看表单"
        >
            <FormDialog :data="formData"></FormDialog>
        </el-dialog>
        <el-dialog :visible.sync="showAddDialog" width="800px" title="初始化">
            <el-form :model="addForm" ref="addFlowForm" label-width="100px" :rules="addRules">
                <el-form-item label="表单名称">
                    <el-input v-model="addForm.name" disabled></el-input>
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
                    <json-viewer :value="addForm.formData"></json-viewer>
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
import formData from "./components/form/form.js";
import FormDialog from "./components/form/index";
import WorkFlow from "./components/workflow/index";
import { utils } from "./components/workflow/utils/mixin";
import {
    updateFlow,
    flowDetails,
    getFlowGroup,
    addFlow,
} from "@/request/api/system/form";
import JsonViewer from "vue-json-viewer";
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true);
export default {
    name: "FormList",
    mixins: [utils],
    data() {
        return {
            showAddDialog: false,
            addForm: {},
            addRules: {
                group_id: [
                    {
                        required: true,
                        message: "请选择考勤分组",
                        trigger: "change",
                    },
                ],
            },
            formData: {},
            dialogVisible: false,
            type: this.$route.query.type,
            code: this.$route.query.code,
            loading: false,
            nodeConfig: {},
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
            flowName: "",
            flowId: null,
            flowGroupList: [],
        };
    },
    components: {
        FormDialog,
        WorkFlow,
        JsonViewer,
    },
    methods: {
        submit() {
            // if (this.checkAllNode(this.nodeConfig)) {
                let data = {
                    name: this.flowName,
                    code: this.code,
                    group_id: 1,
                    version: 0,
                    deploy_time: "string",
                    icon: "",
                    status: 1,
                    sort: 0,
                    is_delete: 0,
                };
                data.config = JSON.stringify({
                    // formData: this.formData,
                    formData: formData[this.code].formData,
                    processData: this.nodeConfig,
                });
                updateFlow(this.flowId, data).then((res) => {
                    this.$toast("编辑流程成功！");
                });
            // } else {
            //     this.$toastError("请将节点条件设置完整！");
            // }
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
            if (
                this.isApproverNode(node) &&
                props.assigneeType == "user" &&
                props.approvers.length <= 0
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
        getFlowDetails() {
            this.loading = true;
            flowDetails(this.code)
                .then((res) => {
                    let r = res.data.results[0];
                    let config = JSON.parse(r.config);
                    this.flowName = r.name;
                    this.flowId = r.id;
                    this.formData = config.formData;
                    this.nodeConfig = config.processData;
                    this.$store.dispatch(
                        "flow/commit_fields",
                        config.formData.fields
                    );
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        addFlow() {
            getFlowGroup({
                pageNum: "all",
            }).then((res) => {
                this.flowGroupList = res.data;
                let resp = formData[this.code];
                this.addForm = {
                    name: resp.name,
                    code: this.code,
                    formData: resp,
                };
                this.showAddDialog = true;
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
                    data.config = JSON.stringify({
                        formData: this.addForm.formData.formData,
                        processData: this.defaultNodeConfig,
                    });
                    addFlow(data).then((res) => {
                        this.$toast("初始化流程成功！");
                    });
                }
            });
        },
    },
    created() {
        this.getFlowDetails();
        // this.formData = formData[this.code].formData
        // console.log(this.formData)
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