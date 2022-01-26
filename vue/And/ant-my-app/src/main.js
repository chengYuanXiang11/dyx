import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import { Table } from 'ant-design-vue';
import { Popconfirm } from 'ant-design-vue';


import 'ant-design-vue/dist/antd.css';
import App from './App';

Vue.component(Button.name, Button);
Vue.use(Table);
Vue.use(Popconfirm);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');