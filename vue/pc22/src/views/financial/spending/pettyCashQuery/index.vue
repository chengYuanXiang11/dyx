<template>
    <div class="app-container">
        <!-- 备用金查询 -->
        申请人
        <el-input v-model="value" class="inputwidth"></el-input>
        部门
        <el-select
            v-model="value2"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.deptName"
                :value="item.value"
            >
            </el-option>
        </el-select>
        <el-button class="marginLeft" type="primary" @click="search"
            >搜索</el-button
        >
        <el-button type="info" @click="reset">重置</el-button>
        <el-table :data="tableData" style="width: 100%" class="yg-table">
            <el-table-column prop="applicant" label="申请人" width="180">
            </el-table-column>
            <el-table-column prop="paymentType" label="部门" width="180">
            </el-table-column>
            <el-table-column prop="payee" label="当前总金额"> </el-table-column>
            <el-table-column prop="applicationAmount" label="当前可用金额">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template>
                    <el-button size="mini" type="text" @click="usageRecords">申请记录</el-button>
                    <el-button size="mini" type="text">使用记录</el-button>
                </template>
            </el-table-column>
        </el-table>
         <UsageRecord v-model="usageRecordShow"></UsageRecord>
    </div>
</template>

<script>
import UsageRecord from "./UsageRecord.vue";

import { nameSearchDept } from "@/request/api/organization/dept.js";
export default {
    name: "To-do",
    data() {
        return {
            value: "12",
            value2: "",
            tableData: [
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
                {
                    applicant: "王小虎",
                    paymentType: "付款类型1",
                    payee: "李爱莲",
                    applicationAmount: "103,131,132.0",
                    expectedTime: "2020-01-05",
                    applicationTime: "2020-01-05   10:15:10",
                    actualTime: "2020-01-05",
                    collectionAccount: "",
                    paymentAccount: "",
                    remarks: "",
                },
            ],
            list: [],
            loading: false,
            options: [],
          usageRecordShow:false
        };
    },
       components: { UsageRecord },
    methods: {
        remoteMethod(query) {
            if (query !== "") {
                this.loading = true;

                nameSearchDept({
                    deptName: query,
                })
                    .then((res) => {
                        this.options = res.data.results;
                    })
                    .finally((err) => {
                        this.loading = false;
                    });
            } else {
                this.options = [];
            }
        },
        // 搜索
        search() {
            // this
        },
        // 重置
        reset() {
            // this.
        },
        usageRecords(){
 this.usageRecordShow = true
        }
    },
    created() {
        console.log(this.$route);
    },
};
</script>

<style scoped lang="scss">
.inputwidth {
    width: 130px;
}
.marginLeft {
    margin-left: 20px;
}
</style>
