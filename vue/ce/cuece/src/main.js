import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vconsole from "vconsole";
const vConsole = new Vconsole();
Vue.config.productionTip = false;
// 路由文件
new Vue({ router, render: (h) => h(App) }).$mount("#app");
