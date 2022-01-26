<template>
    <div class="app-container">
        <div>
            <el-form
                v-show="showSearch"
                ref="queryForm"
                :model="paging"
                :inline="true"
                label-width="85x"
            >
                <el-form-item label="商家名称" prop="merchantName">
                    <el-input
                        v-model="paging.merchantName"
                        placeholder="请输入商家名称"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="服务类型" prop="servicesType">
                    <el-select
                        multiple
                        v-model="paging.servicesType"
                        placeholder="请选择客户分类"
                        clearable
                        size="small"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in searchList"
                            :key="dict.id"
                            :label="dict.servicesTypeName"
                            :value="dict.servicesTypeName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input
                        v-model="paging.contacts"
                        placeholder="请输入联系人"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>

                <el-form-item label="订单编号" prop="orderNum" v-if="isShow">
                    <el-input
                        v-model="paging.orderNum"
                        placeholder="请输入订单编号"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="手机号" prop="contactWay" v-if="isShow">
                    <el-input
                        v-model="paging.contactWay"
                        placeholder="请输入订单编号"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="下单时间" prop="orderTime" v-if="isShow">
                    <el-date-picker v-model="paging.orderTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="工作人员" prop="staff" v-if="isShow">
                    <el-input
                        v-model="paging.staff"
                        placeholder="请输入工作人员"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery"
                    >搜索</el-button>
                    <el-button
                        type="primary"
                        :icon="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        size="mini"
                        @click="searchShow"
                    >{{ isShow ? "收起" : "高级" }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tabs-box">
            <el-radio-group v-model="paging.orderStatus" @change="tabsTodo">
                <el-radio-button :label="m.val" v-for="(m,i) in tabsList" :key="i">
                    {{
                        m.name
                    }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="订单编号" prop="orderNum" show-overflow-tooltip />
            <el-table-column label="商户名称" prop="merchantName" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品名称" show-overflow-tooltip>
                <template slot-scope="scope">{{ formatterName(scope.row.goodsInfo) }}</template>
            </el-table-column>
            <el-table-column label="联系人" prop="contacts" show-overflow-tooltip></el-table-column>
            <el-table-column label="手机号" prop="contactWay" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务地点" prop="serviceLocation" show-overflow-tooltip></el-table-column>

            <el-table-column label="服务类别" prop="pass_state" show-overflow-tooltip>
                <template slot-scope="scope">{{ formatterType(scope.row.goodsInfo) }}</template>
            </el-table-column>
            <el-table-column label="货物重量(吨)" prop="cargoWeight" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{ formatterWeight(scope.row.goodsInfo) }}</template>
            </el-table-column>

            <el-table-column label="预约时间" prop="appointmentTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="车辆到达时间" prop="carArrivalTime" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="订单总额" prop="orderTotal" show-overflow-tooltip></el-table-column>

            <el-table-column
                label="打赏费"
                prop="rewardFee"
                v-if="paging.orderStatus == 3"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="服务开始时间"
                prop="startTime"
                width="150"
                v-if="paging.orderStatus == 2 || paging.orderStatus == 3 || paging.orderStatus == 4"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="服务结束时间"
                prop="finishTime"
                width="150"
                v-if="paging.orderStatus == 3"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="工作人员"
                prop="staff"
                v-if="paging.orderStatus == 2 || paging.orderStatus == 3 || paging.orderStatus == 4"
                show-overflow-tooltip
            >
                <template slot-scope="scope">{{ formatterStaff(scope.row.staff) }}</template>
            </el-table-column>

            <el-table-column
                label="取消时间"
                prop="cancelOrderNum"
                v-if="paging.orderStatus == 4"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="取消费用"
                prop="cancelOrderMoney"
                v-if="paging.orderStatus == 4"
                show-overflow-tooltip
            ></el-table-column>

            <el-table-column label="下单时间" prop="orderTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" prop="creatorName" show-overflow-tooltip></el-table-column>
            <el-table-column
                label="操作"
                width="150"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="details(scope.row.id)">查看</el-button>
                    <el-button size="mini" type="text" @click="operation(scope.row)">安排人员</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="paging.pageNum"
            :limit.sync="paging.pageSize"
            @pagination="getList"
        />

        <el-dialog title="安排人员" :visible.sync="showDrawer" width="30%" :before-close="drawerClosed">
            <el-form ref="form" :model="form" label-width="135px" :rules="rules">
                <el-form-item label="预约时间" prop="appointmentTime">
                    <!-- <el-input disabled v-model="form.appointmentTime"></el-input> -->
                    <el-date-picker
                        disabled
                        v-model="form.appointmentTime"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :label="a.servicestype" prop="staff" v-for="(a,b) in form.staff" :key="b">
                    <!-- <el-input readonly  placeholder="请选择装货人员">
                        <el-button type="primary" slot="append">选择人员</el-button> 
                    </el-input> -->
                    <el-select v-model="staffList" placeholder="" multiple>
                        <el-option
                            v-for="(item) in userList"
                            :key="item.userid"
                            :label="item.username"
                            :value="item.userid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="卸货人员" prop="staff">
                    <el-input readonly v-model="form.repairer" placeholder="请选择卸货人员">
                        <el-button type="primary" slot="append">选择人员</el-button>
                    </el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="drawerClosed">取 消</el-button>
                <el-button type="primary" @click="confirmForm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {
    getList,
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    searchList,
} from "@/request/api/market/merchantServices/serviceOrder";
export default {
    data() {
        return {
            staffList:[],
            tabsList: [
                { name: "待完成", val: 1 },
                { name: "进行中", val: 2 },
                { name: "已完成", val: 3 },
                { name: "已取消", val: 4 },
            ],
            // 显示搜索条件
            showSearch: true,
            isShow: false,
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
                merchantName: "",
                servicesType: [],
                contacts: '',
                orderNum: "",
                contactWay: "",
                orderTime: "",
                orderStatus: 1,
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {

            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入类别名称",
                        trigger: "blur",
                    },
                ],
                repairer: [
                    {
                        required: true,
                        message: "请输入负责人",
                        trigger: "change",
                    },
                ],
            },
            searchList: [],
            userList:[
                {
                    username:"张三",
                    userid:"101"
                }
            ]
        };
    },
    created() {
        this.getList();
        searchList().then(res => {
            this.searchList = res.data.results
        })
    },
    methods: {
        formatterName(val) {
            let v = JSON.parse(val).map(item => {
                return item.goodsName
            })
            return v.join(',')
        },
        formatterType(val) {
            let v2 = JSON.parse(val).map(item => {
                let aa = item.servicesType.map(i => {
                    return i.name
                })
                return aa
            })
            return v2.flat(Infinity).join(',')
        },
        formatterWeight(val) {
            let v2 = JSON.parse(val).map(item => {
                let aa = item.servicesType.map(i => {
                    return i.cargoWeight
                })
                return aa
            })
            return v2.flat(Infinity).join(',')
        },
        formatterStaff(val) {
            let v = JSON.parse(val).map(item => {
                let aa = item.userinfo.map(i => {
                    return i.username
                })
                return aa
            })
            return v.flat(Infinity).join(",")
        },
        // 切换
        tabsTodo(val) {
            this.getList()
        },
        // 高级搜索展示隐藏
        searchShow() {
            this.isShow = !this.isShow;

        },
        details(id) {
            this.$router.push({ path: '/serviceOrder', query: { id: id } })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.paging.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        getList() {
            this.loading = true;
            getList(this.paging)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        operation(row) {
            this.showDrawer = true;
            this.itemId = row.id;
            const self = this,
                loading = this.$load();
            getInfo(row.id)
                .then((response) => {
                    self.form = response.data;
                    self.form.staff = JSON.parse(response.data.staff)
                    console.log(JSON.parse(response.data.staff));
                    console.log(Object.prototype.toString.call(response.data.staff));
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        drawerClosed() {
            this.showDrawer = false;
            (this.form = {
                name: "",
                repairer: "",
            }),
                this.resetForm("form");
        },
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    if (self.drawerType == "add") {
                        addOfficeAddress(self.form)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        updateOfficeAddress(self.form, self.itemId)
                            .then((res) => {
                                self.showDrawer = false;
                                self.$toast("编辑成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                } else {
                    self.$toastError("请将表单填写完整");
                }
            });
        },

    },
};
</script>

<style lang="scss" scoped>
.tabs-box {
    margin-bottom: 20px;
}
</style>

