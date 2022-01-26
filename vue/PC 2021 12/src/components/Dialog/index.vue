<template>
    <el-dialog
        v-bind="$attrs"
        v-on="$listeners"
        custom-class="dialog"
        ref="dialog"
        top="50px"
    >
        <div class="dialog-main">
            <div class="dialog-body">
                <slot></slot>
            </div>
            <div class="dialog-footer" v-if="showFooter">
                <el-button @click="cancel">{{ cancelBtnText }}</el-button>
                <el-button type="primary" @click="confirm">{{
                    confirmBtnText
                }}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "Drawer",
    data() {
        return {};
    },
    props: {
        cancelBtnText: {
            type: String,
            default: "取消",
        },
        confirmBtnText: {
            type: String,
            default: "保存",
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        confirm() {
            this.$emit("confirm");
        },
        cancel() {
            this.$refs['dialog'].handleClose();
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .dialog {
    .el-dialog__body {
        padding: 0px !important;
        .dialog-main {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .dialog-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                max-height: calc(100vh - 218px);
                min-height: 100px;
            }
            .dialog-footer {
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                border-top: solid 1px rgba(0, 0, 0, 0.06);
                padding: 0 24px;
                .el-button {
                    height: 32px;
                    padding: 0 16px;
                    margin-left: 16px;
                }
            }
        }
    }
}
</style>
