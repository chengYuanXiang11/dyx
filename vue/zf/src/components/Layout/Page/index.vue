<template>
    <div
        class="container-main"
        :style="{
            background: background,
        }"
    >
        <el-scrollbar style="height: 100%" :class="{'padding-none' : paddingNone}">
            <slot></slot>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: "Page-layout",
    props: {
        paddingNone: {
            type: Boolean,
            default: false,
        },
        background: {
            type: String,
            default: "#fff",
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.container-main {
    height: 100%;
    ::v-deep .el-scrollbar{
        .el-scrollbar__wrap {
            overflow-x: hidden;
            .el-scrollbar__view {
                min-height: 100%;
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
</style>
