<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="办公地点名称" prop="office_addr_name" />
            <el-table-column label="城市" :formatter="formatCity" />
            <el-table-column
                label="地址"
                prop="addr"
                :show-overflow-tooltip="true"
            />
            <el-table-column label="邮编" prop="postcode" />
            <el-table-column label="电话" prop="phone"></el-table-column>
            <el-table-column label="传真" prop="fax"></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="operation('edit', scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="del(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="paging.pageNum"
            :limit.sync="paging.pageSize"
            @pagination="getList"
        />
        <Yg-Drawer
            v-model="showDrawer"
            :title="(drawerType == 'add' ? '新建' : '编辑') + '办公地点'"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
        >
            <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item label="办公地点名称" prop="office_addr_name">
                    <el-input
                        v-model="form.office_addr_name"
                        placeholder="请输入办公地点名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <Province v-model="form.city"></Province>
                </el-form-item>
                <el-form-item label="地址" prop="addr">
                    <el-input
                        v-model="form.addr"
                        placeholder="请输入地址"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮编">
                    <el-input
                        v-model="form.postcode"
                        placeholder="请输入邮编"
                    ></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input
                        v-model="form.phone"
                        placeholder="请输入电话"
                    ></el-input>
                </el-form-item>
                <el-form-item label="传真">
                    <el-input
                        v-model="form.fax"
                        placeholder="请输入传真"
                    ></el-input>
                </el-form-item>
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
} from "@/request/api/personnel/checking/officeAddress";
export default {
    name: "Officeaddress",
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
                city: [],
            },
            rules: {
                office_addr_name: [
                    {
                        required: true,
                        message: "请输入办公地点名称",
                        trigger: "blur",
                    },
                ],
                city: [
                    {
                        required: true,
                        message: "请选择城市",
                        trigger: "change",
                    },
                ],
                addr: [
                    {
                        required: true,
                        message: "请输入地址",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
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
                    let citys = response.data.city.map((item) => {
                        return item.id;
                    });
                    let res = self.filterObj(response.data, [
                        "id",
                        "office_addr_name",
                        "addr",
                        "postcode",
                        "phone",
                        "phone",,
                        "fax",
                    ]);
                    res.city = citys
                    self.form = res;
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
            (this.form = {
                postcode: "",
                phone: "",
                fax: "",
            }),
                this.resetForm("form");
        },
        del(id) {
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
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
        formatCity(row) {
            let citys = row.city.map((item) => {
                return item.name;
            });
            return citys.join("");
        },
    },
};
</script>

