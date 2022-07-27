<template>
    <div class="app-container">
        <div class="operation" style="position: relative">
            <el-form :inline="true">
                <template v-if="activeName == 'point'">
                    <el-form-item label="巡更点名称">
                        <el-input
                            v-model="paging.pointname__icontains"
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        style="position: absolute; right: 20px"
                        v-if="activeName == 'point'"
                    >
                        <el-button @click="reset">重置</el-button>
                        <el-button type="primary" @click="getPointList"
                            >查询</el-button
                        >
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="巡更路线名称">
                        <el-input
                            v-model="Pathpaging.routinename__icontains"
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="巡更顺序">
                        <el-select
                            v-model="Pathpaging.routine_order"
                            clearable
                            placeholder="请选择"
                        >
                            <el-option label="有序" value="1"></el-option>
                            <el-option label="无序" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="position: absolute; right: 20px">
                        <el-button @click="Pathreset">重置</el-button>
                        <el-button type="primary" @click="getPathList()"
                            >查询</el-button
                        >
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <el-divider></el-divider>
        <div class="operation">
            <el-button
                type="primary"
                @click="operation('add')"
                v-if="activeName == 'point'"
                >新建</el-button
            >
            <el-button type="primary" @click="addPath" v-else>新建</el-button>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="巡更点" name="point">
                <el-table
                    :data="PointTableData"
                    class="yg-table"
                    v-loading="loading"
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        width="100"
                    ></el-table-column>
                    <el-table-column label="巡更点" prop="pointname" />
                    <el-table-column label="备注" prop="remark" />
                    <el-table-column label="设备编号">
                        <template slot-scope="scope">
                            <li
                                v-for="(item, index) in scope.row.device_detail"
                                :key="'device' + index"
                            >
                                <span v-if="scope.row.device_detail.length > 1"
                                    >{{ index + 1 }}.</span
                                >
                                {{ item.device_name }}
                            </li>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="operation('edit', scope.row.id)"
                                >编辑</el-button
                            >
                            <el-button
                                type="text"
                                @click="delPoint(scope.row.id)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination
                    :total="paging.total"
                    :page.sync="paging.pageNum"
                    :limit.sync="paging.pageSize"
                    @pagination="getPointList"
                />
            </el-tab-pane>
            <!-- 巡更路线 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <el-tab-pane label="巡更路线" name="route">
                <el-table
                    :data="PathTableData"
                    class="yg-table"
                    v-loading="loading"
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        width="100"
                    ></el-table-column>
                    <el-table-column
                        label="路线名称"
                        prop="routinename"
                    ></el-table-column>
                    <el-table-column label="巡更顺序">
                        <template slot-scope="scope">
                            {{
                                scope.row.routine_order == "1" ? "有序" : "无序"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="巡更路线"
                        prop="routine_routine"
                    ></el-table-column>
                    <el-table-column
                        label="巡更点数量"
                        prop="point_count"
                    ></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="editPath(scope.row.id)"
                                >编辑</el-button
                            >
                            <el-button
                                type="text"
                                @click="delPath(scope.row.id)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination
                    :total="Pathpaging.total"
                    :page.sync="Pathpaging.pageNum"
                    :limit.sync="Pathpaging.pageSize"
                    @pagination="getPathList"
                />
            </el-tab-pane>
        </el-tabs>
        <!-- 巡更点抽屉 -->
        <Yg-Drawer
            v-model="showDrawer"
            :title="drawerType == 'add' ? '新建' : '编辑'"
            @confirm="confirmForm"
            @closed="drawerClosed"
            @cancel="drawerClosed"
            :confirmLoading="btnLoading"
        >
            <el-form
                :model="form"
                ref="form"
                :rules="rules"
                label-width="100px"
            >
                <el-form-item label="巡更点名称" prop="pointname">
                    <el-input
                        v-model="form.pointname"
                        show-word-limit
                        :maxlength="6"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        rows="3"
                        resize="none"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="'设备编号' + (index + 1)"
                    v-for="(item, index) in form.creator"
                    :key="index"
                    :prop="'creator.' + index + '.device_name'"
                    :rules="{
                        required: true,
                        message: '设备编号不能为空',
                        trigger: 'blur',
                    }"
                >
                    <el-input
                        v-model="item.device_name"
                        style="width: 80%; margin-right: 20px"
                    ></el-input>
                    <el-button type="text" @click="delFacility(index)"
                        ><i class="el-icon-delete" style="font-size: 20px"></i
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="addFacility"
                        >+ 设备编号</el-button
                    >
                </el-form-item>
            </el-form>
        </Yg-Drawer>
        <!-- 巡更路线抽屉 -->
        <Yg-Drawer
            v-model="showRouteDrawer"
            :title="`${RouteDrawerType == 'add' ? '新建' : '编辑'}路线`"
            size="1080px"
            @confirm="confirmRoute"
            @closed="hideRouteDrawer"
            @cancel="hideRouteDrawer"
            :confirmLoading="routeBtnLoading"
        >
            <div class="route-drawer-main">
                <div class="header">
                    <el-form
                        :model="routeForm"
                        ref="routeForm"
                        :rules="routeRules"
                        label-width="100px"
                        :inline="true"
                    >
                        <el-form-item label="路线名称" prop="routinename">
                            <el-input
                                v-model="routeForm.routinename"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="巡更顺序" prop="routine_order">
                            <el-radio-group v-model="routeForm.routine_order">
                                <el-radio label="1">有序</el-radio>
                                <el-radio label="2">无序</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="body">
                    <div class="route-line">
                        <div class="title">
                            路线巡更点：{{ routeList.length }}个
                        </div>
                        <div class="line-main">
                            <draggable
                                v-model="routeList"
                                forceFallback="true"
                                group="people"
                                animation="100"
                                class="draggable"
                            >
                                <div
                                    class="item"
                                    v-for="(item, index) in routeList"
                                    :key="index"
                                >
                                    <div class="item-text">
                                        <span
                                            v-if="
                                                routeForm.routine_order == '1'
                                            "
                                            >{{ index + 1 }}</span
                                        >
                                        <p>
                                            {{ item.pointname }}
                                        </p>
                                    </div>
                                    <svg-icon
                                        icon-class="Close-Circle-Fill"
                                        @click="removeItem(item)"
                                    ></svg-icon>
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <div class="route-list">
                        <div class="search">
                            <div class="title">
                                巡更点
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    placement="top"
                                >
                                    <div slot="content" class="tooltip">
                                        <p>点击：添加</p>
                                        <p>拖拽：添加或改变顺序</p>
                                    </div>
                                    <svg-icon
                                        icon-class="Question-Circle-Line"
                                    ></svg-icon>
                                </el-tooltip>
                            </div>
                            <el-input
                                placeholder="请输入关键词搜索"
                                v-model="searchRoutineName"
                                ><i
                                    slot="prefix"
                                    class="el-input__icon el-icon-search"
                                ></i
                            ></el-input>
                        </div>
                        <ul>
                            <draggable
                                v-model="routeAllList"
                                forceFallback="true"
                                group="people"
                                animation="100"
                                class="draggable"
                            >
                                <li
                                    v-for="(item, index) in formatArr"
                                    :key="index"
                                    @click="addItem(item)"
                                >
                                    <p>
                                        {{ item.pointname }}
                                    </p>
                                </li>
                            </draggable>
                        </ul>
                    </div>
                </div>
            </div>
        </Yg-Drawer>
    </div>
</template>

<script>
import {
    getPointList,
    addPoint,
    delPoint,
    getInfoPoint,
    updatePoint,
    getPathList,
    addPath,
    delPath,
    getPathInfo,
    updatePath,
} from "@/request/api/market/watchmanAdmin/itinerary.js";
import draggable from "vuedraggable";
export default {
    name: "itinerary",
    components: {
        draggable,
    },
    data() {
        return {
            showRouteDrawer: false,
            RouteDrawerType: "add",
            PathTableData: [],
            //分割
            btnLoading: false,
            PointTableData: [],
            loading: false,
            activeName: "point",
            showDrawer: false,
            drawerType: "",
            itemId: "",
            form: {
                creator: [{ id: 1, device_name: "" }],
            },
            rules: {
                pointname: [
                    {
                        required: true,
                        message: "请输入巡更点名称",
                        trigger: "blur",
                    },
                ],
            },
            paging: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
            },
            Pathpaging: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
            },
            routeForm: {
                routinename: "",
                routine_order: "1",
            },
            routeRules: {
                routinename: [
                    {
                        required: true,
                        message: "请输入巡更路线名称",
                        trigger: "blur",
                    },
                ],
                routine_order: [
                    {
                        required: true,
                        message: "请选择巡更顺序",
                        trigger: "change",
                    },
                ],
            },
            routeAllList: [],
            routeList: [],
            searchRoutineName: "",
            routeBtnLoading: false,
        };
    },
    computed: {
        formatArr() {
            return this.routeAllList.filter((item) => {
                return item.pointname.indexOf(this.searchRoutineName) != -1;
            });
        },
    },
    methods: {
        Pathreset() {
            //重置查询巡更路线
            this.Pathpaging = {
                pageNum: 1,
                pageSize: 20,
                total: 0,
            };
            this.getPathList();
        },
        delPath(id) {
            //删除巡更路线
            let self = this;
            delPath(id).then((resp) => {
                self.$toast("删除成功！");
                self.getPathList();
            });
        },
        addPath() {
            this.showRouteDrawer = true;
            this.RouteDrawerType = "add";
            this.Pathoperation();
        },
        Pathoperation() {
            getPointList({
                pageNum: "all",
            }).then((resp) => {
                this.routeAllList = []
                resp.data.map((item) => {
                    let has = this.routeList.find((v) => item.id == v.id);
                    if (!has) {
                        this.routeAllList.push({
                            id: item.id,
                            pointname: item.pointname,
                        })
                    }
                });
            });
        },
        confirmRoute() {
            this.$refs["routeForm"].validate((valid) => {
                if (valid) {
                    this.routeBtnLoading = true;
                    let routine_routine = this.routeList.map((item) => {
                        return item.id;
                    });
                    let data = {
                        ...this.routeForm,
                        routine_routine,
                    };
                    if (this.RouteDrawerType == "add") {
                        addPath(data)
                            .then((resp) => {
                                this.hideRouteDrawer();
                                this.$toast("新增成功！");
                                this.getPathList();
                            })
                            .finally(() => {
                                this.routeBtnLoading = false;
                            });
                    } else {
                        let id = data.id;
                        delete data.id;
                        updatePath(id, data)
                            .then((resp) => {
                                this.hideRouteDrawer();
                                this.$toast("修改成功！");
                                this.getPathList();
                            })
                            .finally(() => {
                                this.routeBtnLoading = false;
                            });
                    }
                }
            });
        },
        hideRouteDrawer() {
            this.showRouteDrawer = false;
            this.routeAllList = [];
            this.routeList = [];
            this.searchRoutineName = "";
            this.resetForm("routeForm");
        },
        addItem(item) {
            let idx = this.routeAllList.findIndex((v) => v.id == item.id);
            this.routeAllList.splice(idx, 1);
            this.routeList.push(item);
        },
        removeItem(item) {
            let idx = this.routeList.findIndex((v) => v.id == item.id);
            this.routeList.splice(idx, 1);
            this.routeAllList.push(item);
        },
        editPath(id) {
            getPathInfo(id).then((res) => {
                let resp = res.data;
                this.routeForm = {
                    routinename: resp.routinename,
                    routine_order: resp.routine_order,
                    id: resp.id,
                };
                this.routeList = resp.point_number.map((item) => {
                    return {
                        id: item.id,
                        pointname: item.name,
                    };
                });
                this.showRouteDrawer = true;
                this.RouteDrawerType = "edit";
                this.Pathoperation();
            });
        },
        getPathList() {
            //获取巡更路线列表
            this.loading = true;
            getPathList(this.Pathpaging)
                .then((resp) => {
                    this.Pathpaging.total = resp.data.count;
                    this.PathTableData = resp.data.results;
                })
                .finally((erroe) => {
                    this.loading = false;
                });
        },
        /* 分割线 ----------------------------------------------------------------------------------------------------------------- */
        reset() {
            //重置
            (this.paging = {
                pageNum: 1,
                pageSize: 20,
                total: 0,
            }),
                this.getPointList();
        },
        getInfoPoint() {
            //获取单条巡更点数据
            getInfoPoint(this.itemId).then((resp) => {
                // console.log(resp.data)
                this.form = resp.data;
                this.form.creator = resp.data.device_detail;
            });
        },
        delPoint(id) {
            //删除巡更点
            delPoint(id).then((resp) => {
                this.getPointList();
            });
        },
        delFacility(index) {
            //删除巡更点设备
            this.form.creator.splice(index, 1);
        },
        addFacility() {
            //添加设备编号
            this.form.creator.push({
                id: 1,
                device_name: "",
            });
        },
        confirmForm() {
            //巡更点抽屉确认按钮
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    if (self.drawerType == "add") {
                        //新增
                        let res = JSON.parse(
                            JSON.stringify(self.form).replace(
                                /creator/g,
                                "device_detail"
                            )
                        );
                        // console.log(res)
                        addPoint(res)
                            .then((resp) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getPointList();
                                self.form = { creator: [] };
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        //修改巡更点
                        let res = {};
                        res.pointname = self.form.pointname;
                        res.remark = self.form.remark;
                        res.device_detail = self.form.creator;
                        updatePoint(self.itemId, res)
                            .then((resp) => {
                                self.showDrawer = false;
                                self.$toast("修改成功！");
                                self.getPointList();
                                self.form = { creator: [] };
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    }
                }
            });
        },
        drawerClosed() {
            //抽屉取消或关闭抽屉触发
            this.showDrawer = false;
            (this.form = { creator: [{ id: 1, device_name: "" }] }),
                this.resetForm("form");
        },
        getPointList() {
            //获取巡更点列表
            this.loading = true;
            getPointList(this.paging)
                .then((resp) => {
                    this.paging.total = resp.data.count;
                    this.PointTableData = resp.data.results;
                    let res = this.PointTableData.map((item) => {
                        return item.id;
                    });
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        handleClick() {
            //切换标签页
            (this.paging = {
                pageNum: 1,
                pageSize: 20,
                total: 0,
            }),
                (this.Pathpaging = {
                    pageNum: 1,
                    pageSize: 20,
                    total: 0,
                }),
                this.activeName == "point"
                    ? this.getPointList()
                    : this.getPathList();
        },
        operation(type, id) {
            //新建或编辑
            // this.form = {}
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfoPoint();
        },
    },
    created() {
        this.getPointList();
    },
};
</script>

<style scoped lang="scss">
.route-drawer-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: -20px;
    .header {
        padding: 20px 20px 0;
        border-bottom: solid 1px rgba(0, 0, 0, 0.06);
    }
    .body {
        flex: 1;
        display: flex;
        .route-line {
            flex: 1;
            display: flex;
            flex-direction: column;
            .title {
                font-weight: 500;
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                padding: 16px 24px;
            }
            .line-main {
                flex: 1;
                .draggable {
                    padding: 16px 24px;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    .item {
                        float: left;
                        width: 144px;
                        height: 40px;
                        background: #048790;
                        border-radius: 2px;
                        box-sizing: border-box;
                        padding: 0px 10px;
                        margin-right: 60px;
                        margin-bottom: 48px;
                        position: relative;
                        .item-text {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            span {
                                border: solid 1px #fff;
                                display: block;
                                width: 15px;
                                height: 15px;
                                border-radius: 2em;
                                text-align: center;
                                line-height: 15px;
                                font-size: 10px;
                                margin-right: 5px;
                                background: #fff;
                                color: #048790;
                            }
                            p {
                                max-width: calc(100% - 20px);
                                line-height: 40px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                color: #ffffff;
                                font-size: 14px;
                                text-align: center;
                            }
                        }
                        &:nth-child(4n) {
                            margin-right: 0;
                        }
                        .svg-icon {
                            position: absolute;
                            right: -7px;
                            top: -7px;
                            fill: #000;
                            // background: #fff;
                            border-radius: 2em;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .route-list {
            width: 226px;
            border-left: solid 1px rgba(0, 0, 0, 0.06);
            height: 100%;
            padding: 16px;
            display: flex;
            flex-direction: column;
            .search {
                .title {
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    color: rgba(1, 6, 33, 0.9);
                    font-weight: 500;
                    margin-bottom: 13px;
                    .svg-icon {
                        margin: 2px 0 0 5px;
                    }
                }
            }
            .draggable {
                width: 100%;
                height: 100%;
            }
            ul {
                margin-top: 8px;
                padding: 0 25px 24px;
                overflow: hidden;
                flex: 1;
                li {
                    height: 40px;
                    border-radius: 2px;
                    border: 1px solid #d0d0d3;
                    line-height: 40px;
                    text-align: center;
                    margin-top: 16px;
                    color: rgba(1, 6, 33, 0.75);
                    font-size: 14px;
                    &:hover {
                        border-color: #048790;
                        color: #048790;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.tooltip {
    padding: 2px 6px;
    p:first-child {
        margin-bottom: 10px;
    }
}
</style>