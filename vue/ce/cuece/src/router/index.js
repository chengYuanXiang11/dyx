import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  //首页路由
  {
    path: "/",
    component: () => import("../App.vue"),
    name: "/table",
    meta: { title: "收银" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
