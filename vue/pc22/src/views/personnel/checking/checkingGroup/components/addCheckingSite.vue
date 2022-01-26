<template>
    <el-dialog
        title="考勤地点"
        :visible.sync="selectSiteDialog"
        width="800px"
        destroy-on-close
        @closed="dialogClose"
    >
        <el-steps :active="active" align-center>
            <el-step title="选择考勤地点和范围"></el-step>
            <el-step title="设置地点名称"></el-step>
        </el-steps>
        <div id="myMap" v-show="active == 1">
            <div class="myMap-header">
                <el-amap-search-box
                    class="search-box"
                    :search-option="map.searchOption"
                    :on-search-result="onSearchResult"
                ></el-amap-search-box>
                <el-select v-model="map.radius" placeholder="请选择">
                    <el-option
                        v-for="(item, index) in scopeList"
                        :key="index"
                        :value="item"
                    >
                        <span>{{ item }}</span>
                        <span style="margin-left: 10px">米</span>
                    </el-option>
                </el-select>
            </div>
            <el-amap
                ref="may-amap"
                class="amap-box"
                :vid="'amap-vue'"
                :zoom="map.zoom"
                :plugin="map.plugin"
                :center="map.center"
                :events="map.events"
            >
                <el-amap-marker
                    v-for="(o, index) in markers"
                    :key="'marker' + index"
                    :position="o.position"
                    :vid="'marker' + index"
                    :title="o.title"
                ></el-amap-marker>
                <el-amap-circle
                    v-for="(o, index) in markers"
                    :key="'circle' + index"
                    :center="o.position"
                    :radius="map.radius"
                    :vid="'circle'"
                    :strokeColo="map.color"
                    :strokeWeight="2"
                    :fillColor="map.color"
                    :fillOpacity="0.5"
                ></el-amap-circle>
            </el-amap>
        </div>
        <div v-show="active == 2" class="dialogForm">
            <el-form
                :model="dialogForm"
                label-width="200px"
                :rules="DialogRules"
                ref="dialogForm"
            >
                <el-form-item label="考勤详细地址：">
                    <p>
                        {{ dialogForm.address }}
                    </p>
                </el-form-item>
                <el-form-item label="经纬度坐标：">
                    <p>
                        {{ dialogForm.coordinate }}
                    </p>
                </el-form-item>
                <el-form-item label="有效范围：">
                    <p>{{ dialogForm.scope }} 米</p>
                </el-form-item>
                <el-form-item label="考勤地点名称：" prop="checkingName">
                    <el-input v-model="dialogForm.checkingName"></el-input>
                    <div class="tip">
                        该名称会在打卡手机端显示，便于员工识别打卡地点
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <div v-show="active == 1">
                <el-button @click="selectSiteDialog = false">取消</el-button>
                <el-button type="primary" @click="next">下一步</el-button>
            </div>
            <div v-show="active == 2">
                <el-button @click="active = 1">上一步</el-button>
                <el-button type="primary" @click="addCheckingSite"
                    >确 定</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "addCheckingSite",
    data() {
        let self = this;
        return {
            selectSiteDialog: this.show,
            map: {
                center: [116.397428, 39.90923],
                zoom: 16,
                lng: 0,
                lat: 0,
                color: "#048790",
                radius: 100,
                searchOption: {
                    city: "全国",
                    citylimit: false,
                },
                plugin: [
                    //一些工具插件
                    {
                        pName: "Geolocation",
                        events: {
                            init(o) {
                                o.getCurrentPosition((status, result) => {
                                    if (result && result.position) {
                                        self.settingMarkers({
                                            lng: result.position.lng,
                                            lat: result.position.lat,
                                            title: result.formattedAddress,
                                        });
                                        self.$nextTick();
                                    }
                                });
                                AMap.event.addListener(o, "complete", (e) => {
                                    self.settingMarkers({
                                        lng: e.position.lng,
                                        lat: e.position.lat,
                                        title: e.formattedAddress,
                                    });
                                });
                            },
                        },
                    },
                ],
                events: {
                    click(e) {
                        let { lng, lat } = e.lnglat;
                        // 这里通过高德 SDK 完成。
                        let geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all",
                        });
                        geocoder.getAddress(
                            [lng, lat],
                            function (status, result) {
                                if (
                                    status === "complete" &&
                                    result.info === "OK"
                                ) {
                                    if (result && result.regeocode) {
                                        self.settingMarkers({
                                            lng: lng,
                                            lat: lat,
                                            title: result.regeocode
                                                .formattedAddress,
                                        });
                                    }
                                }
                            }
                        );
                    },
                },
            },
            markers: [],
            active: 1,
            dialogForm: {},
            DialogRules: {
                checkingName: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        scopeList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    methods: {
        settingMarkers(result) {
            let { lng, lat, title } = result;
            this.map.lng = lng;
            this.map.lat = lat;
            this.map.center = [lng, lat];
            let marker = {
                position: [lng, lat],
                title: title,
            };
            this.markers = [];
            this.markers.push(marker);
            document.querySelector(".search-box-wrapper input").value = title;
        },
        onSearchResult(pois) {
            let result = pois[0];
            let { lat, lng, name } = result;
            this.settingMarkers({
                lng: lng,
                lat: lat,
                formattedAddress: name,
            });
        },
        next() {
            this.active = 2;
            let site = this.markers[0];
            this.dialogForm = {
                address: site.title,
                coordinate: site.position.join(","),
                position: site.position,
                scope: this.map.radius,
                checkingName: site.title,
            };
        },
        addCheckingSite() {
            this.$refs["dialogForm"].validate((valid) => {
                if (valid) {
                    this.selectSiteDialog = false;
                    this.$emit("confirm", this.dialogForm);
                }
            });
        },
        dialogClose() {
            this.$refs["dialogForm"].resetFields();
            this.dialogForm = {};
            this.map.radius = 100;
            this.active = 1;
            this.selectSiteDialog = false;
            this.$emit("update:show", false);
        },
    },
    watch: {
        show() {
            this.selectSiteDialog = this.show;
        },
    },
};
</script>

<style scoped lang="scss">
.form-item-title {
    color: #1f2f3d;
    margin: 20px 0;
    font-size: 22px;
}
::v-deep .el-dialog__header {
    border-bottom: solid 1px #ddd;
}
#myMap {
    width: 100%;
    height: 320px;
    position: relative;
    margin-top: 30px;
    .myMap-header {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 150;
        padding: 16px 24px;
        display: flex;
        .el-vue-search-box-container {
            height: 36px;
        }
        ::v-deep .el-select {
            margin-left: 20px;
            width: 100px;
        }
    }
}
.dialogForm {
    margin: 30px 0;
    display: flex;
    justify-content: center;
}
</style>

