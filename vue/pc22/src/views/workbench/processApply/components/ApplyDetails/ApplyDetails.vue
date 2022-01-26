<template>
    <el-scrollbar style="height: 100%">
        <!-- 申请的详情信息 -->
        <el-row class="warp-description">
            <!-- 左界面 -->
            <el-col class="left-description">
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
                                <el-tag type="warning">审批中</el-tag>
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
                    ></BusinessLeft>

                    <!-- <el-descriptions
                        :column="1"
                        border
                        v-for="(item, index) in config"
                        :key="index"
                    >
                        <el-descriptions-item
                            v-if="item.validate == undefined"
                            :label="`${item.title}${
                                item !== undefined
                                    ? item.title.includes('时长')
                                        ? '(小时)'
                                        : ''
                                    : ''
                            }`"
                        >
                            {{ flow_var[item.field] }}
                        </el-descriptions-item>
                    </el-descriptions> -->
                </el-col>
                <!-- 流程信息 -->
                <el-col :span="16" v-if="this.query.type == 0">
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
            </el-col>
            <!-- 审批情况 -->
            <el-col class="right-description">
                <!-- <div>申请流程</div> -->
                <el-form>
                    <ExamineState
                        :examineData.sync="examineData"
                        :type="query.type"
                        :node_id="node_id"
                        :index="Number(index)"
                        :node_name="node_name"
                    ></ExamineState>
                </el-form>
            </el-col>
        </el-row>
        <!-- 提交 -->
        <div class="form-submit">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </el-scrollbar>
</template>
<script>
import { getOneTable,SubmitAgency } from "@/request/api/system/flow.js";
import ExamineState from "./ExamineState.vue";
import BusinessLeft from "./BusinessLeft.vue";
export default {
    name: "ApplyDetails",
    data() {
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
                status: "0",
                remarks: "",
            },
            query: {},
            // 当前流程进行到的id
            node_id: "",
            // 当前流程具体进行到的阶段
            index: "",
            show:false,
            // 待抄送
            node_name: "",
        };
    },
    watch: {
        $route: {
            handler() {
                //获取申请详情
                this.query = this.$route.query;
                if (!this.query.examine_id) return;
                getOneTable(this.query.examine_id, this.query.id).then(
                    (res) => {
                        // 获取有效数据
                        this.data = res.data.results[0];
                        // 获取当前流程进行到的nodeId(用于计算流程进行到的节点)
                        this.node_id = this.data.node_id;
                        // 获取表单数据
                        this.flow_var = JSON.parse(this.data.flow_var);
                        console.log(this.flow_var);
                        // 获取流程信息数据
                        this.show = true
                        this.examineData = JSON.parse(this.data.node_list);
                        // 流程数据添加发起人
                        this.examineData[0].properties.menbers = [];
                        this.examineData[0].properties.menbers[0] = {
                            user_id: this.data.creator,
                            user_name: this.data.creator_name,
                        };
                        // 计算流程进行到的节点
                        this.index = this.examineData.findIndex(
                            (v) => v.nodeId === this.data.node_id
                        );
                        // 当前抄送是否完成
                        this.node_name = this.data.node_name;
                        // 获取表单label
                        this.config = JSON.parse(this.data.examine_config)
                            .formData.map((v) => {
                                if (v.validate !== undefined) {
                                    return {
                                        field: v.field,
                                        // 去除:特殊字符
                                        title: v.title.replace(
                                            /[':;'；：]/g,
                                            ""
                                        ),
                                    };
                                }
                            })
                            .filter((v) => {
                                return v !== undefined;
                            });
                        console.log(this.config);
                    }
                );
            },
            deep: true,
            immediate: true,
        },
    },
    components: { ExamineState, BusinessLeft },
    created() {
        console.log("d");
    },
    methods: {
        // 处理审核
        auditData(v) {
            v.forEacg((value) => {
                let prop = value.properties;
                // 如果走审核流程
                if (prop.title === "审核人") {
                    // 如果走会签流程
                    if (prop.counterSign) {
                        // 待添加字段(待解决,等接口)
                        // let status = prop.menbers.every(v=>v.xxx)
                        // 如果该流程审批完成不做操作
                        // if(status){
                        //     return
                        // }else{
                        // if(正在走流程){
                        // 标记为走流程
                        // }
                        //标记拒绝人
                        // 删除后面的所有流程,直接结束
                        // }
                    } else if (prop.counterSign === false) {
                        //走或签
                        // let status = prop.menbers.some(v=>)
                        // if(status){
                        //如果通过，不做操作
                        //     return
                        // }else{
                        //标记拒绝人
                        // 删除后面的所有流程,直接结束
                        // }
                    }
                }
            });
        },
        submit() {
            SubmitAgency(this.query.id,{"result":2,"suggest":"提交审批"}).then(res=>{
                console.log(res)
            })
        },
        cancel() {},
    },
};
</script>
<style lang="scss" scoped>
.warp-description {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    box-sizing: border-box;
    min-width: 1184px;
    height: 714px;
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
