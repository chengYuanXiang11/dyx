<template>
    <div>
        <div
            class="handle-button"
            :style="{ 'background-color': theme }"
            @click="show = !show"
            v-if="!show"
        >
            <i class="el-icon-setting" />
        </div>
        <el-drawer
            :visible.sync="show"
            direction="rtl"
            size="350px"
            :withHeader="false"
        >
            <div class="drawer-container">
                <div>
                    <h3 class="drawer-title">页面样式设置</h3>

                    <div class="drawer-item">
                        <span>主题样式</span>
                        <theme-picker
                            style="
                                float: right;
                                height: 26px;
                                margin: -3px 8px 0 0;
                            "
                            @change="themeChange"
                        />
                    </div>

                    <div class="drawer-item">
                        <span>开启标签页</span>
                        <el-switch v-model="tagsView" class="drawer-switch" />
                    </div>
                    <div class="drawer-item">
                        <span>菜单栏Logo</span>
                        <el-switch
                            v-model="sidebarLogo"
                            class="drawer-switch"
                        />
                    </div>
                    <div class="drawer-item">
                        <span>菜单手风琴</span>
                        <el-switch
                            v-model="uniqueOpened"
                            class="drawer-switch"
                        />
                    </div>
                    <div class="drawer-item">
                        <span>面包屑</span>
                        <el-switch v-model="showCrumbs" class="drawer-switch" />
                    </div>
                    <div class="drawer-item">
                        <span>全屏</span>
                        <el-switch
                            v-model="showFullScreen"
                            class="drawer-switch"
                        />
                    </div>
                    <div class="drawer-item">
                        <span>刷新</span>
                        <el-switch
                            v-model="showRefresh"
                            class="drawer-switch"
                        />
                    </div>
                    <div class="drawer-item">
                        <span>布局</span>
                        <el-select v-model="size" class="drawer-switch" size="mini">
                            <el-option
                                v-for="item of sizeOptions"
                                :key="item.value"
                                :disabled="size === item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import ThemePicker from "../Tool/ThemePicker";

export default {
    components: { ThemePicker },
    data() {
        return {
            show: false,
            sizeOptions: [
                { label: "默认", value: "default" },
                { label: "中等", value: "medium" },
                { label: "小", value: "small" },
                { label: "超小", value: "mini" },
            ],
        };
    },
    computed: {
        tagsView: {
            get() {
                return this.$store.state.settings.tagsView;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "tagsView",
                    value: val,
                });
            },
        },
        sidebarLogo: {
            get() {
                return this.$store.state.settings.sidebarLogo;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "sidebarLogo",
                    value: val,
                });
            },
        },
        uniqueOpened: {
            get() {
                return this.$store.state.settings.uniqueOpened;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "uniqueOpened",
                    value: val,
                });
            },
        },
        showCrumbs: {
            get() {
                return this.$store.state.settings.showCrumbs;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "showCrumbs",
                    value: val,
                });
            },
        },
        showFullScreen: {
            get() {
                return this.$store.state.settings.showFullScreen;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "showFullScreen",
                    value: val,
                });
            },
        },
        showRefresh: {
            get() {
                return this.$store.state.settings.showRefresh;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "showRefresh",
                    value: val,
                });
            },
        },
        size: {
            get() {
                return this.$store.getters.size;
            },
            set(val) {
                this.$store.dispatch("app/setSize", val);
                this.$ELEMENT.size = val;
                this.refreshView();
                this.$success('切换成功');
            },
        },
        theme() {
            return this.$store.state.settings.theme;
        },
    },
    methods: {
        themeChange(val) {
            this.$store.dispatch("settings/changeSetting", {
                key: "theme",
                value: val,
            });
        },
        refreshView() {
            // In order to make the cached page re-rendered
            this.$store.dispatch("tagsView/delAllCachedViews", this.$route);

            const { fullPath } = this.$route;

            this.$nextTick(() => {
                this.$router.replace({
                    path: "/redirect" + fullPath,
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        padding: 12px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .drawer-switch {
        float: right;
    }
}
.handle-button {
    width: 48px;
    height: 48px;
    position: absolute;
    right: 0px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;
    top: 50%;
    margin-top: -24px;
    z-index: 999;
    i {
        font-size: 24px;
        line-height: 48px;
    }
}
</style>
