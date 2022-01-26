<template>
    <div :class="classObj" class="app-wrapper">
        <div
            v-if="device === 'mobile' && sidebar.opened"
            class="drawer-bg"
            @click="handleClickOutside"
        />
        <sidebar class="sidebar-container" />
        <div class="main-container hasTagsView">
            <div class="fixed-header">
                <navbar />
            </div>
            <app-main />
        </div>
        <div
            :class="['sidebar-switch', { active: sidebar.opened }]"
            @click="toggleSideBar"
        >
            <i class="el-icon-arrow-right"></i>
        </div>
    </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";

export default {
    name: "Layout",
    components: {
        AppMain,
        Navbar,
        Sidebar,
        TagsView,
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            sidebar: (state) => state.app.sidebar,
            device: (state) => state.app.device,
        }),
        ...mapGetters(["sidebar"]),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile",
            };
        },
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch("app/closeSideBar", {
                withoutAnimation: false,
            });
        },
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
    },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
    .sidebar-switch {
        background-color: #fff;
        width: 22px;
        height: 66px;
        cursor: pointer;
        position: fixed;
        left: 56px;
        top: 50%;
        margin-top: 2px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
        border-radius: 0px 2px 2px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 1001;
        transition: left 0.28s;
        &.active {
            left: 202px;
            i {
                transform: rotate(180deg);
            }
        }
    }
    &.mobile{
        .sidebar-switch{
            left: 2px;
            &.active{
                left: 202px;
            }
        }
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
}
.mobile .fixed-header {
    width: 100%;
}
</style>
