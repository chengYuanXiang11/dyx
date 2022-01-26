<template>
    <el-drawer
        v-bind="$attrs"
        v-on="$listeners"
        custom-class="drawer"
        ref="drawer"
    >
        <div class="drawer-main">
            <div class="drawer-body">
                <slot></slot>
            </div>
            <div class="drawer-footer" v-if="showFooter">
                <el-button @click="cancel">{{ cancelBtnText }}</el-button>
                <el-button type="primary" @click="confirm">{{
                    confirmBtnText
                }}</el-button>
            </div>
        </div>
    </el-drawer>
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
            this.$refs['drawer'].closeDrawer();
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .drawer {
    .el-drawer__header {
        margin: 0;
        padding: 0 24px;
        height: 56px;
        font-size: 16px;
        color: #333;
        border-bottom: solid 1px rgba(0, 0, 0, 0.06);
        .el-drawer__close-btn {
            color: rgba(1, 6, 33, 0.55);
        }
    }
    .el-drawer__body {
        height: calc(100vh - 56px);
        .drawer-main {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .drawer-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            .drawer-footer {
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
