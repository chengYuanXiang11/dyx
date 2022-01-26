<template>
    <!-- 流程详情 -->
    <el-scrollbar style="height: 100%">
        <!-- 申请的详情信息 -->
        <el-row class="warp-description">
            <!-- 左界面 -->

            <el-col class="left-description" v-loading="!show">
                <!-- 申请人信息 -->
                <el-col class="col-description">
                    <el-descriptions :column="1" border>
                        <!-- 标题头 -->
                        <template #title>
                            <div>
                                {{ data.title }}

                                <el-tag
                                    type="success"
                                    v-if="node_name === '已通过'"
                                    >已通过</el-tag
                                >
                                <el-tag
                                    type="danger"
                                    v-else-if="node_name === '已拒绝'"
                                    >已拒绝</el-tag
                                >
                                <el-tag v-else type="warning">审批中</el-tag>
                            </div>
                        </template>
                        <el-descriptions-item label="申请人">{{
                            data.creator_name
                        }}</el-descriptions-item>
                        <el-descriptions-item label="部门">{{
                            data.dept_belong_id
                        }}</el-descriptions-item>
                        <el-descriptions-item label="职务" :span="2"
                            >苏州市</el-descriptions-item
                        >
                        <el-descriptions-item label="申请日期" :span="2">{{
                            data.create_datetime
                        }}</el-descriptions-item>
                    </el-descriptions>
                    <BusinessLeft
                        v-if="show"
                        :flow_var="flow_var"
                        :config="config"
                        :group="group"
                        :type="type"
                    ></BusinessLeft>
                </el-col>
                <!-- 流程信息 -->
                <el-col :span="16" v-if="this.query.type == 1">
                    <el-form
                        label-suffix=":"
                        :model="formData"
                        :rules="rules"
                        ref="formData"
                    >
                        <el-form-item label="审批结果" prop="result">
                            <el-radio-group
                                v-model="formData.result"
                                @change="resultChange"
                            >
                                <el-radio-button type="success" label="2"
                                    >同意</el-radio-button
                                >
                                <el-radio-button label="3"
                                    >拒绝</el-radio-button
                                >
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审批备注" prop="suggest">
                            <el-input
                                type="textarea"
                                v-model="formData.suggest"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <!-- 审批情况 -->

            <el-col class="right-description" v-loading="!show" >
                <!-- <div>申请流程</div> -->
                <el-form>
                    <ExamineState
                        v-if="show"
                        :indexValue.sync="index"
                        :examineData.sync="examineData"
                        :node_name="node_name"
                        :type="query.type"
                        :examineinst_id="query.examine_instance_id"
                    ></ExamineState>
                </el-form>
            </el-col>
        </el-row>
        <!-- 提交 -->
        <div class="form-submit" v-if="this.query.type == 1">
            <el-button type="primary" @click="submit('formData')"
                >提交</el-button
            >
            <el-button @click="cancel('formData')">取消</el-button>
        </div>
    </el-scrollbar>
</template>
<script>
import {
    getOneTable,
    SubmitAgency,
} from "@/request/api/system/flow.js";
import ExamineState from "../Examine/ExamineState.vue";
import BusinessLeft from "./BusinessLeft.vue";
// 审批备注验证

export default {
    name: "ApplyDetails",
    data() {
        var validateRemarks = (rule, value, callback) => {
            if (this.formData.result == 3 && value === "") {
                callback(new Error("请输入审批备注"));
            } else {
                callback();
            }
        };
        return {
            //申请信息
            data: {},
            // 具体信息
            config: [],
            flow_var: {},
            process: true,
            // 审核人和抄送人
            examineData: [],
            formData: {
                result: 2,
                suggest: "",
            },
            query: {},
            // 当前流程具体进行到的阶段
            index: 0,
            show: false,
            // 待抄送
            node_name: "",
            // 验证
            rules: {
                result: [
                    {
                        required: true,
                        message: "请选择审核结果",
                        trigger: "blur",
                    },
                ],
                suggest: [
                    {
                        validator: validateRemarks,
                        trigger: "change",
                    },
                ],
            },
            // 出差申请的数据是组的形式
            group: false,
            // 申请类型
            type: "",
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    components: { ExamineState, BusinessLeft },
    methods: {
        resultChange(v) {
            // console.log(v);
        },
        getList() {
            this.query = this.$route.query;
            this.show = false;
            this.index = 0;
            this.data = [];
            getOneTable(
                this.query.examine_id,
                this.query.examine_instance_id
            ).then((res) => {
                // 获取有效数据
                this.data = res.data.results[0];
                this.type = this.data.examine_name;
                // 获取表单数据
                this.flow_var = JSON.parse(this.data.flow_var);
                // if(Object.keys(this.flow_var).includes())
                if (Object.keys(this.flow_var).includes("value0")) {
                    this.group = true;
                }
                // 获取总流程信息数据
                this.examineData = JSON.parse(this.data.node_list);

                // 计算流程进行到的节点

                let node_id = this.data.node_id;
                // console.log(node_id)
                if(node_id===''){
                    this.index = this.examineData.length
                }else{
                      this.index = this.examineData.findIndex(
                    (v) => v.nodeId === node_id
                );
                }

                // 流程数据添加发起人
                this.examineData[0].properties.menbers = [];
                this.examineData[0].properties.menbers[0] = {
                    user_id: this.data.creator,
                    user_name: this.data.creator_name,
                };
                // 当前抄送是否完成
                this.node_name = this.data.node_name;
                if (this.node_name === "已拒绝") {
                    this.examineData.splice(this.index + 1);
                }
                // 获取表单label
                this.config = JSON.parse(this.data.examine_config)
                    .formData.map((v) => {
                        if (v.validate !== undefined) {
                            return {
                                field: v.field,
                                // 去除:特殊字符
                                title: v.title.replace(/[':;'；：]/g, ""),
                            };
                        }
                    })
                    .filter((v) => {
                        return v !== undefined;
                    });
            }).finally((error) => {
                     this.show = true;
                });
        },

        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    SubmitAgency(this.query.id, {
                        result: Number(this.formData.result),
                        suggest: this.formData.suggest,
                    }).then((res) => {
                        this.$message.success("提交成功");
                        this.$refs[formName].resetFields();
                        this.$router.back();
                    })
                } else {
                    return false;
                }
            });
        },
        cancel(formName) {
            this.$refs[formName].resetFields();
            this.$router.back();
        },
    },
};
</script>
<style lang="scss" scoped>
.warp-description {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    box-sizing: border-box;
    // height: 714px;
    .left-description {
        width: 750px;
        display: flex;
        flex-flow: column nowrap;
        padding: 20px;
        background-color: #fff;
        //左右分割
        border: 5px solid #f6f6f6;
        .col-description {
            margin-bottom: 40px;
            // 描述表头宽度
            ::v-deep .el-descriptions-item__label.is-bordered-label {
                width: 200px;
            }
        }
    }
    .right-description {
        padding: 20px 0px 20px 20px;
        background-color: #fff;
        //左右分割
        border: 5px solid #f6f6f6;
    }
}
.form-submit {
    flex: 1;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
}
</style>
