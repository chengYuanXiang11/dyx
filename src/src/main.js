import Vue from "vue";
import App from "./App";
// element Ui
import Element from "element-ui";
import "./assets/styles/element-variables.scss";
Vue.use(Element, {
    size: "medium"
});

// form-create
import formCreate from '@form-create/element-ui'
Vue.use(formCreate)
// 全局样式文件
import "@/assets/styles/global.scss"; // global css
import "@/assets/styles/reset.scss"; // reset css

import store from "./store";
import router from "./router";
import permission from "./directive/permission";

import "./assets/icons"; // icon
// 路由拦截
import "./router/interceptor"; // permission control

// 全局方法挂载
import globalMethod from "./utils/globalMethod";
Vue.use(globalMethod);
Vue.use(permission);

// 全局组件
import globalComponents from "./components";
Vue.use(globalComponents);

Vue.config.productionTip = false;

// 高德地图
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '9d33e6acc8057fc84d27bd27dec76dce',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});

import formCreate from "@form-create/element-ui";
Vue.use(formCreate)
import holidayTypes from '@/views/system/form/components/form/module/holiday-types'
formCreate.component('holidayTypes', holidayTypes)
let vue = new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});
export default vue
