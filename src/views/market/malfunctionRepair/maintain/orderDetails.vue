<template>
    <div class="app-container">
        <div v-loading="loading">
            <div class="steps-box">
                <div class="step-title">
                    <div class="orderInfo">订单信息:</div>
                    <el-tag
                        :type="
                            ruleForm.repair_status == 1 ? 'warning' : 'success'
                        "
                        >{{
                            ruleForm.repair_status == 1 ? "待完成" : "已完成"
                        }}</el-tag
                    >
                    <div>{{ ruleForm.ticketcode }}</div>
                </div>
                <el-steps :active="Number(ruleForm.repair_status) + 1">
                    <el-step title="下单时间">
                        <template slot="description">
                            {{ ruleForm.create_datetime }}
                            <div>
                                <div class="step-label">预约时间</div>
                                <div>{{ ruleForm.pre_time }}</div>
                            </div>
                        </template>
                    </el-step>
                    <el-step
                        title="预计上门时间"
                        :description="ruleForm.pre_order_time"
                    ></el-step>
                    <el-step
                        title="完成时间"
                        :description="ruleForm.finish_time"
                    ></el-step>
                </el-steps>
            </div>

            <div class="middle-box">
                <el-row :gutter="10" style="margin: 20px 0">
                    <el-col :span="16">
                        <el-descriptions :column="3" title="报修信息">
                            <el-descriptions-item label="商户名称">{{
                                ruleForm.shop_manage
                            }}</el-descriptions-item>
                            <el-descriptions-item label="报修人">{{
                                ruleForm.proposer
                            }}</el-descriptions-item>
                            <el-descriptions-item label="联系电话">{{
                                ruleForm.proposer_phone
                            }}</el-descriptions-item>
                            <el-descriptions-item
                                label="下单时间"
                                v-if="pageType == 'wancheng'"
                                >{{
                                    ruleForm.create_datetime
                                }}</el-descriptions-item
                            >
                            <el-descriptions-item
                                label="预约时间"
                                v-if="pageType == 'wancheng'"
                                >{{ ruleForm.pre_time }}</el-descriptions-item
                            >
                            <el-descriptions-item label="报修内容">{{
                                ruleForm.content
                            }}</el-descriptions-item>
                            <el-descriptions-item label="报修地址" :span="3">{{
                                ruleForm.address
                            }}</el-descriptions-item>
                            <el-descriptions-item label="报修图片" :span="3">
                                <div v-if="pre_picture.length > 0">
                                    <el-image
                                        style="width: 148px; height: 148px"
                                        v-for="(m, i) in pre_picture"
                                        :key="i"
                                        :src="m"
                                        :preview-src-list="pre_picture"
                                    >
                                    </el-image>
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="16" v-if="pageType == 'view'">
                        <el-descriptions title="维修信息" :column="3">
                            <el-descriptions-item label="维修人">{{
                                ruleForm.repairer
                            }}</el-descriptions-item>
                            <el-descriptions-item label="联系电话">{{
                                ruleForm.repair_phone
                            }}</el-descriptions-item>
                            <el-descriptions-item label="故障原因">{{
                                ruleForm.result
                            }}</el-descriptions-item>
                            <el-descriptions-item label="维修前" :span="3">
                                <div v-if="before_repair.length > 0">
                                    <el-image
                                        style="width: 148px; height: 148px"
                                        v-for="(m, i) in before_repair"
                                        :key="i"
                                        :src="m"
                                        :preview-src-list="before_repair"
                                    >
                                    </el-image>
                                </div>
                            </el-descriptions-item>
                            <el-descriptions-item label="维修后" :span="3">
                                <div v-if="after_repair.length > 0">
                                    <el-image
                                        style="width: 148px; height: 148px"
                                        v-for="(m, i) in after_repair"
                                        :key="i"
                                        :src="m"
                                        :preview-src-list="after_repair"
                                    >
                                    </el-image>
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                    <el-col :span="12" v-if="pageType == 'wancheng'">
                        <div class="titleSty">维修信息</div>
                        <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="80px"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="维修人" prop="repairer">
                                <el-input
                                    v-model="ruleForm.repairer"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="repair_phone">
                                <el-input
                                    v-model="ruleForm.repair_phone"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="故障原因" prop="result">
                                <el-input v-model="ruleForm.result"></el-input>
                            </el-form-item>
                            <el-form-item label="维修前">
                                <UploadImg
                                    v-model="before_repair"
                                    :limit="3"
                                ></UploadImg>
                            </el-form-item>
                            <el-form-item label="维修后">
                                <UploadImg
                                    v-model="after_repair"
                                    :limit="3"
                                ></UploadImg>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="submitForm('ruleForm')"
                                    >完成</el-button
                                >
                                <el-button @click="resetForm('ruleForm')"
                                    >取消</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getInfo,
    updateRepairInfo,
} from "@/request/api/market/malfunctionRepair/maintenanceTask";
export default {
    name: "repairsOrderDetails",
    data() {
        return {
            loading: false,
            ruleForm: {
                pre_picture: [],
                before_repair: [],
                after_repair: [],
            },
            rules: {
                repairer: [
                    {
                        required: true,
                        message: "请输入维修人",
                        trigger: "blur",
                    },
                ],
                repair_phone: [
                    {
                        required: true,
                        message: "请输入联系电话",
                        trigger: "blur",
                    },
                ],
                result: [
                    {
                        required: true,
                        message: "请输入故障原因",
                        trigger: "blur",
                    },
                ],
            },
            pageType: "",
            id: "",
            pre_picture: [],
            before_repair: [],
            after_repair: [],
        };
    },
    created() {
        let { params, query } = this.$route;
        this.pageType = params.type;
        this.id = query.id;
        this.getInfo();
    },
    methods: {
        // 根据id获取数据
        getInfo() {
            const self = this
              const  loading = this.$load();
            getInfo(this.id)
                .then((response) => {
                    console.log(response);
                    self.ruleForm = response.data;
                    self.pre_picture = response.data.pre_picture
                        ? response.data.pre_picture.split(",")
                        : [];
                    self.before_repair = response.data.before_repair.split(",");
                    self.after_repair = response.data.after_repair.split(",");
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        // 完成按钮
        submitForm(formName) {
            const self = this;
            // ,loading = this.$load();
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    self.ruleForm.before_repair = self.before_repair.join(",");
                    self.ruleForm.after_repair = self.after_repair.join(",");
                    // console.log(self.ruleForm);
                    updateRepairInfo(self.ruleForm, self.id)
                        .then((response) => {
                            self.ruleForm = response.data;
                            self.closePage();
                        })
                        .finally((error) => {
                            self.$nextTick(() => {
                                // loading.close();
                            });
                        });
                    this.$refs[formName].resetFields();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // 取消按钮
        resetForm(formName) {
            this.closePage();
        },
    },
};
</script>

<style scoped lang="scss">
.app-container {
    .steps-box {
        width: 70%;
        height: auto;
        .step-title {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .orderInfo {
                font-size: 16px;
                font-weight: bold;
                color: #303133;
            }
            .el-tag {
                margin: 0 6px;
            }
        }

        .step-label {
            font-size: 16px;
            line-height: 38px;
        }
    }
    .middle-box {
        margin: 20px 0;
    }

    .titleSty {
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 20px;
        color: #303133;
        margin-left: 7px;
    }
}
</style>

