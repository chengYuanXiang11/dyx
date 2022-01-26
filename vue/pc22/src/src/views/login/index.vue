<template>
    <div class="login">
        <div class="login-header">
            <div class="login-logo">
                <img class="logo" src="@/assets/images/login/login-logo.png" />
                <img class="name" src="@/assets/images/login/login-title.png" />
            </div>
            <div class="tel">
                <svg-icon icon-class="service" class="service" />
                <span>客服热线：400-050-0907</span>
            </div>
        </div>
        <div class="login-box">
            <div class="login-title">智慧农批管理系统</div>
            <el-tabs v-model="loginType">
                <el-tab-pane label="密码登录" name="pwd"> </el-tab-pane>
                <el-tab-pane label="验证码登录" name="code"></el-tab-pane>
            </el-tabs>
            <LoginForm :loginType="loginType" />
        </div>
    </div>
</template>

<script>
import { getCodeImg } from "@/request/api/login";
import LoginForm from "./components/login-form.vue";
export default {
    name: "Login",
    components: {
        LoginForm,
    },
    data() {
        return {
            loginType: "pwd",
            codeUrl: "",
            loginForm: {
                username: "admin",
                password: "123456",
                rememberMe: false,
                code: "1",
                uuid: "",
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "用户名不能为空",
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "密码不能为空",
                    },
                ],
                code: [
                    {
                        required: true,
                        trigger: "change",
                        message: "验证码不能为空",
                    },
                ],
            },
            loading: false,
            redirect: undefined,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    created() {
        // this.getCode();
        // this.getCookie();
    },
    methods: {
        getCode() {
            getCodeImg().then((res) => {
                this.codeUrl = res.data.image_url
                    ? process.env.VUE_APP_BASE_API + res.data.image_url
                    : require("@/assets/images/profile.jpg");
                this.loginForm.uuid = res.data.key;
            });
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
.login {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    background: url("../../assets/images/login/login-bg.png") no-repeat center /
        cover;
    padding-top: 60px;
    min-height: 616px;
    *{
        box-sizing: border-box;
    }
    .login-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: rgba(5, 74, 84, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 100px 0 120px;
        z-index: 1001;
        .login-logo {
            display: flex;
            align-items: center;
            .logo {
                height: 30px;
                width: 29px;
                margin-right: 5px;
            }
            .name {
                height: 36px;
                width: 111px;
            }
        }
        .tel {
            display: flex;
            color: #fff;
            align-items: center;
            .service {
                fill: #fff;
                margin-right: 5px;
            }
            span {
                font-size: 14px;
            }
        }
    }
    .login-box {
        border-radius: 6px;
        background: #ffffff;
        width: 480px;
        height: 556px;
        padding: 0 60px;
        margin: 0 100px;
        position: relative;
        .login-title {
            margin: 60px 0 35px;
            text-align: center;
            font-size: 26px;
            color: rgba(51, 51, 51, 1);
        }
        .el-tabs {
            .el-tabs__header {
                margin-bottom: 24px;
            }
            .el-tabs__nav-wrap::after {
                display: none;
            }
            .el-tabs__item {
                padding: 0px 18px;
                font-size: 16px;
                color: rgba(1, 6, 33, 0.75);
                &.is-active {
                    color: #048790;
                }
            }
        }
    }
}
</style>
