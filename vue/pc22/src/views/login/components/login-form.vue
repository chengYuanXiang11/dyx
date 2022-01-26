<template>
    <div>
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
        >
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    type="text"
                    auto-complete="off"
                    placeholder="请输入手机号/用户名"
                >
                    <svg-icon
                        slot="prefix"
                        icon-class="phone"
                        class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="password" v-if="loginType == 'pwd'">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="请输入密码"
                    @keyup.enter.native="handleLogin"
                    show-password
                >
                    <svg-icon
                        slot="prefix"
                        icon-class="password"
                        class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-else>
                <div class="login-msgCode">
                    <el-input
                        v-model="loginForm.code"
                        auto-complete="off"
                        placeholder="请输入验证码"
                        @keyup.enter.native="handleLogin"
                    >
                        <svg-icon
                            slot="prefix"
                            icon-class="msg-code"
                            class="el-input__icon input-icon"
                        />
                    </el-input>
                    <!-- <div class="login-code">
                    <img :src="codeUrl" class="login-code-img" @click="getCode" />
                </div> -->
                    <el-button
                        class="send-code-btn"
                        :disabled="isSend"
                        @click="getSmsCode"
                        >{{ codeText }}</el-button
                    >
                </div>
            </el-form-item>
            <el-form-item>
                <div class="login-option">
                    <el-checkbox v-model="loginForm.rememberMe"
                        >记住密码</el-checkbox
                    >
                    <span>忘记密码</span>
                </div>
            </el-form-item>
            <el-form-item class="clear-margin">
                <el-button
                    :loading="loading"
                    type="primary"
                    @click.native.prevent="handleLogin"
                    class="login-button"
                >
                    <span>{{ !loading ? "登 录" : "登 录 中..." }}</span>
                </el-button>
            </el-form-item>
            <el-form-item class="clear-margin">
                <div class="system-version">v1.0.1</div>
            </el-form-item>
        </el-form>
        <transition name="fade-transform" mode="out-in">
            <div class="img-code-dialog" v-show="showDialog">
                <div class="header">请输入安全验证</div>
                <div class="dialog-main">
                    <div class="input-box">
                        <el-input
                            v-model="loginForm.code"
                            auto-complete="off"
                            placeholder="请输入图片验证码"
                            @keyup.enter.native="pwdLogin"
                            ref="code-input"
                        >
                        </el-input>
                        <img
                            :src="codeUrl"
                            class="login-code-img"
                            title="点击刷新验证码"
                            @click="getCode"
                        />
                    </div>
                    <div class="dialog-footer">
                        <el-button @click="closeDialog">取消</el-button>
                        <el-button type="primary" @click="pwdLogin"
                            >确定</el-button
                        >
                    </div>
                </div>
            </div>
        </transition>
        <div class="dialog-shadow" v-show="showDialog"></div>
    </div>
</template>

<script>
import { getCodeImg } from "@/request/api/login";
import Cookies from "js-cookie";
import { decrypt, encrypt } from "@/utils/jsencrypt";
export default {
    data() {
        return {
            codeUrl: "",
            loading: false,
            loginForm: {
                username: "",
                password: "",
                rememberMe: false,
                code: "",
                uuid: "",
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "手机号/用户名不能为空",
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
            isSend: false,
            count: "",
            timer: null,
            codeText: "获取验证码",
            showDialog: false,
        };
    },
    props: {
        loginType: {
            type: String,
            default: "pwd",
        },
    },
    methods: {
        getSmsCode() {
            this.countDown(60);
        },
        countDown() {
            const TIME_COUNT = 5;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.isSend = true;
                this.codeText = this.count + "s后重新发送";
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                        this.codeText = this.count + "s后重新发送";
                    } else {
                        this.isSend = false;
                        clearInterval(this.timer);
                        this.timer = null;
                        this.codeText = "获取验证码";
                    }
                }, 1000);
            }
        },
        getCode() {
            getCodeImg().then((res) => {
                this.codeUrl = res.data.image_url
                    ? process.env.VUE_APP_BASE_API + res.data.image_url
                    : require("@/assets/images/profile.jpg");
                this.loginForm.uuid = res.data.key;
            });
        },
        showCodeDialog(){
            const self = this;
            self.getCode();
            self.showDialog = true;
            self.$nextTick(() => {
                self.$refs['code-input'].focus()
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (this.loginType == "pwd") {
                        // this.pwdLogin();
                        this.showCodeDialog();
                    } else {
                        this.showCodeDialog();
                    }
                    // this.loading = true;
                    // if (this.loginForm.rememberMe) {
                    //     Cookies.set("username", this.loginForm.username, {
                    //         expires: 30,
                    //     });
                    //     Cookies.set(
                    //         "password",
                    //         encrypt(this.loginForm.password),
                    //         { expires: 30 }
                    //     );
                    //     Cookies.set("rememberMe", this.loginForm.rememberMe, {
                    //         expires: 30,
                    //     });
                    // } else {
                    //     Cookies.remove("username");
                    //     Cookies.remove("password");
                    //     Cookies.remove("rememberMe");
                    // }
                    // this.$store
                    //     .dispatch("Login", this.loginForm)
                    //     .then(() => {
                    //         this.$router
                    //             .push({ path: this.redirect || "/" })
                    //             .catch(() => {});
                    //     })
                    //     .catch(() => {
                    //         this.loading = false;
                    //         this.getCode();
                    //     });
                }
            });
        },
        closeDialog() {
            this.showDialog = false;
            this.loginForm.code = "";
        },
        pwdLogin() {
            this.$store
                .dispatch("Login", this.loginForm)
                .then(() => {
                    this.saveAccount()
                    this.$router
                        .push({ path: this.redirect || "/" })
                        .catch(() => {});
                })
                .catch(() => {
                    this.loading = false;
                    this.getCode();
                });
        },
        saveAccount(){
            let {username,password,rememberMe} = this.loginForm;
            if(this.loginForm.rememberMe){
                Cookies.set("username",username);
                Cookies.set("password",encrypt(password));
                Cookies.set("rememberMe",rememberMe);
            }
            else{
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove("rememberMe");
            }
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get("rememberMe");
            this.loginForm = {
                username:
                    username === undefined ? this.loginForm.username : username,
                password:
                    password === undefined
                        ? this.loginForm.password
                        : decrypt(password),
                rememberMe:
                    rememberMe === undefined ? false : Boolean(rememberMe),
            };
        },
    },
    created() {
        this.getCookie();
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
.login-form {
    .login-code-img {
        height: 50px;
    }
    .login-button {
        height: 50px;
        width: 100%;
        font-size: 16px;
        border-radius: 2px;
    }
    .login-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
            color: #777;
            cursor: pointer;
        }
    }
    .system-version {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
        color: #999;
        font-size: 14px;
    }
    .login-msgCode {
        display: flex;
        justify-content: space-between;
        .send-code-btn {
            border-color: #999;
            margin-left: 24px;
            font-size: 16px;
            color: #048790;
            &.is-disabled,
            &.is-disabled:hover,
            &.is-disabled:focus {
                background: #f5f5f5;
                color: #999;
                border-color: #999;
            }
            &:hover,
            &:focus {
                color: #fff;
                background: #048790;
                border-color: #048790;
            }
        }
    }
    .el-form-item {
        margin-bottom: 30px;
        &.clear-margin {
            margin: 0;
        }
        .el-form-item__error {
            height: 30px;
            padding: 0;
            display: flex;
            align-items: center;
            font-size: 14px;
        }
        .el-input__prefix {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            .svg-icon {
                font-size: 16px;
                fill: rgba(4, 135, 144, 1);
            }
        }
        .el-input {
            .el-input__inner {
                height: 50px;
                font-size: 16px;
                padding-left: 36px;
                border-color: #999;
                &:focus {
                    border-color: rgba(4, 135, 144, 1);
                }
            }
        }
    }
}
.dialog-shadow {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 900;
}
.img-code-dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 208px;
    background: #fff;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
        0px 6px 16px 0px rgba(0, 0, 0, 0.08),
        0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    z-index: 1001;
    transform: translate(-50%, -50%);
    .header {
        height: 48px;
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.06);
        padding-left: 12px;
        color: rgba(1, 6, 33, 0.9);
        font-weight: 600;
        font-size: 14px;
    }
    .dialog-main {
        padding: 24px 12px;
        height: calc(100% - 48px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .input-box {
            display: flex;
            .el-input input {
                padding-left: 8px;
            }
            img {
                width: 100px;
                height: 50px;
                display: block;
                margin-left: 12px;
                cursor: pointer;
            }
        }
        .dialog-footer {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
