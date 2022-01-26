<template>
    <div
        class="form-layout"
        v-loading="loading"
        element-loading-text="请求数据中，请稍后..."
        :style="{
            background: background,
        }" 
    >
        <div class="form-main">
            <el-scrollbar style="height: 100%" :class="{'padding-none' : paddingNone}">
                <slot></slot>
            </el-scrollbar>
        </div>
        <div class="form-footer" v-if="!hiddenFooter">
            <slot name="footer"></slot>
            <el-button @click="cancel" v-if="showCancelBtn">{{
                cancelBtnText
            }}</el-button>
            <el-button type="primary" @click="onSubmit" v-if="showSubmitBtn">{{
                submitBtnText
            }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Form-layout",
    data() {
        return {};
    },
    props: {
        submitBtnText: {
            type: String,
            default: "确定",
        },
        cancelBtnText: {
            type: String,
            default: "取消",
        },
        showCancelBtn: {
            type: Boolean,
            default: true,
        },
        showSubmitBtn: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        background: {
            type: String,
            default: "#fff",
        },
        paddingNone: {
            type: Boolean,
            default: false,
        },
        hiddenFooter: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        onSubmit() {
            this.$emit("submit");
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.form-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.padding-none{
        padding: 0;
    }
    .form-main {
        flex: 1;
        overflow: hidden;
        ::v-deep .el-scrollbar{
            .el-scrollbar__wrap {
                overflow-x: hidden;
                .el-scrollbar__view {
                    position: relative;
                    padding: 20px;
                }
            }
            &.padding-none{
                .el-scrollbar__view {
                    padding: 0px;
                }
            }
        }
    }
    .form-footer {
        padding: 10px 20px;
        display: flex;
        justify-content: flex-end;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
            0 0 3px 0 rgba(0, 0, 0, 0.04);
        position: relative;
        z-index: 999;
    }
}
</style>
