<template>
    <div class="app-container">
        <div class="operation">
            <el-button type="primary" @click="operation('add')">新建</el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" class="yg-table" v-loading="loading">
            <el-table-column label="楼层序号" prop="order_num" />
            <el-table-column label="负责人" prop="principal" />
            <el-table-column label="联系方式" prop="contact" />
            <el-table-column label="是否有地图">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_map == '1'">有</span>
                    <span v-if="scope.row.is_map == '2'">没有</span>
                </template>
            </el-table-column>
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
                        @click="MapAdmin(scope.row.id)"
                        >地图管理</el-button
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
                <el-form-item label="楼层序号" prop="order_num">
                    <el-input
                        v-model="form.order_num"
                        placeholder="请输入楼层序号"
                    ></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="principal">
                    <el-input
                        v-model="form.principal"
                        placeholder="请输入负责人"
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input
                        v-model="form.contact"
                        placeholder="请输入联系方式"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
        <Yg-Drawer
            v-model="showMapDrawer"
            title="地图管理"
            @confirm="mapconfirmForm"
            @closed="mapdrawerClosed"
            @cancel="mapdrawerClosed"
        >
            <el-form>
                <el-form-item label="上传图片">
                    <UploadImg v-model="imgList" :limit="1"></UploadImg>
                </el-form-item>
                <el-form-item label="地图资源">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="mapres"
                        resize="none"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="中心坐标">
                    <el-input v-model="COI" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getFloorList,
    addFloor,
    getInfo,
    updateFloor,
    delFloor,
} from "@/request/api/market/areaAdmin/floorAdmin";
export default {
    name: "floor",
    data() {
        return {
            total: 0,
            pagings: {
                pageNum: 1,
                pageSize: 20,
            },
            COI: "",
            mapres: "",
            imgList: [],
            showMapDrawer: false,
            itemId: "",
            form: {},
            rules: {
                order_num: [
                    {
                        required: true,
                        message: "请输入区域名称",
                        trigger: "blur",
                    },
                ],
                principal: [
                    {
                        required: true,
                        message: "请输入区域名称",
                        trigger: "blur",
                    },
                ],
                contact: [
                    {
                        required: true,
                        message: "请输入区域名称",
                        trigger: "blur",
                    },
                ],
            },
            btnLoading: false,
            drawerType: "",
            showDrawer: false,
            tableData: [],
            loading: false,
            id: this.$route.query.id,
        };
    },
    methods: {
        mapconfirmForm() {
            let res = {};
            for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id == this.itemId) {
                    res.order_num = this.tableData[i].order_num;
                    res.principal = this.tableData[i].principal;
                    res.contact = this.tableData[i].contact;
                }
            }
            res.map = this.imgList.join(",");
            res.map_resource = this.mapres;
            res.center = this.COI;
            res.is_map = 1;
            updateFloor(res, this.itemId)
                .then((resp) => {
                    this.showMapDrawer = false;
                    this.$toast("编辑成功！");
                    this.getList();
                })
                .finally((error) => {
                    this.btnLoading = false;
                });
        },
        mapdrawerClosed() {
            this.showMapDrawer = false;
        },
        MapAdmin(id) {
            //打开地图管理
            this.showMapDrawer = true;
            this.itemId = id;
            const self = this,
                loading = this.$load();
            getInfo(this.itemId)
                .then((resp) => {
                    let res = resp.data;
                    self.imgList = res.map ? [res.map] : [];
                    self.mapres = res.map_resource;
                    self.COI = res.center;
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.btnLoading = true;
                    self.form.building_manage = Number(self.id);
                    if (self.drawerType == "add") {
                        //新增
                        addFloor(self.form)
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
                        updateFloor(self.form, self.itemId)
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
        getInfo() {
            const self = this,
                loading = this.$load();
            getInfo(this.itemId)
                .then((resp) => {
                    let res = self.filterObj(resp.data, [
                        "order_num",
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
        operation(type, id) {
            this.form = {};
            this.showDrawer = true;
            this.itemId = id;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        del(id) {
            //删除
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delFloor(id).then((res) => {
                    self.$toast("删除成功！");
                    self.getList();
                });
            });
        },
        getList() {
            getFloorList(this.id, this.pagings)
                .then((resp) => {
                    this.tableData = resp.data.results;
                    this.total = resp.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        drawerClosed() {
            this.showDrawer = false;
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
</style>

