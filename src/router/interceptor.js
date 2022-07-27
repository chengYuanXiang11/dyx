import router from ".";
import store from "../store";
import {
    Message
} from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {
    getToken
} from "@/utils/auth";

const whiteList = ["/login", "/401", "/404"];

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        if (to.path === "/login") {
            next({
                path: "/"
            });
            NProgress.done();
        } else {
            if (store.getters.permission_routes.length === 0) {
                store.dispatch("user/getInfo").then(res => {
                    // 拉取user_info
                    store.dispatch("permission/generateRoutes").then(accessRoutes => {
                        router.addRoutes(accessRoutes); // 动态添加可访问路由表
                        next({
                            ...to,
                            replace: true
                        }); // hack方法 确保addRoutes已完成
                    });
                }).catch(err => {
                    store.dispatch("user/logout").then(() => {
                        Message.error(err);
                        next({
                            path: "/"
                        });
                    });
                });
            } else {
                next();
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});