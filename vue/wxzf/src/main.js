import Vue from "vue";
import App from "./App.vue";
// UI组件库
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
Vue.config.productionTip = false;

// import Message from "../src/components/message";
// Vue.prototype.$message = Message;
// const message = {
//   install(Vue) {
//     Vue.prototype.$message = Message;
//     Vue.nextTick(function () {
//       console.log(Vue.version)
//     })
//   },
// };
Vue.use(message);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
