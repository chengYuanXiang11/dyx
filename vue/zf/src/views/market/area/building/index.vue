<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        @pagination="handlePagination"
    >
        <template slot="action-bar">
            <el-button type="primary" @click="operation('add')" v-hasPermi="['123456']">新增</el-button>
        </template>
        <el-table :data="tableData" border height="100%">
            <el-table-column label="建筑名称" prop="building_name" />
            <el-table-column label="建筑类型" prop="principal" />
            <el-table-column label="负责人" prop="contact" />
            <el-table-column label="联系方式" prop="contact" />
            <el-table-column label="是否有地图">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_map == '1'">有</span>
                    <span v-if="scope.row.is_map == '2'">没有</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" class-name="small-padding fixed-width" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="text" @click="toBuilding(scope.row.id)">楼层管理</el-button>
                    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Drawer
            :visible.sync="showDrawer"
            v-loading="loading"
            element-loading-text="拼命加载中"
            :title="(drawerType == 'add' ? '新建' : '编辑')"
            :before-close="beforeClose"
            @confirm="confirmForm"
        >
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="区域名称" prop="building_name">
                    <el-input v-model="form.building_name" placeholder="请输入区域名称"></el-input>
                </el-form-item>
                <el-form-item label="建筑类型" prop="buildingtype">
                    <el-radio-group v-model="form.buildingtype">
                        <el-radio label="1">宿舍楼</el-radio>
                        <el-radio label="2">办公楼</el-radio>
                        <el-radio label="3">商铺楼</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="请输入负责人" prop="principal">
                    <el-input v-model="form.principal" placeholder="请输入负责人"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="form.contact" placeholder="请输入负责人联系方式"></el-input>
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
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
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 100,
                isOpen: false,
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
        toBuilding(id) {
            this.$router.push({ path: '/areaMgmt/building-main/floor', query: { id: id } })
        },
        beforeClose() {
            this.showDrawer = false
        },
        handlePagination(e) {
            this.search.pageSize = e.pageSize;
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        handleSearch(e) {
            this.queryParams = e;
            this.search.pageNum = 1;
            this.getList();
        },
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
                                self.$message({
                                    message: '新增成功！',
                                    type: 'success'
                                });
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
                                self.$message({
                                    message: '编辑成功！',
                                    type: 'success'
                                });
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
            getBuildingList(this.id, this.queryFormat(this.queryParams, this.search))
                .then((resp) => {
                    this.tableData = resp.data.results;
                    this.search.total = resp.data.count;
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
            const self = this
            // loading = this.$load()
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
                        // loading.close();
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
                    self.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
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

