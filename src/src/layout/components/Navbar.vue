<template>
    <div class="navbar">
        <Logo :collapse="!sidebar.opened"></Logo>
        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <div class="right-menu-item hover-effect">
                    <router-link to="/user/msg">
                        <i class="el-icon-message-solid badge-item-icon" />
                        <!-- <el-badge
                            v-if="unread_msg_count"
                            :value="unread_msg_count"
                            :max="99"
                            style="margin-left: -4px"
                        /> -->
                    </router-link>
                </div>
            </template>

            <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                trigger="click"
            >
                <div class="avatar-wrapper">
                    <el-avatar :size="24" :src="avatar"></el-avatar>
                    <span>用户名</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Sidebar/Logo.vue";
import store from "@/store";

export default {
    components: {
        Logo
    },
    data() {
        return {
            // count: store.unread_msg_count,
        };
    },
    computed: {
        ...mapGetters(["sidebar", "avatar", "device"]),
        // , "unread_msg_count"
    },
    methods: {
        async logout() {
            this.$confirm("确定注销并退出系统吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                    location.href = "/index";
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #048790;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        height: 100%;
        line-height: 50px;
        margin-left: auto;
        .badge-item {
            height: 70px;
            width: 30px;
            line-height: 40px;
            text-align: center;
            margin-right: 5px;
            .badge-item-icon {
                width: 18px;
                color: #5a5e66;
                height: 18px;
            }
        }

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #fff;
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
                position: relative;
                display: flex;
                align-items: center;
                color: #fff;
                .user-avatar {
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    border-radius: 12px;
                }
                span{
                    font-size: 14px;
                    margin-left: 8px;
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
