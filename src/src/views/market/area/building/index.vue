<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
            <!-- {{this.id}} -->
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" class="yg-table" v-loading="loading">
            <el-table-column label="建筑名称" prop="building_name" />
            <el-table-column label="建筑类型" prop="buildingtype">
                <template slot-scope="scope">
                    <span v-if="scope.row.buildingtype == 1">宿舍楼</span>
                    <span v-if="scope.row.buildingtype == 2">办公楼</span>
                    <span v-if="scope.row.buildingtype == 3">商铺楼</span>
                </template>
            </el-table-column>
            <el-table-column label="负责人" prop="principal" />
            <el-table-column label="联系方式" prop="contact" />
            <el-table-column
                label="操作"
                class-name="small-padding fixed-width"
                align="center"
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
                        @click="toFloor(scope.row.id)"
                        >楼层管理</el-button
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
            v-show="total > 0"
            :total="total"
            :page.sync="pagings.pageNum"
            :limit.sync="pagings.pageSize"
            @pagination="getList"
        />
        <Yg-Drawer
            v-model="showDrawer"
            :title="drawerType == 'add' ? '新建' : '编辑'"
            @confirm="confirmForm"
            :confirmLoading="btnLoading"
            @closed="drawerClosed"
            @cancel="drawerClosed"
        >
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="区域名称" prop="building_name">
                    <el-input
                        v-model="form.building_name"
                        placeholder="请输入区域名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="建筑类型" prop="buildingtype">
                    <el-radio-group v-model="form.buildingtype">
                        <el-radio label="1">宿舍楼</el-radio>
                        <el-radio label="2">办公楼</el-radio>
                        <el-radio label="3">商铺楼</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="请输入负责人" prop="principal">
                    <el-input
                        v-model="form.principal"
                        placeholder="请输入负责人"
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input
                        v-model="form.contact"
                        placeholder="请输入负责人联系方式"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getBuildingList,
    addBuilding,
    delBuilding,
    getInfo,
    updateBuilding,
} from "@/request/api/market/areaAdmin/buildingAdmin";
export default {
    name: "building",
    data() {
        return {
            total: 0,
            pagings: {
                pageNum: 1,
                pageSize: 20,
            },
            form: {},
            rules: {
                building_name: [
                    {
                        required: true,
                        message: "请输入区域名称",
                        trigger: "blur",
                    },
                ],
                buildingtype: [
                    {
                        required: true,
                        message: "请选择建筑类型",
                        trigger: "blur",
                    },
                ],
                principal: [
                    {
                        required: true,
                        message: "请输入负责人",
                        trigger: "blur",
                    },
                ],
                contact: [
                    {
                        required: true,
                        message: "请输入负责人联系方式",
                        trigger: "blur",
                    },
                ],
            },
            tableData: [],
            loading: false,
            showDrawer: false,
            btnLoading: false,
            drawerType: "",
            id: this.$route.query.id,
            itemId: "",
        };
    },
    methods: {
        confirmForm() {
            //保存新增或编辑信息
            const self = this;
            self.$refs["form"].validate((vaild) => {
                if (vaild) {
                    self.btnLoading = true;
                    self.form.area_manage = Number(self.id);
                    if (self.drawerType == "add") {
                        //新增
                        console.log(self.form);
                        addBuilding(self.form)
                            .then((resp) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getList();
                                self.form = {};
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        //编辑
                        updateBuilding(self.form, self.itemId)
                            .then((resp) => {
                                self.showDrawer = false;
                                self.$toast("编辑成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                }
            });
        },
        getList() {
            //获取列表
            getBuildingList(this.id, this.pagings)
                .then((resp) => {
                    this.tableData = resp.data.results;
                    // console.log(this.tableData)
                    this.total = resp.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        operation(type, id) {
            //打开右侧抽屉
            this.form = {};
            this.showDrawer = true;
            this.itemId = id;
            this.drawerType = type;
            type == "edit" && this.getInfo();
        },
        getInfo() {
            //获取详情
            const self = this,
                loading = this.$load();
            // console.log(this.itemId);
            getInfo(this.itemId)
                .then((resp) => {
                    let res = self.filterObj(resp.data, [
                        "building_name",
                        "buildingtype",
                        "principal",
                        "contact",
                    ]);
                    self.form = res;
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        del(id) {
            //删除
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delBuilding(id).then((res) => {
                    self.$toast("删除成功！");
                    self.getList();
                });
            });
        },
        drawerClosed() {
            //抽屉取消
            this.showDrawer = false;
        },
        toFloor(id) {
            // this.$router.push("/floor")
            this.$router.push({ path: "/floor", query: { id: id } });
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
</style>

