<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />

        <breadcrumb
            id="breadcrumb-container"
            class="breadcrumb-container"
            v-if="showCrumbs"
        />

        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <screenfull
                    id="screenfull"
                    class="right-menu-item hover-effect"
                    v-if="showFullScreen"
                />
                <div
                    class="right-menu-item hover-effect"
                    @click="refresh"
                    v-if="showRefresh"
                >
                    <i class="el-icon-refresh-right"></i>
                </div>
            </template>

            <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                trigger="click"
            >
                <div class="avatar-wrapper">
                    <img :src="userInfo.avatar" class="user-avatar" />
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/">
                        <el-dropdown-item>首页</el-dropdown-item>
                    </router-link>
                    <a
                        target="_blank"
                        href="http://192.168.1.54:8008/yugu/yugu_vue_admin"
                    >
                        <el-dropdown-item>GitLub</el-dropdown-item>
                    </a>
                    <a
                        target="_blank"
                        href="http://kjd786166251.gitee.io/admin-template-doc/"
                    >
                        <el-dropdown-item>文档</el-dropdown-item>
                    </a>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display: block">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Tool/Breadcrumb";
import Hamburger from "./Tool/Hamburger";
import Screenfull from "./Tool/Screenfull";

export default {
    components: {
        Breadcrumb,
        Hamburger,
        Screenfull,
    },
    computed: {
        ...mapGetters(["sidebar", "userInfo", "device"]),
        showCrumbs() {
            return this.$store.state.settings.showCrumbs;
        },
        showFullScreen() {
            return this.$store.state.settings.showFullScreen;
        },
        showRefresh() {
            return this.$store.state.settings.showRefresh;
        },
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        async logout() {
            this.$store.dispatch("user/logout").then(() => {
                this.$router.replace(`/login?redirect=${this.$route.fullPath}`);
            });
        },
        refresh() {
            this.$refreshPage();
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    width: 100%;
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
