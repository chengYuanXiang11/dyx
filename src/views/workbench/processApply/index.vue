<template>
    <div class="app-container">
        <div class="Processapply-main" v-for="o in activeUsers" :key="o.id">
            <div class="title">{{ o.name }}</div>
            <div class="item-body">
                <div
                    class="item"
                    v-for="n in o.child_data"
                    :key="n.id"
                    @click="goApply(n)"
                >
                    <div>
                        <i
                            class="svg-icon"
                            :class="n.icon ? n.icon : svgIcon(n.flow_name)"
                            :style="{ background: svgColor(n.flow_name) }"
                        ></i>
                    </div>

                    <div>{{ n.flow_name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getFlow } from "@/request/api/system/flow.js";

export default {
    name: "Processapply",
    data() {
        return {
            itemList: [],
        };
    },
    methods: {
        goApply(value) {
            // 根据id去拿对应数据
            this.$router.push({
                path: `/TabaleApply?flow_name=${
                    value.flow_name + "列表"
                }&code=${value.code}&id=${value.id}&name=${value.flow_name}`,
            });
        },
        svgIcon(type) {
            switch (type) {
                case "请假申请":
                case "补卡申请":
                case "加班申请":
                    return "el-icon-time";
                case "加班申请":
                case "外出申请":
                case "离职申请":
                case "用章申请":
                case "用车申请":
                    return "el-icon-coordinate";
                case "调班申请":
                    return "el-icon-refresh";
                case "出差申请":
                    return "el-icon-office-building";
                case "预算申请":
                case "付款申请":
                case "报销申请":
                case "备用金申请":
                case "借款申请":
                case "预算调整":
                    return "el-icon-sold-out";
            }
        },
        svgColor(type) {
            switch (type) {
                case "请假申请":
                case "补卡申请":
                case "出差申请":
                    return "#1890FF";
                case "加班申请":
                case "外出申请":
                case "离职申请":
                case "用章申请":
                case "用车申请":
                    return "#FA8C16";
                case "调班申请":
                    return "#52C41A ";
                case "预算申请":
                case "付款申请":
                case "报销申请":
                case "备用金申请":
                case "借款申请":
                case "预算调整":
                    return "#FF4D4F ";
            }
        },
    },
    computed: {
        activeUsers() {
            if (this.itemList.length > 0) {
                return this.itemList.filter(function (item) {
                    return item.status === 1;
                });
            } else {
                return [];
            }
        },
    },
    activated() {
        getFlow().then((res) => {
            this.itemList = res.data.results.reverse();
        });
    },
    created() {
        getFlow().then((res) => {
            this.itemList = res.data.results.reverse();
        });
    },
};
</script>

<style scoped lang="scss">
.Processapply-main {
    .title {
        font-size: 24px;
        margin: 20px 0;
    }
    .item-body {
        display: flex;
        flex-flow: row wrap;
        .item {
            width: 240px;
            height: 46px;
            border: solid 1px #ddd;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-right: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
            .svg-icon {
                width: 30px;
                height: 30px;
                margin: 0 15px;
                padding: 3px;
                color: #fff;
                font-size: 30px;
                border-radius: 3px;
            }
            span {
                margin-top: 10px;
            }
            &:hover {
                background-color: #048790;
                color: #fff;
                border-color: #048790;
                cursor: pointer;
            }
        }
    }
}
</style>
