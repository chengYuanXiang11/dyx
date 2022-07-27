<template>
    <div class="app-container">
        <el-radio-group v-model="radio1" @change="radioChange" @click.native="radioClick($event)">
            <el-radio-button :label="1">商铺租赁</el-radio-button>
            <el-radio-button :label="2">宿舍租赁</el-radio-button>
            <el-radio-button :label="3">仓库租赁</el-radio-button>
        </el-radio-group>

        <div v-if="isTable">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="'待出租' + '(' + valOne + ')'" name="0"></el-tab-pane>
                <el-tab-pane :label="'已出租' + '(' + valTwo + ')'" name="1"></el-tab-pane>
            </el-tabs>
            <el-table v-loading="loading" :data="tableData" class="yg-table">
                <el-table-column key="1" :label="formatterName()" prop="locationNumber" />
                <el-table-column key="2" :label="formatterArea()" prop="proportion" />
                <el-table-column key="5" label="仓库类型" prop="warehouseType" v-if="radio1 == 3" />
                <el-table-column
                    key="6"
                    label="可存放类型"
                    prop="storageType"
                    v-if="radio1 == 3"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">{{ formatterStorageType(scope.row.storageType) }}</template>
                </el-table-column>
                <el-table-column key="3" label="位置" prop="location" />
                <el-table-column key="4" label="起止日期" prop="contractPeriod" v-if="activeName == 2" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            @click="viewTo(scope.row.locationNumberId)"
                        >查看历史</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                :total="total"
                :page.sync="query.pageNum"
                :limit.sync="query.pageSize"
                @pagination="getList"
            />
        </div>
        <div v-else>
            <el-table v-loading="loadingA" :data="tableDataA" class="yg-table">
                <el-table-column key="0" type="index" label="序号" />
                <el-table-column key="1" label="商户名称" prop="storeName" />
                <el-table-column key="2" label="姓名" prop="merchantName" />
                <el-table-column key="3" label="联系方式" prop="mobile" />
                <el-table-column key="4" label="起止日期" prop="contractPeriod" />
                <el-table-column key="5" label="状态" prop="leaseStatus" />
            </el-table>

            <pagination
                :total="totalA"
                :page.sync="queryA.pageNum"
                :limit.sync="queryA.pageSize"
                @pagination="getListA"
            />
        </div>
    </div>
</template>

<script>
import {
    getList, getHistory
} from "@/request/api/market/leaseTotal/index";
export default {
    name: "Leasetotal",
    data() {
        return {
            isTable: true,
            loading: false,
            total: 0,
            tableData: [
                { id: 1, locationNumber: "01" }
            ],
            query: {
                pageNum: 1,
                pageSize: 20,
                leaseType: 1,
                leaseStatus: 0
            },
            radio1: 1,
            activeName: '0',
            valOne: '',
            valTwo: '',

            // 查看历史
            loadingA: false,
            tableDataA: [],
            totalA: 0,
            queryA: {
                pageNum: 1,
                pages: 20,
                leaseType: "",
                locationNumberId: ""
            },

        };
    },
    created() {
        this.getList()
    },
    methods: {
        formatterStorageType(val) {
            if (val != "" && val != null && val.length > 0) {
                return val.join(',')
            } else if(val.length==0){
                return ""
            }else{
                return val
            }
        },
        formatterName() {
            if (this.radio1 == 1) {
                return '商铺号'
            } else if (this.radio1 == 2) {
                return '宿舍号'
            } else {
                return '仓库号'
            }
        },
        formatterArea() {
            if (this.radio1 == 1 || this.radio1 == 2) {
                return '面积/㎡'
            } else {
                return '仓库容量'
            }
        },
        // 切换类型
        radioClick(e) {
            if (e.target.tagName === 'INPUT') return //处理原生点击事件执行两次的问题
            this.isTable = true
        },
        // 监控获取类型值
        radioChange(val) {
            console.log(val);
            this.activeName = '0'//切换类型将出租状态重置为待出租
            this.query.pageNum = 1
            this.query.leaseStatus = 0
            this.query.leaseType = val
            this.getList(this.query)
        },
        // 查看历史
        viewTo(id) {
            this.isTable = false
            this.queryA.leaseType = this.radio1
            this.queryA.locationNumberId = id
            this.getListA()
        },
        // tab切换出租状态
        handleClick(tab) {
            console.log(tab.name);
            this.query.pageNum = 1
            this.query.leaseStatus = Number(tab.name)
            this.query.leaseType = this.radio1
            this.getList(this.query)
        },
        // 获取外部列表
        getList() {
            let _this = this
            this.loading = true;
            getList(this.query).then((res) => {
                _this.loading = false;
                _this.tableData = res.data.rows
                _this.total = res.data.total
                _this.valOne = res.data.count.no_rent.toString()
                _this.valTwo = res.data.count.have_rent.toString()
            }).catch((err) => {

            });
        },
        // 获取查看历史列表
        getListA() {
            let _this = this
            this.loadingA = true;
            getHistory(this.queryA).then((res) => {
                _this.loadingA = false;
                _this.tableDataA = res.data.rows
                _this.totalA = res.data.total
            }).catch((err) => {

            });
        },
    },

};
</script>

<style scoped lang="scss">
.yg-table {
    margin-top: 15px;
}
</style>

