<template>
    <!-- 补卡时间组件 -->
    <div class="block">

        <el-date-picker
            class="date-pick"
            v-model="dataValue"
            type="datetime"
            placeholder="选择补卡时间"

        >
        </el-date-picker>
        <el-link type="info" :underline="false" v-if="value"
            >可补卡时间：{{ `${startMakeup}   -   ${endMakeup}` }}</el-link
        >
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "holiday-types",
    data() {
        return {};
    },
    props: {
        value: {
            type: null,
            default: null,
        },
    },
    watch: {},
    methods: {},
    computed: {
        dataValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
        startMakeup() {
            if (this.dataValue === null) {
                return "";
            } else {
                return moment(
                    new Date(this.dataValue.getTime() - 60 * 60 * 1000)
                ).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        endMakeup() {
            if (this.dataValue === null) {
                return "";
            } else {
                return moment(
                    new Date(this.dataValue.getTime() + 60 * 30 * 1000)
                ).format("YYYY-MM-DD HH:mm");
            }
        },
    },
};
</script>
<style scoped lang="scss">
::v-deep .el-input--medium .el-input__inner {
    padding-left: 15px;
}
</style>
