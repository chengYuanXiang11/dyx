<template>
    <div>
        <div class="bg-banner" />
        <div id="login-box">
            <div class="login-banner" />
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                class="login-form"
                auto-complete="on"
                label-position="left"
            >
                <div class="title-container">
                    <h3 class="title">{{ title }}</h3>
                </div>
                <div>
                    <el-form-item prop="account">
                        <el-input
                            ref="name"
                            v-model="form.account"
                            placeholder="用户名"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                        >
                            <i slot="prefix" class="el-icon-s-custom" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            ref="password"
                            v-model="form.password"
                            :type="passwordType"
                            placeholder="密码"
                            tabindex="2"
                            auto-complete="on"
                            @keyup.enter.native="handleLogin"
                        >
                            <i slot="prefix" class="el-icon-lock" />
                            <svg-icon
                                slot="suffix"
                                :iconClass="
                                    passwordType === 'password'
                                        ? 'eye'
                                        : 'eye-open'
                                "
                                @click="showPassword"
                            />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="code-box">
                            <el-input
                                v-model="form.code"
                                auto-complete="off"
                                placeholder="验证码"
                                @keyup.enter.native="handleLogin"
                            >
                                <svg-icon
                                    slot="prefix"
                                    icon-class="validCode"
                                    class="el-input__icon input-icon"
                                />
                            </el-input>
                            <el-image
                                :src="codeUrl"
                                class="login-code-img"
                                @click="getCode"
                            />
                        </div>
                    </el-form-item>
                </div>
                <el-checkbox v-model="form.remember">记住我</el-checkbox>
                <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%"
                    class="login-btn"
                    @click.native.prevent="handleLogin"
                    >登 录</el-button
                >
            </el-form>
        </div>
    </div>
</template>

<script>
import { getCodeImg } from "@/request/api/login";
export default {
    name: "Login",
    data() {
        return {
            codeUrl: "",
            title: process.env.VUE_APP_TITLE,
            form: {
                account: "kangjiandong@123",
                password: "kangjiandong@123",
                code: "",
                remember: !!localStorage.login_account,
                uuid:""
            },
            rules: {
                account: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入用户名",
                    },
                ],
                password: [
                    { required: true, trigger: "blur", message: "请输入密码" },
                    {
                        min: 6,
                        max: 18,
                        trigger: "blur",
                        message: "密码长度为6到18位",
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
            passwordType: "password",
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
        this.getCode();
    },
    methods: {
        getCode() {
            getCodeImg().then((res) => {
                this.codeUrl = res.data.image_url
                    ? process.env.VUE_APP_BASE_API + res.data.image_url
                    : "";
                this.form.uuid = res.data.key;
            });
        },
        showPassword() {
            this.passwordType =
                this.passwordType === "password" ? "" : "password";
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const loginForm = JSON.parse(JSON.stringify(this.form));
                    this.$store
                        .dispatch("user/login", loginForm)
                        .then(() => {
                            this.loading = false;
                            this.form.remember &&
                                localStorage.setItem(
                                    "login_account",
                                    this.form.account
                                );
                            this.$router.push({ path: this.redirect || "/" });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
[data-mode="mobile"] {
    #login-box {
        max-width: 80%;
        .login-banner {
            display: none;
        }
    }
}
::v-deep input[type="password"]::-ms-reveal {
    display: none;
}
.bg-banner {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/image/login/login-bg.jpg");
    background-size: cover;
    background-position: center center;
}
#login-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #999;
    .login-banner {
        width: 300px;
        background-image: url("../../assets/image/login/login-banner.jpg");
        background-size: cover;
        background-position: center center;
    }
    .login-form {
        width: 450px;
        padding: 50px 35px 30px;
        overflow: hidden;
        .title-container {
            position: relative;
            .title {
                font-size: 22px;
                color: #666;
                margin: 0 auto 30px;
                text-align: center;
                font-weight: bold;
            }
        }
    }
    .code-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-input {
            width: 65%;
        }
        .el-image {
            height: 48px;
            width: 30%;
            cursor: pointer;
            border:1px solid #DCDFE6;
            border-radius: 4px;
        }
    }
    .login-btn{
        height: 48px;
        font-size: 16px;
    }
    ::v-deep .el-input {
        display: inline-block;
        height: 48px;
        width: 100%;
        input {
            height: 48px;
        }
        .el-input__prefix {
            left: 10px;
        }
        .el-input__prefix,
        .el-input__suffix {
            display: flex;
            align-items: center;
        }
        .el-input__suffix {
            right: 10px;
        }
    }
    .el-checkbox {
        margin: 20px 0;
    }
}
</style>
