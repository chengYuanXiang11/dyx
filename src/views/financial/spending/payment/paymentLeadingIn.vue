<template>
    <div class="app-container">
        <el-steps :active="active" finish-status="success">
            <el-step title="上传付款表"></el-step>
            <el-step title="核对付款表"></el-step>
        </el-steps>
        <!-- 上传付款表 -->
        <el-form
            ref="form"
            :model="form"
            label-width="180px"
            v-if="active === 0"
        >
            <el-form-item label="付款状态">
                <el-radio-group v-model="form.paymentStatus">
                    <el-radio-button label="1">待付款</el-radio-button>
                    <el-radio-button label="2">已付款</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="付款表导入">
                <Execl
                    v-model="fileList"
                    :multiple="false"
                    :list="false"
                    :drag="drag"
                    @uploadStatue="uploadStatue"
                ></Execl>
                <el-progress
                    v-if="fileList.length > 0"
                    type="circle"
                    :percentage="fileList[0].percentage"
                    :status="percentStatus"
                ></el-progress>
            </el-form-item>
            <span
                >Excel中请务必包含「付款类型」「付款事由」「付款金额(元)」「付款日期」「收款人(单位)」「银行账户」数据项</span
            >
            <p>
                如需参考模版
                <el-link type="primary" @click="download">下载</el-link>
            </p>
        </el-form>
        <!-- 核对付款表 -->
        <el-col v-if="active != 0">
            <el-table :data="tableData" style="width: 100%" class="yg-table">
                <el-table-column prop="date" label="付款类型" width="180">
                </el-table-column>
                <el-table-column prop="name" label="付款事由" width="180">
                </el-table-column>
                <el-table-column prop="address" label="付款金额">
                </el-table-column>
                <el-table-column prop="address" label="付款日期 ">
                </el-table-column>
                <el-table-column prop="address" label="收款人(单位)">
                </el-table-column>
                <el-table-column prop="address" label="银行账户">
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="back">重新导入</el-button>
            <el-button type="primary">确认</el-button>
        </el-col>
        <el-button type="primary" @click="goBack">返回</el-button>
    </div>
</template>
<script>
import Execl from "@/views/personnel/Scheduling/Execl.vue";
export default {
    name: "paymentLeadingIn",
    data() {
        return {
            active: 0,
            form: {
                paymentStatus: "1",
            },
            fileList: [],
            drag: true,
            uploadStatus: true,
            percentStatus: null,
            //上传后的列表
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1517 弄",
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1519 弄",
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1516 弄",
                },
            ],
        };
    },
    components: { Execl },
    methods: {
        next() {
            if (++this.active > 2) this.active = 0;
            // 成功则删除掉列表中已导入的文件
            this.fileList = [];
        },
        back() {
            this.percentStatus = null;
            if (--this.active < 0) this.active = 0;
        },
        // 上传成功或者失败
        uploadStatue(val) {
            if (val) {
                this.percentStatus = "success";
                this.next();
            } else {
                this.percentStatus = "exception";
            }
        },
        //下载模板
        download() {},
        goBack() {
            this.$router.back();
        },
    },
};
</script>
