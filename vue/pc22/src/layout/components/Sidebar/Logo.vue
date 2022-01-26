<template>
    <div class="sidebar-logo-container" :class="{ collapse: collapse }">
        <transition name="sidebarLogoFade">
            <router-link
                v-if="collapse"
                key="collapse"
                class="sidebar-logo-link"
                to="/"
            >
                <svg-icon icon-class="logo"  class="sidebar-logo"/>
                <h1 class="sidebar-title">{{ title }}</h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <svg-icon icon-class="logo"  class="sidebar-logo"/>
                <h1 class="sidebar-title">{{ title }}</h1>
            </router-link>
        </transition>
    </div>
</template>

<script>
export default {
    name: "SidebarLogo",
    props: {
        collapse: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            title: process.env.VUE_APP_TITLE,
        };
    },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    // height: 50px;
    // line-height: 50px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 9;
    background: var(--default-color);
    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
            // color: var(--default-color);
            color: #fff;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            // color: #333;
            color: #fff;
            // font-weight: 600;
            font-weight: 400;
            // line-height: 50px;
            line-height: 46px;
            font-size: 16px;
            // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px !important;
        }
    }
}
</style>
