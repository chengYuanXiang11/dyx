<template>
    <div class="area-select">
        <!-- <el-form-item
            label="所在区域"
            :rules="[
                { required: true, message: '请选择所在区域', trigger: 'change' },
            ]"
        > -->
            <el-select
                v-model="area"
                placeholder="请选择所在区域"
                @change="selectChange($event, 'area')"
            >
                <el-option
                    v-for="area in areaOption"
                    :key="area.id"
                    :label="area.label"
                    :value="area.value"
                >
                </el-option>
            </el-select>
        <!-- </el-form-item>
        <el-form-item label="所在建筑"
            :rules="[
                { required: true, message: '请选择所在建筑', trigger: 'change' },
            ]"> -->
            <el-select
                v-model="building"
                placeholder="请选择所在建筑"
                @change="selectChange($event, 'building')"
            >
                <el-option
                    v-for="building in buildingOption"
                    :key="building.id"
                    :label="building.label"
                    :value="building.value"
                >
                </el-option>
            </el-select>
        <!-- </el-form-item>
        <el-form-item label="所在楼层"
            :rules="[
                { required: true, message: '请选择所在楼层', trigger: 'change' },
            ]"> -->
            <el-select
                v-model="floor"
                placeholder="请选择所在楼层"
                @change="selectChange($event, 'floor')"
            >
                <el-option
                    v-for="floor in floorOption"
                    :key="floor.id"
                    :label="floor.label"
                    :value="floor.value"
                >
                </el-option>
            </el-select>
        <!-- </el-form-item> -->
        <!-- <el-form-item
            :prop="areaItemName.areaCity"
            label-width="20px"
            class="inline-item street"
        >
            <el-select
                v-model.number="areaForm.areaCity"
                :loading="streetLoading"
                @change="streetChange"
                placeholder="请选择"
                clearable
                :style="{ width: itemCfg.inputWidth }"
            >
                <el-option
                    v-for="cty in streetList"
                    :key="cty.prcName"
                    :label="cty.prcName"
                    :value="cty.prcId"
                >
                    <template v-if="streetLoading" slot="prefix">
                        <i class="el-icon-loading"></i>
                    </template>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            :prop="areaItemName.areaArea"
            label-width="20px"
            class="inline-item village"
        >
            <el-select
                v-model.number="areaForm.areaArea"
                :loading="villageLoading"
                placeholder="请选择"
                clearable
                :style="{ width: itemCfg.inputWidth }"
            >
                <el-option
                    v-for="cty in villageList"
                    :key="cty.prcName"
                    :label="cty.prcName"
                    :value="cty.prcId"
                >
                </el-option>
                <template v-if="villageLoading" slot="prefix">
                    <i class="el-icon-loading"></i>
                </template>
            </el-select>
        </el-form-item> -->
    </div>
</template>

<script>
import { getList } from "@/request/api/market/areaAdmin/areaAdmin";
import { getBuildingList } from "@/request/api/market/areaAdmin/buildingAdmin";
import { getFloorList } from "@/request/api/market/areaAdmin/floorAdmin";
export default {
    name: "areaComponents",
    data() {
        return {
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    console.log(level);
                    setTimeout(() => {
                        if (level == 0) {
                            getList({
                                pageNum: "all",
                            }).then((res) => {
                                const nodes = res.data.map((value, i) => ({
                                    value: value.id,
                                    label: value.area_name,
                                    leaf: node.level >= 2,
                                }));
                                resolve(nodes);
                            });
                            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        } else if (level == 1) {
                            getBuildingList(data.value, {
                                pageNum: "all",
                            }).then((res) => {
                                const nodes = res.data.map((value, i) => ({
                                    value: value.id,
                                    label: value.building_name,
                                    leaf: node.level >= 2,
                                }));
                                resolve(nodes);
                            });
                        } else if (level == 2) {
                            getFloorList(data.value, {
                                pageNum: "all",
                            }).then((res) => {
                                const nodes = res.data.map((value, i) => ({
                                    value: value.id,
                                    label: value.order_num,
                                    leaf: node.level >= 2,
                                }));
                                resolve(nodes);
                            });
                        }
                    }, 100);
                },
            },
            area: "",
            areaOption: [],
            building: "",
            buildingOption: [],
            floor: "",
            floorOption: [],
        };
    },
    props: {
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        value(newVal) {
            this.init();
        },
    },
    methods: {
        emit(e) {
            let datas = [this.area, this.building, this.floor];
            this.$emit("input", datas);
        },
        getList() {
            getList({
                pageNum: "all",
            }).then((res) => {
                this.areaOption = res.data.map((value, i) => ({
                    value: value.id,
                    label: value.area_name,
                }));
            });
        },
        getBuildingList(id) {
            getBuildingList(id, {
                pageNum: "all",
            }).then((res) => {
                this.buildingOption = res.data.map((value, i) => ({
                    value: value.id,
                    label: value.building_name,
                }));
            });
        },
        selectChange(e, type) {
            switch (type) {
                case "area":
                    this.buildingOption = [];
                    this.building = "";
                    this.getBuildingList(e);
                    break;
                case "building":
                    this.getFloorList(e);
                    break;
                case "floor":
                    break;
            }
            if (type != "floor") {
                this.floorOption = [];
                this.floor = "";
            }
            this.emit();
        },
        getFloorList(id) {
            getFloorList(id, {
                pageNum: "all",
            }).then((res) => {
                this.floorOption = res.data.map((value, i) => ({
                    value: value.id,
                    label: value.order_num,
                }));
            });
        },
        init() {
            if (this.value.length > 0) {
                if (this.value.length != 3) {
                    throw new Error("数据格式不正确");
                } else {
                    let arr = JSON.parse(JSON.stringify(this.value));
                    this.getList();
                    this.getBuildingList(arr[0]);
                    this.getFloorList(arr[1]);
                    this.area = arr[0];
                    this.building = arr[1];
                    this.floor = arr[2];
                }
            } else {
                this.area = "";
                this.building = "";
                this.floor = "";
                this.getList();
            }
        },
    },
    created() {
        this.init();
    },
};
</script>
<style lang="scss" scoped>
.area-select{
    display: flex;
    justify-content: space-between;
    min-width: 300px;
    .el-select{
        width: 30%;
    }
}
</style>