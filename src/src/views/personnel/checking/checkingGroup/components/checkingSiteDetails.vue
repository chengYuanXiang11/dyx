<template>
    <el-dialog
        title="查看考勤地点"
        :visible.sync="siteDetailsDialog"
        width="800px"
        destroy-on-close
        @closed="dialogClose"
    >
        <div id="myMap">
            <el-amap
                class="amap-box"
                vid="amap-vue-details"
                :zoom="map.zoom"
                :plugin="map.plugin"
                :center="data.position"
            >
                <el-amap-marker
                    :position="data.position"
                    vid="marker-details"
                    :title="data.address"
                ></el-amap-marker>
                <el-amap-circle
                    :center="data.position"
                    :radius="data.scope"
                    vid="circle-details"
                    :strokeColo="map.color"
                    :strokeWeight="2"
                    :fillColor="map.color"
                    :fillOpacity="0.5"
                ></el-amap-circle>
            </el-amap>
        </div>
        <el-descriptions :column="1" class="address-details">
            <el-descriptions-item label="考勤详细地址"
                >{{data.address}}</el-descriptions-item
            >
            <el-descriptions-item label="经纬度坐标"
                >{{data.coordinate}}</el-descriptions-item
            >
            <el-descriptions-item label="有效范围"
                >{{data.scope}} 米</el-descriptions-item
            >
            <el-descriptions-item label="考勤地点名称"
                ><p>{{data.checkingName}}</p>
                <div class="tip">
                    该名称会在打卡手机端显示，便于员工识别打卡地点
                </div></el-descriptions-item
            >
        </el-descriptions>
    </el-dialog>
</template>

<script>
export default {
    name: "checkingSiteDetails",
    data() {
        return {
            siteDetailsDialog: this.show,
            map: {
                zoom: 16,
                color: "#048790",
                radius: 100,
            },
            markers: [],
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data:{
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    methods: {
        dialogClose(){
            this.$emit("update:show", false);
        },
    },
    watch: {
        show() {
            this.siteDetailsDialog = this.show;
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep .address-details{
    margin-top: 30px;
    .el-descriptions-item__label{
        width: 100px;
        text-align: right;
    }
    .tip{
        color: #999;
    }
}
::v-deep .el-dialog__header {
    border-bottom: solid 1px #ddd;
}
#myMap {
    width: 100%;
    height: 320px;
    position: relative;
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

