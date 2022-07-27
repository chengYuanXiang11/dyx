<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="费用名称" prop="costname">
                <template slot-scope="scope">{{ scope.row.othercost.costname }}</template>
            </el-table-column>
            <el-table-column label="费用规则" prop="costrules" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.othercost.list" :key="index">
                        <h5>情况{{ index + 1 }}:</h5>
                        <div
                            v-for="(val,i) in item.costrules"
                            :key="i + 1"
                        >{{ formatterOperation(val.operation) }}:{{ val.time }}分钟</div>
                        <div>{{ formatterType(item.deductType, 1) }}:{{ item.deductmoney }}{{ formatterType(item.deductType, 2) }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="是否开启" prop="status">
                <template slot-scope="scope">
                    <el-switch
                        @change="changeOpen(scope.row.othercost, scope.row.id)"
                        v-model="scope.row.othercost.status"
                        :active-value=1
                        :inactive-value=0
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="paging.pageNum"
            :limit.sync="paging.pageSize"
            @pagination="getList"
        />
        <!-- :showFooter="false" -->
        <Yg-Drawer
            v-model="showDrawer"
            title="编辑"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
        >
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="费用名称" prop="costname">
                    <el-input v-model="form.costname" placeholder="请输入费用名称"></el-input>
                </el-form-item>
                <el-form-item label="是否开启">
                    <el-switch
                        @change="isChangeShow"
                        v-model="form.status"
                        :active-value=1
                        :inactive-value=0
                    ></el-switch>
                </el-form-item>
                <div v-if="form.status == 1">
                    <div class="add-title">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-circle-plus-outline"
                            @click="addObj"
                        >添加情况</el-button>
                    </div>
                    <el-card class="box-card" v-for="(item,index) in form.list" :key="index">
                        <div slot="header" class="clearfix">
                            <span>情况{{ index + 1 }}</span>
                            <el-button
                                style="float: right;"
                                size="mini"
                                type="danger"
                                plain
                                @click.prevent="deleteItem(index)"
                            >删除</el-button>
                        </div>
                        <div>
                            <div class="title-top">
                                <div>当预约时间-当前时间</div>
                                <el-button
                                    size="small"
                                    @click="addItem(index)"
                                    v-if="form.list[index].costrules.length < 2"
                                >添加条件</el-button>
                            </div>

                            <el-form-item
                                :prop="'list.' + index + '.costrules.' + i + '.time'"
                                label-width="0"
                                :rules="[
                                    { required: true, message: '不能为空' },
                                    { type: 'number', message: '必须为整数' }
                                ]"
                                v-for="(li,i) in item.costrules"
                                :key="i"
                            >
                                <div style="display:flex;align-items: center;">
                                    <el-input
                                        placeholder="请输入数字"
                                        v-model.number="li.time"
                                        class="input-with-select"
                                        size="medium"
                                    >
                                        <el-select
                                            v-model="li.operation"
                                            slot="prepend"
                                            placeholder="请选择"
                                        >
                                            <el-option label="小于" :value="1"></el-option>
                                            <el-option label="小于等于" :value="2"></el-option>
                                            <el-option label="大于" :value="3"></el-option>
                                            <el-option label="大于等于" :value="4"></el-option>
                                        </el-select>
                                        <template slot="append">分钟</template>
                                    </el-input>
                                    <!-- el-icon-remove-outline -->
                                    <i
                                        class="el-icon-delete"
                                        @click.prevent="removeItem(index, i)"
                                        style="font-size: 25px;padding: 10px 0 0 10px;color: #F56C6C;cursor: pointer;"
                                        v-if="form.list[index].costrules.length > 1"
                                    ></i>
                                    <!-- <el-button size="mini" @click.prevent="removeItem(item)">删除</el-button> -->
                                </div>
                            </el-form-item>
                            <el-form-item
                                :prop="'list.' + index + '.deductmoney'"
                                label-width="0"
                                :rules="[
                                    { required: true, message: '不能为空' },
                                    { type: 'number', message: '必须为整数' }
                                ]"
                            >
                                <el-input
                                    placeholder="请输入数字"
                                    v-model.number="item.deductmoney"
                                    class="input-with-select"
                                    min="0"
                                >
                                    <el-select
                                        v-model="item.deductType"
                                        slot="prepend"
                                        placeholder="请选择"
                                    >
                                        <el-option label="扣订单金额百分比" :value="1"></el-option>
                                        <el-option label="扣固定金额" :value="2"></el-option>
                                    </el-select>
                                    <template slot="append">{{ item.deductType == 1 ? '%' : '元' }}</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-card>
                </div>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getList,
    addOfficeAddress,
    getInfo,
    updateOfficeAddress,
    delOfficeAddress,
} from "@/request/api/market/merchantServices/otherFees";
export default {
    data() {
        return {
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                costname: "",
                status: 1,
                list: [
                    {
                        costrules: [
                            { time: "", operation: 3 }
                        ],
                        deductmoney: "",
                        deductType: 1// % 或 元
                    }
                ]
            },
            rules: {
                contentOne: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                    { type: 'number', message: '年龄必须为数字值' }
                ],

            },
            isOthercost: ""

        };
    },
    created() {
        this.getList();
    },
    methods: {
        changeOpen(othercost, id) {
            console.log(othercost, id);
            this.itemId = id
            this.isOthercost = othercost
            let _this = this
            async function statusCheck() {
                await _this.getInfo()
                await _this.uptateStatus()

            }
            statusCheck()

        },
        uptateStatus() {
            let _this = this
            _this.loading = true;
            console.log(_this.isOthercost);
            let obj = {
                othercost:_this.isOthercost
            }
            updateOfficeAddress(obj, _this.itemId)
                .then((res) => {
                    _this.getList();
                })
                .finally((error) => {
                    _this.loading = false;
                });
        },
        isChangeShow(v) {
            console.log(v);
        },
        formatterOperation(val) {
            let list = ['', '小于', '小于等于', '大于', '大于等于']
            if (val !== "") {
                return list[val]
            } else {
                return val
            }
        },
        formatterType(val, num) {
            let listOne = ['', '扣订单金额百分比', '扣固定金额']
            let listTwo = ['', '%', '元']
            if (val != "") {
                if (num == 1) {
                    return listOne[val]
                } else {
                    return listTwo[val]
                }
            }
        },
        // 添加情况
        addObj() {
            this.form.list.unshift({
                costrules: [
                    { time: "", operation: 3 }
                ],
                deductmoney: "",
                deductType: 1// % 或 元
            })
            this.$refs.form.clearValidate()
        },
        // 删除情况
        deleteItem(index) {
            this.form.list.splice(index, 1)
        },
        // 条件增加
        addItem(index) {
            this.form.list[index].costrules.push({
                time: "",
                operation: 1
            })
        },
        // 条件删除
        removeItem(index, i) {
            this.form.list[index].costrules.splice(i, 1)
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
        getInfo() {
            const self = this,
                loading = this.$load();
            getInfo(this.itemId)
                .then((response) => {
                    console.log(response.data.othercost);
                    if (response.data.othercost != null) {
                        self.form = response.data.othercost
                    } else {
                        self.$message.warning('暂无数据')
                    }
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        operation(type, id) {
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        drawerClosed() {
            this.showDrawer = false;
            // (this.form = {
            //     name: "",
            //     repairer: ""
            // }),
            this.resetForm("form");
        },
        del(id) {
            const self = this;
            self
                .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    delOfficeAddress(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                });
        },
        confirmForm() {

            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    console.log(self.form);

                    self.showDrawer = false;

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
                        let obj = {
                            othercost: self.form
                        }
                        updateOfficeAddress(obj, self.itemId)
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
.add-title {
    display: flex;
    justify-content: flex-end;
}
::v-deep .el-card {
    margin-top: 15px;
}
.box-card {
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both;
    }
    ::v-deep .el-select .el-input {
        width: 160px;
    }
    ::v-deep .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    ::v-deep .el-input-group {
        margin-top: 10px;
    }
    .title-top {
        display: flex;
        justify-content: space-between;
    }
}
</style>

