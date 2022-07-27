import Vue from 'vue'
import App from './App.vue'
import Cookies from 'js-cookie'
// UI组件库
import ElementUI from 'element-ui';
import './assets/style/element-variables.scss';
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium',
});
// 初始化样式
import './assets/style/index.scss';
// 路由文件
import router from './router'
// 路由拦截
import "./router/interceptor";
// vuex
import store from './store'
// icon
import './icons'
Vue.config.productionTip = false
// 全局组件
import globalComponents from "./components";
Vue.use(globalComponents);
// 全局方法
import globalMethod from "./utils/global";
Vue.use(globalMethod);
// 自定义指令
import permission from "./directive";
Vue.use(permission);
console.log(process.env)
let vue = new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
export default vue